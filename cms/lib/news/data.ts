import "server-only"

import { Pool } from "pg"

import { prisma } from "@/lib/db"
import { websiteUrl } from "@/lib/seo/website"

import {
  formatDay,
  formatTime,
  keyPoints,
  mappedPixIds,
  newsSections,
  OTHER_SECTION,
  plainText,
  sectionForPixId,
  sourceOf,
  storySlug,
} from "./format"

/**
 * News for the CMS's News page: stories from the Pix database (Supabase project "PixAgent",
 * table pix_posts), and whether each one shows on the website (this CMS's news_visibility
 * table). Every published Pix story shows unless it's been hidden here.
 *
 * PIX_DATABASE_URL: the Pix database as the read-only dailymattr_reader role, through the
 * transaction pooler. That role only sees published, non-rejected stories, and can't write.
 */

export const NEWS_PAGE_SIZE = 24

export type NewsStatus = "all" | "showing" | "hidden"

export type NewsFilters = {
  q: string
  /** A newsSections slug, "other", or "" for every section. */
  section: string
  status: NewsStatus
  /** YYYY-MM-DD (India time) or "". */
  date: string
  /** 1-based. */
  page: number
}

export type NewsItem = {
  /** pix_posts.id */
  id: string
  /** Pix ID (pix_posts.published_id), the number at the end of the story's URL. */
  pixId: string
  headline: string
  image: string | null
  section: { slug: string; label: string } | null
  day: string
  time: string
  publishedAt: string
  points: string[]
  source: { label: string; url: string } | null
  author: string | null
  approvedBy: string | null
  show: boolean
  /** The last show / hide in the CMS, if any. */
  changed: { by: string | null; at: string } | null
  /** The story's page on the website. */
  websiteHref: string | null
}

export type NewsOverview = {
  totals: { published: number; showing: number; hidden: number; today: number }
  /** Stories per section ("" = every section), for the current search, date and status. */
  sectionCounts: Record<string, number>
  /** Stories matching every filter. */
  matching: number
  items: NewsItem[]
}

const globalForPix = globalThis as unknown as { cmsPixPool?: { url: string; pool: Pool } }

function getPixPool(): Pool {
  const url = process.env.PIX_DATABASE_URL
  if (!url) throw new PixSetupError("PIX_DATABASE_URL isn't set for the CMS, so it can't read the Pix stories.")
  const cached = globalForPix.cmsPixPool
  if (cached && cached.url === url) return cached.pool
  cached?.pool.end().catch(() => {})
  const pool = new Pool({ connectionString: url, max: 4, idleTimeoutMillis: 10_000 })
  globalForPix.cmsPixPool = { url, pool }
  return pool
}

/** A setup problem worth showing as-is, rather than a generic database error. */
export class PixSetupError extends Error {}

type Row = {
  id: string
  published_id: string
  headline: string | null
  detail_body: string | null
  summary: string | null
  main_image_url: string | null
  category_id: number | null
  published_at: Date
  source_url: string | null
  user_name: string | null
  approved_by_name: string | null
}

