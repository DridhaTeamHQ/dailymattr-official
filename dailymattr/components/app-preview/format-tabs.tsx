"use client"

import { useId, useState } from "react"
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
// (8859:12714) covering it. Tab bar 8859:12720: black, 1211 × 78, centred, 37px above the
// bottom, padding 5.6, radius 14.93; seven 67.2-tall tabs, radius 11.2, the active one on 15%
// white. Inactive tabs sit at 50% opacity. Phones and tablets keep a full-width bar 24px in.
// Subtitles show once the box is wide enough for all seven (78rem).
const fade = "transition-opacity duration-300"
const inactive = "opacity-50 group-hover/trigger:opacity-80"
// NIA's brand gradient, the same as the NIA title in the bento and on About.
const niaGradient = "bg-[linear-gradient(246.16deg,#af75ff_3.11%,#4d90fd_93.93%)]"

const formatTime =(s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

export function FormatTabs() {
  const [active, setActive] = useState(formats[0].value)
  const reduceMotion = useReducedMotion()
  const activeFormat = formats.find((f) => f.value === active) ?? formats[0]
  // One id per instance, so two tab bars on a page never share an indicator.
  const pillId = `format-pill-${useId()}`
  // Length of a video on screen, read once its metadata loads; stills use the format's own text.
  const [durations, setDurations] = useState<Record<string, number>>({})
  const videoLength = durations[activeFormat.value]
  const durationText =
    activeFormat.videoSrc && videoLength !== undefined ? formatTime(videoLength) : activeFormat.duration
  // Tabs that share a still don't re-animate it when switching between them.
  const mediaKey = activeFormat.videoSrc ?? activeFormat.image.src

  return (
    <Tabs
      value={active}
      onValueChange={(value) => setActive(value as string)}
      // At lg and up the width follows --expand-w (set by ExpandOnScroll as the section
      // scrolls in), falling back to the starting width (START_W) when it isn't set.
      className={cn(
        "@container gap-0",
        CONTENT_WIDTH,
        "lg:w-[var(--expand-w,85vw)] lg:max-w-none"
      )}
    >
      <AspectRatio
        ratio={1200 / 720}
        // At lg and up the height follows --expand-h (falls back to the starting 16:9 height,
        // START_H in expand-on-scroll.tsx, capped at MAX_H so it fits the screen).
        className="overflow-hidden rounded-[0.9333rem] bg-[#f9f8f8] lg:aspect-auto lg:h-[var(--expand-h,min(85vw*0.5625,100svh_-_6rem))]"
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
          className="pointer-events-none absolute top-3 left-3 flex h-[1.8667rem] items-center justify-center gap-[0.5833rem] rounded-[0.5833rem] bg-black/15 py-[0.2333rem] pr-[0.7rem] pl-[0.9333rem] font-helvetica text-[0.8167rem] leading-[1.4rem] font-medium tracking-[-0.0082rem] whitespace-nowrap text-white tabular-nums sm:top-[1.5625rem] sm:left-6"
        >
          <Image src={durationPlay} alt="" className="h-[0.7rem] w-[0.5833rem] shrink-0" />
          {durationText}
        </span>

        {formats.map((f) => (
          <TabsContent key={f.value} value={f.value} className="sr-only">
            {f.title} — {f.subtitle}
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-2 bottom-2 w-auto gap-0 overflow-x-auto rounded-[0.9333rem] bg-black p-1.5 group-data-horizontal/tabs:h-14 sm:inset-x-6 sm:bottom-6 sm:group-data-horizontal/tabs:h-[5.25rem] lg:inset-x-auto lg:bottom-[2.3125rem] lg:left-1/2 lg:w-[75.6875rem] lg:max-w-[calc(100%-3rem)] lg:-translate-x-1/2 lg:p-[0.35rem] lg:group-data-horizontal/tabs:h-[4.875rem]">
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
                className="group/trigger h-full min-w-20 flex-1 flex-col gap-[0.2333rem] rounded-[0.7rem] border-0 bg-transparent font-helvetica text-white hover:text-white dark:text-white dark:hover:text-white data-active:bg-transparent data-active:text-white group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:bg-transparent dark:data-active:text-white"
              >
                {isActive &&
                  (reduceMotion ? (
                    <span className="absolute inset-0 rounded-[0.7rem] bg-white/15" />
                  ) : (
                    // Shared layoutId: the pill glides from the old tab to this one.
                    <motion.span
                      layoutId={pillId}
                      className="absolute inset-0 rounded-[0.7rem] bg-white/15 will-change-transform"
                      transition={{ type: "spring", bounce: 0.15, visualDuration: 0.4 }}
                    />
                  ))}
                {/* Bold 16.8/17.92 over Regular 14/15.68 at 50% white; inactive labels at 50%. */}
                <span className="relative text-sm font-bold lg:text-[1.05rem] lg:leading-[1.12rem]">
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
                    "relative hidden text-sm leading-[0.98rem] font-normal text-white/50 @min-[78rem]:block",
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
