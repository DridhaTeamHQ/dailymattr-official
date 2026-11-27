import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import { Pool } from "pg"

import { isMediaImage, type Story, type StoryBody } from "@/components/news/stories"
import { getPrisma } from "./db"

/**
 * The /news pages' stories, read from the Pix database (Supabase project "PixAgent", table
 * pix_posts): every published Pix story, newest first, except the ones hidden with the
 * Customize button on the CMS's News page (the CMS database's news_visibility table).
 *
 * - PIX_DATABASE_URL: the Pix database as the read-only dailymattr_reader role, which can
 *   only read published, non-rejected stories. Unset = the news pages show no stories.
 * - DATABASE_URL: the CMS database (lib/db.ts), for the hidden stories.
 *
 * Both reads are cached for a few minutes, so new Pix stories appear within minutes, and a
 * show / hide in the CMS applies at once: the CMS calls app/api/revalidate after each change.
 */

/** Cache tag the CMS revalidates after a story is shown or hidden. */
export const CMS_NEWS_TAG = "cms-news"

/**
 * How many of the latest stories getStories() returns: for story pages (previous, older and
 * more stories) and prerendering. The news list itself pages through all of them (getNewsPage).
 */
const LIST_SIZE = 400

/** Pix section (pix_posts.category_id) → this site's news section (components/news/content.ts). */
const sectionByPixCategory: Record<number, string> = {
  1: "world",
  2: "india",
  3: "business",
  4: "entertainment",
  6: "sports",
  8: "states",
  11: "lifestyle",
  15: "technology",
}

// One small pool per server process (kept on globalThis across dev hot reloads), through
// Supabase's transaction pooler.
const globalForPix = globalThis as unknown as { pixPool?: { url: string; pool: Pool } }

function getPixPool(): Pool | null {
  const url = process.env.PIX_DATABASE_URL
  if (!url) return null
  const cached = globalForPix.pixPool
  if (cached && cached.url === url) return cached.pool
  cached?.pool.end().catch(() => {})
  const pool = new Pool({ connectionString: url, max: 3, idleTimeoutMillis: 10_000 })
  globalForPix.pixPool = { url, pool }
  return pool
}

type PixRow = {
  id: string
  published_id: string
  headline: string | null
  main_image_url: string | null
  category_id: number | null
  published_at: Date
}

type PixStoryRow = PixRow & { detail_body: string | null; summary: string | null; source_url: string | null }

const LIST_COLUMNS = "id, published_id, headline, main_image_url, category_id, published_at"

/**
 * A story is on the website, as on the old site, once it has a numeric Pix ID, its publish
 * time has passed and its headline has a letter or digit (the headline-less "Daily Wrap"
 * cards are app-only). The dailymattr_reader role only sees published, non-rejected rows.
 */
const LIVE = "published_id ~ '^[0-9]+$' and published_at <= now() and headline ~ '[[:alnum:]]'"

// The last good reads, so a short database outage keeps the news up (best effort, per instance).
let lastStories: Story[] | null = null
let lastHidden: string[] | null = null

/**
 * The Pix ids (pix_posts.id) hidden in the CMS. No CMS database configured = nothing hidden.
 * If the CMS database can't be read, the last good list is used; with none, this throws, so
 * a hidden story is never shown by mistake.
 */
async function getHiddenIds(): Promise<string[]> {
  const prisma = getPrisma()
  if (!prisma) return []
  try {
    const rows = await prisma.newsVisibility.findMany({ where: { showOnWebsite: false }, select: { postId: true } })
    lastHidden = rows.map((row) => row.postId)
    return lastHidden
  } catch (error) {
    if (lastHidden) return lastHidden
    throw error
  }
}

