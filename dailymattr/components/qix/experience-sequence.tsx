"use client"

import { useEffect, useRef, useState, type Ref } from "react"
import { useAnimate, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import type { VideoAsset } from "@/lib/videos"

type Frame = { label: string; video: VideoAsset }

/** Soft ease-out (expo-like) for the fill sweeping across and the number changing colour. */
const SWEEP = "cubic-bezier(0.22, 1, 0.36, 1)"

/**
 * Numbered step circle. When the timeline reaches it, it gives one soft, continuous bounce: it
 * eases up a little, eases back through a slight dip and settles, slowing to rest at every
 * turn so nothing snaps. At the same moment blue sweeps across it from the left (the side the
 * line arrives from), like an eclipse, the number turns white, and a light, thin ring drifts
 * out once and fades. Going back to frame 1 empties it again, calmly.
 */
function StepCircle({
  n,
  reached,
  arrived,
  edgeRef,
}: {
  n: number
  reached: boolean
  /** True from the moment this step's frame starts; each time it turns true, the circle bounces. */
  arrived: boolean
  /** The still (never scaled) box the timeline measures, so the line doesn't wobble mid-bounce. */
  edgeRef: Ref<HTMLSpanElement>
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>()

  useEffect(() => {
    const circle = scope.current?.querySelector<HTMLElement>("[data-circle]")
    const ring = scope.current?.querySelector<HTMLElement>("[data-ring]")
    if (!circle || !ring || !arrived) return
    // One continuous motion: up 5.5%, back through a 2% dip, then rest. Each leg eases in and
    // out, so the circle slows to a stop at the top and at the bottom, like a real bounce.
    const bounce = animate(
      circle,
      { scale: [1, 1.055, 0.98, 1] },
      { duration: 0.9, times: [0, 0.3, 0.65, 1], ease: ["easeOut", "easeInOut", "easeInOut"] }
    )
    // A light ripple: thin, faint, not far, fading slowly.
    const ripple = animate(
      ring,
      { scale: [1, 1.45], opacity: [0.22, 0] },
      { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
    )
    return () => {
      bounce.stop()
      ripple.stop()
    }
  }, [arrived, animate, scope])

  return (
    <span ref={scope} className="relative grid size-8 place-items-center">
      <span ref={edgeRef} aria-hidden className="pointer-events-none absolute inset-0" />
      <span
        data-ring
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full border border-[#3979ff] opacity-0 will-change-transform"
      />
      <span
        data-circle
        className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-[#eaf1ff] text-[0.8125rem] leading-8 font-medium tracking-[0.0188rem] will-change-transform"
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#3979ff]"
          style={{
            clipPath: reached ? "circle(150% at 0% 50%)" : "circle(0% at 0% 50%)",
            transition: `clip-path ${reached ? "800ms" : "450ms"} ${SWEEP}`,
          }}
        />
        <span
          className="relative"
          style={{
            color: reached ? "#ffffff" : "#3979ff",
            transition: `color 450ms ${SWEEP} ${reached ? "150ms" : "0ms"}`,
          }}
        >
          {n}
        </span>
      </span>
    </span>
  )
}

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
  const lineRef = useRef<HTMLSpanElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([])

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

  // Phones: the four frames are wider than the screen and scroll sideways. Follow the timeline:
  // when a frame starts, slide the row so it sits at the left edge, easing the previous frame
  // out of view; back to the start when the loop begins again. Where all four fit (desktop)
  // there is nothing to scroll, so this does nothing.
  useEffect(() => {
    const list = listRef.current
    const scroller = list?.parentElement
    const item = list?.children[active + 1] as HTMLElement | undefined // +1: the hairline comes first
    if (!running || !scroller || !item || scroller.scrollWidth <= scroller.clientWidth) return
    scroller.scrollTo({ left: active === 0 ? 0 : item.offsetLeft, behavior: "smooth" })
  }, [active, running])

  // Browsers pause video on a hidden tab; pick the active frame up again when the tab returns.
  useEffect(() => {
    const resume = () => {
      if (document.visibilityState === "visible" && running) videoRefs.current[active]?.play().catch(() => {})
    }
    document.addEventListener("visibilitychange", resume)
    return () => document.removeEventListener("visibilitychange", resume)
  }, [active, running])

  // Timeline: while frame N plays, a blue line runs along the hairline from step N's circle to
  // step N+1's, in time with the clip. Steps already played stay filled; it starts over with
  // frame 1.
  useEffect(() => {
    const line = lineRef.current
    const fill = fillRef.current
    if (!line || !fill || !running) return
    let frame = 0
    // A step circle's left / right edge, in px along the hairline.
    const edge = (i: number, side: "left" | "right") => {
      const badge = badgeRefs.current[i]
      if (!badge) return 0
      return badge.getBoundingClientRect()[side] - line.getBoundingClientRect().left
    }
    const last = frames.length - 1
    const tick = () => {
      const video = videoRefs.current[active]
      const progress = video?.duration ? Math.min(1, video.currentTime / video.duration) : 0
      // From this circle's right edge to the next one's left edge, so the line touches the next
      // circle just as its frame starts (and it fills). The last frame has no line after it.
      const start = active < last ? edge(active, "right") : edge(last, "left")
      const end = active < last ? edge(active + 1, "left") : start
      fill.style.width = `${start + progress * (end - start)}px`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, running, frames.length])

  return (
    <ol ref={listRef} className="relative grid w-[41rem] grid-cols-4 gap-4">
      {/* Hairline the step numbers sit on (Figma 8646:2713), from step 1 to step 4 and no further,
          with the blue timeline over it. Each circle is centred under its 8.25rem video (4.125rem
          in), and steps are 10.5rem apart (9.5rem column + 1rem gap). */}
      <span ref={lineRef} aria-hidden className="absolute top-[16.75rem] left-[4.125rem] h-px w-[31.5rem] bg-[#ebebeb]">
        <span
          ref={fillRef}
          className="absolute top-1/2 left-0 h-0.5 w-0 -translate-y-1/2 rounded-full bg-[#3979ff]"
        />
      </span>
      {frames.map((frame, i) => {
        const isActive = running && i === active
        const isReached = running && i <= active
        return (
          <li key={frame.label} className="relative flex w-[8.25rem] flex-col items-center gap-3">
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
            <StepCircle
              n={i + 1}
              reached={isReached}
              arrived={isActive}
              edgeRef={(el) => {
                badgeRefs.current[i] = el
              }}
            />
            <span className="text-center text-sm leading-5 font-medium tracking-[-0.01rem] text-[#696969]">{frame.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
