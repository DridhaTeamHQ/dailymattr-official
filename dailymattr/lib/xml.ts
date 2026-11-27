/** Escapes text for an XML element (sitemaps). */
export const xmlEscape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

/**
 * CDN cache times for the sitemaps, as on the old site: the 48-hour Google News sitemap and
 * the current month change all the time, past months never.
 */
const CACHE = {
  pages: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  index: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  news: "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
  monthCurrent: "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600",
  monthPast: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
} as const

export function xmlResponse(body: string, cache: keyof typeof CACHE) {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": CACHE[cache] },
  })
}
