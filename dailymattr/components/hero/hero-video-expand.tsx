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

// Scroll distances, as fractions of the screen height.
const GROW = 0.8 // card → full screen (before the pin: the card rises from 80% down to the top)
const HOLD = 0.25 // stays full screen — a brief beat, not a long stretch
const SHRINK = 0.7 // full screen → card
const TOTAL = GROW + HOLD + SHRINK
const GROW_END = GROW / TOTAL
const SHRINK_START = (GROW + HOLD) / TOTAL

/**
 * The hero video. On desktop it starts as the contained 2:1 card and, as the page scrolls,
 * grows to fill the screen (the whole video, nothing cropped), holds there briefly, then
 * shrinks back into a card just above the next content. On phones and portrait screens a
 * pinned full-screen stage would mostly be empty space around a short 16:9 strip, so the
 * video simply widens to the screen edges as it scrolls into view. Everything tracks the
 * scroll, so scrolling back up plays it in reverse.
 */
export function HeroVideoExpand({ src }: { src: string }) {
  const reduceMotion = useReducedMotion()
  const [size, setSize] = useState<Size | null>(null)
  const [ratio, setRatio] = useState(16 / 9)

  useLayoutEffect(() => {
    const measure = () => setSize({ w: document.documentElement.clientWidth, h: window.innerHeight })
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

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
      <div className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeroShowcase>{video}</HeroShowcase>
      </div>
    )
  }

  if (size.w < 768 || size.w < size.h) return <WidenOnScroll ratio={ratio}>{video}</WidenOnScroll>

  return (
    <PinnedExpand size={size} ratio={ratio}>
      {video}
    </PinnedExpand>
  )
}

/** Phones / portrait: the video widens from the padded card to the screen edges, in flow. */
function WidenOnScroll({ ratio, children }: { ratio: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  // 0 as the video enters from the bottom, 1 once it is centred on screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const inset = useTransform(scrollYProgress, (p) => 16 * (1 - ease(clamp01(p))))
  const radius = useTransform(scrollYProgress, (p) => 12 * (1 - ease(clamp01(p))))

  return (
    <motion.div ref={ref} className="mt-10 w-full" style={{ paddingInline: inset }}>
      <motion.div
        className="w-full overflow-hidden bg-placeholder"
        style={{ aspectRatio: ratio, borderRadius: radius }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Desktop: grow to full screen, a brief hold, shrink back — pinned while it plays. */
function PinnedExpand({ size, ratio, children }: { size: Size; ratio: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { h } = size

  // One scroll value drives every stage, so they can never get out of step. It runs from the
  // card sitting 80% down the screen (0) to the moment the pin releases (1).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end end"] })

  const boxAt = (p: number): Box => {
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
    const b = boxAt(p)
    return Math.max(size.w - b.x - b.width - (size.w >= 1024 ? 24 : 12), 16)
  })
  const cardOpacity = useTransform(scrollYProgress, (p) => clamp01(cardness(p) / 0.4))

  return (
    // Pinned for the hold and the shrink; the grow happens while the card rises to the top.
    <div ref={ref} className="relative mt-14" style={{ height: h * (1 + HOLD + SHRINK) }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: h }}>
        <motion.div
          className="absolute top-0 left-0 overflow-hidden bg-placeholder"
          style={{ x, y, width, height, borderRadius: radius }}
        >
          {children}
        </motion.div>
        <motion.div
          className="absolute"
          style={{ top: cardTop, right: cardRight, opacity: cardOpacity }}
        >
          <BriefingCard />
        </motion.div>
      </div>
    </div>
  )
}
