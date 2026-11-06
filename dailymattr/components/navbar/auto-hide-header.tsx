"use client"

import { useRef, useState } from "react"
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"

// How far the page must travel in one direction before the bar reacts. Smooth scrolling
// moves a few pixels per frame, so this looks at the whole stroke, not frame-to-frame jitter.
const HIDE_AFTER = 120
const SHOW_AFTER = 24
// Always show the bar near the top of the page.
const TOP_ZONE = 80

/**
 * Sticky header that glides up and fades out while scrolling down, and glides back in once
 * the page is scrolled up again.
 */
export function AutoHideHeader({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  // Where the current scroll stroke started, and which way it is going.
  const anchor = useRef(0)
  const direction = useRef<1 | -1>(1)

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current
    const dir = current > previous ? 1 : current < previous ? -1 : direction.current
    if (dir !== direction.current) {
      direction.current = dir
      anchor.current = previous
    }
    const travelled = current - anchor.current

    if (current < TOP_ZONE) setHidden(false)
    else if (travelled > HIDE_AFTER) setHidden(true)
    else if (travelled < -SHOW_AFTER) setHidden(false)
  })

  return (
    <motion.header
      className="sticky top-0 z-50 w-full bg-background will-change-transform"
      initial={false}
      animate={hidden ? { y: "-100%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              // Hiding is a slow, even glide (ease-in-out) so the bar drifts away rather than
              // snapping off; showing again uses a quicker ease-out so it is there when wanted.
              y: hidden
                ? { duration: 1.1, ease: [0.45, 0, 0.25, 1] }
                : { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              opacity: hidden
                ? { duration: 0.9, ease: "easeInOut", delay: 0.2 }
                : { duration: 0.5, ease: "easeOut" },
            }
      }
    >
      {children}
    </motion.header>
  )
}
