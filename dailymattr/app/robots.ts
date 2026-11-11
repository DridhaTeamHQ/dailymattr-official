import type { MetadataRoute } from "next"

import { site } from "@/lib/site"

/** /robots.txt: crawl everything except Next's internals, and point crawlers at the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/_next/", "/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
