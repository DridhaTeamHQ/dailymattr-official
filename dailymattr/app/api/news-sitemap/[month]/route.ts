import { FIRST_SITEMAP_MONTH, getMonthSitemapStories } from "@/lib/news"
import { absoluteUrl } from "@/lib/site"
import { xmlEscape, xmlResponse } from "@/lib/xml"

/**
 * One month's archive sitemap, served at the old site's URL /news/sitemap-YYYY-MM.xml
 * (next.config.ts rewrites it here): every story published that month (UTC), newest change
 * first, each with its lastmod. Months outside the first live month to this one are a 404.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/news-sitemap/[month]">) {
  const { month: ym } = await params
  const match = /^(\d{4})-(\d{2})$/.exec(ym)
  const now = new Date()
  const key = match ? Number(match[1]) * 12 + Number(match[2]) : 0
  const month = match ? Number(match[2]) : 0
  if (
    !match ||
    month < 1 ||
    month > 12 ||
    key < FIRST_SITEMAP_MONTH.year * 12 + FIRST_SITEMAP_MONTH.month ||
    key > now.getUTCFullYear() * 12 + now.getUTCMonth() + 1
  ) {
    return new Response("Not found\n", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  const current = key === now.getUTCFullYear() * 12 + now.getUTCMonth() + 1
  const stories = await getMonthSitemapStories(Number(match[1]), month)
  const urls = stories
    .map((s) => `  <url>\n    <loc>${xmlEscape(absoluteUrl(`/news/${s.slug}`))}</loc>\n    <lastmod>${s.modifiedAt}</lastmod>\n  </url>\n`)
    .join("")
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`, current ? "monthCurrent" : "monthPast")
}
