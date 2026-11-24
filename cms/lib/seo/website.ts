import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import type { WebsiteDefaults } from "./fields"

/**
 * WEBSITE_URL: the dailymattr website's address, e.g. http://localhost:3000 in dev and
 * https://dailymattr-new.vercel.app when deployed. Several addresses can be given,
 * comma-separated (say the Vercel address and the real domain): the first is where the
 * CMS reads the SEO defaults, and every one is refreshed after a save.
 */
export const websiteUrls = (process.env.WEBSITE_URL ?? "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean)

export const websiteUrl = websiteUrls[0] ?? ""

const example = "https://dailymattr-new.vercel.app"

/** A setup mistake that stops the CMS reaching the website, in plain words, or null. */
export function websiteSetupProblem(): string | null {
  if (!websiteUrl) {
    return `WEBSITE_URL isn't set for the CMS. Set it to the website's address, e.g. ${example}, and redeploy.`
  }
  for (const url of websiteUrls) {
    try {
      new URL(url)
    } catch {
      return `WEBSITE_URL contains "${url}", which isn't a web address. Use the full address, e.g. ${example}.`
    }
    // On Vercel, localhost is the Vercel server itself, not the website.
    if (process.env.VERCEL && /\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url)) {
      return `WEBSITE_URL is ${url}, which only works on your own computer. In the CMS's Vercel project settings, set WEBSITE_URL to the website's address (e.g. ${example}) and redeploy.`
    }
  }
  return null
}

/**
 * The website's own SEO defaults, from its GET /api/seo/defaults. They live in the
 * website's code (dailymattr/lib/seo.ts and lib/site.ts), so the CMS only reads them.
 * Throws when the website can't be reached; pages show a notice instead.
 */
export async function getWebsiteDefaults(): Promise<WebsiteDefaults> {
  "use cache"
  cacheLife("minutes")
  cacheTag("website-defaults")

  const res = await fetch(`${websiteUrl}/api/seo/defaults`, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`The website answered ${res.status} for /api/seo/defaults.`)
  const data = (await res.json()) as WebsiteDefaults
  if (!data?.site || !Array.isArray(data.pages)) throw new Error("The website's /api/seo/defaults isn't in the expected format.")
  return data
}

/**
 * Tells each website address to drop its cached SEO data (POST), then waits while it
 * reads the new data from the database (GET), so the very next page shows the change.
 * Returns false when any address couldn't be refreshed; it then picks the change up on
 * its own within a minute or so.
 */
export async function notifyWebsite(): Promise<boolean> {
  const secret = process.env.WEBSITE_REVALIDATE_SECRET
  if (!websiteUrls.length || !secret || websiteSetupProblem()) return false

  const refresh = async (url: string) => {
    const call = (method: "POST" | "GET") =>
      fetch(`${url}/api/revalidate`, {
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

  const results = await Promise.all(websiteUrls.map(refresh))
  return results.every(Boolean)
}
