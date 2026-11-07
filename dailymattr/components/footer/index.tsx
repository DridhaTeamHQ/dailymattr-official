import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { footerGroups } from "./footer-links"

/**
 * Site footer, from the landing-page Figma frame: brand + newsletter sign-up on the left,
 * five link columns on the right, copyright under a hairline. Colours come from theme
 * tokens so it is light on regular pages; inside `.theme-nia` it switches to the dark
 * values and zooms with the rest of the NIA page (see components/nia/nia-scale.tsx).
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background px-4 pt-16 pb-10 font-helvetica sm:px-6 lg:border-t-0 lg:pt-6 [.theme-nia_&]:bg-[#0b0b0d] [.theme-nia_&]:lg:border-t [.theme-nia_&]:lg:pt-24 [.theme-nia_&]:font-sans [.theme-nia_&]:lg:[zoom:var(--nia-scale,1)]">
      {/* Lines up with the wide panels above (PANEL_WIDTH); the NIA page keeps its 1200px column */}
      <div className={cn(PANEL_WIDTH, "flex flex-col [.theme-nia_&]:max-w-[75rem] [.theme-nia_&]:lg:w-full")}>
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-20">
          {/* Brand on top, newsletter sign-up pinned to the bottom of the row */}
          <div className="flex min-w-0 flex-col justify-between gap-12 lg:self-stretch">
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="dailymattr home" className="block w-fit">
                <Image src="/footer/logo.svg" alt="dailymattr" width={150} height={31} className="block" />
              </Link>
              <p className="max-w-84 text-base leading-6 text-muted-foreground [.theme-nia_&]:text-white/55">
                The mobile training and operations platform for your frontline staff.
              </p>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-base leading-6 text-foreground">Sign up for email updates</p>
              <p className="text-base leading-6 text-muted-foreground [.theme-nia_&]:text-white/55">
                Keep up with Bounti news and product features
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/newsletter" />}
                className="mt-4 h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
              >
                Subscribe to newsletter
                <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
                  <ArrowUpRight className="size-3" />
                </span>
              </Button>
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 lg:flex lg:shrink-0 lg:gap-10 xl:gap-20">
            {footerGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-1 whitespace-nowrap">
                <p className="text-base leading-5.5 tracking-[-0.02rem] text-foreground">{group.title}</p>
                <ul className="flex flex-col gap-1">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-base leading-6 tracking-[-0.01rem] text-[#696969] transition-colors hover:text-foreground"
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

        {/* Bottom bar */}
        <div className="mt-16 border-t border-border pt-6 text-sm leading-5 text-muted-foreground sm:text-right [.theme-nia_&]:text-white/50">
          <p>© 2026 Dridha Technologies Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
