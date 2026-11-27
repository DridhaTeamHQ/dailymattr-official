import { FIRST_SITEMAP_MONTH } from "@/lib/news"
import { absoluteUrl } from "@/lib/site"
import { xmlEscape, xmlResponse } from "@/lib/xml"

/**
 * /news/sitemap-index.xml, as on the old site: one archive sitemap per month
 * (/news/sitemap-YYYY-MM.xml, app/api/news-sitemap/[month]), newest month first, from the
 * first month with live stories to this one. Each story is in exactly one of them.
 */
export async function GET() {
  const now = new Date()
  const months: string[] = []
  for (let y = now.getUTCFullYear(), m = now.getUTCMonth() + 1; y * 12 + m >= FIRST_SITEMAP_MONTH.year * 12 + FIRST_SITEMAP_MONTH.month; m--) {
    if (m === 0) {
      y--
      m = 12
    }
    months.push(`${y}-${String(m).padStart(2, "0")}`)
  }
  const entries = months
    .map((ym) => `  <sitemap><loc>${xmlEscape(absoluteUrl(`/news/sitemap-${ym}.xml`))}</loc></sitemap>\n`)
    .join("")
  return xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}</sitemapindex>\n`, "index")
}
