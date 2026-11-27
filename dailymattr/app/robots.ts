import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/**
 * /robots.txt, the old site's rules: crawl everything but the API, and list its three
 * sitemaps (static pages, the monthly news archive index, and the 48-hour Google News
 * sitemap, which isn't in the index so new stories are found within minutes).
 *
 * Don't block /_next/ (scripts and styles Google needs to render the pages), news pages,
 * pagination or images. Date-filtered news pages (?date=) stay crawlable so search engines
 * can read their noindex tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/__save"] },
    sitemap: [`${site.url}/sitemap-pages.xml`, `${site.url}/news/sitemap-index.xml`, `${site.url}/news/sitemap.xml`],
  }
}
