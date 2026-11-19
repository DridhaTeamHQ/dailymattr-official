"use client"

import { createContext, useContext, useRef, useSyncExternalStore } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"
import { useLenis } from "lenis/react"

/**
 * Desktop scroll for the app preview, in two parts:
 *
 * 1. Opening: the media widens as it scrolls into view, from 85vw (START_W, about 94px from
 *    each edge on a 1280 screen) out to the Figma frame (8859:12712: 1792 × 1008 on the 1920
 *    page, so 64px / 4rem from each edge, 16:9, capped at MAX_H), fully open once the stage pins.
 * 2. Steps: the stage then stays pinned, centred on screen, for `steps` × 40vh of scrolling, and
 *    each 40vh is one step (format-tabs.tsx shows one tab per step); after the last one the page
 *    scrolls on. Scrolling back walks the steps in reverse and narrows the media again.
 *
 * It sets --expand-w / --expand-h, which the media reads at lg and up, and provides the steps
 * through usePinnedSteps(). Phones and tablets, which already fill the width, are not pinned and
 * keep tap-to-switch tabs. Reduced motion: no pin, no variables, the media stays at the starting size.
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

const DESKTOP = "(min-width: 64rem)"
function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(DESKTOP)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}
const isDesktop = () => window.matchMedia(DESKTOP).matches

type PinnedSteps = {
  /** The step the scroll is on, 0 … steps − 1. */
  step: MotionValue<number>
  /** True while goTo() is scrolling, so the steps it passes on the way are skipped. */
  jumping: React.RefObject<boolean>
  /** Scrolls to the middle of a step, e.g. when its tab is clicked. */
  goTo: (index: number) => void
}
const PinnedStepsContext = createContext<PinnedSteps | null>(null)

/** The scroll-driven steps while the stage is pinned (desktop, motion allowed), else null. */
export const usePinnedSteps = () => useContext(PinnedStepsContext)

export function ExpandOnScroll({ steps, children }: { steps: number; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop, () => false)
  const pinned = desktop && !reduceMotion
  const lenis = useLenis()
  const jumping = useRef(false)

  // Opening: from the track entering the screen to its top reaching the top of the screen,
  // where the stage pins with the media centred.
  const { scrollYProgress: opening } = useScroll({ target: track, offset: ["start end", "start start"] })
  // Steps: across the pinned part of the track.
  const { scrollYProgress: through } = useScroll({ target: track, offset: ["start start", "end end"] })

  const eased = useTransform(() => {
    const t = Math.min(Math.max(opening.get(), 0), 1)
    return 1 - (1 - t) ** 3 // ease-out: opens quickly, settles gently
  })
  // Open width: the whole row between the site gutters (SITE_GUTTER, 4rem / 64px at 1920 from
  // each edge). Open height: 16:9 of that width (100vw includes the scrollbar, a few px off;
  // object-cover absorbs it), capped at MAX_H so it fits the screen.
  const width = useTransform(() => {
    const e = eased.get()
    return `calc(${1 - e} * ${START_W} + ${e} * 100%)`
  })
  const height = useTransform(() => {
    const e = eased.get()
    return `min(calc(${1 - e} * ${START_H} + ${e} * (100vw - 8rem) * 0.5625), ${MAX_H})`
  })
  const step = useTransform(() => Math.min(steps - 1, Math.floor(through.get() * steps)))

  const goTo = (index: number) => {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const y = top + ((index + 0.5) / steps) * (el.offsetHeight - window.innerHeight)
    jumping.current = true
    // Also cleared on a timer, in case a wheel or key interrupts the scroll before it ends.
    const timer = window.setTimeout(() => (jumping.current = false), 1200)
    const done = () => {
      window.clearTimeout(timer)
      jumping.current = false
    }
    if (lenis) lenis.scrollTo(y, { duration: 0.9, onComplete: done })
    else window.scrollTo({ top: y, behavior: "smooth" })
  }

  return (
    <PinnedStepsContext.Provider value={pinned ? { step, jumping, goTo } : null}>
      <motion.div
        ref={track}
        // 100vh for the pinned stage + 40vh of scrolling per step.
        className="w-full lg:motion-safe:h-[calc(100vh_+_var(--steps)*40vh)]"
        style={
          {
            "--steps": steps,
            ...(reduceMotion ? {} : { "--expand-w": width, "--expand-h": height }),
          } as unknown as React.CSSProperties
        }
      >
        <div className="w-full lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:items-center lg:motion-safe:justify-center">
          {children}
        </div>
      </motion.div>
    </PinnedStepsContext.Provider>
  )
}
