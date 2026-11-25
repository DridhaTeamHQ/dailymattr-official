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
        where published_id ~ '^[0-9]+$' and not (id = any($1::uuid[]))
        order by published_at desc
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
    const clauses = ["published_id ~ '^[0-9]+$'", "not (id = any($1::uuid[]))"]
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
          order by published_at desc
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
        where published_id ~ '^[0-9]+$' and not (id = any($1::uuid[]))
          and category_id = any($2::int[])
          and jsonb_typeof(web_pages) = 'array' and jsonb_array_length(web_pages) > 0
          and published_at > now() - interval '30 days'
        order by category_id, published_at desc`,
      [hidden, SHOWCASE_SECTIONS.flatMap(pixCategoriesFor)]
    )
    return rows
      .map((row) => {
        const story = toStory(row)
        const points = toBody(row).points
        return { story, slides: toSlides(row.web_pages, story.headline, points) }
      })
      .filter((item) => item.slides.length > 0)
      .sort((a, b) => SHOWCASE_SECTIONS.indexOf(a.story.category ?? "") - SHOWCASE_SECTIONS.indexOf(b.story.category ?? ""))
  } catch (error) {
    console.warn("[news] Couldn't read the Pix showcase:", error)
    return []
  }
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

/** One story with its key points, by Pix ID; null when it doesn't exist or is hidden. */
export async function getStory(id: string): Promise<{ story: Story; body: StoryBody } | null> {
  "use cache"
  cacheTag(CMS_NEWS_TAG)
  cacheLife("minutes")

  const pool = getPixPool()
  if (!pool || !/^\d+$/.test(id)) return null
  try {
    const [hidden, { rows }] = await Promise.all([
      getHiddenIds(),
      pool.query<PixStoryRow>(
        `select ${LIST_COLUMNS}, detail_body, summary, source_url from pix_posts where published_id = $1 limit 1`,
        [id]
      ),
    ])
    const row = rows[0]
    if (!row || hidden.includes(row.id)) return null
    return { story: toStory(row), body: toBody(row) }
  } catch (error) {
    console.warn(`[news] Couldn't read story ${id}:`, error)
    return null
  }
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

/** Longest headline part of a story slug, before "-<Pix ID>" (matches the old site's URLs). */
const MAX_SLUG = 79

/**
 * The old site's story slug: the headline in lower case, "%" as "percent" and "₹" as "rs",
 * apostrophes dropped, everything else between words a hyphen, cut at a word to 79
 * characters, then "-<Pix ID>". Pages look stories up by the ID alone, so an old link with
 * a slightly different headline part still opens the story.
 */
export function storySlug(headline: string, id: string) {
  const words = headline
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/%/g, " percent ")
    .replace(/₹/g, " rs ")
    .replace(/&/g, " and ")
    .replace(/['’‘`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  let short = words
  if (words.length > MAX_SLUG) {
    const cut = words.slice(0, MAX_SLUG + 1).lastIndexOf("-")
    short = cut > 0 ? words.slice(0, cut) : words.slice(0, MAX_SLUG)
  }
  return short ? `${short}-${id}` : id
}

const INDIA = "Asia/Kolkata"

function toStory(row: PixRow): Story {
  const headline = plain(row.headline ?? "") || "Untitled story"
  const at = new Date(row.published_at)
  return {
    id: row.published_id,
    slug: storySlug(headline, row.published_id),
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
