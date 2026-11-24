"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Top-nav pages. User management lives in the account menu (user-menu.tsx), not here.
const links = [
  { href: "/", label: "Dashboard" },
  { href: "/seo", label: "SEO" },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "px-3 text-muted-foreground",
              active && "bg-muted text-foreground hover:bg-muted"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
