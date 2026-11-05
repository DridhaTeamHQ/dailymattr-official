import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { DownloadButton } from "./download-button"
import { LanguageSwitcher } from "./language-switcher"
import { Logo } from "./logo"
import { leftLinks, rightLinks } from "./nav-config"

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Open menu" />}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Logo className="h-5" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {[...leftLinks, ...rightLinks].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Separator className="my-3" />
          <div className="flex items-center justify-between px-2">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm font-medium text-foreground">
              Log in
            </Link>
          </div>
          <DownloadButton className="mt-4 w-full justify-between" />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
