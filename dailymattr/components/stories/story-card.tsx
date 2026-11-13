"use client"

import * as React from "react"
import { VolumeX } from "lucide-react"
import { useReducedMotion } from "motion/react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { VideoAsset } from "@/lib/videos"

// 9:16 portrait tile, radius 24, fill #DEDEDE (--placeholder).
// Pass the cover <Image fill /> as children. With a `video`, hovering the card lifts it a
// little and plays the clip, with sound, over the cover; leaving pauses it and rewinds.
// Touch screens have no hover, so there a tap plays the clip and another tap stops it; the
// carousel passes `tapped` so only one card plays at a time.
// Nothing is downloaded until the card is first hovered or tapped.

/** True on devices whose main pointer cannot hover (phones, tablets). */
const isTouchOnly = () => !window.matchMedia("(hover: hover)").matches

export function StoryCard({
  children,
  video,
  tapped = false,
  onTap,
}: {
  children?: React.ReactNode
  video?: VideoAsset
  /** Playing because it was tapped (touch screens). */
  tapped?: boolean
  /** Called when the card is tapped on a touch screen. */
  onTap?: () => void
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [hoverArmed, setHoverArmed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  // True while the browser keeps the clip muted (no click/tap/key on the page yet).
  const [soundBlocked, setSoundBlocked] = React.useState(false)

  const canPlay = !!video && !reduceMotion
  const armed = canPlay && (hoverArmed || tapped)
  const active = hovered || tapped

  // Plays with sound. Browsers refuse unmuted playback until the visitor has clicked, tapped or
  // pressed a key on the page, so until then it plays muted and the first such interaction
  // (while still hovering) turns the sound on.
  React.useEffect(() => {
    const el = videoRef.current
    if (!el || !armed) return
    if (!active) {
      el.pause()
      el.currentTime = 0
      return
    }
    el.muted = false
    el.play().then(() => setSoundBlocked(false)).catch(() => {
      el.muted = true
      setSoundBlocked(true)
      el.play().catch(() => {})
    })
    const unmute = () => {
      el.muted = false
      setSoundBlocked(false)
    }
    const events = ["pointerdown", "keydown"] as const
    events.forEach((e) => window.addEventListener(e, unmute, { capture: true }))
    return () => events.forEach((e) => window.removeEventListener(e, unmute, { capture: true }))
  }, [active, armed])

  return (
    <div
      className={`transition-transform duration-300 ease-out hover:scale-[1.08] ${tapped ? "scale-[1.08]" : ""}`}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || !canPlay || isTouchOnly()) return
        setHoverArmed(true)
        setHovered(true)
      }}
      onClick={() => {
        if (canPlay && isTouchOnly()) onTap?.()
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <AspectRatio ratio={9 / 16} className="overflow-hidden rounded-[1.5rem] bg-placeholder">
        {children}
        {armed && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              active && playing ? "opacity-100" : "opacity-0"
            }`}
          >
            {video.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
        {active && playing && soundBlocked && (
          <span className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white backdrop-blur-sm">
            <VolumeX className="size-4" aria-hidden />
            Click for sound
          </span>
        )}
      </AspectRatio>
    </div>
  )
}
