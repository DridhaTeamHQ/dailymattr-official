"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react"

import { useNavHeight } from "@/components/navbar/nav-height"
import { ScrubVideo } from "@/components/shared/scrub-video"
import { SiteVideo } from "@/components/shared/site-video"
import type { VideoAsset } from "@/lib/videos"

import { HeroShowcase } from "./hero-showcase"

// r = root font size / 16: the rem scale, which shrinks on laptops (see app/globals.css).
// d = devicePixelRatio: screen pixels per CSS pixel (1.5 on Windows at 150%).
type Size = { w: number; h: number; r: number; d: number }
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

/**
 * Holds the video 2px past its clipping box on every side, so the video's own outermost pixel
 * column (which the browser blends with the empty space beyond it) is never on screen.
 */
function Bleed({ children }: { children: React.ReactNode }) {
  return <div className="absolute -inset-[2px]">{children}</div>
}
const BLEED = 2 // px, as Bleed

// The full-screen hold shows the video at exactly one video pixel per screen pixel whenever
// that still covers the screen, cropping at most this much more than a plain cover fit would.
// Any other scale resamples every frame, and even a 1% resample (e.g. a 1920px video on a
// 1265px-wide window at 150%) smears each fine line across two pixels: the phone's text and
// edges read as blurred.
const MAX_NATIVE_CROP = 0.15

/** Rounds a CSS length to the nearest whole screen pixel. */
const snap = (v: number, d: number) => Math.round(v * d) / d
/**
 * The box with every edge on a whole screen pixel. Mid-grow the box's edges land between
 * screen pixels, and on a 1.5x screen (Windows at 150%) Chrome then leaves a 1px gap down the
 * video's right edge: a thin dark line that follows the card as it grows. Each edge is
 * rounded on its own (not the size), so the right edge lands on a pixel too.
 */
const snapBox = ({ x, y, width, height }: Box, d: number): Box => {
  const left = snap(x, d)
  const top = snap(y, d)
  return { x: left, y: top, width: snap(x + width, d) - left, height: snap(y + height, d) - top }
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
// The whole clip runs over the scroll, so this sets its pace: 6 gives the 21 s home clip about
// 230px of scroll per second of video on a laptop, slow enough to read each app screen while
// full screen. Retune it if the clip's length changes.
const HOLD = 6
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
        d: window.devicePixelRatio || 1,
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
  // mix-blend-multiply keeps Chrome from handing the video to a hardware overlay (overlays
  // only take plain source-over quads). On Windows at 150% an overlaid video gets a 1px dark
  // seam down its right edge that the Bleed can't hide, since Chrome crops the video to its
  // box before overlaying it; it comes and goes as Chrome promotes and demotes the overlay.
  // The clip is flattened onto the page's white, and white × white is white, so it looks the same.
  const video = (progress?: MotionValue<number>, source: VideoAsset = asset) => (
    <ScrubVideo
      video={source}
      progress={progress}
      className="size-full object-cover mix-blend-multiply"
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

  // Large screens (lg and up) scrub the full-colour encode where the browser can decode it:
  // the mp4's half-resolution colour visibly softens the phone screen's coloured text at this
  // size. Smaller screens keep the mp4, which phones decode in hardware.
  const sharp =
    asset.fullColor && size.w >= 1024 ? { ...asset, sources: [asset.fullColor, ...asset.sources] } : asset
  return (
    <PinnedExpand
      size={size}
      video={(progress) => video(progress, sharp)}
      pixels={{ width: asset.width, height: asset.height }}
    />
  )
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
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: ratio, borderRadius: radius }}
      >
        <Bleed>{video()}</Bleed>
      </motion.div>
    </motion.div>
  )
}

/**
 * Desktop: grow to full screen, a brief hold, then scroll on — pinned while it plays.
 * "Full screen" is the part of the screen below the pinned navbar: the stage pins just under
 * it, and every distance here is measured in that space.
 */
