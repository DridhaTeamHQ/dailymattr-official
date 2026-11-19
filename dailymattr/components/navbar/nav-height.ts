import { useSyncExternalStore } from "react"

/**
 * The pinned navbar's rendered height in px (it changes with the laptop zoom), published by
 * PinnedHeader. Sections that pin themselves to the screen sit below it rather than under it:
 * CSS reads it as var(--nav-height), scripts with useNavHeight().
 */
const EVENT = "nav-height-change"
let current = 0

export function publishNavHeight(height: number) {
  if (height === current) return
  current = height
  document.documentElement.style.setProperty("--nav-height", `${height}px`)
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  return () => window.removeEventListener(EVENT, onChange)
}

/** The navbar's height in px; 0 on the server and before the header has measured itself. */
export function useNavHeight() {
  return useSyncExternalStore(subscribe, () => current, () => 0)
}
