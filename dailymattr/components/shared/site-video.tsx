"use client"

import { useEffect, useRef, useState, type ComponentProps } from "react"
import { useReducedMotion } from "motion/react"

import { placeholderVideo, type VideoAsset } from "@/lib/videos"

type SiteVideoProps = Omit<
  ComponentProps<"video">,
  "src" | "poster" | "preload" | "autoPlay" | "muted" | "ref" | "children"
> & {
  /** An entry from lib/videos.ts, or a plain URL for a placeholder clip. */
  video: VideoAsset | string
  /** Above the fold (a hero): start loading straight away instead of when scrolled near. */
  priority?: boolean
  /** Leave unset to autoplay while on screen; pass false to hold it paused (e.g. inactive tab). */
  playing?: boolean
}

/** How far outside the screen a video starts loading, so it is ready as it scrolls in. */
const LOAD_MARGIN = "400px 0px"

/**
 * The one way the site renders a video. Muted, looping and inline, and it:
 *  - fetches nothing until it is close to the screen (unless `priority`),
 *  - plays only while it is actually visible, and pauses when scrolled away,
 *  - shows its local poster (or first frame) instantly, and keeps it if the video fails,
 *  - stays on that still frame for visitors who prefer reduced motion.
 */
export function SiteVideo({ video, priority = false, playing, ...props }: SiteVideoProps) {
  const asset = typeof video === "string" ? placeholderVideo(video) : video
  const ref = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [near, setNear] = useState(priority)
  const [visible, setVisible] = useState(false)

  // Two observers: a wide one that starts the download early, a tight one for play/pause.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          nearObserver.disconnect()
        }
      },
      { rootMargin: LOAD_MARGIN }
    )
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    if (!priority) nearObserver.observe(el)
    visibleObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      visibleObserver.disconnect()
    }
  }, [priority])

  // Sources are only rendered once near. Inserting a <source> into an empty <video> starts
  // loading by itself; call load() only if the browser gave up first (no source found), since
  // calling it otherwise aborts the request already in flight and starts a second one.
  useEffect(() => {
    const el = ref.current
    if (near && el && el.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) el.load()
  }, [near])

  const shouldPlay = near && visible && playing !== false && !reduceMotion
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // React does not reliably reflect `muted` as an attribute; autoplay needs it set.
    el.muted = true
    if (shouldPlay) el.play().catch(() => {})
    else el.pause()
  }, [shouldPlay])

  return (
    <video
      ref={ref}
      poster={asset.poster}
      muted
      loop
      playsInline
      // Before it is near there are no sources, so nothing downloads whatever this says.
      preload={priority ? "auto" : "metadata"}
      {...props}
    >
      {near && asset.sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  )
}
