import { getSeoRoutes } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { canonicalPath } from "@/lib/urls"
import { xmlEscape, xmlResponse } from "@/lib/xml"

/**
 * /sitemap-pages.xml, the old site's sitemap of its pages (already submitted in Search
 * Console): every indexable page from the SEO source (lib/seo.ts plus pages added in the
 * CMS), at its public URL (/about/). News stories are in the news sitemaps instead
 * (app/news/sitemap-index.xml, app/news/sitemap.xml), so each URL is listed once.
 *
 * No lastmod: the dates have to be real edit dates to be of any use, and pages don't record
 * them. changefreq and priority are the CMS's sitemap hints.
 */
export async function GET() {
  const routes = (await getSeoRoutes()).filter((r) => !r.noindex && !r.canonical)
  const urls = routes
    .sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : 0))
    .map(
      (r) =>
        `  <url>\n    <loc>${xmlEscape(absoluteUrl(canonicalPath(r.path)))}</loc>\n` +
        (r.changeFrequency ? `    <changefreq>${r.changeFrequency}</changefreq>\n` : "") +
        (r.priority != null ? `    <priority>${r.priority.toFixed(1)}</priority>\n` : "") +
        `  </url>\n`
    )
    .join("")
  return xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>\n`, "pages")
}
