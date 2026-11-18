"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { cn } from "@/lib/utils"
import { SiteVideo } from "@/components/shared/site-video"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formats } from "./formats"

// Figma 8859:12712: media opens to 1792 × 1008. Tab bar 1075.2 × 78.4, centred, 37px above the
// bottom, padding 5.6, six 177.3 × 67.2 tabs, radius 16 (phones and tablets keep a full-width
// bar 24px in). Duration badge 81 × 30 at (24, 25). Subtitles show once the box is wide enough
// to fit them (640px: the 800px box on a 1280px laptop, as in Figma).
const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

export function FormatTabs() {
  const [active, setActive] = useState(formats[0].value)
  const reduceMotion = useReducedMotion()
  const activeFormat = formats.find((f) => f.value === active) ?? formats[0]
  // One id per instance, so two tab bars on a page never share an indicator.
  const pillId = `format-pill-${useId()}`
  // Length of the clip on screen, read from the video once its metadata loads.
  const [durations, setDurations] = useState<Record<string, number>>({})
  const duration = durations[activeFormat.value]

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
        className="overflow-hidden rounded-xl bg-placeholder lg:aspect-auto lg:h-[var(--expand-h,min(85vw*0.5625,100svh_-_6rem))]"
      >
        {/*
          Decorative preview layer. Both clips are mounted while the tab changes, so the
          incoming one fades up over the outgoing one instead of cutting. The panels below
          carry the semantics; this layer is hidden from assistive tech.
        */}
        <AnimatePresence initial={false}>
          {activeFormat.videoSrc && (
            <motion.div
              key={activeFormat.value}
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
              <SiteVideo
                video={activeFormat.videoSrc}
                className="size-full object-cover"
                onLoadedMetadata={(e) => {
                  const d = e.currentTarget.duration
                  if (Number.isFinite(d)) setDurations((prev) => ({ ...prev, [activeFormat.value]: d }))
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {duration !== undefined && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-3 left-3 flex h-[1.875rem] items-center gap-2 rounded-md bg-white/25 pr-3 pl-4 text-[0.9375rem] leading-none font-medium text-white tabular-nums backdrop-blur-md sm:top-[1.5625rem] sm:left-6"
          >
            <svg viewBox="0 0 8 10" className="h-[0.7rem] w-[0.58rem] fill-current" aria-hidden>
              <path d="M0 0.8v8.4a.8.8 0 0 0 1.2.7l6.4-4.2a.8.8 0 0 0 0-1.4L1.2.1A.8.8 0 0 0 0 .8Z" />
            </svg>
            {formatTime(duration)}
          </span>
        )}

        {formats.map((f) => (
          <TabsContent key={f.value} value={f.value} className="sr-only">
            {f.title} — {f.subtitle}
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-2 bottom-2 w-auto gap-0 overflow-x-auto rounded-[1rem] bg-foreground p-1.5 group-data-horizontal/tabs:h-14 sm:inset-x-6 sm:bottom-6 sm:group-data-horizontal/tabs:h-[5.25rem] lg:inset-x-auto lg:bottom-[2.3125rem] lg:left-1/2 lg:w-[67.2rem] lg:max-w-[calc(100%-3rem)] lg:-translate-x-1/2 lg:p-[0.35rem] lg:group-data-horizontal/tabs:h-[4.9rem]">
          {formats.map((f) => {
            const isActive = f.value === active
            return (
              <TabsTrigger
                key={f.value}
                value={f.value}
                // The background lives in the sliding pill below, not on the trigger itself.
                className="h-full min-w-20 flex-1 flex-col gap-0.5 rounded-xl border-0 bg-transparent text-background/50 transition-colors duration-300 hover:text-background/80 data-active:bg-transparent data-active:text-background group-data-[variant=default]/tabs-list:data-active:shadow-none dark:data-active:bg-transparent dark:data-active:text-background"
              >
                {isActive &&
                  (reduceMotion ? (
                    <span className="absolute inset-0 rounded-xl bg-background/15" />
                  ) : (
                    // Shared layoutId: the pill glides from the old tab to this one.
                    <motion.span
                      layoutId={pillId}
                      className="absolute inset-0 rounded-xl bg-background/15 will-change-transform"
                      transition={{ type: "spring", bounce: 0.15, visualDuration: 0.4 }}
                    />
                  ))}
                <span className="relative text-sm font-bold lg:text-lg lg:leading-5">{f.title}</span>
                <span className="relative hidden text-sm leading-4 font-normal text-background/50 @min-[640px]:block">
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
