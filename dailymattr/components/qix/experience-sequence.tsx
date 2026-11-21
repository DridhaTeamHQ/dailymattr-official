"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import type { VideoAsset } from "@/lib/videos"

type Frame = { label: string; video: VideoAsset }

/**
 * Four frames of one explainer, played in turn: every frame shows its thumbnail, then frame 1
 * plays; when it ends, frame 2 picks up where it stopped, and so on to frame 4, then back to 1.
 * The clips are consecutive cuts of the same video, so the four read as one continuous story.
 * Plays only while on screen; visitors who prefer reduced motion just see the thumbnails.
 */
export function QixExperienceSequence({ frames }: { frames: Frame[] }) {
  const listRef = useRef<HTMLOListElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const reduceMotion = useReducedMotion()
  const [inView, setInView] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const running = inView && !reduceMotion

  // Play the active frame from its start; hold every other frame on its thumbnail.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (running && i === active) {
        video.currentTime = 0
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active, running])

  // Browsers pause video on a hidden tab; pick the active frame up again when the tab returns.
  useEffect(() => {
    const resume = () => {
      if (document.visibilityState === "visible" && running) videoRefs.current[active]?.play().catch(() => {})
    }
    document.addEventListener("visibilitychange", resume)
    return () => document.removeEventListener("visibilitychange", resume)
  }, [active, running])

  return (
    <ol ref={listRef} className="relative grid w-[41rem] grid-cols-4 gap-4">
      {/* Hairline the step numbers sit on. Figma 8646:2713. */}
      <span aria-hidden className="absolute top-[16.75rem] left-4 h-px w-[39rem] bg-[#ebebeb]" />
      {frames.map((frame, i) => {
        const isActive = running && i === active
        return (
          <li key={frame.label} className="relative flex flex-col gap-3">
            <span className="relative h-[14.75rem] w-[8.25rem] overflow-hidden rounded-[0.875rem] bg-[#e6e7ea]">
              <video
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                muted
                playsInline
                preload={inView ? "auto" : "none"}
                aria-label={`Step ${i + 1}: ${frame.label}`}
                onEnded={() => setActive((i + 1) % frames.length)}
                className="absolute inset-0 size-full object-cover"
              >
                {frame.video.sources.map((s) => (
                  <source key={s.src} src={s.src} type={s.type} />
                ))}
              </video>
              {/* Thumbnail on top until this frame's turn comes. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- local poster still, sized by the frame */}
              <img
                src={frame.video.poster}
                alt=""
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-300",
                  isActive ? "opacity-0" : "opacity-100"
                )}
              />
            </span>
            <span
              className={cn(
                "grid size-8 place-items-center rounded-[0.625rem] text-[0.8125rem] leading-8 font-medium tracking-[0.0188rem] transition-colors",
                isActive ? "bg-[#3979ff] text-white" : "bg-[#eaf1ff] text-[#3979ff]"
              )}
            >
              {i + 1}
            </span>
            <span className="text-sm leading-5 font-medium tracking-[-0.01rem] text-[#696969]">{frame.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
