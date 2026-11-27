import { NextResponse, type NextRequest } from "next/server"

import { storeFor } from "@/lib/store-link"
import { isStoryPath } from "@/lib/urls"

/*
 * Two jobs, both from the old site:
 *
 * 1. /download, the one link everyone shares (the app's referral invites, "Get the app" across
 *    the site). Ported from the old site's api/download.js: phones are sent straight to their
 *    store, so a tap on a shared link opens the App Store or Google Play with no page in
 *    between. Referral credit comes from the friend typing the code into the app, so the link
 *    carries none.
 *
 *    - iPhone / iPad / iPod: 302 to the App Store. It has to be a server-side redirect: iOS will
 *      not hand a script redirect (location.href = ...) to the App Store.
 *    - Android: 302 to Google Play.
 *    - Link-preview bots (WhatsApp, Telegram, ...) and desktops get the /download page, so a
 *      shared link shows a card and a laptop gets store badges and a QR code to scan.
 *
 *    Unlike the old site, a Mac is not sent to the App Store: the app is for phones, so a Mac
 *    sees the page. An iPad in desktop mode reports itself as a Mac, so the server can't tell it
 *    apart; the page spots its touch screen and sends it on (components/download/store-redirect.tsx).
 *
 * 2. The old site's URL forms, so every URL search engines know keeps working and each page has
 *    one address (next.config.ts turns Next's own trailing-slash redirects off for this):
 *    - pages end in a slash: /about -> /about/ (308)
 *    - story pages don't: /news/<headline>-<id>/ -> /news/<headline>-<id> (308)
 *    - news lists page with /page/N/: /news/?page=2 -> /news/page/2/ (308), and /news/page/2/
 *      is served by the /news page as ?page=2 (a rewrite); /news/page/1/ -> /news/.
 */

const PREVIEW_BOT = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|discordbot|linkedinbot/i

/** The answer depends on who is asking, so no shared cache may keep it. */
const noSharedCache = { "Cache-Control": "no-store", Vary: "User-Agent" }

/** /news/, /news/india/ (with or without the slash). */
const NEWS_LIST = /^\/news(?:\/([a-z]{2,30}))?\/?$/
/** /news/page/2/, /news/india/page/2/ (with or without the slash). */
const NEWS_LIST_PAGE = /^\/news(?:\/([a-z]{2,30}))?\/page\/(\d{1,6})(\/?)$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === "/download") return download(request)
  return oldSiteUrls(request)
}

function download(request: NextRequest) {
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

function oldSiteUrls(request: NextRequest) {
  const url = request.nextUrl
  const { pathname, searchParams } = url
  // Client-side fetches (prefetches and navigations) aren't redirected: the site's links are
  // already in the right form, and a redirected fetch can't change the address bar.
  const isFetch = request.headers.get("sec-fetch-dest") === "empty"
  const moved = (path: string, query = searchParams) => {
    if (isFetch) return NextResponse.next()
    // A plain URL: a clone of nextUrl would put the request's own trailing slash back.
    const target = new URL(request.url)
    target.pathname = path
    target.search = query.toString()
    return NextResponse.redirect(target, 308)
  }

  // /news/page/N/: the list page, given the page number as ?page=N.
  const paged = NEWS_LIST_PAGE.exec(pathname)
  if (paged) {
    const [, section, digits, slash] = paged
    const base = section ? `/news/${section}/` : "/news/"
    const n = Number(digits)
    if (n <= 1) return moved(base)
    if (!slash || digits !== String(n)) return moved(`${base}page/${n}/`)
    const target = url.clone()
    target.pathname = section ? `/news/${section}` : "/news"
    target.searchParams.set("page", String(n))
    return NextResponse.rewrite(target)
  }

  // /news/?page=N (the new site's earlier form) -> /news/page/N/
  const list = NEWS_LIST.exec(pathname)
  if (list && searchParams.has("page")) {
    const base = list[1] ? `/news/${list[1]}/` : "/news/"
    const n = Number.parseInt(searchParams.get("page") ?? "", 10)
    const query = new URLSearchParams(searchParams)
    query.delete("page")
    return moved(Number.isFinite(n) && n > 1 ? `${base}page/${n}/` : base, query)
  }

  if (pathname === "/") return NextResponse.next()
  const bare = pathname.replace(/\/+$/, "")
  // Story pages and /download (the shared app link) have no trailing slash.
  if (isStoryPath(bare) || bare === "/download") return pathname === bare ? NextResponse.next() : moved(bare)
  return pathname.endsWith("/") && !pathname.endsWith("//") ? NextResponse.next() : moved(`${bare}/`)
}

export const config = {
  // Pages only: not Next's own files (/_next, /__nextjs...), the API, app-link files, the
  // app's shared story links (/s/...), or files (anything with an extension).
  matcher: ["/((?!_next/|__|api/|\\.well-known/|s/|.*\\.[A-Za-z0-9]+$).*)"],
}
