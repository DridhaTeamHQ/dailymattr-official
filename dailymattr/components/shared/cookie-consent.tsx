"use client"

import * as React from "react"
import Link from "next/link"
import { CookieIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** What the visitor allowed. "necessary" and "rejected" both mean: no optional cookies. */
export type CookieConsent = "all" | "necessary" | "rejected"

const STORAGE_KEY = "dm_cookie_consent"
const CONSENT_EVENT = "dm-consent-change"

/** The saved choice, or null if the visitor hasn't answered yet. Check this before loading analytics. */
export function getCookieConsent(): CookieConsent | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === "all" || v === "necessary" || v === "rejected" ? v : null
  } catch {
    return null
  }
}

function saveConsent(value: CookieConsent) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {}
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange)
  window.addEventListener("storage", onChange)
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange)
    window.removeEventListener("storage", onChange)
  }
}

// Server render and hydration treat it as answered, so the popup only appears on the client.
const ANSWERED = "answered"

/**
 * Cookie choice popup, bottom-left; shown until the visitor picks an option.
 * NIA pins the root font size to 16px, so there it zooms by the laptop scale to match other pages.
 */
export function CookieConsentPopup() {
  const consent = React.useSyncExternalStore(subscribe, getCookieConsent, () => ANSWERED)
  const show = consent === null

  // Slide in on the frame after mount, so the entrance animates.
  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => {
    if (!show) return
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [show])

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
      className={cn(
        "fixed inset-x-4 bottom-4 z-[60] rounded-xl bg-background p-5 shadow-lg ring-1 ring-foreground/10 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-opacity sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[24rem] [html:has(.nia-layout)_&]:lg:[zoom:var(--site-scale-auto,1)]",
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center gap-2">
        <CookieIcon className="size-4 text-foreground" aria-hidden="true" />
        <h2 id="cookie-consent-title" className="text-md font-medium text-foreground">
          We use cookies
        </h2>
      </div>
      <p id="cookie-consent-body" className="mt-2 text-sm leading-5 text-muted-foreground">
        Necessary cookies keep dailymattr working. With your OK, we&apos;d also use optional ones to
        understand how the site is used. Read our{" "}
        <Link href="/privacypolicy" className="text-foreground underline underline-offset-2">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" size="sm" className="sm:flex-1" onClick={() => saveConsent("rejected")}>
          Reject
        </Button>
        <Button variant="secondary" size="sm" className="sm:flex-1" onClick={() => saveConsent("necessary")}>
          Necessary only
        </Button>
        <Button
          size="sm"
          className="bg-foreground text-background hover:bg-foreground/85 sm:flex-1"
          onClick={() => saveConsent("all")}
        >
          Accept all
        </Button>
      </div>
    </div>
  )
}