/** The latest stories, newest first (see LIST_SIZE). */
export async function getStories(): Promise<Story[]> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool) return []
  try {
    const hidden = await getHiddenIds()
    const { rows } = await pool.query<PixRow>(
      `select ${LIST_COLUMNS} from pix_posts
        where ${LIVE} and not (id = any($1::uuid[]))
        order by published_at desc, id desc
        limit $2`,
      [hidden, LIST_SIZE]
    )
    lastStories = rows.map(toStory)
    return lastStories
  } catch (error) {
    console.warn(`[news] Couldn't read the stories, ${lastStories ? "using the last copy" : "showing none"}:`, error)
    return lastStories ?? []
  }
}

/** Stories per page on /news and the section pages (whole rows at four and five columns). */
export const NEWS_PAGE_SIZE = 20

/**
 * One page of the news list (?page=), newest first, for a section (/news/<section>) or every
 * section, and optionally one day (?date=YYYY-MM-DD, India time). Pages through every
 * published Pix story, not only the latest ones. `total` counts every matching story.
 */
export async function getNewsPage({
  category,
  date,
  page,
}: {
  category?: string
  date?: string
  page: number
}): Promise<{ stories: Story[]; total: number }> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool) return { stories: [], total: 0 }
  try {
    const hidden = await getHiddenIds()
    const params: unknown[] = [hidden]
    const clauses = [LIVE, "not (id = any($1::uuid[]))"]
    if (category) {
      params.push(pixCategoriesFor(category))
      clauses.push(`category_id = any($${params.length}::int[])`)
    }
    if (date) {
      params.push(date)
      clauses.push(`(published_at at time zone 'Asia/Kolkata')::date = $${params.length}::date`)
    }
    const where = clauses.join(" and ")
    const offset = (Math.max(1, Math.floor(page)) - 1) * NEWS_PAGE_SIZE

    const [count, list] = await Promise.all([
      pool.query<{ n: number }>(`select count(*)::int as n from pix_posts where ${where}`, params),
      pool.query<PixRow>(
        `select ${LIST_COLUMNS} from pix_posts where ${where}
          order by published_at desc, id desc
          limit ${NEWS_PAGE_SIZE} offset ${offset}`,
        params
      ),
    ])
    return { stories: list.rows.map(toStory), total: count.rows[0]?.n ?? 0 }
  } catch (error) {
    console.warn("[news] Couldn't read a page of stories:", error)
    return { stories: [], total: 0 }
  }
}

/** One rendered Pix page (a 9:16 slide image) of a story. */
export type PixSlide = { url: string; width: number; height: number; alt: string }

export type PixShowcaseItem = { story: Story; slides: PixSlide[] }

/** The sections the Pix page's "Real stories" row shows, one story each, in this order. */
const SHOWCASE_SECTIONS = ["world", "business", "entertainment", "sports"]

/**
 * The Pix page's "Real stories" row: the newest visible story from each of SHOWCASE_SECTIONS
 * that has its rendered Pix slides (pix_posts.web_pages: the cover with the headline, then
 * the key points). Empty when the Pix database can't be read; the row then keeps its
 * placeholder cards.
 */
export async function getPixShowcase(): Promise<PixShowcaseItem[]> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool) return []
  try {
    const hidden = await getHiddenIds()
    const { rows } = await pool.query<PixStoryRow & { web_pages: unknown }>(
      `select distinct on (category_id) ${LIST_COLUMNS}, detail_body, summary, source_url, web_pages
         from pix_posts
        where ${LIVE} and not (id = any($1::uuid[]))
          and category_id = any($2::int[])
          and jsonb_typeof(web_pages) = 'array' and jsonb_array_length(web_pages) > 0
          and published_at > now() - interval '30 days'
        order by category_id, published_at desc`,
      [hidden, SHOWCASE_SECTIONS.flatMap(pixCategoriesFor)]
    )
    return rows
      .map(toShowcaseItem)
      .filter((item) => item.slides.length > 0)
      .sort((a, b) => SHOWCASE_SECTIONS.indexOf(a.story.category ?? "") - SHOWCASE_SECTIONS.indexOf(b.story.category ?? ""))
  } catch (error) {
    console.warn("[news] Couldn't read the Pix showcase:", error)
    return []
  }
}

