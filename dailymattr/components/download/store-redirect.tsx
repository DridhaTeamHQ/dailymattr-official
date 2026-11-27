"use client"

import { useEffect } from "react"

import { storeFor } from "@/lib/store-link"

/**
 * Backup for proxy.ts, which sends phones to their store before this page is ever served.
 * Two kinds of device still land here and are sent on from the browser:
 * - an iPad, whose Safari asks for the desktop site by default and so reports itself as a Mac
 *   (only its touch screen gives it away, and only the browser knows that);
 * - any phone that got the page anyway, e.g. from a cached copy.
 * replace() keeps /download out of the history, so Back doesn't bounce to the store again.
 */
export function StoreRedirect() {
  useEffect(() => {
    const store = storeFor(navigator.userAgent, navigator.maxTouchPoints)
    if (store) window.location.replace(store)
  }, [])
  return null
}
