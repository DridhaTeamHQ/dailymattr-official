import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CONTENT_WIDTH } from "@/components/shared/layout"
import { Logo } from "@/components/navbar/logo"
import { footerGroups, legalLinks } from "./footer-links"

export function Footer() {
  return (
    <footer className="w-full px-4 pt-8 pb-10">
      <div className={cn(CONTENT_WIDTH, "flex flex-col gap-12")}>
        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
          {/* Sign-up sits right under the tagline (Figma), not pinned to the bottom */}
          <div className="flex flex-col gap-12">
            <div>
              <Logo />
              <p className="mt-3 max-w-60 text-xs text-muted-foreground">
                The mobile training and operations platform for your deskless staff.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">Sign up for email updates</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Keep up with Bounti news and product features
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/newsletter" />}
                className="mt-3 h-8 gap-2 rounded-lg pr-1.5 pl-3 text-xs font-medium"
              >
                Subscribe to newsletter
                <span className="flex size-5 items-center justify-center rounded-[5px] bg-primary-foreground/20">
                  <ArrowUpRight className="size-3" />
                </span>
              </Button>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:gap-x-16"
          >
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-medium text-foreground">{group.title}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div>
          <Separator />
          <div className="flex flex-col gap-3 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-6">
              {legalLinks.map((l) => (
                <Link key={l.label} href={l.href} className="hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
            <p>© 2026 Dailymattr Technologies Private Limited. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
