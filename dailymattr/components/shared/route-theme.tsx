"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

/** Routes whose shared chrome (navbar + footer) switches to the dark NIA colours. */
const DARK_ROUTES = ["/nia", "/newsroom"]
/** Routes that also take NIA's own sizing (fixed 16px root, zoomed footer layout). */
const NIA_LAYOUT_ROUTES = ["/nia"]

const matches = (routes: string[], pathname: string) =>
  routes.some((r) => pathname === r || pathname.startsWith(`${r}/`))

/** True on routes with the dark chrome. For UI portalled outside <RouteTheme> (e.g. sheets). */
export function useDarkRoute() {
  return matches(DARK_ROUTES, usePathname())
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
