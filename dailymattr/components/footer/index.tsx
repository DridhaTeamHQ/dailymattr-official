import Image from "next/image"
import Link from "next/link"

import { footerGroups, legalLinks, storeBadges } from "./footer-links"

/**
 * Site footer. Figma: "Footer" — node 8856:9310 (1200px content column).
 * Colours come from theme tokens so it is light on regular pages; inside
 * `.theme-nia` it switches to the exact dark values from the frame and zooms
 * with the rest of the NIA page (see components/nia/nia-scale.tsx).
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background px-4 pt-16 pb-10 sm:px-6 lg:pt-24 [.theme-nia_&]:bg-[#0b0b0d] [.theme-nia_&]:lg:[zoom:var(--nia-scale,1)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col">
        <div className="relative flex flex-col gap-12 lg:flex-row lg:flex-wrap lg:items-start lg:gap-20">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:w-[480px]">
            <Link href="/" aria-label="dailymattr home" className="block h-[34.828px] w-[150px]">
              <Image
                src="/footer/logo.svg"
                alt="dailymattr"
                width={149.922}
                height={30.828}
                className="block"
              />
            </Link>
            <p className="text-[16px] leading-6 text-muted-foreground [.theme-nia_&]:text-white/55">
              A little more understanding, every day.
            </p>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 lg:flex lg:gap-20"
          >
            {footerGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-1 whitespace-nowrap">
                <p className="text-[16px] leading-[22.4px] tracking-[-0.32px] text-foreground">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-1">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[16px] leading-6 tracking-[-0.16px] text-[#696969] transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Get the app — sits under the Legal/Support columns on desktop */}
          <div className="flex flex-col gap-1.5 lg:absolute lg:top-[183px] lg:left-[904px]">
            <p className="text-[16px] leading-6 font-medium tracking-[-0.2px] text-foreground">
              Get the app
            </p>
            <div className="flex gap-3 pt-3">
              {storeBadges.map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="block shrink-0 transition-opacity hover:opacity-85"
                >
                  <Image
                    src={b.image}
                    alt={b.alt}
                    width={b.width}
                    height={b.height}
                    className="block h-11 w-auto"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-16">
          <div className="flex flex-col gap-3 border-t border-border pt-6 text-[14px] leading-5 text-muted-foreground sm:flex-row sm:items-start sm:justify-between [.theme-nia_&]:text-white/50">
            <div className="flex gap-6">
              {legalLinks.map((l) => (
                <Link key={l.label} href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
            <p>© 2026 Dridha Technologies Private Limited. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
