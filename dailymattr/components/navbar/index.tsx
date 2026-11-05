import Link from "next/link"

import { Separator } from "@/components/ui/separator"
import { AnnouncementBar } from "./announcement-bar"
import { DownloadButton } from "./download-button"
import { LanguageSwitcher } from "./language-switcher"
import { Logo } from "./logo"
import { MobileMenu } from "./mobile-menu"
import { leftLinks, rightLinks } from "./nav-config"
import { NavLinks } from "./nav-links"

export function Navbar() {
  return (
    <>
      {/* Scrolls away with the page; only the nav row below stays pinned */}
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full bg-background">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-8">
          <NavLinks links={leftLinks} className="hidden justify-self-start md:flex" />
          <div className="md:hidden" />

          <Logo />

          <div className="flex items-center justify-self-end gap-2">
            <NavLinks links={rightLinks} className="hidden xl:flex" />

            <div className="hidden items-center gap-2 md:flex">
              <LanguageSwitcher />
              <Separator orientation="vertical" className="h-4" />
              <Link
                href="/login"
                className="px-2 text-[13px] font-medium whitespace-nowrap text-foreground hover:text-muted-foreground"
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
      </header>
    </>
  )
}
