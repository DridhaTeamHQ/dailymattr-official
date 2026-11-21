"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

/**
 * Widens the app preview media as it scrolls into view on desktop: from 85vw (START_W, about
 * 94px from each edge on a 1280 screen) out to the Figma frame (8859:12712: 1792 × 1008 on the 1920 page, so
 * 64px / 4rem from each edge), fully open once its centre reaches the middle of the screen.
 * It tracks the scroll, so scrolling back narrows it again.
 * It only sets --expand-w; the media reads it at lg and up and keeps 16:9, with its width capped
 * so it fits the screen height (see format-tabs.tsx). Phones and tablets, which already fill the
 * width, are unaffected. Reduced motion: no variable, so the media stays at the starting size.
 */
/** Starting width at lg and up; format-tabs.tsx uses the same value when no variable is set. */
export const START_W = "85vw"

export function ExpandOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const eased = useTransform(scrollYProgress, (p) => {
    const t = Math.min(Math.max(p, 0), 1)
    return 1 - (1 - t) ** 3 // ease-out: opens quickly, settles gently
  })
  // Open width: the whole row between the site gutters (SITE_GUTTER, 4rem / 64px at 1920 from
  // each edge). The height follows from the 16:9 box.
  const width = useTransform(eased, (e) => `calc(${1 - e} * ${START_W} + ${e} * 100%)`)

  return (
    <motion.div
      ref={ref}
      className="w-full"
      style={reduceMotion ? undefined : ({ "--expand-w": width } as unknown as React.CSSProperties)}
    >
      {children}
    </motion.div>
  )
}
