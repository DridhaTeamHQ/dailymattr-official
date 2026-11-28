"use client"

import { useRef, type ComponentProps } from "react"
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
 * Half a frame of a 60 fps clip. A scroll step that moves the clip by less than this lands on
 * the frame already showing, so it isn't worth a seek.
 */
const HALF_FRAME = 1 / 120

/**
 * A video that never plays on its own: its frame is locked to `progress`, so it moves exactly
 * as far as the page scrolls, stops the moment scrolling stops, and runs backwards when
 * scrolling back up. The frame is not eased on top of the scroll: the page's smooth scrolling
 * (Lenis) already glides, and a second glide here made the video trail the page and keep
 * playing after it had stopped. Encode the file with `scrub: true` in
 * scripts/encode-videos.mjs (dense keyframes) so every seek is quick.
 */
export function ScrubVideo({ video, progress, onLoadedMetadata, ...props }: ScrubVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const target = useRef(0) // seconds the scroll position asks for

  /**
   * Shows the frame the scroll asks for. While the decoder is still busy with the last seek it
   * waits rather than queueing; `onSeeked` calls this again when that seek lands, so the frame
   * always catches up with the latest scroll position, including the one scrolling stopped on.
   */
  const show = () => {
    const el = ref.current
    if (!el || !el.duration || el.seeking) return
    if (Math.abs(el.currentTime - target.current) >= HALF_FRAME) el.currentTime = target.current
  }

  const seekTo = (p: number) => {
    const el = ref.current
    if (!el || !el.duration) return
    // Stop just short of the end: some browsers show a blank frame at exactly `duration`.
    target.current = Math.min(Math.max(p, 0), 1) * (el.duration - 0.05)
    show()
  }

  useMotionValueEvent(progress ?? fallback, "change", seekTo)

  return (
    <video
      ref={ref}
      poster={video.poster}
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      {...props}
      onSeeked={(e) => {
        props.onSeeked?.(e)
        show()
      }}
      // Once the length is known, jump straight to wherever the page already is (e.g. reload
      // halfway down).
      onLoadedMetadata={(e) => {
        onLoadedMetadata?.(e)
        if (!progress) return
        const el = e.currentTarget
        target.current = Math.min(Math.max(progress.get(), 0), 1) * (el.duration - 0.05)
        el.currentTime = target.current
        // Phones (iOS Safari above all) may not draw a seeked frame of a video that has never
        // played, leaving the poster up while the page scrolls. A muted play-and-pause wakes
        // the decoder; if it's refused (e.g. Low Power Mode), seeking still works once it can.
        if (window.matchMedia("(pointer: coarse)").matches) {
          el.play()
            .then(() => {
              el.pause()
              el.currentTime = target.current
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