function PinnedExpand({
  size,
  video,
  pixels,
}: {
  size: Size
  video: RenderVideo
  /** The video file's own width and height, in video pixels. */
  pixels: { width: number; height: number }
}) {
  const ref = useRef<HTMLDivElement>(null)
  // The stage's top on a whole screen pixel, so the full-screen video lands on the pixel grid.
  const top = snap(useNavHeight(), size.d)
  const stage = { ...size, h: size.h - top }
  const { h } = stage
  // The clip runs from the top of the page (first frame) to the pin releasing (last frame).
  const videoProgress = usePageProgress(ref, size, "pin")

  // One scroll value drives every stage, so they can never get out of step. It runs from the
  // card sitting 80% down the space below the navbar (0) to the moment the pin releases (1).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${top + h * 0.8}px`, "end end"],
  })

  // No shrink: once full screen it stays full screen and, when the pin releases, scrolls up
  // with the page. Scrolling back to the top reverses the grow, back down to the card.
  // Snapped once here, so the one-to-one zoom below is worked out from the very box it fills.
  const full = snapBox(fullBox(stage), size.d)
  const boxAt = (p: number): Box => {
    if (p > GROW_END) return full
    return snapBox(mixBox(cardBox(stage, "top"), fullBox(stage), ease(clamp01(p / GROW_END))), size.d)
  }
  /** 0 when full-screen, 1 when a card: drives the corner radius. */
  const cardness = (p: number) => (p <= GROW_END ? 1 - clamp01(p / GROW_END) : 0)

  // The video's size at one video pixel per screen pixel, and the scale (relative to that) at
  // which it just covers a box.
  const native = { width: pixels.width / size.d, height: pixels.height / size.d }
  const cover = (box: Box) => Math.max(box.width / native.width, box.height / native.height)
  const bled = (box: Box): Box => ({ ...box, width: box.width + 2 * BLEED, height: box.height + 2 * BLEED })
  // Where one-to-one reaches past the screen's edges, the whole grow is zoomed by the same small
  // factor so it ends exactly there; otherwise (a screen larger than the video, or far smaller)
  // it covers the box as usual.
  const fullCover = cover(full)
  const zoom = cover(bled(full)) <= 1 && fullCover >= 1 - MAX_NATIVE_CROP ? 1 / fullCover : 1
  /** The video's frame inside the box: centred, covering it plus the bleed, on whole pixels. */
  const frameAt = (p: number): Box => {
    const box = boxAt(p)
    const scale = Math.max(cover(box) * zoom, cover(bled(box)))
    const width = native.width * scale
    const height = native.height * scale
    return { x: snap((box.width - width) / 2, size.d), y: snap((box.height - height) / 2, size.d), width, height }
  }

  const x = useTransform(scrollYProgress, (p) => boxAt(p).x)
  const y = useTransform(scrollYProgress, (p) => boxAt(p).y)
  const width = useTransform(scrollYProgress, (p) => boxAt(p).width)
  const height = useTransform(scrollYProgress, (p) => boxAt(p).height)
  const radius = useTransform(scrollYProgress, (p) => 12 * size.r * cardness(p))
  const frameX = useTransform(scrollYProgress, (p) => frameAt(p).x)
  const frameY = useTransform(scrollYProgress, (p) => frameAt(p).y)
  const frameWidth = useTransform(scrollYProgress, (p) => frameAt(p).width)
  const frameHeight = useTransform(scrollYProgress, (p) => frameAt(p).height)

  return (
    // Pinned for the hold; the grow happens while the card rises to the navbar.
    <div ref={ref} className="relative mt-14" style={{ height: h * (1 + HOLD) }}>
      <div
        className="pointer-events-none sticky overflow-hidden"
        style={{ top, height: h }}
      >
        <motion.div
          className="pointer-events-auto absolute top-0 left-0 overflow-hidden"
          style={{ x, y, width, height, borderRadius: radius }}
        >
          <motion.div
            className="absolute top-0 left-0"
            style={{ x: frameX, y: frameY, width: frameWidth, height: frameHeight }}
          >
            {video(videoProgress)}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
