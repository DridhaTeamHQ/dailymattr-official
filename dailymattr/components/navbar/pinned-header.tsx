"use client"

import { useLayoutEffect, useRef, type CSSProperties } from "react"

import { useTraxNav, useTraxRoute } from "@/components/shared/route-theme"
import { cn } from "@/lib/utils"
import { publishNavHeight } from "./nav-height"
import { useTraxTint } from "./nav-tint"

/**
 * Sticky header that stays pinned to the top of the screen. The announcement bar above it
 * scrolls away with the page; the nav row itself never hides.
 */
export function PinnedHeader({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  // On Trax the nav turns dark over the hero, tinted with the playing cover, and cross-fades
  // back to white once the hero has scrolled past (globals.css, .trax-route / .trax-nav).
  // The tint is set on the header itself, so only the nav restyles while it eases.
  const traxRoute = useTraxRoute()
  const traxNav = useTraxNav()
  const tint = useTraxTint()

  // Publishes the nav height (--nav-height, useNavHeight) so pinned sections can sit below
  // it, and the announcement bar + nav height as --chrome-height, so full-screen heroes can
  // fill exactly what is left of the first screen (the nav's size varies with zoom).
  // A layout effect, so it is set before the page's own layout effects measure the screen.
  useLayoutEffect(() => {
    const header = ref.current
    if (!header) return
    const banner = header.previousElementSibling
    const measure = () => {
      const nav = header.getBoundingClientRect().height
      publishNavHeight(nav)
      const height = nav + (banner?.getBoundingClientRect().height ?? 0)
      document.documentElement.style.setProperty("--chrome-height", `${height}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    if (banner) observer.observe(banner)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  return (
    // On laptops the page's rem sizes shrink to --site-scale (e.g. 0.8, see globals.css). From
    // 1280px the nav is scaled back up to 90% so it reads a little larger; below that it keeps
    // the page size so all its links fit. At scale 1 (desktop) it stays 1:1.
    // NIA pins its root to 16px, so there the nav is zoomed by the laptop ratio instead
    // (--site-scale-auto, floored at 90% from 1280px): the same size as on every other page.
    // The zoom is kept in --nav-zoom so the nav row can undo it for its fixed 64px side gutter.
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-50 w-full bg-background [--nav-zoom:1] [zoom:var(--nav-zoom)] xl:[--nav-zoom:max(1,calc(0.9/var(--site-scale,1)))] [.nia-layout_&]:lg:[--nav-zoom:var(--site-scale-auto,1)] [.nia-layout_&]:xl:[--nav-zoom:max(0.9,var(--site-scale-auto,1))]",
        traxRoute && "trax-route",
        traxNav && "trax-nav",
      )}
      style={traxRoute && tint ? ({ "--trax-tint": tint } as CSSProperties) : undefined}
    >
      {children}
    </header>
  )
}
