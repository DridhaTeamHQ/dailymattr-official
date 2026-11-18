"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

import { ScrubVideo } from "@/components/shared/scrub-video"
import { SiteVideo } from "@/components/shared/site-video"
import type { VideoAsset } from "@/lib/videos"

import { HeroShowcase } from "./hero-showcase"

// r = root font size / 16: the rem scale, which shrinks on laptops (see app/globals.css).
type Size = { w: number; h: number; r: number }
type Box = { x: number; y: number; width: number; height: number }

// Mirrors the hero section's container: max-w-6xl with px-4 / sm:px-6 / lg:px-8 (at a 16px
// root; multiplied by the rem scale r).
const MAX_WIDTH = 1152
const sidePadding = (w: number) => (w >= 1024 ? 32 : w >= 640 ? 24 : 16)
const CARD_RATIO = 2 // the hero card is 2:1

/** The contained 2:1 card, at the top of the frame (growing) or the bottom (shrinking). */
function cardBox({ w, h, r }: Size, align: "top" | "bottom"): Box {
  const width = Math.min(w, MAX_WIDTH * r) - sidePadding(w) * r * 2
  const height = Math.min(width / CARD_RATIO, h)
  return { x: (w - width) / 2, y: align === "top" ? 0 : h - height, width, height }
}

/**
 * Edge to edge: the box fills the whole viewport whatever its aspect ratio, and the video's
 * object-cover crops the overflow. Fitting the video's own ratio instead left empty bands on
 * any screen that isn't exactly 16:9 (16:10 laptops, ultrawides, short browser windows).
 */
