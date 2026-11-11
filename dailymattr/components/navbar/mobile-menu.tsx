"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"

import { useDarkRoute } from "@/components/shared/route-theme"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { DownloadButton } from "./download-button"
import { LanguageSwitcher } from "./language-switcher"
import { Logo } from "./logo"
import { formatItems, leftLinks, rightLinks } from "./nav-config"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const dark = useDarkRoute()
  // Close the sheet after any link is tapped (same-page links would otherwise leave it open).
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" />}
      >
        <Menu />
      </SheetTrigger>
      {/* The sheet is portalled to <body>, outside RouteTheme's wrapper, so it takes the
          dark token scope itself on dark routes. */}
      <SheetContent
        side="right"
        className={cn("w-72 overflow-hidden rounded-l-3xl", dark && "theme-nia")}
      >
        <SheetHeader>
          <SheetTitle>
            <Logo className="h-5" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {[...leftLinks, ...rightLinks].map((l) =>
            l.menu === "features" ? (
              // No dropdown on mobile — the formats are listed inline instead.
              <div key={l.label} className="flex flex-col">
                <span className="px-2 py-2 text-sm text-muted-foreground">{l.label}</span>
                {/* NIA leads the list, as it does in the desktop Features dropdown */}
                <Link
                  href="/nia"
                  onClick={close}
                  className="flex items-center gap-2 rounded-md py-2 pr-2 pl-5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Image src="/nav-menu/nia-icon.svg" alt="" width={16} height={16} />
                  NIA
                  <span className="text-xs text-muted-foreground/70">Your AI assistant</span>
                </Link>
                {formatItems.map((f) => (
                  <Link
                    key={f.href}
                    onClick={close}
                    href={f.href}
                    className="rounded-md py-2 pr-2 pl-5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    {f.name}
                    <span className="ml-2 text-xs text-muted-foreground/70">
                      {f.description}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={l.label}
                onClick={close}
                href={l.href ?? "#"}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            )
          )}
          <Separator className="my-3" />
          <div className="flex items-center justify-between px-2">
            <LanguageSwitcher />
            <Link href="/login" onClick={close} className="text-sm font-medium text-foreground">
              Log in
            </Link>
          </div>
          <DownloadButton className="mt-4 h-11 w-full justify-between rounded-xl pr-2 pl-4 text-sm" />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
