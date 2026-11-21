import { seoMetadata } from "@/lib/seo"

import { NewsPageView } from "@/components/news/sections"

export const generateMetadata = () => seoMetadata("/news")

/** /news: Latest news, every section's stories. UI only on sample stories (components/news/stories.ts). */
export default function NewsPage() {
  return <NewsPageView />
}
