"use client"

import { useId, useRef, useState } from "react"
import { FileAudio, FileVideo, ImageIcon, Link2, RotateCcw, Upload, X } from "lucide-react"

import { requestUpload, type MediaFolder } from "@/app/(cms)/media-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ACCEPT, MAX_MB, mediaFileName, mediaSrc, type MediaKind } from "@/lib/media/url"
import { cn } from "@/lib/utils"

export type VideoMeta = { width: number; height: number; posterUrl: string | null }

/** Where uploads stand for this CMS: ready, or why not (shown under the field). */
export type UploadSetup = { ready: boolean; problem: string | null }

const ICON = { image: ImageIcon, video: FileVideo, audio: FileAudio }

/**
 * A media slot on a Qix or Trax form: a preview of the current file, and Upload / Replace
 * (or drop a file on the preview), or paste a link instead. Uploads go straight from the
 * browser to Supabase Storage with a one-time link from the CMS (lib/media/storage.ts).
 * For a video it also grabs the first frame as its thumbnail and reads its size
 * (onVideoMeta), so editors never make thumbnails by hand.
 */
export function MediaField({
  label,
  hint,
  kind,
  folder,
  value,
  onChange,
  onVideoMeta,
  onUploadingChange,
  websiteUrl,
  uploads,
  error,
  previewClassName,
  imageStyle,
  optional,
}: {
  label: string
  hint?: string
  kind: MediaKind
  folder: MediaFolder
  value: string
  onChange: (url: string) => void
  onVideoMeta?: (meta: VideoMeta) => void
  onUploadingChange?: (uploading: boolean) => void
  websiteUrl: string
  uploads: UploadSetup
  error?: string
  /** Size and shape of the preview box, e.g. "aspect-[9/16] w-32". */
  previewClassName?: string
  imageStyle?: React.CSSProperties
  optional?: boolean
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [problem, setProblem] = useState<string | null>(null)
  const [linkMode, setLinkMode] = useState(false)
  const [link, setLink] = useState("")
  const [dragging, setDragging] = useState(false)
  const uploading = progress !== null
  const src = mediaSrc(value, websiteUrl)
  const Icon = ICON[kind]

  function setUploading(on: boolean) {
    onUploadingChange?.(on)
  }

  async function upload(file: File) {
    setProblem(null)
    if (!uploads.ready) return setProblem(uploads.problem)
    if (!file.type.startsWith(`${kind}/`)) return setProblem(`Choose ${kind === "image" ? "an image" : `a${kind === "audio" ? "n" : ""} ${kind}`} file.`)
    if (file.size > MAX_MB[kind] * 1024 * 1024) return setProblem(`That file is over ${MAX_MB[kind]} MB.`)

    setProgress(0)
    setUploading(true)
    try {
      // A video's thumbnail and size come from the file itself, before it goes up.
      const meta = kind === "video" ? await readVideo(file).catch(() => null) : null
      const url = await putFile(folder, kind, file, (p) => setProgress(p))
      onChange(url)
      if (kind === "video" && onVideoMeta) {
        let posterUrl: string | null = null
        if (meta?.poster) {
          const poster = new File([meta.poster], `${file.name.replace(/\.[^.]+$/, "")}-poster.webp`, { type: meta.poster.type })
          posterUrl = await putFile(folder, "image", poster, () => {}).catch(() => null)
        }
        onVideoMeta({ width: meta?.width ?? 0, height: meta?.height ?? 0, posterUrl })
      }
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "The upload failed. Try again.")
    } finally {
      setProgress(null)
      setUploading(false)
    }
  }

  function applyLink() {
    const v = link.trim()
    if (!v) return
    onChange(v)
    if (kind === "video") onVideoMeta?.({ width: 0, height: 0, posterUrl: null })
    setLink("")
    setLinkMode(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {optional && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
        </label>
        {value && <span className="truncate text-xs text-muted-foreground" title={value}>{mediaFileName(value)}</span>}
      </div>

      <div className={cn("flex gap-3", kind === "audio" ? "flex-col" : "items-start")}>
        {/* Preview, also a drop target */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            const file = e.dataTransfer.files?.[0]
            if (file) upload(file)
          }}
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border transition",
            kind === "audio" ? "flex h-14 w-full items-center px-3" : previewClassName ?? "aspect-[9/16] w-28",
            dragging && "ring-2 ring-primary",
            error && "ring-destructive"
          )}
        >
          {value && kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element -- previews come from any host
            <img src={src} alt="" className="absolute inset-0 size-full object-cover" style={imageStyle} />
          )}
          {value && kind === "video" && (
            <video key={src} src={src} muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" onMouseEnter={(e) => e.currentTarget.play().catch(() => {})} onMouseLeave={(e) => e.currentTarget.pause()} />
          )}
          {value && kind === "audio" && <audio key={src} src={src} controls preload="metadata" className="h-9 w-full" />}
          {!value && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2 text-center text-xs text-muted-foreground">
              <Icon className="size-5" aria-hidden />
              {kind === "audio" ? "No audio yet" : "Drop a file"}
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/85 px-3 text-xs font-medium">
              Uploading {Math.round((progress ?? 0) * 100)}%
              <span className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${(progress ?? 0) * 100}%` }} />
              </span>
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              id={id}
              type="file"
              accept={ACCEPT[kind]}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ""
                if (file) upload(file)
              }}
            />
            <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
              {value ? <RotateCcw data-icon="inline-start" /> : <Upload data-icon="inline-start" />}
              {value ? "Replace" : "Upload"}
            </Button>
            <Button type="button" size="sm" variant="ghost" disabled={uploading} onClick={() => setLinkMode((m) => !m)}>
              <Link2 data-icon="inline-start" />
              Paste link
            </Button>
            {value && optional && (
              <Button type="button" size="sm" variant="ghost" disabled={uploading} onClick={() => onChange("")}>
                <X data-icon="inline-start" />
                Remove
              </Button>
            )}
          </div>
          {linkMode && (
            <div className="flex gap-2">
              <Input
                autoFocus
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    applyLink()
                  }
                }}
                placeholder="https://… or /path/on/website.mp4"
                className="h-8"
              />
              <Button type="button" size="sm" onClick={applyLink} disabled={!link.trim()}>
                Use
              </Button>
            </div>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {(problem || error) && <p className="text-xs font-medium text-destructive">{problem ?? error}</p>}
          {!uploads.ready && !problem && <p className="text-xs text-warning">{uploads.problem}</p>}
        </div>
      </div>
    </div>
  )
}

/** Asks the CMS for a one-time link, then sends the file to Supabase Storage with progress. */
async function putFile(folder: MediaFolder, kind: MediaKind, file: File, onProgress: (p: number) => void) {
  const signed = await requestUpload({ folder, kind, name: file.name, type: file.type, size: file.size })
  if (!signed.ok) throw new Error(signed.error)

  // The same multipart body Supabase's own client sends to a signed upload URL.
  const body = new FormData()
  body.append("cacheControl", "31536000")
  body.append("", file)

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", signed.upload.uploadUrl)
    xhr.setRequestHeader("x-upsert", "false")
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total)
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve()
      let message = `Supabase Storage refused the file (${xhr.status}).`
      try {
        const detail = JSON.parse(xhr.responseText) as { message?: string; error?: string }
        if (detail.message) message = `Upload failed: ${detail.message}`
      } catch {}
      reject(new Error(message))
    }
    xhr.onerror = () => reject(new Error("The upload was interrupted. Check your connection and try again."))
    xhr.send(body)
  })
  onProgress(1)
  return signed.upload.publicUrl
}

/** A video file's size and a WebP of its first frame (a moment in, past any black lead-in). */
function readVideo(file: File): Promise<{ width: number; height: number; poster: Blob | null }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.muted = true
    video.playsInline = true
    video.preload = "auto"
    const finish = (result: { width: number; height: number; poster: Blob | null } | Error) => {
      URL.revokeObjectURL(url)
      if (result instanceof Error) reject(result)
      else resolve(result)
    }
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(0.1, (video.duration || 1) / 10)
    }
    video.onseeked = () => {
      const width = video.videoWidth
      const height = video.videoHeight
      const canvas = document.createElement("canvas")
      // A thumbnail, so cap it at 720 px wide.
      const scale = Math.min(1, 720 / (width || 720))
      canvas.width = Math.round(width * scale)
      canvas.height = Math.round(height * scale)
      const ctx = canvas.getContext("2d")
      if (!ctx || !width) return finish({ width, height, poster: null })
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((poster) => finish({ width, height, poster }), "image/webp", 0.82)
    }
    video.onerror = () => finish(new Error("Couldn't read that video."))
    video.src = url
  })
}
