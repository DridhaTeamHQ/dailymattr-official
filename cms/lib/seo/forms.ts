import { parseKeywords, type ChangeFrequency, type PageOverrides, type SiteOverrides } from "./fields"

/**
 * The editors' form values: plain strings, where "" means "use the website's default".
 * Tri-state choices use "default" for the same thing.
 */
export type PageForm = {
  title: string
  description: string
  keywords: string
  canonical: string
  ogTitle: string
  ogDescription: string
  image: string
  noindex: "default" | "yes" | "no"
  nofollow: "default" | "yes" | "no"
  priority: string
  changeFrequency: string
  jsonLd: string
}

export type SiteForm = {
  siteName: string
  titleTemplate: string
  defaultDescription: string
  defaultKeywords: string
  defaultImage: string
  twitterHandle: string
  googleVerification: string
  bingVerification: string
}

/** What a save action returns to the editor. */
export type SaveResult =
  | { ok: true; live: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

const flag = (value: boolean | null) => (value == null ? "default" : value ? "yes" : "no")

export function toPageForm(overrides: PageOverrides): PageForm {
  return {
    title: overrides.title ?? "",
    description: overrides.description ?? "",
    keywords: overrides.keywords?.join(", ") ?? "",
    canonical: overrides.canonical ?? "",
    ogTitle: overrides.ogTitle ?? "",
    ogDescription: overrides.ogDescription ?? "",
    image: overrides.image ?? "",
    noindex: flag(overrides.noindex),
    nofollow: flag(overrides.nofollow),
    priority: overrides.priority == null ? "default" : String(overrides.priority),
    changeFrequency: overrides.changeFrequency ?? "default",
    jsonLd: overrides.jsonLd == null ? "" : JSON.stringify(overrides.jsonLd, null, 2),
  }
}

const blank = (value: string) => value.trim() || null
const fromFlag = (value: string) => (value === "yes" ? true : value === "no" ? false : null)

/**
 * The form as overrides, without validation, for the live previews and checks while
 * typing. The save action does the real parsing and validation.
 */
export function previewOverrides(form: PageForm): PageOverrides {
  return {
    title: blank(form.title),
    description: blank(form.description),
    keywords: parseKeywords(form.keywords),
    canonical: blank(form.canonical),
    ogTitle: blank(form.ogTitle),
    ogDescription: blank(form.ogDescription),
    image: blank(form.image),
    noindex: fromFlag(form.noindex),
    nofollow: fromFlag(form.nofollow),
    priority: form.priority === "default" ? null : Number(form.priority),
    changeFrequency: form.changeFrequency === "default" ? null : (form.changeFrequency as ChangeFrequency),
    jsonLd: form.jsonLd.trim() ? {} : null,
  }
}

export function previewSiteOverrides(form: SiteForm): SiteOverrides {
  return {
    siteName: blank(form.siteName),
    titleTemplate: blank(form.titleTemplate),
    defaultDescription: blank(form.defaultDescription),
    defaultKeywords: parseKeywords(form.defaultKeywords),
    defaultImage: blank(form.defaultImage),
    twitterHandle: blank(form.twitterHandle),
    googleVerification: blank(form.googleVerification),
    bingVerification: blank(form.bingVerification),
  }
}

export function toSiteForm(overrides: SiteOverrides): SiteForm {
  return {
    siteName: overrides.siteName ?? "",
    titleTemplate: overrides.titleTemplate ?? "",
    defaultDescription: overrides.defaultDescription ?? "",
    defaultKeywords: overrides.defaultKeywords?.join(", ") ?? "",
    defaultImage: overrides.defaultImage ?? "",
    twitterHandle: overrides.twitterHandle ?? "",
    googleVerification: overrides.googleVerification ?? "",
    bingVerification: overrides.bingVerification ?? "",
  }
}
