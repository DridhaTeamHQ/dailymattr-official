import { seoMetadata } from "@/lib/seo"

import { NewsPageView } from "@/components/news/sections"

export const generateMetadata = () => seoMetadata("/news")

/**
 * /news: Latest news, every section's stories, from the Pix database (lib/news.ts), one page
 * at a time: ?page=2, and ?date=YYYY-MM-DD for one day.
 */
export default function NewsPage({ searchParams }: PageProps<"/news">) {
  return <NewsPageView searchParams={searchParams} />
}
