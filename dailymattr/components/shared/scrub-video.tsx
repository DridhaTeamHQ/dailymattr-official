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

/**
 * How quickly the shown frame catches up with the scroll position: the share of the gap closed
 * per 60 Hz frame (scaled by the real frame time, so 120 Hz screens glide at the same pace).
 * Lower is a softer, longer glide.
 */
const FOLLOW = 0.1

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
  const last = useRef(0) // timestamp of the previous tick, 0 when idle

  const tick = (now: number) => {
    raf.current = 0
    const el = ref.current
    if (!el || !el.duration) return
    // Frames elapsed at 60 Hz since the last tick (capped, so a stalled tab doesn't jump).
    const frames = last.current ? Math.min((now - last.current) / (1000 / 60), 4) : 1
    last.current = now
    const diff = target.current - shown.current
    const step = 1 - (1 - FOLLOW) ** frames
    shown.current = Math.abs(diff) < 0.005 ? target.current : shown.current + diff * step
    // Skip a frame while the decoder is still busy with the last seek, rather than queueing.
    if (!el.seeking) el.currentTime = shown.current
    if (shown.current !== target.current) raf.current = requestAnimationFrame(tick)
    else last.current = 0
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
        // Phones (iOS Safari above all) may not draw a seeked frame of a video that has never
        // played, leaving the poster up while the page scrolls. A muted play-and-pause wakes
        // the decoder; if it's refused (e.g. Low Power Mode), seeking still works once it can.
        if (window.matchMedia("(pointer: coarse)").matches) {
          el.play()
            .then(() => {
              el.pause()
              el.currentTime = shown.current
            })
            .catch(() => {})
        }
      }}
    >
      {video.sources.map((s) => (
        <source key={s.src} src={s.src} type={s.type} />
      ))}
    </video>
  )
}
