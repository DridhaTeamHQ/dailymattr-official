"use client"

import { useEffect, useRef } from "react"
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react"

// How many pixels of scrolling it takes to slide the bar fully out (or back in).
const SCROLL_DISTANCE = 300
// Above this speed (px/s) the bar stops tracking the scroll and plays a timed glide instead,
// so a fast flick doesn't make it vanish in a single frame.
const FAST_SCROLL = 1500

// Normal scrolling: a light spring that follows the scroll position.
const FOLLOW = { type: "spring", stiffness: 220, damping: 32, mass: 0.6 } as const
// Fast scrolling: an even glide to fully hidden or fully shown.
const GLIDE = { duration: 0.8, ease: [0.45, 0, 0.25, 1] } as const

/**
 * Sticky header that moves with the scroll: scrolling down slides it up gradually until it
 * is out of view, and scrolling up slides it back the same way. A fast scroll plays a smooth
 * timed glide instead of jumping.
 */
export function AutoHideHeader({ children }: { children: React.ReactNode }) {
  const { scrollY } = useScroll()
  // Where the scroll says the bar should be: 0 = fully shown, 1 = fully hidden.
  const target = useRef(0)
  // What is drawn.
  const progress = useMotionValue(0)
  const glide = useRef<{ controls: AnimationPlaybackControls; to: number } | null>(null)
  // A percentage keeps the offset right under the CSS zoom applied at xl.
  const y = useTransform(progress, (h) => `${-h * 100}%`)
  const opacity = useTransform(progress, [0, 0.6, 1], [1, 0.85, 0])
  const ref = useRef<HTMLElement>(null)

  // Publishes the announcement bar + nav height as --chrome-height, so full-screen heroes
  // can fill exactly what is left of the first screen (the nav's size varies with zoom).
  useEffect(() => {
    const header = ref.current
    if (!header) return
    const banner = header.previousElementSibling
    const measure = () => {
      const height =
        header.getBoundingClientRect().height + (banner?.getBoundingClientRect().height ?? 0)
      document.documentElement.style.setProperty("--chrome-height", `${height}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    if (banner) observer.observe(banner)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current
    const delta = current - previous
    if (delta === 0) return
    const fast = Math.abs(scrollY.getVelocity()) > FAST_SCROLL

    let next = Math.min(1, Math.max(0, target.current + delta / SCROLL_DISTANCE))
    if (fast) next = delta > 0 ? 1 : 0
    // Overscroll bounce above the top must never hide the bar.
    if (current <= 0) next = 0
    target.current = next

    // Let a running glide finish while the scroll keeps heading the same way.
    const running = glide.current
    if (running && running.to === next) return

    if (fast && current > 0) {
      const controls = animate(progress, next, GLIDE)
      glide.current = { controls, to: next }
      controls.then(() => {
        if (glide.current?.controls === controls) glide.current = null
      })
    } else {
      glide.current = null
      animate(progress, next, FOLLOW)
    }
  })

  return (
    // On laptops the page's rem sizes shrink to --site-scale (e.g. 0.8, see globals.css). From
    // 1280px the nav is scaled back up to 90% so it reads a little larger; below that it keeps
    // the page size so all its links fit. At scale 1 (desktop, NIA) it stays 1:1.
    <motion.header
      ref={ref}
      style={{ y, opacity }}
      className="sticky top-0 z-50 w-full bg-background will-change-transform xl:[zoom:max(1,calc(0.9/var(--site-scale,1)))]"
    >
      {children}
    </motion.header>
  )
}
