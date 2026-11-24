"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { cn } from "@/lib/utils"
import { SiteVideo } from "@/components/shared/site-video"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formats } from "./formats"
import durationPlay from "@/public/home/duration-play.png"
import niaStar from "@/public/home/nia-star.svg"

// Figma 8859:12712: a #f9f8f8 panel, radius 14.93, opening to 1792 × 1008 with the app mockup
// (8859:12714) covering it. Tab bar 8859:12720: 1211 × 78, centred, 37px above the bottom,
// padding 5.6, radius 14.93; seven 67.2-tall tabs, radius 11.2. Phones and tablets keep a
// full-width bar 24px in. Subtitles show once the box is wide enough for all seven (78rem).
// The bar is frosted glass rather than solid black: a dark tint (so white labels stay legible
// over the light frames of the clips) blurred and saturated over the video, a soft top sheen,
// a hairline white edge and a lift shadow. The active tab is a brighter glass pill.
const fade = "transition-opacity duration-300"
// Inactive tabs at 60% (Figma: 50%), a touch higher so they read on the lighter glass.
const inactive = "opacity-60 group-hover/trigger:opacity-90"
const glassBar =
  "bg-black/55 bg-linear-to-b from-white/[0.12] to-white/[0.02] backdrop-blur-2xl backdrop-saturate-[1.6] ring-1 ring-white/15 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_40px_-12px_rgba(0,0,0,0.55)]"
const glassPill =
  "absolute inset-0 rounded-[0.7rem] bg-white/[0.18] bg-linear-to-b from-white/15 to-transparent ring-1 ring-white/25 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_-4px_rgba(0,0,0,0.35)]"
// NIA's brand gradient, the same as the NIA title in the bento and on About.
const niaGradient = "bg-[linear-gradient(246.16deg,#af75ff_3.11%,#4d90fd_93.93%)]"

