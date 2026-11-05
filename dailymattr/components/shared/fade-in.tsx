"use client"

import { motion, useReducedMotion } from "motion/react"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait before revealing, for staggering neighbours. */
  delay?: number
}

/**
 * Scroll reveal: rises a short distance while fading and un-blurring, on an expo-out curve
 * so it starts with intent and settles softly. Plays once per component.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      // Drop the filter once settled: any filter (even blur(0)) turns this wrapper into the
      // containing block for `position: fixed` children, trapping modals inside it.
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      // A fixed margin rather than an `amount` ratio, so very tall components still trigger.
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
