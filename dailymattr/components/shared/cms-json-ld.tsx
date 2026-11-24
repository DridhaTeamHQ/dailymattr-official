import { getCmsSeo } from "@/lib/cms"
import { jsonLdHtml } from "@/lib/site"

import { PageJsonLd } from "./page-json-ld"

/**
 * Per-page structured data (JSON-LD) set in the CMS. Rendered once in the root layout:
 * it hands the client the JSON-LD of every page that has one, and PageJsonLd picks the
 * current page's, so no page file needs its own tag.
 */
export async function CmsJsonLd() {
  const { pages } = await getCmsSeo()
  const scripts = Object.fromEntries(
    Object.entries(pages)
      .filter(([, page]) => page.jsonLd != null)
      .map(([path, page]) => [path, jsonLdHtml(page.jsonLd)])
  )
  if (Object.keys(scripts).length === 0) return null
  return <PageJsonLd scripts={scripts} />
}
