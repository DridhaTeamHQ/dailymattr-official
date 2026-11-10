"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

/**
 * Widens the app preview media as it scrolls into view on desktop: from the content column
 * (min(62.5vw, 75rem)) out to 88vw, fully open once its centre reaches the middle of the
 * screen. It tracks the scroll, so scrolling back narrows it again.
 * It only sets --expand-w / --expand-h; the media reads them at lg and up (see format-tabs.tsx), so phones
 * and tablets, which already fill the width, are unaffected. Reduced motion: no variable, so
 * the media stays at the content column.
 */
export function ExpandOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const eased = useTransform(scrollYProgress, (p) => {
    const t = Math.min(Math.max(p, 0), 1)
    return 1 - (1 - t) ** 3 // ease-out: opens quickly, settles gently
  })
  // Widens to 88vw, but the height only grows to 47.1vw (what a 78.5vw-wide 5:3 box would
  // be), so the extra width doesn't push the bottom off a laptop screen; object-cover crops.
  const width = useTransform(eased, (e) => `calc(${1 - e} * min(62.5vw, 75rem) + ${e} * 88vw)`)
  const height = useTransform(eased, (e) => `calc(${1 - e} * min(62.5vw, 75rem) * 0.6 + ${e} * 47.1vw)`)

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
