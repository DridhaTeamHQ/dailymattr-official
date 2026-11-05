"use client"

import "lenis/dist/lenis.css"
import { ReactLenis } from "lenis/react"
import { useReducedMotion } from "motion/react"

/**
 * Eased, inertia-style page scrolling. Wheel and trackpad input glides to a stop instead of
 * jumping, and each wheel step travels a little less, so scroll-linked animations (like the
 * hero video) play out more slowly. The page still scrolls natively underneath, so
 * `useScroll`, sticky elements and anchors keep working. Off for reduced-motion users.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <>{children}</>

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07, // lower = smoother, longer glide
        wheelMultiplier: 0.8, // each wheel step moves 80% of the usual distance
        touchMultiplier: 1,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
