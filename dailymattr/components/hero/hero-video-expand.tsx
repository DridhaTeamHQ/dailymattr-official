"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { BriefingCard } from "./briefing-card"
import { HeroShowcase } from "./hero-showcase"

type Size = { w: number; h: number }
type Box = { x: number; y: number; width: number; height: number }

// Mirrors the hero section's container: max-w-6xl with px-4 / sm:px-6 / lg:px-8.
const MAX_WIDTH = 1152
const sidePadding = (w: number) => (w >= 1024 ? 32 : w >= 640 ? 24 : 16)
const CARD_RATIO = 2 // the hero card is 2:1

/** The contained 2:1 card, at the top of the frame (growing) or the bottom (shrinking). */
function cardBox({ w, h }: Size, align: "top" | "bottom"): Box {
  const width = Math.min(w, MAX_WIDTH) - sidePadding(w) * 2
  const height = Math.min(width / CARD_RATIO, h)
  return { x: (w - width) / 2, y: align === "top" ? 0 : h - height, width, height }
}

/**
 * Full screen at the video's own aspect ratio, so the whole frame is visible with no edges
 * cropped: as large as fits the screen, centred.
 */
function fullBox({ w, h }: Size, ratio: number): Box {
  const width = Math.min(w, h * ratio)
  const height = width / ratio
  return { x: (w - width) / 2, y: (h - height) / 2, width, height }
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1)
// Ease in-out, so each stage starts and settles gently rather than at constant speed.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const mixBox = (a: Box, b: Box, t: number): Box => ({
  x: mix(a.x, b.x, t),
  y: mix(a.y, b.y, t),
  width: mix(a.width, b.width, t),
  height: mix(a.height, b.height, t),
})

/**
 * The hero video starts as the contained 2:1 card and, as the page scrolls, grows to fill the
 * screen (the full video, nothing cropped). It holds there for a moment, then shrinks back
 * into a card sitting just above the next content, and the page moves on. Every step tracks
 * the scroll, so scrolling back up plays it all in reverse.
 */
export function HeroVideoExpand({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [size, setSize] = useState<Size | null>(null)
  const [ratio, setRatio] = useState(16 / 9)

  useLayoutEffect(() => {
    const measure = () => setSize({ w: document.documentElement.clientWidth, h: window.innerHeight })
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const h = size?.h ?? 0

  // One scroll value drives every stage, so they can never get out of step. It runs from the
  // card sitting 80% down the screen (0) to the end of the pinned stretch (1). The wrapper is
  // 3 screens tall, so that is 0.8 + 2 = 2.8 screens of scrolling:
  //   grow 0 → 0.8 screens, hold full-screen until 1.8, shrink over the last screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end end"] })
  const GROW_END = 0.8 / 2.8
  const SHRINK_START = 1.8 / 2.8

  const boxAt = (p: number): Box => {
    if (!size) return { x: 0, y: 0, width: 0, height: 0 }
    const full = fullBox(size, ratio)
    if (p <= GROW_END) return mixBox(cardBox(size, "top"), full, ease(clamp01(p / GROW_END)))
    if (p < SHRINK_START) return full
    return mixBox(full, cardBox(size, "bottom"), ease(clamp01((p - SHRINK_START) / (1 - SHRINK_START))))
  }
  /** 0 when full-screen, 1 when a card: drives the corner radius and the briefing card. */
  const cardness = (p: number) =>
    p <= GROW_END
      ? 1 - clamp01(p / GROW_END)
      : p < SHRINK_START
        ? 0
        : clamp01((p - SHRINK_START) / (1 - SHRINK_START))

  const x = useTransform(scrollYProgress, (p) => boxAt(p).x)
  const y = useTransform(scrollYProgress, (p) => boxAt(p).y)
  const width = useTransform(scrollYProgress, (p) => boxAt(p).width)
  const height = useTransform(scrollYProgress, (p) => boxAt(p).height)
  const radius = useTransform(scrollYProgress, (p) => 12 * cardness(p))

  // The briefing card rides the box's top-right corner, hidden while the video is full-screen.
  const cardTop = useTransform(scrollYProgress, (p) => {
    const b = boxAt(p)
    return b.y + b.height * 0.14
  })
  const cardRight = useTransform(scrollYProgress, (p) => {
    if (!size) return 0
    const b = boxAt(p)
    return Math.max(size.w - b.x - b.width - (size.w >= 1024 ? 24 : 12), 16)
  })
  const cardOpacity = useTransform(scrollYProgress, (p) => clamp01(cardness(p) / 0.4))

  const video = (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className="size-full object-cover"
      onLoadedMetadata={(e) => {
        const v = e.currentTarget
        if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight)
      }}
    />
  )

  // No motion, or not measured yet on the server: the plain contained card.
  if (reduceMotion || !size) {
    return (
      <div ref={ref} className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeroShowcase>{video}</HeroShowcase>
      </div>
    )
  }

  return (
    // Pinned for 2 screens: ~1 screen grows/holds full-screen, the last screen shrinks it back.
    <div ref={ref} className="relative mt-14" style={{ height: h * 3 }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: h }}>
        <motion.div
          className="absolute top-0 left-0 overflow-hidden bg-placeholder"
          style={{ x, y, width, height, borderRadius: radius }}
        >
          {video}
        </motion.div>
        <motion.div
          className="absolute hidden sm:block"
          style={{ top: cardTop, right: cardRight, opacity: cardOpacity }}
        >
          <BriefingCard />
        </motion.div>
      </div>
    </div>
  )
}
