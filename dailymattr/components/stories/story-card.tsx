"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import type { VideoAsset } from "@/lib/videos"

// 9:16 portrait tile, radius 24, fill #DEDEDE (--placeholder).
// Pass the cover <Image fill /> as children. With a `video`, hovering the card lifts it a
// little and plays the clip over the cover; leaving pauses it and rewinds to the cover.
// Nothing is downloaded until the first hover.
export function StoryCard({ children, video }: { children?: React.ReactNode; video?: VideoAsset }) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()
  const [armed, setArmed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)

  const canPlay = !!video && !reduceMotion

  React.useEffect(() => {
    const el = videoRef.current
    if (!el || !armed) return
    el.muted = true
    if (hovered) {
      el.play().catch(() => {})
    } else {
      el.pause()
      el.currentTime = 0
    }
  }, [hovered, armed])

  return (
    <div
      className="transition-transform duration-300 ease-out hover:scale-[1.08]"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || !canPlay) return
        setArmed(true)
        setHovered(true)
      }}
      onPointerLeave={() => setHovered(false)}
    >
      <AspectRatio ratio={9 / 16} className="overflow-hidden rounded-[1.5rem] bg-placeholder">
        {children}
        {canPlay && armed && (
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
              hovered && playing ? "opacity-100" : "opacity-0"
            }`}
          >
            {video.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        )}
      </AspectRatio>
    </div>
  )
}
