import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { prisma } from "./db"
import type { SeoPage, SeoSettings } from "./generated/prisma/client"

/**
 * SEO overrides saved in the CMS, read straight from its database (Supabase, see
 * lib/db.ts and prisma/schema.prisma) and layered over this site's own defaults in
 * lib/seo.ts and lib/site.ts. Only the fields someone has changed are returned, so
 * anything missing here falls back to the defaults in code.
 *
 * - DATABASE_URL: the CMS database. Unset = the site uses its defaults only.
 * - CMS_REVALIDATE_SECRET: shared with the CMS, so every save there refreshes this cache
 *   straight away (app/api/revalidate/route.ts). Otherwise it refreshes within minutes.
 */

export type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"

export type CmsPageSeo = Partial<{
  title: string
  description: string
  keywords: string[]
  canonical: string
  ogTitle: string
  ogDescription: string
  image: string
  noindex: boolean
  nofollow: boolean
  priority: number
  changeFrequency: ChangeFrequency
  jsonLd: unknown
}>

export type CmsSiteSeo = Partial<{
  name: string
  titleTemplate: string
  description: string
  keywords: string[]
  image: string
  twitterHandle: string
  googleVerification: string
  bingVerification: string
}>

export type CmsSeo = { settings: CmsSiteSeo; pages: Record<string, CmsPageSeo> }

/** Cache tag the CMS revalidates after each save. */
export const CMS_SEO_TAG = "cms-seo"

// The last good read, so a short database outage keeps the custom SEO instead of
// dropping back to the defaults (best effort: per server instance).
let lastGood: CmsSeo | null = null

export async function getCmsSeo(): Promise<CmsSeo> {
  "use cache"
  cacheTag(CMS_SEO_TAG)
  cacheLife("minutes")

  if (!process.env.DATABASE_URL) return { settings: {}, pages: {} }
  try {
    const [pages, settings] = await Promise.all([
      prisma.seoPage.findMany(),
      prisma.seoSettings.findUnique({ where: { id: 1 } }),
    ])
    lastGood = {
      settings: settings ? siteOverrides(settings) : {},
      pages: Object.fromEntries(pages.map((page) => [page.path, pageOverrides(page)])),
    }
    return lastGood
  } catch (error) {
    console.warn(`[cms] Couldn't read SEO from the database, using ${lastGood ? "the last copy" : "the site defaults"}:`, error)
    return lastGood ?? { settings: {}, pages: {} }
  }
}

/** Drops unset fields (null, or an empty keyword list) so the defaults show through. */
function setOnly<T extends object>(values: T): Partial<{ [K in keyof T]: NonNullable<T[K]> }> {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value != null && !(Array.isArray(value) && value.length === 0))
  ) as Partial<{ [K in keyof T]: NonNullable<T[K]> }>
}

function pageOverrides(page: SeoPage): CmsPageSeo {
  return setOnly({
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    canonical: page.canonical,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    image: page.image,
    noindex: page.noindex,
    nofollow: page.nofollow,
    priority: page.priority,
    changeFrequency: page.changeFrequency,
    jsonLd: page.jsonLd,
  })
}

function siteOverrides(settings: SeoSettings): CmsSiteSeo {
  return setOnly({
    name: settings.siteName,
    titleTemplate: settings.titleTemplate,
    description: settings.defaultDescription,
    keywords: settings.defaultKeywords,
    image: settings.defaultImage,
    twitterHandle: settings.twitterHandle,
    googleVerification: settings.googleVerification,
    bingVerification: settings.bingVerification,
  })
}
