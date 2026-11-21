import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { AnimatedLogo } from "./animated-logo"
import { AnnouncementBar } from "./announcement-bar"
import { DownloadButton } from "./download-button"
import { LanguageSwitcher } from "./language-switcher"
import { MobileMenu } from "./mobile-menu"
import { leftLinks, rightLinks } from "./nav-config"
import { NavLinks } from "./nav-links"
import { PinnedHeader } from "./pinned-header"

export function Navbar() {
  return (
    <>
      {/* Scrolls away with the page; only the nav row below stays pinned */}
      <AnnouncementBar />
      <PinnedHeader>
        {/* Full width: links sit at the screen edges (with padding), logo stays centred.
            From lg the gutter is a true 64px on screen at every width: divided by the header's
            zoom (--nav-zoom, pinned-header.tsx) and, on the left, less the first link's own
            12px (px-3) padding, so the "Features" text and the "Get the app" button both sit
            64px from the edges. */}
        <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:pr-[calc(64px/var(--nav-zoom,1))] lg:pl-[calc(64px/var(--nav-zoom,1)_-_0.75rem)]">
          <NavLinks links={leftLinks} className="hidden justify-self-start md:flex" />
          <div className="md:hidden" />

          <AnimatedLogo />

          <div className="flex items-center justify-self-end gap-2">
            <NavLinks links={rightLinks} className="hidden lg:flex" />

            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher />
              <Separator orientation="vertical" className="h-4" />
              <Link
                href="/login"
                className="px-2 text-sm font-medium whitespace-nowrap text-foreground hover:text-muted-foreground"
              >
                Log in
              </Link>
              <DownloadButton />
            </div>

            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
        <Separator />
      </PinnedHeader>
    </>
  )
}
