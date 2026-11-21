"use client"

import { usePathname } from "next/navigation"

import { useTraxHeroUnderNav } from "@/components/navbar/nav-tint"
import { cn } from "@/lib/utils"

/** Routes whose shared chrome (navbar + footer) switches to the dark NIA colours. */
const DARK_ROUTES = ["/nia", "/benchmark"]
/** Routes that also take NIA's own sizing (fixed 16px root, zoomed footer layout). */
const NIA_LAYOUT_ROUTES = ["/nia"]
/**
 * Routes whose navbar alone goes dark over the hero, tinted with the playing cover's colour
 * (--trax-tint, set by components/trax/hero-wash.tsx). The footer keeps its usual colours.
 */
const TRAX_NAV_ROUTES = ["/formats/trax"]

const matches = (routes: string[], pathname: string) =>
  routes.some((r) => pathname === r || pathname.startsWith(`${r}/`))

/** True on routes with the dark chrome. For UI portalled outside <RouteTheme> (e.g. sheets). */
export function useDarkRoute() {
  return matches(DARK_ROUTES, usePathname())
}

/** True on the routes whose navbar can take the Trax cover tint. */
export function useTraxRoute() {
  return matches(TRAX_NAV_ROUTES, usePathname())
}

/**
 * True while the navbar takes the Trax cover tint (the `.trax-nav` scope, globals.css): on
 * Trax, and only while the hero is still under the nav. Scrolled past it, the nav is white.
 */
export function useTraxNav() {
  const traxRoute = useTraxRoute()
  const overHero = useTraxHeroUnderNav()
  return traxRoute && overHero
}

/** True wherever the navbar is dark: the dark routes and the tinted Trax nav. */
export function useDarkNav() {
  const darkRoute = useDarkRoute()
  const traxNav = useTraxNav()
  return darkRoute || traxNav
}

/**
 * The navbar and footer live in the root layout, so a page can't restyle them directly.
 * This wrapper adds the `.theme-nia` token scope on dark routes; `display: contents`
 * keeps it out of the layout so the body's flex column is unaffected.
 */
export function RouteTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dark = matches(DARK_ROUTES, pathname)
  const niaLayout = matches(NIA_LAYOUT_ROUTES, pathname)

  return (
    <div className={cn("contents", dark && "theme-nia", niaLayout && "nia-layout")}>{children}</div>
  )
}
