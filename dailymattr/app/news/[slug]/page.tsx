import { notFound } from "next/navigation"

import { seoMetadata } from "@/lib/seo"

import { getNewsCategory, newsCategories, newsPath } from "@/components/news/content"
import { NewsPageView } from "@/components/news/sections"
import { StoryPageView } from "@/components/news/story-page"
import { getStory, stories } from "@/components/news/stories"

/**
 * Navigations here may block (instant-navigation validation, cacheComponents): the page awaits
 * params at the top so an unknown slug is a real 404, which leaves no params-free App Shell to
 * show first. Every section and story is prerendered below, so a navigation only waits on a
 * static payload.
 */
export const instant = false

/** Prerender every section page and every story page. */
export function generateStaticParams() {
  return [...newsCategories.map((c) => ({ slug: c.slug })), ...stories.map((s) => ({ slug: s.slug }))]
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params
  return seoMetadata(newsPath(slug))
}

/**
 * /news/<slug>: a section's stories (/news/india) or one story (/news/<story-slug>), the same
 * URLs as the old site. Sections and stories share the segment, so the slug decides which.
 */
export default async function NewsSlugPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params
  const category = getNewsCategory(slug)
  if (category) return <NewsPageView category={category} />
  const story = getStory(slug)
  if (story) return <StoryPageView story={story} />
  notFound()
}
