import { NextResponse, type NextRequest } from "next/server"

import { storeFor } from "@/lib/store-link"

/*
 * /download is the one link everyone shares (the app's referral invites, "Get the app" across
 * the site). Ported from the old site's api/download.js: phones are sent straight to their
 * store, so a tap on a shared link opens the App Store or Google Play with no page in between.
 * Referral credit comes from the friend typing the code into the app, so the link carries none.
 *
 * - iPhone / iPad / iPod: 302 to the App Store. It has to be a server-side redirect: iOS will
 *   not hand a script redirect (location.href = ...) to the App Store.
 * - Android: 302 to Google Play.
 * - Link-preview bots (WhatsApp, Telegram, ...) and desktops get the /download page, so a
 *   shared link shows a card and a laptop gets store badges and a QR code to scan.
 *
 * Unlike the old site, a Mac is not sent to the App Store: the app is for phones, so a Mac
 * sees the page. An iPad in desktop mode reports itself as a Mac, so the server can't tell it
 * apart; the page spots its touch screen and sends it on (components/download/store-redirect.tsx).
 */

const PREVIEW_BOT = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|discordbot|linkedinbot/i

/** The answer depends on who is asking, so no shared cache may keep it. */
const noSharedCache = { "Cache-Control": "no-store", Vary: "User-Agent" }

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? ""
  const store = PREVIEW_BOT.test(ua) ? null : storeFor(ua)

  if (!store) return NextResponse.next()

  // A tap on a <Link href="/download"> (or its prefetch) fetches the page's RSC payload with
  // fetch(), which the browser marks Sec-Fetch-Dest: empty (Next strips its own RSC headers
  // before the proxy runs). A redirect to a store would fail there (cross-origin), so answer
  // with an empty response: the router then loads /download as a full page, which gets the
  // 302 below. Browsers that don't send the header get the 302 here; the router's fetch fails
  // and it falls back to the same full page load.
  if (request.headers.get("sec-fetch-dest") === "empty") {
    return new NextResponse(null, { status: 204, headers: noSharedCache })
  }

  return NextResponse.redirect(store, { status: 302, headers: noSharedCache })
}

export const config = {
  matcher: "/download",
}
