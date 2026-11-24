"use client"

import { usePathname } from "next/navigation"

/** The current page's JSON-LD from the CMS (see cms-json-ld.tsx), keyed by path. */
export function PageJsonLd({ scripts }: { scripts: Record<string, string> }) {
  const pathname = usePathname()
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  const html = scripts[path]
  // Already escaped by jsonLdHtml(). A data block, so React renders it without warnings.
  return html ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: html }} /> : null
}
