import "server-only"

import { format } from "date-fns"

import { getSeoSettings, listSeoPages, toPageOverrides, toSiteOverrides } from "@/lib/seo/data"
import {
  effectivePage,
  effectiveSite,
  emptyPageOverrides,
  seoChecks,
  type WebsiteDefaults,
} from "@/lib/seo/fields"
import { getWebsiteDefaults, websiteSetupProblem, websiteUrl } from "@/lib/seo/website"

import type { SeoListItem } from "./seo-table"

/**
 * What every SEO page starts from: the website's defaults plus the site-wide overrides.
 * `error` is set when the website can't be reached.
 */
export async function loadSeoBase() {
  // Setup mistakes (no WEBSITE_URL, localhost on Vercel) get a precise message up front.
  const problem = websiteSetupProblem()
  if (problem) return { error: problem, websiteUrl } as const

  let defaults: WebsiteDefaults
  try {
    defaults = await getWebsiteDefaults()
  } catch (error) {
    // Production hides the real error message (it's thrown inside a cached function), so
    // say what was tried instead. Dev shows the real one.
    const detail = process.env.NODE_ENV === "development" && error instanceof Error ? ` (${error.message})` : ""
    return {
      error: `Couldn't load the SEO defaults from ${websiteUrl}/api/seo/defaults. Check that the website is deployed and that WEBSITE_URL is its address.${detail}`,
      websiteUrl,
    } as const
  }
  const settings = await getSeoSettings()
  return {
    error: null,
    websiteUrl,
    defaults,
    settings,
    site: effectiveSite(defaults.site, toSiteOverrides(settings)),
  } as const
}

export const formatEdited = (date: Date) => format(date, "d MMM yyyy, h:mm a")

/**
 * Every page (the website's, then ones added in the CMS) with its SEO status, plus the
 * totals the dashboard and the SEO page show.
 */
export async function loadSeoOverview() {
  const base = await loadSeoBase()
  if (base.error !== null) return base

  const rows = await listSeoPages()
  const rowsByPath = new Map(rows.map((row) => [row.path, row]))
  const defaultsByPath = new Map(base.defaults.pages.map((page) => [page.path, page]))
  const paths = [
    ...base.defaults.pages.map((page) => page.path),
    ...rows.map((row) => row.path).filter((path) => !defaultsByPath.has(path)),
  ]

  const items: SeoListItem[] = paths.map((path) => {
    const row = rowsByPath.get(path) ?? null
    const page = effectivePage(path, defaultsByPath.get(path), row ? toPageOverrides(row) : emptyPageOverrides, base.site)
    const checks = seoChecks(page)
    return {
      path,
      title: page.title,
      noindex: page.noindex,
      customized: !!row,
      addedInCms: !defaultsByPath.has(path),
      score: checks.filter((check) => check.passed).length,
      total: checks.length,
      edited: row ? { at: formatEdited(row.updatedAt), by: row.updatedBy } : null,
    }
  })

  const totals = {
    pages: items.length,
    customized: items.filter((item) => item.customized).length,
    hidden: items.filter((item) => item.noindex).length,
    passing: items.filter((item) => item.score === item.total).length,
  }

  // Latest edits first, for the dashboard.
  const recent = [...rows]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 6)
    .map((row) => ({
      path: row.path,
      title: items.find((item) => item.path === row.path)?.title ?? row.path,
      by: row.updatedBy,
      at: formatEdited(row.updatedAt),
    }))

  return { ...base, items, totals, recent }
}

/** "12" of "60" → "20%". */
export const percent = (part: number, whole: number) => `${whole ? Math.round((part / whole) * 100) : 0}%`