/** How many Pix the home page's "Happening now" row shows. */
const LATEST_PIX = 12

/**
 * The home page's "Happening now" row: the newest visible stories from every section that
 * have their rendered Pix slides. Empty when the Pix database can't be read; the row then
 * keeps its design cards.
 */
export async function getLatestPix(): Promise<PixShowcaseItem[]> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool) return []
  try {
    const hidden = await getHiddenIds()
    // A few spare rows, in case some stories' slides aren't in the Pix media bucket.
    const { rows } = await pool.query<PixStoryRow & { web_pages: unknown }>(
      `select ${LIST_COLUMNS}, detail_body, summary, source_url, web_pages
         from pix_posts
        where ${LIVE} and not (id = any($1::uuid[]))
          and jsonb_typeof(web_pages) = 'array' and jsonb_array_length(web_pages) > 0
        order by published_at desc
        limit $2`,
      [hidden, LATEST_PIX + 8]
    )
    return rows
      .map(toShowcaseItem)
      .filter((item) => item.slides.length > 0)
      .slice(0, LATEST_PIX)
  } catch (error) {
    console.warn("[news] Couldn't read the latest Pix:", error)
    return []
  }
}

function toShowcaseItem(row: PixStoryRow & { web_pages: unknown }): PixShowcaseItem {
  const story = toStory(row)
  return { story, slides: toSlides(row.web_pages, story.headline, toBody(row).points) }
}

/** pix_posts.web_pages → slides in order, keeping only images in the Pix media bucket. */
function toSlides(pages: unknown, headline: string, points: string[]): PixSlide[] {
  if (!Array.isArray(pages)) return []
  return pages
    .filter(
      (page): page is { url: string; width?: number; height?: number; sort_order?: number } =>
        typeof page?.url === "string" && isMediaImage(page.url)
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((page, i) => ({
      url: page.url,
      width: page.width || 1080,
      height: page.height || 1995,
      // The slides are pictures of text: the cover carries the headline, the rest the points.
      alt: i === 0 ? headline : points.length ? `Key points: ${points.join(" ")}` : headline,
    }))
}

/** The Pix section ids shown on one of this site's news section pages. */
function pixCategoriesFor(section: string) {
  return Object.entries(sectionByPixCategory)
    .filter(([, slug]) => slug === section)
    .map(([id]) => Number(id))
}

/** What a story page needs for its search and share tags (lib/seo.ts storySeo). */
export type StoryArticle = {
  /** ISO times; modifiedAt is never before publishedAt. */
  publishedAt: string
  modifiedAt: string
  /** The story's pictures for its structured data: the artwork, then the rendered Pix slides. */
  images: string[]
  /** The share card: the first Pix slide (the headline is on it) at share size, else the artwork. */
  shareImage: { url: string; width?: number; height?: number } | null
}

/** One story with its key points, by Pix ID; null when it doesn't exist or is hidden. */
export async function getStory(id: string): Promise<{ story: Story; body: StoryBody; article: StoryArticle } | null> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool || !/^\d+$/.test(id)) return null
  try {
    const [hidden, { rows }] = await Promise.all([
      getHiddenIds(),
      pool.query<PixStoryRow & { updated_at: Date | null; web_pages: unknown }>(
        `select ${LIST_COLUMNS}, detail_body, summary, source_url, updated_at, web_pages
           from pix_posts where published_id = $1 and ${LIVE} limit 1`,
        [id]
      ),
    ])
    const row = rows[0]
    if (!row || hidden.includes(row.id)) return null
    return { story: toStory(row), body: toBody(row), article: toArticle(row) }
  } catch (error) {
    console.warn(`[news] Couldn't read story ${id}:`, error)
    return null
  }
}

