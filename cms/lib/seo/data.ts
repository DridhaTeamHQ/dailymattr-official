import "server-only"

import { prisma } from "@/lib/db"
import { Prisma, type SeoPage, type SeoSettings } from "@/lib/generated/prisma/client"

import {
  emptyPageOverrides,
  emptySiteOverrides,
  type PageOverrides,
  type SiteOverrides,
} from "./fields"

// Rows → override objects. An empty keyword list counts as "not set".

export function toPageOverrides(row: SeoPage | null): PageOverrides {
  if (!row) return emptyPageOverrides
  return {
    title: row.title,
    description: row.description,
    keywords: row.keywords.length ? row.keywords : null,
    canonical: row.canonical,
    ogTitle: row.ogTitle,
    ogDescription: row.ogDescription,
    image: row.image,
    noindex: row.noindex,
    nofollow: row.nofollow,
    priority: row.priority,
    changeFrequency: row.changeFrequency,
    jsonLd: row.jsonLd ?? null,
  }
}

export function toSiteOverrides(row: SeoSettings | null): SiteOverrides {
  if (!row) return emptySiteOverrides
  return {
    siteName: row.siteName,
    titleTemplate: row.titleTemplate,
    defaultDescription: row.defaultDescription,
    defaultKeywords: row.defaultKeywords.length ? row.defaultKeywords : null,
    defaultImage: row.defaultImage,
    twitterHandle: row.twitterHandle,
    googleVerification: row.googleVerification,
    bingVerification: row.bingVerification,
  }
}

const isEmpty = (values: object) => Object.values(values).every((value) => value == null)

// Pages

export function listSeoPages() {
  return prisma.seoPage.findMany({ orderBy: { path: "asc" } })
}

export function getSeoPage(path: string) {
  return prisma.seoPage.findUnique({ where: { path } })
}

/** Saves a page's overrides. With nothing left to override, the row is removed. */
export async function savePageOverrides(path: string, overrides: PageOverrides, editorEmail: string) {
  if (isEmpty(overrides)) {
    await prisma.seoPage.deleteMany({ where: { path } })
    return
  }
  const data = {
    ...overrides,
    keywords: overrides.keywords ?? [],
    jsonLd: overrides.jsonLd == null ? Prisma.DbNull : (overrides.jsonLd as Prisma.InputJsonValue),
    updatedBy: editorEmail,
  }
  await prisma.seoPage.upsert({ where: { path }, create: { path, ...data }, update: data })
}

export async function deletePageOverrides(path: string) {
  await prisma.seoPage.deleteMany({ where: { path } })
}

// Site-wide settings (a single row, id 1)

export function getSeoSettings() {
  return prisma.seoSettings.findUnique({ where: { id: 1 } })
}

export async function saveSiteOverrides(overrides: SiteOverrides, editorEmail: string) {
  if (isEmpty(overrides)) {
    await prisma.seoSettings.deleteMany({ where: { id: 1 } })
    return
  }
  const data = { ...overrides, defaultKeywords: overrides.defaultKeywords ?? [], updatedBy: editorEmail }
  await prisma.seoSettings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data })
}

// The website reads these same two tables straight from the database
// (dailymattr/lib/cms.ts); notifyWebsite() in ./website.ts tells it to refresh after a save.
