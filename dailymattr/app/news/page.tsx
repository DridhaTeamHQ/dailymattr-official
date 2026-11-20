import { seoMetadata } from "@/lib/seo"

import { EmptyPage } from "@/components/shared/empty-page"

export const generateMetadata = () => seoMetadata("/news")

/** /news: empty until the Latest News page is built (PAGE-SLUGS.md). */
export default function NewsPage() {
  return <EmptyPage title="Latest News" />
}