function fullBox({ w, h }: Size): Box {
  return { x: 0, y: 0, width: w, height: h }
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
// Stays full screen while the rest of the clip scrubs by, then scrolls away with the page.
const HOLD = 0.7
const TOTAL = GROW + HOLD
const GROW_END = GROW / TOTAL

/**
 * The hero video. On desktop it starts as the contained 2:1 card and, as the page scrolls,
 * grows to fill the screen edge to edge, holds there while the clip scrubs by, then scrolls away with the
 * page. On phones and portrait screens a
 * pinned full-screen stage would mostly be empty space around a short 16:9 strip, so the
 * video simply widens to the screen edges as it scrolls into view and the clip plays on its
 * own. On desktop everything tracks the scroll, so scrolling back up plays it in reverse.
 */
export function HeroVideoExpand({ video: asset }: { video: VideoAsset }) {
  const reduceMotion = useReducedMotion()
  const [size, setSize] = useState<Size | null>(null)
  const [ratio, setRatio] = useState(asset.width / asset.height)

  useLayoutEffect(() => {
    const measure = () =>
      setSize({
        w: document.documentElement.clientWidth,
        h: window.innerHeight,
        r: parseFloat(getComputedStyle(document.documentElement).fontSize) / 16,
      })
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const onLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight)
  }
  // The clip never plays by itself: its frames follow the page scroll (see ScrubVideo).
  const video = (progress?: MotionValue<number>) => (
    <ScrubVideo
      video={asset}
      progress={progress}
      className="size-full object-cover"
      onLoadedMetadata={onLoadedMetadata}
    />
  )

  // No motion, or not measured yet on the server: the plain contained card.
  if (reduceMotion || !size) {
    return (
      <div className="mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <HeroShowcase>{video()}</HeroShowcase>
      </div>
    )
  }

  // Phones and portrait screens: the clip just plays and loops, it isn't tied to the scroll.
  if (size.w < 768 || size.w < size.h) {
    const playingVideo = () => (
      <SiteVideo
        video={asset}
        priority
        className="size-full object-cover"
        onLoadedMetadata={onLoadedMetadata}
      />
    )
    return <WidenOnScroll ratio={ratio} video={playingVideo} />
  }

  return <PinnedExpand size={size} video={video} />
}

type RenderVideo = (progress?: MotionValue<number>) => React.ReactNode

/**
 * 0 at the very top of the page, 1 when `ref`'s section is done: for "pin", when its bottom
 * meets the bottom of the screen (the pin releases); for "flow", when it has scrolled off the
 * top. Measured from the page top, not from when the section enters, so the clip sits on its
 * first frame on load and moves from the very first scroll.
 */
function usePageProgress(ref: React.RefObject<HTMLElement | null>, size: Size, mode: "pin" | "flow") {
  const { scrollY } = useScroll()
  const end = useRef(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const bottom = el.getBoundingClientRect().bottom + window.scrollY
      end.current = Math.max(mode === "pin" ? bottom - window.innerHeight : bottom, 1)
    }
    measure()
    // Re-measure whenever the section or anything above it changes height (fonts, images, the
    // scroll length itself), so the last frame always lands exactly where the section ends.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [ref, size, mode])
  return useTransform(scrollY, (y) => y / end.current)
}

/**
 * Phones / portrait: the video widens from the padded card to the screen edges, in flow.
 * The clip itself plays normally here (SiteVideo); only the width follows the scroll.
 */
function WidenOnScroll({ ratio, video }: { ratio: number; video: RenderVideo }) {
  const ref = useRef<HTMLDivElement>(null)
  // 0 as the video enters from the bottom, 1 once it is centred on screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
  const inset = useTransform(scrollYProgress, (p) => 16 * (1 - ease(clamp01(p))))
  const radius = useTransform(scrollYProgress, (p) => 12 * (1 - ease(clamp01(p))))

  return (
    <motion.div ref={ref} className="mt-10 w-full" style={{ paddingInline: inset }}>
      <motion.div
        className="w-full overflow-hidden"
        style={{ aspectRatio: ratio, borderRadius: radius }}
      >
        {video()}
      </motion.div>
    </motion.div>
  )
}

/** Desktop: grow to full screen, a brief hold, then scroll on — pinned while it plays. */
function PinnedExpand({ size, video }: { size: Size; video: RenderVideo }) {
  const ref = useRef<HTMLDivElement>(null)
  const { h } = size
  // The clip runs from the top of the page (first frame) to the pin releasing (last frame).
  const videoProgress = usePageProgress(ref, size, "pin")

  // One scroll value drives every stage, so they can never get out of step. It runs from the
  // card sitting 80% down the screen (0) to the moment the pin releases (1).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end end"] })

  // No shrink: once full screen it stays full screen and, when the pin releases, scrolls up
  // with the page. Scrolling back to the top reverses the grow, back down to the card.
  const boxAt = (p: number): Box => {
    const full = fullBox(size)
    if (p <= GROW_END) return mixBox(cardBox(size, "top"), full, ease(clamp01(p / GROW_END)))
    return full
  }
  /** 0 when full-screen, 1 when a card: drives the corner radius. */
  const cardness = (p: number) => (p <= GROW_END ? 1 - clamp01(p / GROW_END) : 0)

  const x = useTransform(scrollYProgress, (p) => boxAt(p).x)
  const y = useTransform(scrollYProgress, (p) => boxAt(p).y)
  const width = useTransform(scrollYProgress, (p) => boxAt(p).width)
  const height = useTransform(scrollYProgress, (p) => boxAt(p).height)
  const radius = useTransform(scrollYProgress, (p) => 12 * size.r * cardness(p))

  return (
    // Pinned for the hold; the grow happens while the card rises to the top.
    <div ref={ref} className="relative mt-14" style={{ height: h * (1 + HOLD) }}>
      <div className="pointer-events-none sticky top-0 overflow-hidden" style={{ height: h }}>
        <motion.div
          className="pointer-events-auto absolute top-0 left-0 overflow-hidden"
          style={{ x, y, width, height, borderRadius: radius }}
        >
          {video(videoProgress)}
        </motion.div>
      </div>
    </div>
  )
}
