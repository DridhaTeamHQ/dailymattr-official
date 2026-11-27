import { notFound, permanentRedirect } from "next/navigation"

import { getStories, getStory } from "@/lib/news"
import { seoMetadata } from "@/lib/seo"

import { getNewsCategory, newsCategories, newsPath } from "@/components/news/content"
import { parseNewsQuery } from "@/components/news/news-list"
import { newsListMetadata, storyJsonLd, storySeo } from "@/components/news/seo"
import { NewsPageView } from "@/components/news/sections"
import { JsonLd } from "@/components/shared/seo-json-ld"
import { StoryPageView } from "@/components/news/story-page"
import { storyIdFromSlug } from "@/components/news/stories"

/**
 * Navigations here may block (instant-navigation validation, cacheComponents): the page awaits
 * params at the top so an unknown slug is a real 404, which leaves no params-free App Shell to
 * show first. Every section and the latest stories are prerendered below; any other story is
 * rendered on its first visit and cached from then on.
 */
export const instant = false

/** How many of the newest stories to prerender at build time. */
const PRERENDERED_STORIES = 40

/** Prerender every section page and the newest story pages. */
export async function generateStaticParams() {
  const stories = await getStories()
  return [
    ...newsCategories.map((c) => ({ slug: c.slug })),
    ...stories.slice(0, PRERENDERED_STORIES).map((s) => ({ slug: s.slug })),
  ]
}

export async function generateMetadata({ params, searchParams }: PageProps<"/news/[slug]">) {
  const { slug } = await params
  if (getNewsCategory(slug)) return newsListMetadata(newsPath(slug), parseNewsQuery(await searchParams))
  const id = storyIdFromSlug(slug)
  const found = id ? await getStory(id) : null
  if (!found) return seoMetadata(newsPath(slug))
  // A story's own SEO, built like the old site's story pages (components/news/seo.ts),
  // unless the CMS sets others.
  return seoMetadata(newsPath(found.story.slug), await storySeo(found))
}

/**
 * /news/<slug>: a section's stories (/news/india, paged with ?page= and ?date= like /news) or
 * one story (/news/<headline>-<Pix ID>), the same URLs as the old site. Sections and stories
 * share the segment, so the slug decides which; a story is looked up by the Pix ID at the end
 * of its slug.
 */
export default async function NewsSlugPage({ params, searchParams }: PageProps<"/news/[slug]">) {
  const { slug } = await params
  const category = getNewsCategory(slug)
  if (category) return <NewsPageView category={category} searchParams={searchParams} />

  const id = storyIdFromSlug(slug)
  const [found, stories] = await Promise.all([id ? getStory(id) : null, getStories()])
  if (!found) notFound()
  // One URL per story, as on the old site: an old or mistyped headline part redirects to it.
  if (slug !== found.story.slug) permanentRedirect(`/news/${found.story.slug}`)
  return (
    <>
      <JsonLd data={storyJsonLd(found)} />
      <StoryPageView story={found.story} body={found.body} stories={stories} />
    </>
  )
}
