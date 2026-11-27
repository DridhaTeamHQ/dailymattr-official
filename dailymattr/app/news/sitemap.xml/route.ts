import { getNewsSitemapStories } from "@/lib/news"
import { absoluteUrl, site } from "@/lib/site"
import { xmlEscape, xmlResponse } from "@/lib/xml"

/**
 * /news/sitemap.xml, the Google News sitemap: stories from the last 48 hours, as on the old
 * site. It isn't in the sitemap index (every story is already in its month's archive);
 * robots.txt lists it so new stories are found within minutes.
 */
export async function GET() {
  const stories = await getNewsSitemapStories()
  const urls = stories
    .map(
      (s) => `  <url>
    <loc>${xmlEscape(absoluteUrl(`/news/${s.slug}`))}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(site.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${s.publishedAt}</news:publication_date>
      <news:title>${xmlEscape(s.headline)}</news:title>
    </news:news>
  </url>\n`
    )
    .join("")
  return xmlResponse(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${urls}</urlset>\n`,
    "news"
  )
}