/* ---------- Sitemaps ---------- */

/** A story's entry in the news sitemaps. */
export type SitemapStory = { slug: string; headline: string; publishedAt: string; modifiedAt: string }

type SitemapRow = Pick<PixRow, "id" | "published_id" | "headline" | "published_at"> & { updated_at: Date | null }

const toSitemapStory = (row: SitemapRow): SitemapStory => ({
  slug: storySlug(row.headline ?? "", row.published_id),
  headline: plain(row.headline ?? ""),
  publishedAt: new Date(row.published_at).toISOString(),
  modifiedAt: modifiedAt(row),
})

/** The first month with live stories: the news sitemaps start here. */
export const FIRST_SITEMAP_MONTH = { year: 2026, month: 8 }

/**
 * The Google News sitemap's stories (app/news/sitemap.xml): the last 48 hours, newest first,
 * at most 1,000, as on the old site.
 */
export async function getNewsSitemapStories(): Promise<SitemapStory[]> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool) return []
  const hidden = await getHiddenIds()
  const { rows } = await pool.query<SitemapRow>(
    `select id, published_id, headline, published_at, updated_at from pix_posts
      where ${LIVE} and not (id = any($1::uuid[])) and published_at >= now() - interval '48 hours'
      order by published_at desc, id desc
      limit 1000`,
    [hidden]
  )
  return rows.map(toSitemapStory)
}

/**
 * Every story published in one month (UTC), for its archive sitemap
 * (/news/sitemap-YYYY-MM.xml), newest change first. Past months don't change, so they are
 * kept for a day; a show / hide in the CMS still refreshes them at once.
 */
export async function getMonthSitemapStories(year: number, month: number): Promise<SitemapStory[]> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  const now = new Date()
  const current = year === now.getUTCFullYear() && month === now.getUTCMonth() + 1
  if (current) cacheLife("minutes")
  else cacheLife("days")

  const pool = getPixPool()
  if (!pool) return []
  const hidden = await getHiddenIds()
  const start = new Date(Date.UTC(year, month - 1, 1)).toISOString()
  const end = new Date(Date.UTC(year, month, 1)).toISOString()
  const { rows } = await pool.query<SitemapRow>(
    `select id, published_id, headline, published_at, updated_at from pix_posts
      where ${LIVE} and not (id = any($1::uuid[])) and published_at >= $2 and published_at < $3
      order by greatest(published_at, coalesce(updated_at, published_at)) desc, published_at desc, id desc`,
    [hidden, start, end]
  )
  return rows.map(toSitemapStory)
}

/* ---------- Pix row → story ---------- */

/**
 * Pix marks the words it highlights with [square brackets] and some headlines start with a
 * column tag on its own line ("[#dailymattrwrites]\n…"). The website shows plain text.
 */
