"use client"

import Link from "next/link"
import { useLenis } from "lenis/react"
import type { ComponentProps } from "react"

import { useNavHeight } from "@/components/navbar/nav-height"

/** Gentle start and finish, for a long programmatic glide down the page. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * A Link that glides to an anchor on the current page (through Lenis when smooth scrolling
 * is on, else natively; instantly for reduced motion), stopping just below the pinned nav.
 * Any other href (another page, no #) behaves as a plain Link.
 */
export function AnchorLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const lenis = useLenis()
  const navHeight = useNavHeight()

  const glide = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    // Leave new-tab clicks and the like to the browser
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const url = new URL(href, window.location.href)
    if (!url.hash || url.pathname !== window.location.pathname) return
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
    if (!target) return
    e.preventDefault()

    if (lenis) {
      lenis.scrollTo(target, { offset: -navHeight, duration: 1.2, easing: easeInOutCubic })
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
    }
    history.replaceState(history.state, "", url.hash)
    // Move keyboard focus along with the view, without a second jump
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1")
    target.focus({ preventScroll: true })
  }

  return <Link href={href} onClick={glide} {...props} />
}
