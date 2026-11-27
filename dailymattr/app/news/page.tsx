import { NewsPageView } from "@/components/news/sections"
import { parseNewsQuery } from "@/components/news/news-list"
import { newsListMetadata } from "@/components/news/seo"

export async function generateMetadata({ searchParams }: PageProps<"/news">) {
  return newsListMetadata("/news", parseNewsQuery(await searchParams))
}

/**
 * /news/: Latest news, every section's stories, from the Pix database (lib/news.ts), one page
 * at a time: /news/page/2/ (proxy.ts passes the number as ?page=), and ?date=YYYY-MM-DD for
 * one day, the old site's URLs.
 */
export default function NewsPage({ searchParams }: PageProps<"/news">) {
  return <NewsPageView searchParams={searchParams} />
}
