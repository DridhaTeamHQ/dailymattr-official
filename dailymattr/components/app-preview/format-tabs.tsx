"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formats } from "./formats"

// Figma: media 1200 × 720 (shared content column); tab bar 1152 × 84 at (24, 612), padding 6,
// gap 0, radius 16. Subtitles show once the box is wide enough to fit them.
export function FormatTabs() {
  const [active, setActive] = useState(formats[0].value)
  const reduceMotion = useReducedMotion()
  const activeFormat = formats.find((f) => f.value === active) ?? formats[0]
  // One id per instance, so two tab bars on a page never share an indicator.
  const pillId = `format-pill-${useId()}`

  return (
    <Tabs
      value={active}
      onValueChange={(value) => setActive(value as string)}
      className={cn("@container gap-0", CONTENT_WIDTH)}
    >
      <AspectRatio ratio={1200 / 720} className="overflow-hidden rounded-xl bg-placeholder">
        {/*
          Decorative preview layer. Both clips are mounted while the tab changes, so the
          incoming one fades up over the outgoing one instead of cutting. The panels below
          carry the semantics; this layer is hidden from assistive tech.
        */}
        <AnimatePresence initial={false}>
          {activeFormat.videoSrc && (
            <motion.video
              key={activeFormat.value}
              src={activeFormat.videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              className="absolute inset-0 size-full object-cover will-change-[opacity,transform]"
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.5, ease: "easeInOut" },
                scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              }}
            />
          )}
        </AnimatePresence>

        {formats.map((f) => (
          <TabsContent key={f.value} value={f.value} className="sr-only">
            {f.title} — {f.subtitle}
          </TabsContent>
        ))}

        <TabsList className="absolute inset-x-2 bottom-2 w-auto gap-0 overflow-x-auto rounded-[16px] bg-foreground p-1.5 group-data-horizontal/tabs:h-14 sm:inset-x-6 sm:bottom-6 sm:group-data-horizontal/tabs:h-[84px]">
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
                <span className="relative text-sm font-medium">{f.title}</span>
                <span className="relative hidden text-xs font-normal text-background/40 @min-[900px]:block">
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
