// Encodes every local video for the web: `npm run videos`.
//
// Originals live in media-src/ (git-ignored, so large masters never reach GitHub or Vercel).
// Each entry below becomes three files in public/videos/, matching localVideo() in
// lib/videos.ts:
//   <name>.webm         VP9  — smallest, preferred by Chrome, Firefox, Edge, Safari 17+
//   <name>.mp4          H.264 — fallback that plays everywhere, moov atom up front
//   <name>-poster.webp  first frame, so the box is never blank while the video loads
// Audio is dropped unless an entry sets audio: true (AAC in the mp4, Opus in the webm).
// Needs ffmpeg on PATH.
//
//   npm run videos            encode anything missing or older than its original
//   npm run videos -- --force re-encode everything
//   npm run videos -- --force --only=a,b   re-encode just these names

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, statSync } from "node:fs"
import path from "node:path"

// Per-video settings. crf = quality (lower is sharper and bigger): h264 ~23-28, vp9 ~32-42.
// Tune each clip so its .webm comes out smaller than its .mp4 (the script warns if not),
// since browsers that support WebM pick it first. When VP9 gains nothing for a clip, set
// webm: false here and pass { webm: false } to its localVideo() in lib/videos.ts.
const VIDEOS = [
  // Low-detail footage: H.264 already lands at ~0.7 MB and VP9 could not beat it.
  { name: "day-by-day", input: "Day_by_day_video.mp4", h264Crf: 26, webm: false },
  { name: "pix-entry", input: "pix_entry_video.mp4", h264Crf: 26, vp9Crf: 36 },
  // Explainers gallery on the home page, played with sound.
  { name: "curiosity-1", input: "curiosity_1.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
  { name: "customer-story-2", input: "dailymattr_Customer_Story_2.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
]

/** Longest edge; the masters are 1080p and the widest use is a full-screen hero. */
const MAX_WIDTH = 1920

const root = path.resolve(import.meta.dirname, "..")
const srcDir = path.join(root, "media-src")
const outDir = path.join(root, "public", "videos")
const force = process.argv.includes("--force")
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",")

try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
} catch {
  console.error("ffmpeg was not found on PATH. Install it (https://ffmpeg.org) and try again.")
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
const scale = `scale='min(${MAX_WIDTH},iw)':-2`
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`

const outputs = (name) => ({
  mp4: path.join(outDir, `${name}.mp4`),
  webm: path.join(outDir, `${name}.webm`),
  poster: path.join(outDir, `${name}-poster.webp`),
})

const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" })

for (const { name, input, h264Crf = 26, vp9Crf = 36, webm = true, audio = false } of VIDEOS) {
  if (only && !only.includes(name)) continue
  const source = path.join(srcDir, input)
  if (!existsSync(source)) {
    console.warn(`skip ${name}: ${path.relative(root, source)} not found`)
    continue
  }
  const out = outputs(name)
  const stale = (file) => force || !existsSync(file) || statSync(file).mtimeMs < statSync(source).mtimeMs

  console.log(`\n${name}  (${input}, ${kb(source)})`)

  if (stale(out.mp4)) {
    ffmpeg([
      "-i", source, ...(audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]), "-vf", scale,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(h264Crf), "-profile:v", "high",
      "-pix_fmt", "yuv420p", "-maxrate", "5M", "-bufsize", "10M",
      "-movflags", "+faststart", out.mp4,
    ])
  }
  console.log(`  mp4     ${kb(out.mp4)}`)

  if (webm) {
    if (stale(out.webm)) {
      ffmpeg([
        "-i", source, ...(audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"]), "-vf", scale,
        "-c:v", "libvpx-vp9", "-crf", String(vp9Crf), "-b:v", "0", "-row-mt", "1",
        "-deadline", "good", "-cpu-used", "2", out.webm,
      ])
    }
    console.log(`  webm    ${kb(out.webm)}`)
  }

  if (stale(out.poster)) {
    ffmpeg(["-i", source, "-frames:v", "1", "-vf", scale, "-c:v", "libwebp", "-quality", "70", out.poster])
  }
  console.log(`  poster  ${kb(out.poster)}`)

  if (webm && statSync(out.webm).size >= statSync(out.mp4).size) {
    console.warn(`  ! ${name}.webm is not smaller than the mp4: raise vp9Crf for it and run with --force`)
  }
}
