"use server"

import { refresh } from "next/cache"

import { requireApprovedUser } from "@/lib/dal"
import {
  deletePageOverrides,
  getSeoPage,
  savePageOverrides,
  saveSiteOverrides,
} from "@/lib/seo/data"
import {
  changeFrequencies,
  normalizePath,
  parseKeywords,
  type ChangeFrequency,
  type PageOverrides,
  type SiteOverrides,
} from "@/lib/seo/fields"
import type { PageForm, SaveResult, SiteForm } from "@/lib/seo/forms"
import { getWebsiteDefaults, notifyWebsite } from "@/lib/seo/website"

// Every action re-checks the session: a server action is a public endpoint, so the
// page being hidden from signed-out people isn't enough on its own.

type Errors = Record<string, string>

const text = (value: string, max: number, field: string, errors: Errors) => {
  const trimmed = value.trim()
  if (trimmed.length > max) errors[field] = `Keep it under ${max} characters.`
  return trimmed || null
}

/** An absolute http(s) URL or a site-relative path ("/images/x.png"). */
const urlOrPath = (value: string, field: string, errors: Errors) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.startsWith("/") && !/\s/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString()
  } catch {}
  errors[field] = "Use a full https:// URL or a path that starts with /."
  return null
}

const tri = (value: string) => (value === "yes" ? true : value === "no" ? false : null)

function parsePageForm(form: PageForm, errors: Errors): PageOverrides {
  const keywords = parseKeywords(form.keywords)
  if (keywords && keywords.length > 20) errors.keywords = "Use 20 keywords at most."

  const priority = form.priority === "default" ? null : Number(form.priority)
  if (priority != null && !(priority >= 0 && priority <= 1)) errors.priority = "Pick a value from 0 to 1."

  const changeFrequency =
    form.changeFrequency === "default" ? null : (form.changeFrequency as ChangeFrequency)
  if (changeFrequency && !changeFrequencies.includes(changeFrequency)) {
    errors.changeFrequency = "Pick one of the listed options."
  }

  let jsonLd: unknown = null
  if (form.jsonLd.trim()) {
    try {
      jsonLd = JSON.parse(form.jsonLd)
      if (typeof jsonLd !== "object" || jsonLd === null) throw new Error()
      if (form.jsonLd.length > 20_000) errors.jsonLd = "Keep structured data under 20,000 characters."
    } catch {
      errors.jsonLd = "This isn't valid JSON. It should be a JSON-LD object or list."
    }
  }

  return {
    title: text(form.title, 120, "title", errors),
    description: text(form.description, 400, "description", errors),
    keywords,
    canonical: urlOrPath(form.canonical, "canonical", errors),
    ogTitle: text(form.ogTitle, 120, "ogTitle", errors),
    ogDescription: text(form.ogDescription, 400, "ogDescription", errors),
    image: urlOrPath(form.image, "image", errors),
    noindex: tri(form.noindex),
    nofollow: tri(form.nofollow),
    priority,
    changeFrequency,
    jsonLd,
  }
}

/**
 * Saves a page's SEO. `newPath` is set when adding a page the website has no defaults
 * for; otherwise `path` is the existing page being edited.
 */
export async function savePageSeo(
  target: { path: string } | { newPath: string },
  form: PageForm
): Promise<SaveResult> {
  const user = await requireApprovedUser()
  const errors: Errors = {}

  const rawPath = "path" in target ? target.path : target.newPath
  const path = normalizePath(rawPath)
  if (!path) errors.path = "Start with / and leave out spaces, ? and #, e.g. /about."

  if (path && "newPath" in target) {
    const [existing, defaults] = await Promise.all([
      getSeoPage(path),
      getWebsiteDefaults().catch(() => null),
    ])
    if (existing || defaults?.pages.some((page) => page.path === path)) {
      errors.path = "This page is already in the list. Open it from there to edit it."
    }
  }

  const overrides = parsePageForm(form, errors)
  if (Object.keys(errors).length || !path) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors: errors }
  }

  await savePageOverrides(path, overrides, user.email)
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}

/** Drops every override for a page, so the website goes back to its defaults. */
export async function resetPageSeo(rawPath: string): Promise<SaveResult> {
  await requireApprovedUser()
  const path = normalizePath(rawPath)
  if (!path) return { ok: false, error: "Unknown page." }
  await deletePageOverrides(path)
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}

export async function saveSiteSettings(form: SiteForm): Promise<SaveResult> {
  const user = await requireApprovedUser()
  const errors: Errors = {}

  const titleTemplate = text(form.titleTemplate, 120, "titleTemplate", errors)
  if (titleTemplate && !titleTemplate.includes("%s")) {
    errors.titleTemplate = "Include %s where the page title goes, e.g. %s - dailymattr."
  }

  let twitterHandle = form.twitterHandle.trim() || null
  if (twitterHandle) {
    twitterHandle = `@${twitterHandle.replace(/^@/, "")}`
    if (!/^@[A-Za-z0-9_]{1,15}$/.test(twitterHandle)) {
      errors.twitterHandle = "Use a handle like @dailymattr (letters, numbers and _ only)."
    }
  }

  const code = (value: string, field: string) => {
    const trimmed = value.trim()
    if (trimmed && !/^[A-Za-z0-9_\-=.:+/]{1,200}$/.test(trimmed)) {
      errors[field] = 'Paste only the code from content="…", without quotes or the <meta> tag.'
    }
    return trimmed || null
  }

  const defaultKeywords = parseKeywords(form.defaultKeywords)
  if (defaultKeywords && defaultKeywords.length > 30) errors.defaultKeywords = "Use 30 keywords at most."

  const overrides: SiteOverrides = {
    siteName: text(form.siteName, 60, "siteName", errors),
    titleTemplate,
    defaultDescription: text(form.defaultDescription, 400, "defaultDescription", errors),
    defaultKeywords,
    defaultImage: urlOrPath(form.defaultImage, "defaultImage", errors),
    twitterHandle,
    googleVerification: code(form.googleVerification, "googleVerification"),
    bingVerification: code(form.bingVerification, "bingVerification"),
  }

  if (Object.keys(errors).length) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors: errors }
  }

  await saveSiteOverrides(overrides, user.email)
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}
