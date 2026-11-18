"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

/**
 * Widens the app preview media as it scrolls into view on desktop: from 85vw (START_W, about
 * 94px from each edge on a 1280 screen) out to the Figma frame (8859:12712: 1792 × 1008 on the 1920 page, so
 * 64px / 4rem from each edge, 16:9), fully open once its centre reaches the middle of the
 * screen. It tracks the scroll, so scrolling back narrows it again.
 * It only sets --expand-w / --expand-h; the media reads them at lg and up (see format-tabs.tsx), so phones
 * and tablets, which already fill the width, are unaffected. Reduced motion: no variable, so
 * the media stays at the starting size.
 */
/** Starting width at lg and up; format-tabs.tsx uses the same values when no variable is set. */
export const START_W = "85vw"
/** Starting height: 16:9, like the open size, so the box only grows. */
export const START_H = "calc(85vw * 0.5625)"
/**
 * Tallest the media gets at lg and up: the screen height less 3rem above and below, so the
 * whole box (tab bar included) fits on desktop screens shorter than 16:9 of the width. Past
 * that the box keeps its width and the clip crops (object-cover) instead of overflowing.
 * format-tabs.tsx repeats it in its fallback height.
 */
export const MAX_H = "100svh - 6rem"

export function ExpandOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const eased = useTransform(scrollYProgress, (p) => {
    const t = Math.min(Math.max(p, 0), 1)
    return 1 - (1 - t) ** 3 // ease-out: opens quickly, settles gently
  })
  // Open width: the whole row between the site gutters (SITE_GUTTER, 4rem / 64px at 1920 from
  // each edge). Open height: 16:9 of that width (100vw includes the scrollbar, a few px off;
  // object-cover absorbs it), capped at MAX_H so it fits the screen.
  const width = useTransform(eased, (e) => `calc(${1 - e} * ${START_W} + ${e} * 100%)`)
  const height = useTransform(
    eased,
    (e) => `min(calc(${1 - e} * ${START_H} + ${e} * (100vw - 8rem) * 0.5625), ${MAX_H})`
  )

  return (
    <motion.div
      ref={ref}
      className="w-full"
      style={
        reduceMotion
          ? undefined
          : ({ "--expand-w": width, "--expand-h": height } as unknown as React.CSSProperties)
      }
    >
      {children}
    </motion.div>
  )
}