function plain(text: string) {
  return text
    .replace(/^\s*\[?#\w+\]?\s*\n/, "")
    .replace(/[[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** Pix wraps highlighted words in [brackets], (parens) or {braces}; slugs drop the markers. */
const MARKERS = /[[\](){}]/g

/**
 * The old site's story slug (its api/_lib/slug.js, unchanged so every story keeps its URL),
 * from the raw Pix headline: the highlight markers dropped, "₹" as "rs", "&" as "and", "%" as
 * "percent", quotes dropped, accents removed, lower case, everything else between words a
 * hyphen, cut back to a whole word when longer than 80 characters, then "-<Pix ID>". A column
 * tag stays in ("[#dailymattrwrites]" -> "dailymattrwrites-..."), as it did on the old site.
 * Pages look stories up by the ID alone and redirect any other slug to this one.
 */
export function storySlug(headline: string, id: string) {
  let slug = headline
    .replace(MARKERS, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/₹/g, " rs ")
    .replace(/&/g, " and ")
    .replace(/%/g, " percent ")
    .replace(/[‘’“”'"`]/g, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  if (slug.length > 80) {
    slug = slug.slice(0, 80)
    const cut = slug.lastIndexOf("-")
    if (cut > 40) slug = slug.slice(0, cut)
  }
  return `${slug || "story"}-${id}`
}

const INDIA = "Asia/Kolkata"

function toStory(row: PixRow): Story {
  const headline = plain(row.headline ?? "") || "Untitled story"
  const at = new Date(row.published_at)
  return {
    id: row.published_id,
    slug: storySlug(row.headline ?? "", row.published_id),
    headline,
    category: row.category_id != null ? sectionByPixCategory[row.category_id] : undefined,
    date: at.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: INDIA }),
    published: at.toLocaleDateString("en-CA", { timeZone: INDIA }),
    image: row.main_image_url || null,
  }
}

/** Pix writes the key points as "• point" paragraphs; falls back to the summary. */
function toBody(row: PixStoryRow): StoryBody {
  const points = (row.detail_body || row.summary || "")
    .split(/\n+/)
    .map((line) => plain(line).replace(/^[•\-*·]\s*/, ""))
    .filter(Boolean)

  let source: StoryBody["source"] = null
  if (row.source_url) {
    try {
      const url = new URL(row.source_url)
      if (url.protocol === "https:" || url.protocol === "http:") {
        source = { label: url.hostname.replace(/^www\./, ""), url: url.toString() }
      }
    } catch {}
  }
  return { points, source }
}

/** The later of published and updated, so dateModified is never before datePublished. */
function modifiedAt(row: { published_at: Date; updated_at: Date | null }) {
  const published = new Date(row.published_at).getTime()
  const updated = row.updated_at ? new Date(row.updated_at).getTime() : 0
  return new Date(Math.max(published, updated)).toISOString()
}

/** Pix photos and slides live in its public media bucket; no other picture is used for SEO. */
const PIX_MEDIA_HOST = "coggfnbqqyiqfsxvtaym.supabase.co"

function allowedImage(url: unknown) {
  try {
    const parsed = new URL(String(url))
    return parsed.protocol === "https:" && parsed.hostname === PIX_MEDIA_HOST ? parsed.href : ""
  } catch {
    return ""
  }
}

/**
 * The same picture resized by Supabase's image renderer, as the old site did: a 2.7 MB
 * poster comes back at share size. resize=contain keeps the proportions.
 */
function sized(url: string, width: number) {
  const rendered = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/")
  return rendered === url ? url : `${rendered}?width=${width}&resize=contain&quality=72`
}

type PixPage = { url: string; width?: number; height?: number; sort_order?: number }

/** The story's pictures and dates for its search and share tags, as the old site built them. */
function toArticle(row: PixRow & { updated_at: Date | null; web_pages: unknown }): StoryArticle {
  const pages = (Array.isArray(row.web_pages) ? (row.web_pages as PixPage[]) : [])
    .filter((page) => !!allowedImage(page?.url))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const artwork = allowedImage(row.main_image_url)
  const slides = pages.map((page) => allowedImage(page.url))
  const images = [...new Set([artwork || slides[0], ...slides].filter(Boolean))]

  // The share card: the first slide when there is one (a headline baked into the picture is
  // what a WhatsApp or X preview wants), else the artwork. Only slides have a known size.
  let shareImage: StoryArticle["shareImage"] = null
  const first = pages[0]
  if (first && Number(first.width) > 0 && Number(first.height) > 0) {
    const width = Math.min(1200, Number(first.width))
    const height = Math.round((Number(first.height) * width) / Number(first.width))
    shareImage = { url: sized(slides[0], width), width, height }
  } else if (slides[0] || artwork) {
    shareImage = { url: sized(slides[0] || artwork, 1200) }
  }

  return {
    publishedAt: new Date(row.published_at).toISOString(),
    modifiedAt: modifiedAt(row),
    images,
    shareImage,
  }
}
