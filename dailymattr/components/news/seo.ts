import "server-only"

import type { StoryArticle } from "@/lib/news"
import { breadcrumbLd, getPageSeo, seoMetadata, type PageSeo } from "@/lib/seo"
import { getSiteSeo } from "@/lib/site-seo"
import { absoluteUrl, organizationId, organizationLd, site, websiteId } from "@/lib/site"
import { canonicalPath } from "@/lib/urls"
import { getNewsCategory, newsPath } from "./content"
import type { Story, StoryBody } from "./stories"

// Search and share tags for the news pages, built the way the old site built them
// (its api/_lib/seo.js): the list pages as CollectionPage with their stories, each story as
// a NewsArticle by the dailymattr Editorial Team.

/** The list page's place: page (1 = first) and day filter (YYYY-MM-DD or ""). */
export type NewsListQuery = { page: number; date: string }

/**
 * A news list page's public URL: /news/, /news/india/, /news/page/2/, /news/india/page/3/,
 * and ?date= for one day, as on the old site. `basePath` is the route ("/news/india").
 */
export function newsListHref(basePath: string, { page, date }: NewsListQuery) {
  const base = canonicalPath(basePath)
  const path = page > 1 ? `${base}page/${page}/` : base
  return date ? `${path}?date=${date}` : path
}

const dayFormat = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" })

/** "20 November 2026" for 2026-11-20. */
export const formatNewsDay = (date: string) => dayFormat.format(new Date(`${date}T00:00:00+05:30`))

/**
 * A list page's SEO: its entry (lib/seo.ts, CMS overrides on top) with the old site's
 * changes for a page number and a day. Page 2 onwards say so in the title and description
 * and are their own canonical URL; a day's list is "noindex, follow" with the undated page
 * as its canonical.
 */
function adjustForQuery(basePath: string, { page, date }: NewsListQuery) {
  const section = getNewsCategory(basePath.split("/")[2] ?? "")
  return (seo: PageSeo): PageSeo => {
    const day = date ? formatNewsDay(date) : ""
    const description = date
      ? `Browse ${section ? section.label.toLowerCase() : "latest"} news from ${day} on ${site.name}.`
      : seo.description
    return {
      ...seo,
      title: `${seo.title}${date ? ` (${day})` : ""}${page > 1 ? ` - page ${page}` : ""}`,
      description: page > 1 ? `${description} - page ${page}` : description,
      ...(page > 1 && { canonical: newsListHref(basePath, { page, date: "" }) }),
      ...(date && { noindex: true }),
    }
  }
}

/** generateMetadata for /news and the section pages. */
export const newsListMetadata = (basePath: string, query: NewsListQuery) =>
  seoMetadata(basePath, undefined, adjustForQuery(basePath, query))

/** A list page's CollectionPage of its stories, and its breadcrumb (Home > News > Section). */
export async function newsListJsonLd(basePath: string, query: NewsListQuery, stories: Story[], pageSize: number) {
  const [pageSeo, siteSeo] = await Promise.all([getPageSeo(basePath), getSiteSeo()])
  const seo = adjustForQuery(basePath, query)(pageSeo)
  const url = absoluteUrl(seo.canonical ?? canonicalPath(basePath))
  const section = getNewsCategory(basePath.split("/")[2] ?? "")
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        name: siteSeo.titleTemplate.replace("%s", seo.title),
        description: seo.description,
        url,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        publisher: organizationLd(),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: stories.map((story, i) => ({
            "@type": "ListItem",
            position: (query.page - 1) * pageSize + i + 1,
            url: absoluteUrl(`/news/${story.slug}`),
            name: story.headline,
          })),
        },
      },
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "News", path: "/news" },
        ...(section ? [{ name: section.label, path: newsPath(section.slug) }] : []),
      ]),
    ],
  }
}

/** Cuts text at a word to at most `max` characters, ending with an ellipsis (old site's rule). */
export function truncateAtWord(text: string, max: number) {
  const s = text.trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "))
  return (end > max * 0.6 ? cut.slice(0, end) : cut).replace(/[\s,;:\-\u2013\u2014]+$/, "") + "…"
}

type FoundStory = { story: Story; body: StoryBody; article: StoryArticle }

/** The story's meta description: its key points, cut at a word to about 155 characters. */
const storyDescription = ({ story, body }: FoundStory) => truncateAtWord(body.points.join(" "), 155) || story.headline

/**
 * A story page's SEO defaults (the CMS can still override them): "<headline> | dailymattr"
 * as the title, the bare headline on share cards, the key points as the description, the
 * first Pix slide as the share image, and the article dates and section.
 */
export async function storySeo(found: FoundStory): Promise<PageSeo> {
  const { story, article } = found
  const siteSeo = await getSiteSeo()
  const section = story.category ? getNewsCategory(story.category) : undefined
  return {
    title: `${story.headline} | ${siteSeo.name}`,
    absoluteTitle: true,
    ogTitle: story.headline,
    description: storyDescription(found),
    ...(article.shareImage && {
      image: article.shareImage.url,
      imageWidth: article.shareImage.width,
      imageHeight: article.shareImage.height,
      imageAlt: story.headline,
    }),
    ogType: "article",
    article: { publishedTime: article.publishedAt, modifiedTime: article.modifiedAt, section: section?.label },
  }
}

/**
 * A story's structured data, as on the old site: its WebPage, the NewsArticle (the key
 * points are the article body; the source it summarises is isBasedOn and citation; the
 * author is the Editorial Team desk, the same byline the page shows) and its breadcrumb
 * (Home > News > Section > headline).
 */
export function storyJsonLd(found: FoundStory) {
  const { story, body, article } = found
  const url = absoluteUrl(`/news/${story.slug}`)
  const section = story.category ? getNewsCategory(story.category) : undefined
  const description = storyDescription(found)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: story.headline,
        description,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": `${url}#article` },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "NewsArticle",
        "@id": `${url}#article`,
        headline: truncateAtWord(story.headline, 110),
        description,
        articleBody: body.points.join("\n"),
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished: article.publishedAt,
        dateModified: article.modifiedAt,
        inLanguage: site.language,
        isAccessibleForFree: true,
        ...(article.images.length > 0 && { image: article.images }),
        publisher: organizationLd(),
        author: { "@type": "Organization", name: site.editorialTeam.name },
        ...(section && { articleSection: section.label }),
        ...(body.source && { isBasedOn: body.source.url, citation: body.source.url }),
      },
      breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "News", path: "/news" },
        ...(section ? [{ name: section.label, path: newsPath(section.slug) }] : []),
        { name: truncateAtWord(story.headline, 60), path: `/news/${story.slug}` },
      ]),
    ],
  }
}
