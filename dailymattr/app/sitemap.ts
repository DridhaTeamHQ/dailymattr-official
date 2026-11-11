import type { MetadataRoute } from "next"

import { getSeoRoutes } from "@/lib/seo"
import { site } from "@/lib/site"

/** /sitemap.xml: every indexable page from the SEO source (lib/seo.ts, later the CMS). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const routes = await getSeoRoutes()
  return routes
    .filter((r) => !r.noindex)
    .map((r) => ({
      url: `${site.url}${r.path === "/" ? "" : r.path}`,
      lastModified,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    }))
}
