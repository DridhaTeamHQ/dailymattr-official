"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { preload } from "react-dom"

import { useDarkNav } from "@/components/shared/route-theme"
import { cn } from "@/lib/utils"

// The brand's logo reveal video as a sprite: 59 frames of white artwork stacked top to bottom
// (built by scripts/encode-logo-sprite.mjs; keep these numbers in step with it).
const SPRITE = { src: "/logo_animation/logo-reveal.webp", frames: 59, w: 432, h: 150 }
const FPS = 25
// Frame 0: the big quote marks, faint, start to fill in. Frame 27: the quotes logo, solid.
// Frames 29-40: the marks shrink to wordmark size.
// Frame 58: the quotes have shrunk and opened out into the full "dailymattr" wordmark.
const QUOTES = 27
const WORDMARK = SPRITE.frames - 1
// In the video the quotes logo stands almost twice as tall as the wordmark, which is too big
// for the navbar: draw it at the wordmark's height instead (106 of 186 px in the master),
// then grow back to full size while the marks shrink down (frames 29-40), so the hand-off
// to the wordmark is unchanged.
const QUOTES_SCALE = 106 / 186
const SHRINK_START = 29
const SHRINK_END = 40
const scaleAt = (i: number) =>
  QUOTES_SCALE +
  (1 - QUOTES_SCALE) * Math.min(1, Math.max(0, (i - SHRINK_START) / (SHRINK_END - SHRINK_START)))
// Shrinking back into the quotes plays a little faster than the reveal, so it keeps up with
// the scroll.
const SHRINK_SPEED = 1.5
// Within this many px of the top the logo always shows the wordmark.
const TOP = 8
// How far (px) the page has to move one way before the logo follows, so a little jitter in
// the scroll doesn't flip it back and forth.
const TRAVEL = 10

const BLUE = "#3979ff"
/** How long the logo takes to fade between its light-nav and dark-nav colours. */
const COLOR_FADE_MS = 400
/** "#rrggbb" as [r, g, b]. */
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

/**
 * The navbar logo, animated from the brand's logo reveal. On load the quotes logo fills in
 * and, at the top of the page, opens out into the "dailymattr" wordmark. Starting to scroll
 * down shrinks it back to the quotes; starting to scroll up, anywhere on the page, plays the
 * reveal again. A change of direction mid-way reverses from the current frame. Hovering with
 * a mouse opens the quotes out into the wordmark too; moving off puts back whatever the scroll
 * last asked for. Blue, or white wherever the nav is dark. Reduced motion jumps straight to each
 * end state.
 */
