import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/newsletter")

/** /newsletter (navbar and footer "Subscribe to newsletter"): empty until the page is built (PAGE-SLUGS.md). */
export default function NewsletterPage() {
  return <EmptyPage title="Newsletter" />
}
