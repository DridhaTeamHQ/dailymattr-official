"use client"

import { useLayoutEffect } from "react"

import { cn } from "@/lib/utils"

/**
 * The NIA page is drawn on a 1920px Figma frame. On narrower desktop screens we
 * zoom the page content down by viewport / 1920 so it keeps the frame's
 * proportions (including the side gutters) instead of filling the width.
 *
 * MIN_SCALE stops body copy from becoming unreadably small on laptops.
 * The zoom only applies from the `lg` breakpoint up; phones and tablets keep
 * the regular responsive layout.
 */
const DESIGN_WIDTH = 1920
const MIN_SCALE = 0.75

export function NiaScaledMain({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  useLayoutEffect(() => {
    // Set on <html> (after hydration) so the shared footer can zoom with the page too.
    const root = document.documentElement
    const apply = () => {
      // innerWidth (incl. scrollbar) so a 1920px screen renders the frame 1:1
      const width = window.innerWidth
      const scale = Math.min(1, Math.max(MIN_SCALE, width / DESIGN_WIDTH))
      root.style.setProperty("--nia-scale", String(scale))
    }
    apply()
    window.addEventListener("resize", apply)
    return () => {
      window.removeEventListener("resize", apply)
      root.style.removeProperty("--nia-scale")
    }
  }, [])

  return (
    <main className={cn("flex-1 bg-[#0f0f0f] lg:[zoom:var(--nia-scale,1)]", className)}>
      {children}
    </main>
  )
}