export function AnimatedLogo({ className }: { className?: string }) {
  // Fetch the sprite with the page rather than after hydration.
  preload(SPRITE.src, { as: "image", type: "image/webp", fetchPriority: "high" })

  const linkRef = useRef<HTMLAnchorElement>(null)
  const slotRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const color = useDarkNav() ? "#ffffff" : BLUE
  const colorRef = useRef(color)
  const redrawRef = useRef<() => void>(() => {})

  useEffect(() => {
    const link = linkRef.current
    const slot = slotRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!link || !slot || !canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sprite = new Image()
    let ready = false
    let frame = 0 // where the playhead is (fractional between frames)
    let target = 0 // where it is heading
    let drawn = -1 // the frame on the canvas
    let raf = 0
    let last = 0

    const draw = (i: number) => {
      const { width, height } = canvas
      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, width, height)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      // Scaled about the centre: every frame of the logo is centred in the master.
      const scale = scaleAt(i)
      const w = width * scale
      const h = height * scale
      ctx.drawImage(sprite, 0, i * SPRITE.h, SPRITE.w, SPRITE.h, (width - w) / 2, (height - h) / 2, w, h)
      // Tint: keep the artwork's alpha, swap its white for the logo colour.
      ctx.globalCompositeOperation = "source-in"
      ctx.fillStyle = colorRef.current
      ctx.fillRect(0, 0, width, height)
    }

    const render = (force = false) => {
      const i = Math.round(frame)
      if (!ready || (i === drawn && !force)) return
      draw(i)
      drawn = i
    }

    // Fits the canvas to the slot in whole device pixels, on the pixel grid, drawn 1:1. A
    // canvas a fraction of a pixel off its on-screen size (or sitting between pixels, as the
    // centred slot usually does) is resampled when painted, which blurs the whole logo.
    let fitted = ""
    const fit = () => {
      const box = slot.getBoundingClientRect() // on screen, after the header's zoom
      if (!box.width || !box.height) return
      const dpr = window.devicePixelRatio || 1
      // The header's CSS zoom (see PinnedHeader): on-screen size ÷ CSS size where
      // currentCSSZoom is missing.
      const zoom = slot.currentCSSZoom ?? box.width / (parseFloat(getComputedStyle(slot).width) || box.width)
      const width = Math.round(box.width * dpr)
      const height = Math.round(box.height * dpr)
      // One device pixel in the canvas's own CSS px, and the nudge onto the pixel grid.
      const px = 1 / (dpr * zoom)
      const dx = (Math.round(box.left * dpr) - box.left * dpr) * px
      const dy = (Math.round(box.top * dpr) - box.top * dpr) * px
      const key = `${width} ${height} ${px} ${dx} ${dy}`
      if (key === fitted) return
      fitted = key
      canvas.style.width = `${width * px}px`
      canvas.style.height = `${height * px}px`
      canvas.style.transform = `translate(${dx}px, ${dy}px)`
      if (canvas.width === width && canvas.height === height) return
      canvas.width = width
      canvas.height = height
      render(true)
    }

    const tick = (now: number) => {
      // Capped so a stalled frame (or a background tab) doesn't skip the whole animation.
      const dt = last ? Math.min(now - last, 100) / 1000 : 0
      last = now
      const step = dt * FPS * (target < frame ? SHRINK_SPEED : 1)
      frame = target > frame ? Math.min(target, frame + step) : Math.max(target, frame - step)
      render()
      if (frame === target) {
        raf = 0
        last = 0
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    const play = (to: number) => {
      target = to
      if (!ready || frame === target) return
      if (reduceMotion.matches) {
        frame = target
        render()
        return
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Scroll position, clamped to the page so overscroll bounce (iOS) reads as no movement.
    const scrollTop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return Math.min(Math.max(window.scrollY, 0), Math.max(max, 0))
    }
    let lastY = scrollTop()
    let travel = 0 // px moved in the current direction (negative = up)
    // Loaded part-way down the page: settle on the quotes; at the top: reveal the wordmark.
    target = lastY > TOP ? QUOTES : WORDMARK
    // What the scroll last asked for; it waits while the pointer is over the logo.
    let scrolled = target
    let hovered = false
    const settle = (to: number) => {
      scrolled = to
      if (!hovered) play(to)
    }

    const onScroll = () => {
      // The header moves while the announcement bar scrolls away: keep the logo on the grid.
      fit()
      const y = scrollTop()
      const delta = y - lastY
      lastY = y
      if (delta === 0) return
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta
      if (y <= TOP) settle(WORDMARK)
      else if (travel >= TRAVEL) settle(QUOTES)
      else if (travel <= -TRAVEL) settle(WORDMARK)
    }

    // Mouse only: a tap on a touch screen fires these too, just before it navigates away.
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      hovered = true
      play(WORDMARK)
    }
    const onLeave = () => {
      if (!hovered) return
      hovered = false
      play(scrolled)
    }

    // `load` rather than decode(): decode() waits until the page is painted, so a tab opened
    // in the background would show no logo at all.
    const start = () => {
      ready = true
      render(true)
      play(target)
    }

    redrawRef.current = () => render(true)
    fit()
    sprite.addEventListener("load", start, { once: true })
    sprite.src = SPRITE.src

    const resize = new ResizeObserver(fit)
    resize.observe(slot)
    window.addEventListener("resize", fit)
    window.addEventListener("scroll", onScroll, { passive: true })
    link.addEventListener("pointerenter", onEnter)
    link.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      sprite.removeEventListener("load", start)
      resize.disconnect()
      window.removeEventListener("resize", fit)
      window.removeEventListener("scroll", onScroll)
      link.removeEventListener("pointerenter", onEnter)
      link.removeEventListener("pointerleave", onLeave)
      redrawRef.current = () => {}
    }
  }, [])

  // The navbar switching between light and dark (a route change, or scrolling past the Trax
  // hero) fades the logo to its new colour with the rest of the nav (0.4s, as .trax-route in
  // globals.css). Reduced motion swaps it straight away.
  const shown = useRef(rgb(color))
  useEffect(() => {
    const from = shown.current
    const to = rgb(color)
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const start = performance.now()
    let raf = 0
    const step = (now: number) => {
      const t = instant ? 1 : Math.min(1, (now - start) / COLOR_FADE_MS)
      const eased = t * (2 - t)
      shown.current = [0, 1, 2].map((k) => from[k] + (to[k] - from[k]) * eased)
      colorRef.current = `rgb(${shown.current.map(Math.round).join(" ")})`
      redrawRef.current()
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [color])

  return (
    <Link ref={linkRef} href="/" aria-label="dailymattr home" className="inline-flex shrink-0">
      {/* The slot sets the logo's size (the frame's aspect ratio sets the height); the canvas
          inside is fitted to it in whole device pixels. */}
      <span ref={slotRef} className={cn("relative block aspect-[432/150] w-[8.5rem]", className)}>
        <canvas ref={canvasRef} aria-hidden className="absolute top-0 left-0" />
      </span>
    </Link>
  )
}
