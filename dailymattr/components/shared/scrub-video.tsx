"use client"

import { useEffect, useRef, type ComponentProps } from "react"
import { motionValue, useMotionValueEvent, type MotionValue } from "motion/react"

import type { VideoAsset } from "@/lib/videos"

type ScrubVideoProps = Omit<
  ComponentProps<"video">,
  "src" | "poster" | "preload" | "autoPlay" | "muted" | "loop" | "ref" | "children"
> & {
  video: VideoAsset
  /** 0 → first frame, 1 → last frame. Leave unset to hold the first frame (reduced motion). */
  progress?: MotionValue<number>
}

// useMotionValueEvent needs a motion value even when there is no progress to follow.
const fallback = motionValue(0)

/** How quickly the shown frame catches up with the scroll position (0–1 per animation frame). */
const FOLLOW = 0.18

/**
 * A video that never plays on its own: its frame follows `progress`, so it moves while the
 * page scrolls, stops when scrolling stops, and runs backwards when scrolling back up. The
 * frame eases towards the scroll position rather than jumping, so it reads as animation.
 * Encode the file with `scrub: true` in scripts/encode-videos.mjs (dense keyframes) so every
 * seek is instant.
 */
export function ScrubVideo({ video, progress, onLoadedMetadata, ...props }: ScrubVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const target = useRef(0) // seconds the scroll position asks for
  const shown = useRef(0) // seconds currently on screen (eased)
  const raf = useRef(0)

  const tick = () => {
    raf.current = 0
    const el = ref.current
    if (!el || !el.duration) return
    const diff = target.current - shown.current
    shown.current = Math.abs(diff) < 0.005 ? target.current : shown.current + diff * FOLLOW
    // Skip a frame while the decoder is still busy with the last seek, rather than queueing.
    if (!el.seeking) el.currentTime = shown.current
    if (shown.current !== target.current) raf.current = requestAnimationFrame(tick)
  }

  const seekTo = (p: number) => {
    const el = ref.current
    if (!el || !el.duration) return
    // Stop just short of the end: some browsers show a blank frame at exactly `duration`.
    target.current = Math.min(Math.max(p, 0), 1) * (el.duration - 0.05)
    if (!raf.current) raf.current = requestAnimationFrame(tick)
  }

  useMotionValueEvent(progress ?? fallback, "change", seekTo)
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <video
      ref={ref}
      poster={video.poster}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      // Once the length is known, jump straight to wherever the page already is (e.g. reload
      // halfway down), without easing through the frames before it.
      {...props}
      onLoadedMetadata={(e) => {
        onLoadedMetadata?.(e)
        if (!progress) return
        const el = e.currentTarget
        shown.current = target.current = Math.min(Math.max(progress.get(), 0), 1) * (el.duration - 0.05)
        el.currentTime = shown.current
      }}
    >
      {video.sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}
