"use client"

import { createContext, useContext } from "react"
import { motion, useReducedMotion } from "motion/react"

type Tag = "div" | "section" | "article" | "header" | "footer" | "figure" | "li" | "p" | "span" | "h1" | "h2" | "h3"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  /** Seconds to wait before revealing: heading 0, copy 0.2, media 0.4 (see ./reveal-delay). */
  delay?: number
  /** Element to render, so a list item or section can reveal without an extra wrapper div. */
  as?: Tag
  id?: string
  style?: React.CSSProperties
}

/** "fade-up" everywhere by default; "soft" is the original reveal, kept on the home page. */
type RevealStyle = "fade-up" | "soft"
const RevealStyleContext = createContext<RevealStyle>("fade-up")

/** Gives every FadeIn inside it the original soft reveal instead of the fade-up. */
export function SoftReveal({ children }: { children: React.ReactNode }) {
  return <RevealStyleContext.Provider value="soft">{children}</RevealStyleContext.Provider>
}

/**
 * Original reveal: rises 24px while fading and un-blurring, on an expo-out curve.
 * The filter is dropped once settled: any filter (even blur(0)) turns the wrapper into the
 * containing block for `position: fixed` children, trapping modals inside it.
 */
const soft = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } },
  // A fixed margin rather than an `amount` ratio, so very tall components still trigger.
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
} as const

/**
 * Fade-up, after the reference (AOS "fade-up"): starts transparent and 100px low, then rises
 * into place while fading in over 1s on the CSS `ease` curve.
 */
const fadeUp = {
  initial: { opacity: 0, y: 100 },
  whileInView: { opacity: 1, y: 0 },
  // The observer sees the shifted box, 100px below its resting place, so a 20px margin
  // starts the reveal when the resting position is ~120px on screen, as AOS does.
  viewport: { once: true, margin: "0px 0px -20px 0px" },
  transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
} as const

/**
 * Scroll reveal that plays once. Fade-up by default; inside SoftReveal, the original soft one.
 *
 * Do not put it inside an overflow-hidden box: shifted down, it can be clipped out of sight,
 * and a block that is never seen never reveals. Wrap the box itself instead.
 */
export function FadeIn({ children, className, delay = 0, as = "div", id, style }: FadeInProps) {
  const reduceMotion = useReducedMotion()
  const reveal = useContext(RevealStyleContext) === "soft" ? soft : fadeUp

  if (reduceMotion) {
    const Static = as as "div"
    return (
      <Static id={id} className={className} style={style}>
        {children}
      </Static>
    )
  }

  const Tag = motion[as] as typeof motion.div

  return (
    <Tag
      id={id}
      className={className}
      style={style}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={{ ...reveal.transition, delay }}
    >
      {children}
    </Tag>
  )
}
