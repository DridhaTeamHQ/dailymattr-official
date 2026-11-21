"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { fromSoundToggle, setVideosMuted, SoundToggle, useVideosMuted } from "@/components/shared/sound-toggle"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { VideoAsset } from "@/lib/videos"

// 9:16 portrait tile, radius 24, fill #DEDEDE (--placeholder).
// Pass the cover <Image fill /> as children. With a `video`, hovering the card lifts it a
// little and plays the clip, with sound, over the cover; leaving pauses it and rewinds. A small
// speaker button in the corner mutes and unmutes it (for every card, see SoundToggle).
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
  const userMuted = useVideosMuted()

  const canPlay = !!video && !reduceMotion
  const armed = canPlay && (hoverArmed || tapped)
  const active = hovered || tapped

  // Plays with sound unless the visitor muted videos. Browsers refuse unmuted playback until
  // the visitor has clicked, tapped or pressed a key on the page, so until then it plays muted
  // and the first such interaction (while still hovering) turns the sound on.
  React.useEffect(() => {
    const el = videoRef.current
    if (!el || !armed) return
    if (!active) {
      el.pause()
      el.currentTime = 0
      return
    }
    el.muted = userMuted
    el.play().then(() => setSoundBlocked(false)).catch(() => {
      el.muted = true
      setSoundBlocked(true)
      el.play().catch(() => {})
    })
    if (userMuted) return
    const unmute = (e: Event) => {
      if (fromSoundToggle(e)) return
      el.muted = false
      setSoundBlocked(false)
    }
    const events = ["pointerdown", "keydown"] as const
    events.forEach((e) => window.addEventListener(e, unmute, { capture: true }))
    return () => events.forEach((e) => window.removeEventListener(e, unmute, { capture: true }))
  }, [active, armed, userMuted])

  // Clicking through to a story leaves this page mounted but hidden (Next's cacheComponents),
  // with no pointerleave, so the clip would play on with sound. Effects clean up then: stop it.
  React.useLayoutEffect(() => {
    const el = videoRef
    return () => {
      el.current?.pause()
      setHovered(false)
    }
  }, [])

  const muted = userMuted || soundBlocked
  const toggleSound = () => {
    const el = videoRef.current
    // Set on the element inside the click itself, which browsers accept as permission for sound
    if (el) el.muted = !muted
    setSoundBlocked(false)
    setVideosMuted(!muted)
  }

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
        {active && playing && <SoundToggle muted={muted} onToggle={toggleSound} />}
      </AspectRatio>
    </div>
  )
}
