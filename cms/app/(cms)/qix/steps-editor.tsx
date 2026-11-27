"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import {
  CircleAlert,
  Eye,
  EyeOff,
  Film,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScanSearch,
  Scissors,
  Send,
  Trash2,
  Undo2,
} from "lucide-react"

import { DragHandle, useDragSort } from "@/components/cms/media/drag-sort"
import { putFile, type UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import type { QixStepItem } from "@/lib/formats/data"
import { MAX_QIX_STEPS } from "@/lib/formats/limits"
import { ACCEPT, MAX_MB, mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { publishQixSteps, type PublishStep } from "./actions"
import { PickImage, type Picked } from "./pick-image"
import {
  clock,
  findSceneChanges,
  frameAt,
  loadVideo,
  MIN_STEP,
  posterTime,
  round1,
  round2,
  sameAsPublished,
} from "./video-tools"

const LABELS = ["The question", "The detail", "The big picture", "The explanation"]

/** A video or picture: one already on the website, or a file picked here (not uploaded yet). */
type Media = { kind: "saved"; url: string } | { kind: "file"; file: File; url: string }

type Frame = {
  key: string
  label: string
  video: Media | null
  /** The part of the video this frame plays; both null = the whole video. */
  start: number | null
  end: number | null
  /** Part of the one video chosen with "One video for all frames" (its cut points move it). */
  shared: boolean
  width: number
  height: number
  /** A thumbnail picked for this frame, or its published one. Null = made from the video. */
  thumb: Media | null
  published: boolean
}

/** The one video chosen for all frames, with where it's cut. */
type Shared = { file: File; url: string; duration: number; width: number; height: number; cuts: number[] }

let keySeq = 0
const newKey = () => `f${++keySeq}`

function fromSaved(steps: QixStepItem[]): Frame[] {
  return steps.map((s) => ({
    key: s.id,
    label: s.label,
    video: { kind: "saved", url: s.videoUrl },
    start: s.startSeconds,
    end: s.endSeconds,
    shared: false,
    width: s.videoWidth,
    height: s.videoHeight,
    thumb: s.posterUrl ? { kind: "saved", url: s.posterUrl } : null,
    published: s.published,
  }))
}

const mediaId = (m: Media | null) => (!m ? "" : m.kind === "saved" ? m.url : `file:${m.file.name}:${m.file.size}:${m.url}`)

/** Everything publishing would change, as a string: equal strings = nothing to publish. */
const signature = (frames: Frame[], allThumb: Picked | null) =>
  JSON.stringify([
    frames.map((f) => [f.label.trim(), mediaId(f.video), f.start, f.end, mediaId(f.thumb), f.published]),
    allThumb?.url ?? "",
  ])

/**
 * "The experience" steps, edited in place: the frames as the website shows them, with one
 * video for all frames (split at its scene changes) or a video per frame, thumbnails,
 * captions, order and visibility. Everything is a draft until "Publish to website", which
 * stays grey while there's nothing new; uploads show their progress on each frame.
 */
export function StepsEditor({ steps, websiteUrl, uploads }: { steps: QixStepItem[]; websiteUrl: string; uploads: UploadSetup }) {
  // The draft follows the published steps whenever they change (after a publish, or a reload).
  const savedKey = steps.map((s) => `${s.id}:${s.updatedAt}`).join("|")
  const [base, setBase] = useState({ key: savedKey, frames: fromSaved(steps) })
  const [frames, setFrames] = useState<Frame[]>(base.frames)
  const [shared, setShared] = useState<Shared | null>(null)
  const [allThumb, setAllThumb] = useState<Picked | null>(null)
  if (base.key !== savedKey) {
    const next = fromSaved(steps)
    setBase({ key: savedKey, frames: next })
    setFrames(next)
    setShared(null)
    setAllThumb(null)
  }

  const [notice, setNotice] = useState<{ tone: "error" | "info"; text: string } | null>(null)
  const [scan, setScan] = useState<number | null>(null)
  const [checking, setChecking] = useState(false)
  const [progress, setProgress] = useState<{ overall: number; frames: Record<string, number>; step: string } | null>(null)
  const [publishing, startPublishing] = useTransition()
  const busy = publishing || scan !== null || checking

  const dirty = signature(frames, allThumb) !== signature(base.frames, null)
  const missing = frames.flatMap((f, i) => [
    ...(!f.video ? [`a video for frame ${i + 1}`] : []),
    ...(!f.label.trim() ? [`a caption for frame ${i + 1}`] : []),
  ])
  const canPublish = dirty && frames.length > 0 && missing.length === 0 && uploads.ready && !busy
  const allShared = !!shared && frames.length === shared.cuts.length + 1 && frames.every((f) => f.shared)

  const update = (key: string, patch: Partial<Frame>) => setFrames((list) => list.map((f) => (f.key === key ? { ...f, ...patch } : f)))

  // ── Auto thumbnails for frames with a new video and no picked thumbnail (preview only) ──
  const [autoThumbs, setAutoThumbs] = useState<Record<string, string>>({})
  const autoWanted = frames
    .filter((f) => f.video?.kind === "file" && !f.thumb)
    .map((f) => ({ id: `${f.video!.url}@${f.start ?? 0}`, src: f.video!.url, start: f.start ?? 0, end: f.end ?? (f.start ?? 0) + 1 }))
  const autoKey = autoWanted.map((a) => a.id).join("|")
  useEffect(() => {
    const todo = autoWanted.filter((a) => !autoThumbs[a.id])
    if (!todo.length) return
    let cancelled = false
    const timer = window.setTimeout(async () => {
      const made: Record<string, string> = {}
      for (const a of todo) {
        try {
          const blob = await frameAt(await loadVideo(a.src), posterTime(a), 320)
          if (blob) made[a.id] = URL.createObjectURL(blob)
        } catch {}
        if (cancelled) return
      }
      setAutoThumbs((old) => ({ ...old, ...made }))
    }, 300)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
    // autoWanted is derived from autoKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoKey])

  const thumbOf = (f: Frame) =>
    f.thumb?.kind === "file"
      ? f.thumb.url
      : allThumb
        ? allThumb.url
        : f.thumb
          ? mediaSrc(f.thumb.url, websiteUrl)
          : f.video?.kind === "file"
            ? autoThumbs[`${f.video.url}@${f.start ?? 0}`] ?? ""
            : ""
  const srcOf = (f: Frame) => (!f.video ? "" : f.video.kind === "file" ? f.video.url : mediaSrc(f.video.url, websiteUrl))

  // ── Duplicate check against what's published ──
  async function alreadyPublished(file: File) {
    const urls = [...new Set(base.frames.flatMap((f) => (f.video?.kind === "saved" ? [f.video.url] : [])))]
    for (const url of urls) if (await sameAsPublished(file, mediaSrc(url, websiteUrl))) return true
    return false
  }

  function checkFile(file: File): string | null {
    if (!file.type.startsWith("video/")) return "Choose a video file (MP4, WebM or MOV)."
    if (file.size > MAX_MB.video * 1024 * 1024) return `That video is over ${MAX_MB.video} MB.`
    return null
  }

  // ── One video for all frames ──
  async function pickShared(file: File) {
    setNotice(null)
    const problem = checkFile(file)
    if (problem) return setNotice({ tone: "error", text: problem })
    setChecking(true)
    const dup = await alreadyPublished(file).finally(() => setChecking(false))
    if (dup) {
      return setNotice({
        tone: "error",
        text: `“${file.name}” is already on the website. Choose a different video to publish.`,
      })
    }
    const url = URL.createObjectURL(file)
    try {
      const video = await loadVideo(url)
      const count = Math.max(1, Math.min(MAX_QIX_STEPS, frames.length || MAX_QIX_STEPS))
      if (!Number.isFinite(video.duration) || video.duration < count * MIN_STEP) {
        URL.revokeObjectURL(url)
        return setNotice({ tone: "error", text: `That video is too short: it needs at least ${count * MIN_STEP} seconds.` })
      }
      setScan(0)
      const cuts = count > 1 ? await findSceneChanges(video, count - 1, (p) => setScan(p)) : []
      const s: Shared = { file, url, duration: video.duration, width: video.videoWidth, height: video.videoHeight, cuts }
      setShared(s)
      applyCuts(s, cuts, count)
    } catch {
      setNotice({ tone: "error", text: "Couldn't read that video. Try an MP4 file." })
    } finally {
      setScan(null)
    }
  }

  /** Every frame becomes a part of the shared video, cut at `cuts`. */
  function applyCuts(s: Shared, cuts: number[], count = cuts.length + 1) {
    const bounds = [0, ...cuts, s.duration]
    const media: Media = { kind: "file", file: s.file, url: s.url }
    setFrames((list) =>
      Array.from({ length: count }, (_, i) => {
        const old = list[i]
        return {
          key: old?.key ?? newKey(),
          label: old?.label || LABELS[i] || `Step ${i + 1}`,
          video: media,
          start: round2(bounds[i]),
          end: round2(bounds[i + 1]),
          shared: true,
          width: s.width,
          height: s.height,
          // A thumbnail picked here stays; the old video's thumbnail doesn't fit the new one.
          thumb: old?.thumb?.kind === "file" ? old.thumb : null,
          published: old?.published ?? true,
        }
      })
    )
  }

  async function redetect() {
    if (!shared) return
    setScan(0)
    try {
      const cuts = await findSceneChanges(await loadVideo(shared.url), shared.cuts.length, (p) => setScan(p))
      setShared({ ...shared, cuts })
      applyCuts(shared, cuts)
    } finally {
      setScan(null)
    }
  }

  function splitEvenly() {
    if (!shared) return
    const n = shared.cuts.length + 1
    const cuts = Array.from({ length: n - 1 }, (_, i) => round1((shared.duration * (i + 1)) / n))
    setShared({ ...shared, cuts })
    applyCuts(shared, cuts)
  }

  // ── One frame's own video ──
  async function pickFrameVideo(key: string, file: File) {
    setNotice(null)
    const problem = checkFile(file)
    if (problem) return setNotice({ tone: "error", text: problem })
    setChecking(true)
    const dup = await alreadyPublished(file).finally(() => setChecking(false))
    if (dup) {
      return setNotice({ tone: "error", text: `“${file.name}” is already on the website. Choose a different video for this frame.` })
    }
    const url = URL.createObjectURL(file)
    try {
      const video = await loadVideo(url)
      const frame = frames.find((f) => f.key === key)
      update(key, {
        video: { kind: "file", file, url },
        start: null,
        end: null,
        shared: false,
        width: video.videoWidth || 360,
        height: video.videoHeight || 640,
        thumb: frame?.thumb?.kind === "file" ? frame.thumb : null,
      })
    } catch {
      setNotice({ tone: "error", text: "Couldn't read that video. Try an MP4 file." })
    }
  }

  // ── Frames ──
  function addFrame() {
    if (frames.length >= MAX_QIX_STEPS) {
      return setNotice({ tone: "error", text: `${MAX_QIX_STEPS} frames filled. No more frames allowed.` })
    }
    setNotice(null)
    setFrames((list) => [
      ...list,
      { key: newKey(), label: LABELS[list.length] ?? "", video: null, start: null, end: null, shared: false, width: 360, height: 640, thumb: null, published: true },
    ])
  }

  function move(i: number, to: number) {
    if (i === to || to < 0 || to >= frames.length) return
    setFrames((list) => {
      const next = [...list]
      const [f] = next.splice(i, 1)
      next.splice(to, 0, f)
      return next
    })
  }
  const { itemProps } = useDragSort(move, busy)

  function discard() {
    setFrames(base.frames)
    setShared(null)
    setAllThumb(null)
    setNotice(null)
  }

  // ── Publish ──
  function publish() {
    if (!canPublish) return
    startPublishing(async () => {
      try {
        // Every file to upload once, with the frames it belongs to, so progress shows on them.
        type Job = { file: File; kind: "video" | "image"; frames: string[]; loaded: number; url?: string }
        const jobs = new Map<File, Job>()
        const job = (file: File, kind: Job["kind"], key: string) => {
          const j = jobs.get(file) ?? { file, kind, frames: [], loaded: 0 }
          if (!j.frames.includes(key)) j.frames.push(key)
          jobs.set(file, j)
        }
        for (const f of frames) {
          if (f.video?.kind === "file") job(f.video.file, "video", f.key)
          if (f.thumb?.kind === "file") job(f.thumb.file, "image", f.key)
          else if (allThumb) job(allThumb.file, "image", f.key)
        }
        // Thumbnails made from the new videos (frames without a picked one).
        const autos = new Map<string, File>()
        for (const f of frames) {
          if (f.video?.kind !== "file" || f.thumb || allThumb) continue
          const blob = await frameAt(await loadVideo(f.video.url), posterTime({ start: f.start ?? 0, end: f.end ?? (f.start ?? 0) + 1 }), 720)
          if (blob) {
            const file = new File([blob], `${f.label || "step"}-poster.webp`, { type: "image/webp" })
            autos.set(f.key, file)
            job(file, "image", f.key)
          }
        }

        const all = [...jobs.values()]
        const total = all.reduce((sum, j) => sum + j.file.size, 0) || 1
        const report = () => {
          const loaded = all.reduce((sum, j) => sum + j.loaded, 0)
          const perFrame: Record<string, number> = {}
          for (const f of frames) {
            const mine = all.filter((j) => j.frames.includes(f.key))
            const size = mine.reduce((s, j) => s + j.file.size, 0)
            if (size) perFrame[f.key] = mine.reduce((s, j) => s + j.loaded, 0) / size
          }
          setProgress({ overall: loaded / total, frames: perFrame, step: "Uploading" })
        }
        report()
        // Videos first, a couple at a time.
        const queue = [...all].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "video" ? -1 : 1))
        const worker = async () => {
          for (let j = queue.shift(); j; j = queue.shift()) {
            const current = j
            current.url = await putFile("qix/experience", current.kind, current.file, (p) => {
              current.loaded = p * current.file.size
              report()
            })
            current.loaded = current.file.size
            report()
          }
        }
        await Promise.all([worker(), worker()])

        setProgress((p) => (p ? { ...p, overall: 1, step: "Publishing" } : p))
        const urlOf = (file: File) => jobs.get(file)?.url ?? ""
        const payload: PublishStep[] = frames.map((f) => ({
          label: f.label.trim(),
          videoUrl: f.video!.kind === "file" ? urlOf(f.video!.file) : f.video!.url,
          startSeconds: f.start,
          endSeconds: f.end,
          posterUrl:
            f.thumb?.kind === "file"
              ? urlOf(f.thumb.file)
              : allThumb
                ? urlOf(allThumb.file)
                : f.thumb
                  ? f.thumb.url
                  : autos.get(f.key)
                    ? urlOf(autos.get(f.key)!)
                    : "",
          videoWidth: f.width,
          videoHeight: f.height,
          published: f.published,
        }))
        const result = await publishQixSteps(payload)
        showSaveToast(result, "Published to the website")
        if (!result.ok) setNotice({ tone: "error", text: result.error })
      } catch (error) {
        setNotice({ tone: "error", text: error instanceof Error ? error.message : "Publishing failed. Try again." })
      } finally {
        setProgress(null)
      }
    })
  }

  // ── Website preview playback ──
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState<number | null>(null)
  const [playProgress, setPlayProgress] = useState(0)
  const playing = active === null ? null : frames[active]
  const pStart = playing ? (playing.start ?? 0) : null
  const pEnd = playing ? playing.end : null
  useEffect(() => {
    if (active === null || pStart == null) return
    const video = videos.current[active]
    if (!video) return
    video.currentTime = pStart
    video.play().catch(() => {})
    let raf = 0
    const tick = () => {
      const end = pEnd ?? video.duration
      const span = end - pStart
      setPlayProgress(span > 0 ? Math.min(1, Math.max(0, (video.currentTime - pStart) / span)) : 0)
      if ((pEnd != null && video.currentTime >= pEnd - 0.04) || video.ended) {
        video.pause()
        setPlayProgress(0)
        setActive(active + 1 < frames.length ? active + 1 : null)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      video.pause()
    }
  }, [active, pStart, pEnd, frames.length])
  const fill = useMemo(() => {
    const n = frames.length
    if (active === null || n < 2) return active === null ? 0 : 1
    return Math.min(1, (active + (active < n - 1 ? playProgress : 0)) / (n - 1))
  }, [active, playProgress, frames.length])

  const sharedInput = useRef<HTMLInputElement>(null)
  const cols = Math.max(frames.length, 1)

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={sharedInput}
          type="file"
          accept={ACCEPT.video}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0]
            e.target.value = ""
            if (f) pickShared(f)
          }}
        />
        <Button onClick={() => sharedInput.current?.click()} disabled={busy}>
          <Scissors data-icon="inline-start" />
          One video for all frames
        </Button>
        <Button variant="outline" onClick={addFrame} disabled={busy}>
          <Plus data-icon="inline-start" />
          Add step
        </Button>
        <PickImage
          label={allThumb ? "Change thumbnail for all" : "Add thumbnail"}
          title="Optional: one thumbnail on every frame (a frame's own thumbnail wins)"
          onPick={(p) => setAllThumb(p)}
          disabled={busy || frames.length === 0}
        />
        {allThumb && (
          <Button variant="ghost" size="sm" onClick={() => setAllThumb(null)} disabled={busy}>
            Remove
          </Button>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setActive(active === null ? 0 : null)} disabled={frames.length === 0 || publishing}>
            {active === null ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
            {active === null ? "Play preview" : "Stop"}
          </Button>
          {dirty && (
            <Button variant="ghost" onClick={discard} disabled={busy}>
              <Undo2 data-icon="inline-start" />
              Discard changes
            </Button>
          )}
          <Button
            variant="brand"
            onClick={publish}
            disabled={!canPublish}
            className="disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
          >
            {publishing ? <Spinner data-icon="inline-start" /> : <Send data-icon="inline-start" />}
            {publishing ? `${progress?.step ?? "Publishing"}… ${Math.round((progress?.overall ?? 0) * 100)}%` : "Publish to website"}
          </Button>
        </div>
      </div>

      {/* Status: what's waiting, or why Publish is grey */}
      {publishing && progress ? (
        <div className="flex flex-col gap-1.5 rounded-xl bg-primary/6 px-4 py-3 ring-1 ring-primary/20" role="status">
          <div className="flex items-center justify-between text-sm font-medium text-primary">
            <span>{progress.step === "Publishing" ? "Saving to the website…" : "Uploading to storage…"}</span>
            <span className="tabular-nums">{Math.round(progress.overall * 100)}%</span>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-primary/12">
            <span className="block h-full rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${progress.overall * 100}%` }} />
          </span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground" role="status">
          {!dirty
            ? "Everything here is on the website. Choose a new video or change a frame to publish."
            : missing.length
              ? `Add ${missing.slice(0, 2).join(" and ")}${missing.length > 2 ? "…" : ""} to publish.`
              : !uploads.ready
                ? uploads.problem
                : "You have changes that aren't on the website yet. Check the preview, then Publish."}
        </p>
      )}

      {notice && (
        <p
          role="alert"
          className={cn(
            "flex items-start gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium ring-1",
            notice.tone === "error" ? "bg-destructive/8 text-destructive ring-destructive/30" : "bg-muted text-foreground ring-border"
          )}
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span className="flex-1">{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="text-xs underline-offset-2 hover:underline">
            Dismiss
          </button>
        </p>
      )}

      {/* Finding scenes, or the cut points of the one video */}
      {scan !== null && (
        <div className="flex flex-col gap-2 rounded-2xl bg-muted/50 p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Spinner /> Finding where the scenes change… {Math.round(scan * 100)}%
          </p>
          <span className="h-1.5 overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${scan * 100}%` }} />
          </span>
        </div>
      )}
      {checking && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Checking whether this video is already on the website…
        </p>
      )}
      {shared && allShared && scan === null && (
        <div className="flex flex-col gap-2 rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium">
              <Film className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">Cut points · {shared.file.name}</span>
              <span className="shrink-0 font-normal text-muted-foreground">{clock(shared.duration)}</span>
            </span>
            <span className="flex gap-1">
              <Button type="button" size="xs" variant="ghost" onClick={redetect} disabled={busy}>
                <ScanSearch data-icon="inline-start" />
                Find scenes again
              </Button>
              <Button type="button" size="xs" variant="ghost" onClick={splitEvenly} disabled={busy}>
                Split evenly
              </Button>
            </span>
          </div>
          {shared.cuts.length > 0 && (
            <Slider
              value={shared.cuts}
              onValueChange={(v) => {
                const cuts = (Array.isArray(v) ? v : [v]).map(round1)
                setShared({ ...shared, cuts })
                applyCuts(shared, cuts)
              }}
              min={0}
              max={round1(shared.duration)}
              step={0.1}
              minStepsBetweenValues={MIN_STEP * 10}
              disabled={busy}
              aria-label="Cut points"
            />
          )}
        </div>
      )}

      {/* The frames, as on the website */}
      {frames.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          <Film className="size-8" aria-hidden />
          No frames. Choose one video for all frames, or add a step.
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-background p-4 ring-1 ring-border">
          <ol className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {frames.map((f, i) => {
              const changed = !base.frames.some(
                (b) => b.key === f.key && signature([b], null) === signature([f], null)
              )
              const up = progress?.frames[f.key]
              return (
                <li key={f.key} {...itemProps(i)} className={cn("flex min-w-0 flex-col gap-2", itemProps(i).className)}>
                  <FrameMedia
                    src={srcOf(f)}
                    start={f.start}
                    thumb={thumbOf(f)}
                    playing={active === i}
                    hidden={!f.published}
                    onPlay={() => setActive(i)}
                    videoRef={(el) => {
                      videos.current[i] = el
                    }}
                    onPick={(file) => pickFrameVideo(f.key, file)}
                    disabled={busy}
                  />
                  <div className="-mt-1 flex flex-wrap justify-center gap-1">
                    {changed && <Tag tone="amber">Not published</Tag>}
                    {!f.published && <Tag tone="slate">Hidden</Tag>}
                    {f.thumb?.kind === "file" && <Tag tone="blue">Own thumbnail</Tag>}
                  </div>
                  {up !== undefined && <UploadBar value={up} />}
                </li>
              )
            })}
          </ol>

          {/* Numbered circles on the line, as on the website */}
          <div className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            <span aria-hidden className="absolute top-1/2 h-px -translate-y-1/2 bg-[#ebebeb]" style={{ left: `${50 / cols}%`, right: `${50 / cols}%` }}>
              <span className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full bg-[#3979ff]" style={{ width: `${fill * 100}%` }} />
            </span>
            {frames.map((f, i) => (
              <span key={f.key} className="relative flex justify-center">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold ring-1 transition-colors duration-300",
                    active !== null && i <= active ? "bg-[#3979ff] text-white ring-[#3979ff]" : "bg-white text-[#3979ff] ring-[#dbe6ff]"
                  )}
                >
                  {i + 1}
                </span>
              </span>
            ))}
          </div>

          {/* Caption, part of the video, and the frame's tools */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {frames.map((f, i) => (
              <div key={f.key} className="flex min-w-0 flex-col items-center gap-1.5">
                <Input
                  value={f.label}
                  onChange={(e) => update(f.key, { label: e.target.value })}
                  maxLength={40}
                  placeholder="Caption"
                  aria-label={`Caption for frame ${i + 1}`}
                  aria-invalid={!f.label.trim()}
                  className="h-8 text-center text-sm font-medium text-[#696969]"
                  disabled={busy}
                />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {f.start != null && f.end != null ? `${clock(f.start)} – ${clock(f.end)} · ${Math.round(f.end - f.start)}s` : f.video ? "Whole clip" : "No video yet"}
                </span>
                <div className="flex flex-wrap justify-center gap-1">
                  <PickImage
                    label="Thumbnail"
                    title={`Choose a thumbnail for frame ${i + 1}`}
                    onPick={(p) => update(f.key, { thumb: { kind: "file", file: p.file, url: p.url } })}
                    disabled={busy}
                    small
                  />
                  {f.thumb?.kind === "file" && (
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      title="Back to the thumbnail it had"
                      onClick={() => {
                        const before = base.frames.find((b) => b.key === f.key)
                        update(f.key, { thumb: before && mediaId(before.video) === mediaId(f.video) ? before.thumb : null })
                      }}
                      disabled={busy}
                    >
                      <RotateCcw data-icon="inline-start" />
                      Reset
                    </Button>
                  )}
                </div>
                <div className="flex gap-1">
                  <DragHandle index={i} count={frames.length} onMove={move} disabled={busy} label={`frame ${i + 1}`} />
                  <IconButton
                    label={f.published ? `Hide frame ${i + 1} on the website` : `Show frame ${i + 1} on the website`}
                    onClick={() => update(f.key, { published: !f.published })}
                    disabled={busy}
                  >
                    {f.published ? <Eye /> : <EyeOff />}
                  </IconButton>
                  <IconButton
                    label={`Remove frame ${i + 1}`}
                    onClick={() => setFrames((list) => list.filter((x) => x.key !== f.key))}
                    disabled={busy}
                    danger
                  >
                    <Trash2 />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** A frame's picture and video: plays in the preview; Replace video picks this frame's own clip. */
function FrameMedia({
  src,
  start,
  thumb,
  playing,
  hidden,
  onPlay,
  videoRef,
  onPick,
  disabled,
}: {
  src: string
  start: number | null
  thumb: string
  playing: boolean
  hidden: boolean
  onPlay: () => void
  videoRef: (el: HTMLVideoElement | null) => void
  onPick: (file: File) => void
  disabled?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <div
      className={cn("group relative aspect-[9/16] w-full overflow-hidden rounded-[0.875rem] bg-[#e6e7ea] select-none", hidden && "opacity-60 grayscale")}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const f = e.dataTransfer.files?.[0]
        if (f && !disabled) onPick(f)
      }}
    >
      <input
        ref={input}
        type="file"
        accept={ACCEPT.video}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ""
          if (f) onPick(f)
        }}
      />
      {src ? (
        <>
          <video
            ref={videoRef}
            key={src}
            src={start != null ? `${src}#t=${start}` : src}
            muted
            playsInline
            preload="metadata"
            draggable={false}
            className="absolute inset-0 size-full object-cover"
          />
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element -- local or uploaded thumbnail
            <img
              src={thumb}
              alt=""
              draggable={false}
              className={cn("absolute inset-0 size-full object-cover transition-opacity duration-300", playing ? "opacity-0" : "opacity-100")}
            />
          )}
          {!playing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
              <Button type="button" size="sm" variant="secondary" onClick={onPlay} disabled={disabled}>
                <Play data-icon="inline-start" />
                Play
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={() => input.current?.click()} disabled={disabled}>
                <Film data-icon="inline-start" />
                Replace video
              </Button>
            </div>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={disabled}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-sm text-muted-foreground hover:bg-black/5"
        >
          <Film className="size-6" aria-hidden />
          Choose a video
          <span className="text-xs">or drop one here</span>
        </button>
      )}
    </div>
  )
}

/** Upload progress for one frame, in percent. */
function UploadBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div className="flex flex-col gap-1" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex justify-between text-xs font-medium text-primary">
        <span>{pct >= 100 ? "Uploaded" : "Uploading"}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <span className="h-1.5 overflow-hidden rounded-full bg-primary/12">
        <span className="block h-full rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
      </span>
    </div>
  )
}

function Tag({ tone, children }: { tone: "amber" | "slate" | "blue"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
        tone === "amber" && "bg-warning/14 text-warning",
        tone === "slate" && "bg-foreground/6 text-foreground",
        tone === "blue" && "bg-brand-blue-soft text-primary"
      )}
    >
      {children}
    </span>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant={danger ? "destructive" : "outline"}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  )
}
