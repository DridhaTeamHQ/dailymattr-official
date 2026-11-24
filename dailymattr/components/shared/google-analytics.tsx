"use client"

import { useSyncExternalStore } from "react"
import Script from "next/script"

import { getCookieConsent, subscribeToCookieConsent } from "./cookie-consent"

/** Google Analytics 4 property for dailymattr.com. */
const GA_MEASUREMENT_ID = "G-JBLS1RTH1N"

/**
 * The Google tag (gtag.js), loaded only after the visitor picks "Accept all" in the cookie
 * popup (cookie-consent.tsx), which promises optional cookies only with their OK. Until
 * then nothing is sent to Google. It loads the moment they accept, no reload needed.
 * GA4's enhanced measurement records the client-side page changes itself.
 */
export function GoogleAnalytics() {
  // On the server (and during hydration) there's no saved choice yet, so nothing renders.
  const consent = useSyncExternalStore(subscribeToCookieConsent, getCookieConsent, () => null)
  if (consent !== "all") return null

  return (
    <>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
