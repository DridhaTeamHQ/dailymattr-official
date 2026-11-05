"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

/** How a line comes in: every word on its own beat, or the whole line as one piece. */
type Mode = "word" | "line"

type WordsRevealProps = {
  /** Text to animate. Use "\n" to force a line break. */
  text: string
  className?: string
  /** Seconds to wait before the first piece moves. */
  delay?: number
  /** Seconds between consecutive pieces. */
  stagger?: number
  /** One mode for every line, or an array giving each line its own. */
  per?: Mode | Mode[]
  as?: "h1" | "h2" | "p" | "span" | "div"
}

const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren: delay, staggerChildren: stagger },
  },
})

const piece: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    // Drop the filter once settled so the span stops being a containing block.
    transitionEnd: { filter: "none" },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * Reveals copy a piece at a time: each piece rises out of a soft blur on an expo-out
 * curve, a beat behind the one before it. A piece is a single word by default, or a
 * whole line where `per` says "line". Plays once, on scroll into view.
 */
export function WordsReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  per = "word",
  as = "span",
}: WordsRevealProps) {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as] as typeof motion.span

  const lines = text.split("\n")
  const modeFor = (i: number): Mode => (Array.isArray(per) ? (per[i] ?? "word") : per)

  if (reduceMotion) {
    const Static = as
    return (
      <Static className={className}>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {line}
          </span>
        ))}
      </Static>
    )
  }

  return (
    <Tag
      className={className}
      variants={container(delay, stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ")
        return (
          <span key={lineIndex}>
            {lineIndex > 0 && <br />}
            {modeFor(lineIndex) === "line" ? (
              <motion.span variants={piece} className="inline-block will-change-transform">
                {line}
              </motion.span>
            ) : (
              words.map((w, wordIndex) => (
                <motion.span
                  key={`${lineIndex}-${wordIndex}`}
                  variants={piece}
                  className="inline-block whitespace-pre will-change-transform"
                >
                  {w}
                  {wordIndex < words.length - 1 ? " " : ""}
                </motion.span>
              ))
            )}
          </span>
        )
      })}
    </Tag>
  )
}
