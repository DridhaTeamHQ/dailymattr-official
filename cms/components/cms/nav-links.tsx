"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

// Top-nav pages. User management lives in the account menu (user-menu.tsx), not here.
const links = [
  { href: "/", label: "Dashboard" },
  { href: "/news", label: "News" },
  { href: "/seo", label: "SEO" },
  { href: "/qix", label: "Qix" },
  { href: "/trax", label: "Trax" },
]

/** Page links as pills, like the website's news section pills: the current page in blue. */
export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="-my-2 flex min-w-0 items-center gap-1 overflow-x-auto py-2">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
