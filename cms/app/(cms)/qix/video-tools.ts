/**
 * Video helpers for the Qix steps editor. They run in the browser, on files the editor picks
 * (nothing is uploaded to read them): thumbnails, scene detection, and a duplicate check.
 */

/** Shortest step, in seconds. */
export const MIN_STEP = 1

export const round1 = (n: number) => Math.round(n * 10) / 10
export const round2 = (n: number) => Math.round(n * 100) / 100
export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
/** A moment into the step, past any fade at the cut. */
export const posterTime = (s: { start: number; end: number }) => Math.min(s.start + 0.3, (s.start + s.end) / 2)

export function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.muted = true
    video.playsInline = true
    video.preload = "auto"
    video.onloadedmetadata = () => resolve(video)
    video.onerror = () => reject(new Error("Couldn't read the video."))
    video.src = src
  })
}

export function seek(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const done = () => {
      video.removeEventListener("seeked", done)
      window.clearTimeout(timer)
      resolve()
    }
    const timer = window.setTimeout(done, 1500)
    video.addEventListener("seeked", done)
    video.currentTime = Math.min(Math.max(0, time), Math.max(0, video.duration - 0.05))
  })
}

export async function frameAt(video: HTMLVideoElement, time: number, width: number): Promise<Blob | null> {
  await seek(video, time)
  if (!video.videoWidth) return null
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = Math.round((width * video.videoHeight) / video.videoWidth)
  canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82))
}

/**
 * Where the scenes change. Samples small greyscale frames through the video, then looks for
 * the biggest change between each frame and the one half a second earlier, which catches cuts
 * and cross-fades alike. Each change is placed where its transition starts (where the frame-to-
 * frame change first rises). Keeps the `count` strongest that leave every step at least
 * MIN_STEP long (and not much shorter than an even share); falls back to even splits.
 * Tested on the MRF story: real cuts 2.8 / 5.3 / 6.8 s, found 3.1 / 5.3 / 6.8 s.
 */
export async function findSceneChanges(video: HTMLVideoElement, count: number, onProgress: (p: number) => void) {
  const duration = video.duration
  const interval = Math.max(1 / 15, duration / 400)
  const w = 48
  const h = Math.max(1, Math.round((w * (video.videoHeight || 16)) / (video.videoWidth || 9)))
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!

  const times: number[] = []
  const frames: Float32Array[] = []
  for (let t = 0; t < duration; t += interval) {
    await seek(video, t)
    ctx.drawImage(video, 0, 0, w, h)
    const { data } = ctx.getImageData(0, 0, w, h)
    const luma = new Float32Array(w * h)
    for (let p = 0, q = 0; p < data.length; p += 4, q++) luma[q] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]
    times.push(t)
    frames.push(luma)
    onProgress(Math.min(0.99, t / duration))
  }

  const diff = (a: Float32Array, b: Float32Array) => {
    let sum = 0
    for (let q = 0; q < a.length; q++) sum += Math.abs(a[q] - b[q])
    return sum / a.length
  }
  const lag = Math.max(1, Math.round(0.5 / interval))
  const short = frames.map((f, i) => (i ? diff(f, frames[i - 1]) : 0))
  const long = frames.map((f, i) => (i >= lag ? diff(f, frames[i - lag]) : 0))

  // No step shorter than MIN_STEP, nor much shorter than an even share.
  const gap = Math.max(MIN_STEP, duration / (count + 1) / 3)
  const picked: number[] = []
  const strongest = long.map((score, i) => ({ i, score })).sort((a, b) => b.score - a.score)
  for (const { i } of strongest) {
    if (picked.length === count) break
    // Within the half second before, the sharpest frame-to-frame change, then back to where it begins.
    const from = Math.max(1, i - lag + 1)
    let peak = from
    for (let k = from; k <= i; k++) if (short[k] > short[peak]) peak = k
    let begin = peak
    while (begin > from && short[begin - 1] > short[peak] * 0.35) begin--
    const t = times[begin]
    if (t < gap || duration - t < gap) continue
    if (picked.every((p) => Math.abs(p - t) >= gap)) picked.push(t)
  }
  onProgress(1)
  // Not enough clear changes (very short or single-scene video): split evenly.
  if (picked.length < count) return Array.from({ length: count }, (_, i) => round1((duration * (i + 1)) / (count + 1)))
  return picked.sort((a, b) => a - b).map(round1)
}

/** How the CMS names uploads: "Screen Recording 2025.mp4" → "screen-recording-2025" (see lib/media/storage.ts). */
export const nameSlug = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "file"

/**
 * Whether a picked file is a video that's already published at `src`: the same name (as the
 * CMS names uploads, after its random prefix) and the same size in bytes. False when the size
 * can't be read.
 */
export async function sameAsPublished(file: File, src: string): Promise<boolean> {
  const base = decodeURIComponent(src.split("?")[0].split("#")[0].split("/").pop() ?? "")
    .replace(/\.[^.]+$/, "")
    .replace(/^[0-9a-f]{8}-/, "")
  if (base !== nameSlug(file.name) && base.toLowerCase() !== file.name.replace(/\.[^.]+$/, "").toLowerCase()) return false
  try {
    const res = await fetch(src, { method: "HEAD" })
    return res.ok && Number(res.headers.get("content-length")) === file.size
  } catch {
    return false
  }
}
