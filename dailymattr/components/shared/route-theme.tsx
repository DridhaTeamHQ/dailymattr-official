"use client"

import { usePathname } from "next/navigation"

/** Routes whose shared chrome (navbar + footer) switches to the dark NIA theme. */
const DARK_ROUTES = ["/nia"]

/**
 * The navbar and footer live in the root layout, so a page can't restyle them directly.
 * This wrapper adds the `.theme-nia` token scope on dark routes; `display: contents`
 * keeps it out of the layout so the body's flex column is unaffected.
 */
export function RouteTheme({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const dark = DARK_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`))

  return <div className={dark ? "theme-nia contents" : "contents"}>{children}</div>
}
