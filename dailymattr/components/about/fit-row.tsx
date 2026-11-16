"use client"

import { useLayoutEffect, useRef } from "react"

/**
 * Sideways-scrolling row whose cards keep their fixed Figma size but are zoomed so exactly
 * `fit` of them (plus the gaps between) fill the visible width on desktop. Below `lg` the
 * row keeps its regular size (set with classes on the inner track) and simply scrolls.
 */
export function FitRow({
  fit,
  cardRem,
  gapRem,
  className,
  trackClassName,
  children,
}: {
  fit: number
  /** Card width and gap in rem, as drawn in Figma (px ÷ 16). */
  cardRem: number
  gapRem: number
  className?: string
  trackClassName?: string
  children: React.ReactNode
}) {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = outer.current
    const inner = track.current
    if (!el || !inner) return

    const apply = () => {
      if (window.innerWidth < 1024) {
        inner.style.zoom = ""
        return
      }
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const cs = getComputedStyle(el)
      const available = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const natural = (fit * cardRem + (fit - 1) * gapRem) * rem
      inner.style.zoom = String(Math.min(1, available / natural))
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit, cardRem, gapRem])

  return (
    <div ref={outer} className={className}>
      <div ref={track} className={trackClassName}>
        {children}
      </div>
    </div>
  )
}
