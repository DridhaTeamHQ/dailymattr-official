import { pageJsonLd } from "@/lib/seo"
import { jsonLdHtml } from "@/lib/site"

/** A structured-data block. Already escaped by jsonLdHtml(); React renders it as is. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }} />
}

/**
 * A page's own structured data from its SEO entry (pageJsonLd in lib/seo.ts): WebPage and
 * breadcrumb, like the old site. Put it in the page with the path its SEO is keyed by:
 *
 *   <SeoJsonLd path="/about" />
 */
export async function SeoJsonLd({ path }: { path: string }) {
  const data = await pageJsonLd(path)
  return data ? <JsonLd data={data} /> : null
}
