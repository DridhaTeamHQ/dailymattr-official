import type { Metadata } from "next"

import { site } from "./site"

/**
 * Per-page SEO, kept behind one function so it can move to the CMS later.
 *
 * Today getPageSeo() returns the local defaults below. When the CMS is ready, change only
 * getPageSeo() to fetch the entry for `path` (falling back to these defaults when the CMS has
 * none) — every page, the sitemap and the share cards already read from it.
 */
export type PageSeo = {
  /** Short page title; the root layout's template appends " · dailyMattr". */
  title: string
  description: string
  /** Absolute or site-relative share image; omit to use app/opengraph-image.tsx. */
  image?: string
  /** Keep this page out of search results (it is also left out of the sitemap). */
  noindex?: boolean
  /** Sitemap hints. */
  priority?: number
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly"
}

/** Local defaults, keyed by route. Add new pages here (or in the CMS, once it exists). */
export const defaultSeo: Record<string, PageSeo> = {
  "/": {
    title: site.title,
    description: site.description,
    priority: 1,
    changeFrequency: "daily",
  },
  "/nia": {
    title: "NIA – AI News Assistant",
    description:
      "NIA is dailyMattr's AI assistant. Ask it to explain a story, simplify a complex topic, or help you connect the dots.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/formats/pix": {
    title: "Pix – Visual News Stories",
    description:
      "Pix turns the news into visual stories: the important facts, stripped of noise. Swipe through the story and get to what matters.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/formats/trax": {
    title: "Trax – Listen to the News",
    description:
      "Trax lets you listen to the stories that matter: daily wraps, audio explainers and stories on the go, hands-free.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/about": {
    title: "About Us",
    description:
      "DailyMattr is a news and infotainment platform by Dridha Technologies Private Limited, India: concise news summaries, visual stories, video explainers, audio and conversational exploration.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/newsroom": {
    title: "Newsroom",
    description:
      "The people, the process and the stories behind dailyMattr: how our editorial team researches, checks and explains the news with facts and context.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/privacypolicy": {
    title: "Privacy Policy",
    description:
      "How Dridha Technologies Private Limited collects, uses, shares and protects personal data across the DailyMattr website, app and related services.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  "/advertise": {
    title: "Advertise",
    description:
      "Advertise with dailyMattr: display advertising, clearly labelled sponsored content and brand campaigns that respect the reader's experience and editorial independence.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
}

/** The SEO entry for a route. The single place to connect the CMS. */
export async function getPageSeo(path: string): Promise<PageSeo> {
  return defaultSeo[path] ?? { title: site.title, description: site.description }
}

/** All routes that belong in the sitemap. Swap for a CMS listing later. */
export async function getSeoRoutes(): Promise<(PageSeo & { path: string })[]> {
  return Object.entries(defaultSeo).map(([path, seo]) => ({ path, ...seo }))
}

/**
 * Builds a page's metadata from its SEO entry: title, description, canonical URL, robots and
 * matching Open Graph / Twitter cards. Use it as a page's generateMetadata:
 *
 *   export const generateMetadata = () => seoMetadata("/about")
 *
 * Next replaces (not merges) a parent's openGraph object, so the full set is built here.
 */
export async function seoMetadata(path: string): Promise<Metadata> {
  const seo = await getPageSeo(path)
  const isHome = path === "/"
  const fullTitle = isHome ? seo.title : `${seo.title} · ${site.name}`
  // A page's openGraph replaces the layout's, which drops the inherited share card, so the
  // default (app/opengraph-image.tsx, 1200 × 630) is named here explicitly.
  const images = [
    seo.image
      ? { url: seo.image }
      : { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name} – Understand the world within seconds.` },
  ]

  return {
    // The home page uses its title as-is; other pages get the " · dailyMattr" template.
    title: isHome ? { absolute: seo.title } : seo.title,
    description: seo.description,
    alternates: { canonical: path },
    ...(seo.noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title: fullTitle,
      description: seo.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: seo.description,
      images,
    },
  }
}
