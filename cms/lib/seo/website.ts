import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import type { WebsiteDefaults } from "./fields"

/** The dailymattr website (WEBSITE_URL in .env), e.g. http://localhost:3000 in dev. */
export const websiteUrl = (process.env.WEBSITE_URL ?? "").replace(/\/$/, "")

/**
 * The website's own SEO defaults, from its GET /api/seo/defaults. They live in the
 * website's code (dailymattr/lib/seo.ts and lib/site.ts), so the CMS only reads them.
 * Throws when the website can't be reached; pages show a notice instead.
 */
export async function getWebsiteDefaults(): Promise<WebsiteDefaults> {
  "use cache"
  cacheLife("minutes")
  cacheTag("website-defaults")

  if (!websiteUrl) throw new Error("WEBSITE_URL isn't set in the CMS .env file.")
  const res = await fetch(`${websiteUrl}/api/seo/defaults`, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`The website answered ${res.status} for /api/seo/defaults.`)
  return res.json()
}

/**
 * Tells the website to drop its cached SEO data (POST), then waits while it reads the new
 * data from the database (GET), so the website's very next page shows the change.
 * Returns false when the website couldn't be reached; it then picks the change up on
 * its own within a minute or so.
 */
export async function notifyWebsite(): Promise<boolean> {
  const secret = process.env.WEBSITE_REVALIDATE_SECRET
  if (!websiteUrl || !secret) return false
  const call = (method: "POST" | "GET") =>
    fetch(`${websiteUrl}/api/revalidate`, {
      method,
      headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(8000),
    })
  try {
    const dropped = await call("POST")
    if (!dropped.ok) return false
    // Best effort: if the warm-up fails, the website still refreshes on its own.
    await call("GET").catch(() => null)
    return true
  } catch {
    return false
  }
}
