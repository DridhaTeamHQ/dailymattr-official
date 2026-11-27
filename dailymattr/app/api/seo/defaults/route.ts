import { defaultSeo } from "@/lib/seo"
import { siteSeoDefaults } from "@/lib/site-seo"

/**
 * GET /api/seo/defaults: the SEO defaults in this site's code, without CMS overrides.
 * The CMS reads it to list every page and show what each field falls back to. Public on
 * purpose: it holds the same titles and descriptions that are in the pages' HTML.
 */
export async function GET() {
  return Response.json({
    site: siteSeoDefaults,
    pages: Object.entries(defaultSeo).map(([path, seo]) => ({
      path,
      title: seo.title,
      absoluteTitle: seo.absoluteTitle,
      description: seo.description,
      image: seo.image,
      noindex: seo.noindex,
      priority: seo.priority,
      changeFrequency: seo.changeFrequency,
    })),
  })
}