/** Builds the WHERE clause for the filters; `skipSection` for the per-section counts. */
function whereFor(filters: NewsFilters, hidden: string[], skipSection = false) {
  const clauses = ["published_id ~ '^[0-9]+$'"]
  const params: unknown[] = []
  const param = (value: unknown) => {
    params.push(value)
    return `$${params.length}`
  }

  const q = filters.q.trim()
  if (q) {
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`
    clauses.push(`(headline ilike ${param(like)} or published_id = ${param(q.replace(/^#/, ""))})`)
  }
  if (filters.date) {
    clauses.push(`(published_at at time zone 'Asia/Kolkata')::date = ${param(filters.date)}::date`)
  }
  if (filters.status === "showing") clauses.push(`not (id = any(${param(hidden)}::uuid[]))`)
  if (filters.status === "hidden") clauses.push(`id = any(${param(hidden)}::uuid[])`)
  if (!skipSection && filters.section) {
    const section = newsSections.find((s) => s.slug === filters.section)
    if (section) clauses.push(`category_id = any(${param([...section.pixIds])}::int[])`)
    else if (filters.section === OTHER_SECTION.slug) {
      clauses.push(`(category_id is null or not (category_id = any(${param(mappedPixIds)}::int[])))`)
    }
  }
  return { where: clauses.join(" and "), params }
}

/** One page of stories for the filters, with the totals for the stat cards. */
export async function loadNews(filters: NewsFilters): Promise<NewsOverview> {
  const pool = getPixPool()
  const hiddenRows = await prisma.newsVisibility.findMany({ where: { showOnWebsite: false }, select: { postId: true } })
  const hidden = hiddenRows.map((row) => row.postId)

  const list = whereFor(filters, hidden)
  const counts = whereFor(filters, hidden, true)
  const offset = (filters.page - 1) * NEWS_PAGE_SIZE

  const [totalsResult, sectionResult, pageResult] = await Promise.all([
    pool.query<{ published: number; today: number; hidden: number }>(
      `select count(*)::int as published,
              count(*) filter (where (published_at at time zone 'Asia/Kolkata')::date
                                   = (now() at time zone 'Asia/Kolkata')::date)::int as today,
              count(*) filter (where id = any($1::uuid[]))::int as hidden
         from pix_posts where published_id ~ '^[0-9]+$'`,
      [hidden]
    ),
    pool.query<{ category_id: number | null; n: number }>(
      `select category_id, count(*)::int as n from pix_posts where ${counts.where} group by category_id`,
      counts.params
    ),
    pool.query<Row>(
      `select id, published_id, headline, detail_body, summary, main_image_url, category_id, published_at,
              source_url, user_name, approved_by_name
         from pix_posts where ${list.where}
         order by published_at desc
         limit ${NEWS_PAGE_SIZE} offset ${offset}`,
      list.params
    ),
  ])

  const sectionCounts: Record<string, number> = { "": 0 }
  for (const { category_id, n } of sectionResult.rows) {
    const slug = sectionForPixId(category_id)?.slug ?? OTHER_SECTION.slug
    sectionCounts[slug] = (sectionCounts[slug] ?? 0) + n
    sectionCounts[""] += n
  }

  const rows = pageResult.rows
  const changes = rows.length
    ? await prisma.newsVisibility.findMany({ where: { postId: { in: rows.map((row) => row.id) } } })
    : []
  const changeById = new Map(changes.map((change) => [change.postId, change]))

  const totals = totalsResult.rows[0] ?? { published: 0, today: 0, hidden: 0 }
  return {
    totals: { ...totals, showing: totals.published - totals.hidden },
    sectionCounts,
    // The section counts use every other filter, so the current section's is the match count.
    matching: sectionCounts[filters.section] ?? 0,
    items: rows.map((row) => {
      const change = changeById.get(row.id)
      const headline = plainText(row.headline ?? "") || "Untitled story"
      const at = new Date(row.published_at)
      const section = sectionForPixId(row.category_id)
      const show = change ? change.showOnWebsite : true
      return {
        id: row.id,
        pixId: row.published_id,
        headline,
        image: row.main_image_url || null,
        section: section ? { slug: section.slug, label: section.label } : null,
        day: formatDay(at),
        time: formatTime(at),
        publishedAt: at.toISOString(),
        points: keyPoints(row.detail_body || row.summary),
        source: sourceOf(row.source_url),
        author: row.user_name,
        approvedBy: row.approved_by_name,
        show,
        changed: change ? { by: change.updatedBy, at: `${formatDay(change.updatedAt)}, ${formatTime(change.updatedAt)}` } : null,
        websiteHref: websiteUrl ? `${websiteUrl}/news/${storySlug(row.headline ?? "", row.published_id)}` : null,
      }
    }),
  }
}

/** Records a show / hide for each story. */
export async function saveNewsVisibility(
  stories: { id: string; pixId: string }[],
  show: boolean,
  email: string
) {
  await prisma.$transaction(
    stories.map(({ id, pixId }) =>
      prisma.newsVisibility.upsert({
        where: { postId: id },
        create: { postId: id, publishedId: pixId, showOnWebsite: show, updatedBy: email },
        update: { publishedId: pixId, showOnWebsite: show, updatedBy: email },
      })
    )
  )
}

/** Parses the News page's ?q=&section=&status=&date=&page= search params. */
export function parseNewsFilters(params: Record<string, string | string[] | undefined>): NewsFilters {
  const one = (key: string) => {
    const value = params[key]
    return typeof value === "string" ? value : ""
  }
  const section = one("section")
  const status = one("status")
  const date = one("date")
  const page = Number.parseInt(one("page"), 10)
  return {
    q: one("q").slice(0, 200),
    section: newsSections.some((s) => s.slug === section) || section === OTHER_SECTION.slug ? section : "",
    status: status === "showing" || status === "hidden" ? status : "all",
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 10_000) : 1,
  }
}
