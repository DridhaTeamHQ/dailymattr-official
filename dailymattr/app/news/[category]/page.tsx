import { notFound } from "next/navigation"

import { seoMetadata } from "@/lib/seo"

import { getNewsCategory, newsCategories, newsPath } from "@/components/news/content"
import { EmptyPage } from "@/components/shared/empty-page"

/** Prerender one page per news category. */
export function generateStaticParams() {
  return newsCategories.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: PageProps<"/news/[category]">) {
  const { category } = await params
  return seoMetadata(newsPath(category))
}

/**
 * /news/<category>: empty until the category pages are built (PAGE-SLUGS.md). Params are awaited
 * at the top (allowed with generateStaticParams), so an unknown category returns a real 404.
 */
export default async function NewsCategoryPage({ params }: PageProps<"/news/[category]">) {
  const { category } = await params
  const entry = getNewsCategory(category)
  if (!entry) notFound()
  return <EmptyPage title={entry.title} />
}
