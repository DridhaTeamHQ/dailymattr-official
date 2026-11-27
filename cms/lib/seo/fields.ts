/**
 * SEO field types and helpers shared by the CMS server code and its client editors.
 * The shapes mirror what the website reads (dailymattr/lib/seo.ts and lib/cms.ts).
 */

export const changeFrequencies = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
] as const
export type ChangeFrequency = (typeof changeFrequencies)[number]

export const priorities = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0] as const

/** A page's SEO as defined in the website's code (GET /api/seo/defaults on the website). */
export type PageDefaults = {
  path: string
  title: string
  /** The title is used as it is, without the site's title template (e.g. the home page). */
  absoluteTitle?: boolean
  description: string
  image?: string
  noindex?: boolean
  priority?: number
  changeFrequency?: ChangeFrequency
}

/** Site-wide SEO from the website's code. */
export type SiteDefaults = {
  url: string
  name: string
  titleTemplate: string
  description: string
  keywords: string[]
  image: string
  twitterHandle: string | null
  googleVerification: string | null
  bingVerification: string | null
}

export type WebsiteDefaults = { site: SiteDefaults; pages: PageDefaults[] }

/** A page's overrides as stored in the CMS. null = use the website's default. */
export type PageOverrides = {
  title: string | null
  description: string | null
  keywords: string[] | null
  canonical: string | null
  ogTitle: string | null
  ogDescription: string | null
  image: string | null
  noindex: boolean | null
  nofollow: boolean | null
  priority: number | null
  changeFrequency: ChangeFrequency | null
  jsonLd: unknown
}

export const emptyPageOverrides: PageOverrides = {
  title: null,
  description: null,
  keywords: null,
  canonical: null,
  ogTitle: null,
  ogDescription: null,
  image: null,
  noindex: null,
  nofollow: null,
  priority: null,
  changeFrequency: null,
  jsonLd: null,
}

/** Site-wide overrides as stored in the CMS. null = use the website's default. */
export type SiteOverrides = {
  siteName: string | null
  titleTemplate: string | null
  defaultDescription: string | null
  defaultKeywords: string[] | null
  defaultImage: string | null
  twitterHandle: string | null
  googleVerification: string | null
  bingVerification: string | null
}

export const emptySiteOverrides: SiteOverrides = {
  siteName: null,
  titleTemplate: null,
  defaultDescription: null,
  defaultKeywords: null,
  defaultImage: null,
  twitterHandle: null,
  googleVerification: null,
  bingVerification: null,
}

/** The site settings the website actually uses: CMS overrides on top of its defaults. */
export function effectiveSite(defaults: SiteDefaults, overrides: SiteOverrides) {
  return {
    url: defaults.url,
    name: overrides.siteName ?? defaults.name,
    titleTemplate: overrides.titleTemplate ?? defaults.titleTemplate,
    description: overrides.defaultDescription ?? defaults.description,
    keywords: overrides.defaultKeywords ?? defaults.keywords,
    image: overrides.defaultImage ?? defaults.image,
    twitterHandle: overrides.twitterHandle ?? defaults.twitterHandle,
    googleVerification: overrides.googleVerification ?? defaults.googleVerification,
    bingVerification: overrides.bingVerification ?? defaults.bingVerification,
  }
}
export type EffectiveSite = ReturnType<typeof effectiveSite>

/** A page's SEO as the website renders it: CMS overrides on top of the page's defaults. */
export function effectivePage(
  path: string,
  defaults: PageDefaults | undefined,
  overrides: PageOverrides,
  site: EffectiveSite
) {
  const title = overrides.title ?? defaults?.title ?? site.name
  const description = overrides.description ?? defaults?.description ?? site.description
  const isHome = path === "/"
  // The home page and pages marked absoluteTitle use their title as-is; other pages go
  // through the title template.
  const fullTitle = isHome || defaults?.absoluteTitle ? title : site.titleTemplate.replace("%s", title)
  return {
    path,
    title,
    fullTitle,
    description,
    keywords: overrides.keywords ?? [],
    canonical: overrides.canonical ?? path,
    ogTitle: overrides.ogTitle ?? fullTitle,
    ogDescription: overrides.ogDescription ?? description,
    image: overrides.image ?? defaults?.image ?? site.image,
    noindex: overrides.noindex ?? defaults?.noindex ?? false,
    nofollow: overrides.nofollow ?? false,
    priority: overrides.priority ?? defaults?.priority ?? null,
    changeFrequency: overrides.changeFrequency ?? defaults?.changeFrequency ?? null,
    hasJsonLd: overrides.jsonLd != null,
  }
}
export type EffectivePage = ReturnType<typeof effectivePage>

export type SeoCheck = { label: string; passed: boolean; hint: string }

/** A quick on-page checklist, shown in the editor and summarised as a score in the list. */
export function seoChecks(page: Pick<EffectivePage, "fullTitle" | "description" | "keywords" | "noindex">): SeoCheck[] {
  const focus = page.keywords[0]?.toLowerCase()
  const titleLength = page.fullTitle.length
  const descriptionLength = page.description.length
  return [
    {
      label: "Title length",
      passed: titleLength >= 30 && titleLength <= 60,
      hint: `${titleLength} characters. Aim for 30-60 so Google shows it in full.`,
    },
    {
      label: "Description length",
      passed: descriptionLength >= 70 && descriptionLength <= 160,
      hint: `${descriptionLength} characters. Aim for 70-160.`,
    },
    {
      label: "Focus keyword set",
      passed: !!focus,
      hint: focus ? `Main keyword: "${page.keywords[0]}".` : "Add at least one focus keyword.",
    },
    {
      label: "Focus keyword in title",
      passed: !!focus && page.fullTitle.toLowerCase().includes(focus),
      hint: "Use the main keyword in the page title.",
    },
    {
      label: "Focus keyword in description",
      passed: !!focus && page.description.toLowerCase().includes(focus),
      hint: "Mention the main keyword in the meta description.",
    },
    {
      label: "Visible to search engines",
      passed: !page.noindex,
      hint: page.noindex ? "This page is set to noindex and left out of the sitemap." : "Indexed and in the sitemap.",
    },
  ]
}

/** "/About/" → "/About". Returns null when it isn't a usable route path. */
export function normalizePath(input: string) {
  const path = input.trim()
  if (!path.startsWith("/") || /[\s?#]/.test(path) || path.length > 300) return null
  return path.length > 1 ? path.replace(/\/+$/, "") || "/" : path
}

/** "a, b ,, c" → ["a", "b", "c"] (null when empty). */
export function parseKeywords(input: string) {
  const list = input
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
  return list.length ? list : null
}

/** Website-relative paths ("/opengraph-image") become absolute so previews can load them. */
export function absoluteUrl(url: string, origin: string) {
  return /^https?:\/\//.test(url) ? url : `${origin.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`
}
