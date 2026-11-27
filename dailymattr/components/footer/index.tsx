import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PANEL_WIDTH } from "@/components/shared/layout"
import { appStoreLinks, footerGroups, type FooterGroup } from "./footer-links"
import { FooterSocialLinks } from "./social-links"

/**
 * Site footer, from the landing-page Figma frame: brand + newsletter sign-up on the left,
 * five link columns on the right, copyright under a hairline. Colours come from theme
 * tokens so it is light on regular pages; inside `.theme-nia` only the colours go dark.
 * NIA pins its root font to 16px, so there it is zoomed by the laptop ratio
 * (--site-scale-auto) to come out the same size as on every other page.
 *
 * After a page that ends in a full-bleed photo (`data-full-bleed`), it drops the top border and
 * takes Figma's 97px top gap. cacheComponents keeps visited pages mounted as hidden <main>s
 * (React Activity: inline `display: none !important`) between the live page and the footer,
 * so the rule looks at any earlier <main> that isn't hidden, not just the adjacent one.
 */
/**
 * On desktop, "Get the app" sits on the same line as the second-last link of the longest link
 * column ("Entertainment" in Latest Stories). A column is its title (leading-7, 1.75rem), a
 * 0.75rem gap (gap-3), then links of 1.5rem (leading-6) with 0.25rem between (gap-1).
 */
const appLabelRow = Math.max(...footerGroups.map((g) => g.links.length)) - 2
const appLabelTop = `${1.75 + 0.75 + appLabelRow * (1.5 + 0.25)}rem`

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background px-4 pt-16 pb-10 sm:px-6 lg:px-16 lg:border-t-0 lg:pt-12 [main:not([style*='display:_none']):has(>[data-full-bleed]:last-child)~&]:border-t-0 lg:[main:not([style*='display:_none']):has(>[data-full-bleed]:last-child)~&]:pt-[6.0625rem] [.theme-nia_&]:bg-[#0b0b0d] [.nia-layout_&]:lg:pt-[6.0625rem] [.nia-layout_&]:lg:[zoom:var(--site-scale-auto,1)]">
      {/* Lines up with the wide panels above (PANEL_WIDTH) */}
      <div className={cn(PANEL_WIDTH, "flex flex-col")}>
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-20">
          {/* Brand on top, newsletter sign-up pinned to the bottom of the row */}
          <div className="flex min-w-0 flex-col justify-between gap-12 lg:self-stretch">
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="dailymattr home" className="block w-fit">
                <Image src="/footer/logo.svg" alt="dailymattr" width={150} height={31} className="block [.nia-layout_&]:lg:[zoom:calc(1/var(--site-scale-auto,1))]" />
              </Link>
              <p className="max-w-96 text-base leading-6 text-muted-foreground [.theme-nia_&]:text-white/55">
                &quot;dailymattr&quot; brings you the story behind the headline with context, clarity, and
                perspective that help you understand what really matters.
              </p>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-base leading-6 text-foreground">Sign up for email updates</p>
              <p className="text-base leading-6 text-muted-foreground [.theme-nia_&]:text-white/55">
                Keep up with latest stories, features, and more from &quot;dailymattr&quot;.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/newsletter/" />}
                className="mt-4 h-10 gap-2 rounded-lg pr-2 pl-4 text-base leading-6 font-medium tracking-[-0.01rem]"
              >
                Subscribe to newsletter
                <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-primary-foreground/20">
                  <ArrowUpRight className="size-3" />
                </span>
              </Button>
            </div>
          </div>

          {/* Link columns, with the app-store badges underneath */}
          <div className="relative flex flex-col gap-10 lg:shrink-0">
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-x-8 lg:flex lg:shrink-0 lg:gap-10 xl:gap-20">
            {footerGroups.slice(0, -2).map((group) => (
              <FooterGroupLinks key={group.title} group={group} />
            ))}
            {/* The last two columns (Legal, Support) with the social icons under them on desktop,
                spread from the first column's left edge to the last one's right edge. Below lg
                the wrappers vanish (display: contents) and the columns join the grid. */}
            <div className="contents lg:flex lg:flex-col lg:gap-10">
              <div className="contents lg:flex lg:gap-10 xl:gap-20">
                {footerGroups.slice(-2).map((group) => (
                  <FooterGroupLinks key={group.title} group={group} />
                ))}
              </div>
              <FooterSocialLinks spread className="hidden lg:block" />
            </div>
          </nav>

          {/* Social icons (phones and tablets; desktop has them under Legal and Support), then
              the app badges. On desktop the block runs from the "Entertainment" row (top, see
              appLabelTop) to the bottom of the footer row: the label sits on that row and the
              badges' bottom edge is level with the "Subscribe to newsletter" button on the left.
              Below lg the block is in the flow, where top has no effect. */}
          <div className="flex flex-col gap-6 lg:absolute lg:right-0 lg:bottom-0" style={{ top: appLabelTop }}>
          <FooterSocialLinks className="lg:hidden" />
          <div className="flex flex-col gap-3 lg:flex-1 lg:justify-between lg:gap-0">
            {/* Styled like the footer links, on the same line as the longest column's
                second-last link ("Entertainment"). On desktop it takes no height (its text
                still shows from the top), so the badges always end level with the Subscribe
                button however little room there is. */}
            <p className="text-base leading-6 tracking-[-0.01rem] text-[#696969] lg:h-0">Get the app</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={appStoreLinks.apple}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="block transition-opacity hover:opacity-85"
              >
                <Image src="/downlods/apple.png" alt="Download on the App Store" width={126} height={40} className="block h-10 w-auto" />
              </a>
              <a
                href={appStoreLinks.google}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="block transition-opacity hover:opacity-85"
              >
                <Image src="/downlods/Text.png" alt="Get it on Google Play" width={134} height={40} className="block h-10 w-auto" />
              </a>
            </div>
          </div>
          </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-[12px] leading-5 text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:gap-8 [.theme-nia_&]:text-white/50">
          <p className="lg:whitespace-nowrap">
            The trademarks, logos, and service marks displayed on this site are the property of their
            respective owners.
          </p>
          <p className="shrink-0 sm:text-right">© 2026 Dridha Technologies Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/** One footer column: its title and links. */
function FooterGroupLinks({ group }: { group: FooterGroup }) {
  return (
    <div className="flex flex-col gap-3 whitespace-nowrap">
      <p className="text-md leading-7 tracking-[-0.02rem] text-foreground">{group.title}</p>
      <ul className="flex flex-col lg:gap-1">
        {group.links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="inline-flex min-h-9 items-center text-base leading-6 tracking-[-0.01rem] text-[#696969] transition-colors hover:text-foreground lg:min-h-0"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