const formatTime =(s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

/**
 * Each tab's clip plays this many times, then the bar moves on to the next tab (after the
 * last, back to the first). Picking a tab yourself starts its count over. Clips only play
 * while on screen (SiteVideo), so the bar never runs ahead off screen; with reduced motion
 * nothing plays, so it stays put.
 */
const PLAYS_PER_TAB = 3

export function FormatTabs() {
  const [active, setActive] = useState(formats[0].value)
  const reduceMotion = useReducedMotion()
  // Read in the video's event handlers: the tab on screen and how often its clip has finished.
  const activeRef = useRef(active)
  const playsRef = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const activeFormat = formats.find((f) => f.value === active) ?? formats[0]
  // One id per instance, so two tab bars on a page never share an indicator.
  const pillId = `format-pill-${useId()}`
  // Length of a video on screen, read once its metadata loads; stills use the format's own text.
  const [durations, setDurations] = useState<Record<string, number>>({})
  // Whole seconds played of each tab's clip, so the badge counts down as it plays (and starts
  // over when the clip loops). Only whole seconds are stored, so it re-renders once a second.
  const [elapsed, setElapsed] = useState<Record<string, number>>({})
  const videoLength = durations[activeFormat.value]
  const durationText =
    activeFormat.videoSrc && videoLength !== undefined
      ? formatTime(Math.max(0, videoLength - (elapsed[activeFormat.value] ?? 0)))
      : activeFormat.duration
  // Tabs that share a still don't re-animate it when switching between them.
  const mediaKey = activeFormat.videoSrc ?? activeFormat.image.src

  function select(value: string) {
    activeRef.current = value
    playsRef.current = 0
    // A tab's clip mounts again from the start, so its countdown does too.
    setElapsed((prev) => ({ ...prev, [value]: 0 }))
    setActive(value)
  }

  // On phones the bar scrolls sideways; keep the active tab centred in it, so a tab the bar
  // moved to on its own is never out of sight. Only the bar scrolls, never the page.
  useEffect(() => {
    const list = listRef.current
    const tab = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    const l = list.getBoundingClientRect()
    const t = tab.getBoundingClientRect()
    list.scrollTo({
      left: list.scrollLeft + t.left - l.left - (l.width - t.width) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [active, reduceMotion])

  return (
    <Tabs
      value={active}
      onValueChange={(value) => select(value as string)}
      // At lg and up the width follows --expand-w (set by ExpandOnScroll as the section
      // scrolls in), falling back to the starting width (START_W) when it isn't set. On every
      // screen the box is capped so its 16:9 height fits between the pinned nav and the bottom
      // of the screen (1.5rem clear of each): short screens get a narrower box, never a cropped clip.
      className={cn(
        "@container gap-0",
        CONTENT_WIDTH,
        "max-w-[calc((100svh_-_var(--nav-height,4rem)_-_3rem)*16/9)] lg:w-[var(--expand-w,85vw)]"
      )}
    >
      <AspectRatio
        // 16:9 everywhere, the shape of the clips, so object-cover shows the whole frame.
        ratio={16 / 9}
        className="overflow-hidden rounded-[0.9333rem] bg-[#f9f8f8]"
      >
        {/*
          Decorative preview layer. Both media are mounted while the tab changes, so the
          incoming one fades up over the outgoing one instead of cutting. The panels below
          carry the semantics; this layer is hidden from assistive tech.
        */}
        <AnimatePresence initial={false}>
          <motion.div
            key={mediaKey}
            aria-hidden
            className="absolute inset-0 will-change-[opacity,transform]"
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.5, ease: "easeInOut" },
              scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {activeFormat.videoSrc ? (
              <SiteVideo
                video={activeFormat.videoSrc}
                className="size-full object-cover"
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration
                  if (Number.isFinite(d)) setDurations((prev) => ({ ...prev, [activeFormat.value]: d }))
                }}
                onTimeUpdate={(e) => {
                  const s = Math.floor(e.currentTarget.currentTime)
                  const v = activeFormat.value
                  setElapsed((prev) => (prev[v] === s ? prev : { ...prev, [v]: s }))
                }}
                // Replayed by hand rather than looped, so each finished play can be counted.
                loop={false}
                onEnded={(e) => {
                  const v = activeFormat.value
                  // A clip still fading out after a tab change no longer drives the bar.
                  if (v !== activeRef.current) return
                  playsRef.current += 1
                  if (playsRef.current < PLAYS_PER_TAB) {
                    const video = e.currentTarget
                    video.currentTime = 0
                    video.play().catch(() => {})
                    return
                  }
                  const i = formats.findIndex((f) => f.value === v)
                  select(formats[(i + 1) % formats.length].value)
                }}
              />
            ) : (
              <Image
                src={activeFormat.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 94vw, 100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Figma 8859:12716: 15% black, radius 9.33, 29.87 tall, padding 3.73 / 11.2 / 3.73 /
            14.93, gap 9.33; play icon 9.33 × 11.2; Helvetica Neue Medium 13.07/22.4 −0.13px white. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-3 left-3 flex h-[1.8667rem] items-center justify-center gap-[0.5833rem] rounded-[0.5833rem] bg-black/15 py-[0.2333rem] pr-[0.7rem] pl-[0.9333rem] text-[0.8167rem] leading-[1.4rem] font-medium tracking-[-0.0082rem] whitespace-nowrap text-white tabular-nums sm:top-[1.5625rem] sm:left-6"
        >
          <Image src={durationPlay} alt="" className="h-[0.7rem] w-[0.5833rem] shrink-0" />
          {durationText}
        </span>

        {formats.map((f) => (
          <TabsContent key={f.value} value={f.value} className="sr-only">
            {f.title} — {f.subtitle}
          </TabsContent>
        ))}

        <TabsList ref={listRef} className={cn("absolute inset-x-2 bottom-2 w-auto gap-0 overflow-x-auto rounded-[0.9333rem] p-1.5group-data-horizontal/tabs:h-14 sm:inset-x-6 sm:bottom-6 sm:group-data-horizontal/tabs:h-[5.25rem] lg:inset-x-auto lg:bottom-[2.3125rem] lg:left-1/2 lg:w-[75.6875rem] lg:max-w-[calc(100%-3rem)] lg:-translate-x-1/2 lg:p-[0.35rem] lg:group-data-horizontal/tabs:h-[4.875rem]", glassBar)}>
          {formats.map((f) => {
            const isActive = f.value === active
            // NIA: grey star, and the title and star take the NIA gradient on hover.
            const niaHover = f.sparkle
            const starBox = "absolute -top-[0.1595rem] -right-[0.365rem] size-[0.4389rem]"
            const starMask = { mask: `url(${niaStar.src}) center / contain no-repeat` }
            return (
              <TabsTrigger
                key={f.value}
                value={f.value}
                // The background lives in the sliding pill below, not on the trigger itself.
                className="group/trigger h-full min-w-20 flex-1 flex-col gap-[0.2333rem] rounded-[0.7rem] border-0 bg-transparent text-white hover:text-white dark:text-white dark:hover:text-white data-active:bg-transparent data-active:text-white group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:bg-transparent dark:data-active:text-white"
              >
                {isActive &&
                  (reduceMotion ? (
                    <span className={glassPill} />
                  ) : (
                    // Shared layoutId: the pill glides from the old tab to this one.
                    <motion.span
                      layoutId={pillId}
                      className={cn(glassPill, "will-change-transform")}
                      transition={{ type: "spring", bounce: 0.15, visualDuration: 0.4 }}
                    />
                  ))}
                {/* Bold 16.8/17.92 over Regular 14/15.68 at 50% white; inactive labels at 50%. */}
                {/* NIA is a step heavier (extra-bold): the gradient on hover reads thinner than white. */}
                <span
                  className={cn(
                    "relative text-sm lg:text-[1.05rem] lg:leading-[1.12rem]",
                    f.sparkle ? "font-extrabold" : "font-bold"
                  )}
                >
                  <span className={cn(fade, !isActive && inactive, niaHover && "group-hover/trigger:opacity-0")}>
                    {f.title}
                  </span>
                  {niaHover && (
                    // On hover NIA takes its brand gradient (as in the bento and on About): the
                    // gradient copy fades in over the white title.
                    <span
                      aria-hidden
                      className={cn("absolute inset-0 bg-clip-text text-transparent opacity-0 group-hover/trigger:opacity-100", niaGradient, fade)}
                    >
                      {f.title}
                    </span>
                  )}
                  {f.sparkle && (
                    <>
                      {/* Figma 9262:585: #7f7f7f star in an 8px box, 3.3px above the title and
                          overlapping its end; full opacity, unlike the label. */}
                      <Image src={niaStar} alt="" className={cn(starBox, "group-hover/trigger:opacity-0", fade)} />
                      <span
                        aria-hidden
                        className={cn(starBox, "opacity-0 group-hover/trigger:opacity-100", niaGradient, fade)}
                        style={starMask}
                      />
                    </>
                  )}
                </span>
                <span
                  className={cn(
                    "relative hidden text-sm leading-[0.98rem] font-normal text-white/65 @min-[78rem]:block",
                    fade,
                    !isActive && inactive
                  )}
                >
                  {f.subtitle}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </AspectRatio>
    </Tabs>
  )
}
