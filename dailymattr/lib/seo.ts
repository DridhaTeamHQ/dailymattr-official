import type { Metadata } from "next"

import { storyBodies } from "@/components/news/articles"
import { newsCategories, newsPath } from "@/components/news/content"
import { stories, storyImage } from "@/components/news/stories"
import { editions, quizPath } from "@/components/quizz/content"
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
  "/formats/qix": {
    title: "Qix – Short Video Explainers",
    description:
      "Qix makes learning visual: short video explainers that break today's biggest developments and the ideas behind them into clear, easy-to-follow moments.",
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
  "/benchmark": {
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
  "/quizz": {
    title: "News IQ – Take a Quiz on Today's News",
    description:
      "Pick one of today's stories and answer three questions to test how well you know it. Get your Awareness score, your thinking style, and every answer explained.",
    priority: 0.6,
    changeFrequency: "daily",
  },
  // One quiz page per News IQ story (/quizz/<slug>), with the story photo as its share image.
  ...Object.fromEntries(
    editions.map((e): [string, PageSeo] => [
      quizPath(e.slug),
      {
        title: `${e.shareHeadline} – News IQ Quiz`,
        description: `Three questions on "${e.headline}". Test how well you know the story and get your Awareness score.`,
        image: e.image.src,
        priority: 0.5,
        changeFrequency: "weekly",
      },
    ])
  ),

  // Empty placeholder pages (components/shared/empty-page.tsx), so the footer's links resolve.
  // noindex keeps them out of search and the sitemap; drop it when a page gets its content.
  "/news": {
    title: "Latest News",
    description:
      "News articles, updates and current affairs. Latest news, breaking news and the latest headlines today from India and around the world.",
    noindex: true,
  },
  ...Object.fromEntries(
    newsCategories.map((c): [string, PageSeo] => [
      newsPath(c.slug),
      { title: c.title, description: c.description, noindex: true },
    ])
  ),
  // One page per sample story (/news/<slug>), with its photo as the share image. Sample data
  // (components/news/stories.ts), so kept out of search until the CMS feed replaces it.
  ...Object.fromEntries(
    stories.map((s): [string, PageSeo] => [
      newsPath(s.slug),
      {
        title: s.headline,
        description: storyBodies[s.slug]?.points[0] ?? s.headline,
        image: storyImage(s),
        noindex: true,
      },
    ])
  ),
  // Built, but the sign-up form isn't connected to a mailing list yet: drop noindex once it is.
  "/newsletter": {
    title: "Newsletter",
    description: "Curated news briefings and summarized stories, delivered as a daily news briefing.",
    noindex: true,
  },
  "/careers": {
    title: "Careers",
    description: "Careers at dailyMattr and Dridha Technologies Private Limited.",
    noindex: true,
  },
  "/support": {
    title: "Support",
    description:
      "Get help with the dailyMattr app: send a request to our support team about your account, a technical issue or app feedback.",
    priority: 0.4,
    changeFrequency: "yearly",
  },
  "/inside": {
    title: "Inside dailyMattr",
    description: "Inside dailyMattr: the team, the newsroom and how the platform is built.",
    noindex: true,
  },
  "/login": {
    title: "Log in",
    description: "Log in to your dailyMattr account.",
    noindex: true,
  },
  "/download": {
    title: "Get the App",
    description: "Download the dailyMattr app for iPhone and Android.",
    noindex: true,
  },
  "/termsandconditions": {
    title: "Terms and Conditions",
    description:
      "The terms that govern your use of the dailyMattr app and related services, provided by Dridha Technologies Private Limited.",
    priority: 0.3,
    changeFrequency: "yearly",
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
