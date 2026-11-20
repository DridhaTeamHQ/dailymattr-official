import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/support")

/** /support (the footer's Contact link): empty until the Support page is built (PAGE-SLUGS.md). */
export default function SupportPage() {
  return <EmptyPage title="Support" />
}
