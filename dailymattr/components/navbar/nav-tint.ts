import { useSyncExternalStore } from "react"

/**
 * What the Trax page tells the pinned navbar, both published by components/trax/hero-wash.tsx:
 * - whether the hero is still under the nav (it changes as the visitor scrolls). The nav takes
 *   the playing cover's tint only while it is; once the hero has scrolled up past it, the nav
 *   is its usual white. True until told otherwise, so on /formats/trax the nav is dark from the
 *   first paint.
 * - the tint: the colour at the top of the playing cover. The header applies it to itself
 *   (--trax-tint), so only the nav restyles while it eases to the next cover.
 */
const EVENT = "trax-nav-change"
let underNav = true
let tint: string | null = null

const notify = () => window.dispatchEvent(new Event(EVENT))

export function publishTraxHeroUnderNav(under: boolean) {
  if (under === underNav) return
  underNav = under
  notify()
}

export function publishTraxTint(colour: string | null) {
  if (colour === tint) return
  tint = colour
  notify()
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

export function useTraxHeroUnderNav() {
  return useSyncExternalStore(subscribe, () => underNav, () => true)
}

export function useTraxTint() {
  return useSyncExternalStore(subscribe, () => tint, () => null)
}
