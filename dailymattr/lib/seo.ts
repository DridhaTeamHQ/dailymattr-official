import type { Metadata } from "next"

import { newsCategories, newsPath } from "@/components/news/content"
import { editions, quizPath } from "@/components/quizz/content"
import { getCmsSeo, type ChangeFrequency } from "./cms"
import { getSiteSeo } from "./site-seo"
import { site } from "./site"

/**
 * Per-page SEO. The defaults below live in code; the CMS (lib/cms.ts) can override any
 * field of any page, and add pages that aren't listed here. getPageSeo() layers the CMS
 * entry for a path over its default, and every page, the sitemap and the share cards
 * read from it. The CMS shows these defaults through app/api/seo/defaults.
 */
export type PageSeo = {
  /** Short page title; the site's title template (" · dailyMattr") is added around it. */
  title: string
  description: string
  /** Absolute or site-relative share image; omit to use the site's default share card. */
  image?: string
  /** Keep this page out of search results (it is also left out of the sitemap). */
  noindex?: boolean
  /** Sitemap hints. */
  priority?: number
  changeFrequency?: ChangeFrequency
  // Set from the CMS only:
  /** Focus keywords (the first is the main one); without them the site keywords apply. */
  keywords?: string[]
  /** Canonical URL when another address is the main copy; defaults to the page's own path. */
  canonical?: string
  /** Share-card title and description when they should differ from the page's. */
  ogTitle?: string
  ogDescription?: string
  /** Ask search engines not to follow this page's links. */
  nofollow?: boolean
  /** JSON-LD for this page, rendered by components/shared/cms-json-ld.tsx. */
  jsonLd?: unknown
}

/** Local defaults, keyed by route. Add new pages here, or add them in the CMS. */
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
  // Story pages (/news/<slug>) aren't listed: they come from the Pix database and build their
  // SEO from the story itself (app/news/[slug]/page.tsx). The CMS can still override one.
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
  // Shown on the card when the link is shared (WhatsApp, Telegram, ...). Kept out of search:
  // Google's smartphone crawler reports Android, so proxy.ts sends it on to Google Play.
  "/download": {
    title: "Get the App",
    description:
      "100 fact-checked, human-picked stories a day. Download dailyMattr free on the App Store or Google Play.",
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

/**
 * The SEO entry for a route: its CMS overrides over its default from defaultSeo, or over
 * `fallback` for pages built from data (news stories).
 */
export async function getPageSeo(path: string, fallback?: PageSeo): Promise<PageSeo> {
  const [{ pages }, siteSeo] = await Promise.all([getCmsSeo(), getSiteSeo()])
  const base = defaultSeo[path] ?? fallback ?? { title: site.title, description: siteSeo.description }
  return { ...base, ...pages[path] }
}

/** Every route with SEO (the defaults plus pages added in the CMS), for the sitemap. */
export async function getSeoRoutes(): Promise<(PageSeo & { path: string })[]> {
  const { pages } = await getCmsSeo()
  const paths = new Set([...Object.keys(defaultSeo), ...Object.keys(pages)])
  return Promise.all([...paths].map(async (path) => ({ path, ...(await getPageSeo(path)) })))
}

/**
 * Builds a page's metadata from its SEO entry: title, description, canonical URL, robots and
 * matching Open Graph / Twitter cards. Use it as a page's generateMetadata:
 *
 *   export const generateMetadata = () => seoMetadata("/about")
 *
 * `fallback` is the default for a page that isn't in defaultSeo (e.g. a news story). Next
 * replaces (not merges) a parent's openGraph object, so the full set is built here.
 */
export async function seoMetadata(path: string, fallback?: PageSeo): Promise<Metadata> {
  const [seo, siteSeo] = await Promise.all([getPageSeo(path, fallback), getSiteSeo()])
  const isHome = path === "/"
  // The home page uses its title as-is; other pages go through the site's title template.
  const fullTitle = isHome ? seo.title : siteSeo.titleTemplate.replace("%s", seo.title)
  const shareTitle = seo.ogTitle ?? fullTitle
  const shareDescription = seo.ogDescription ?? seo.description
  const canonical = seo.canonical ?? path
  // A page's openGraph replaces the layout's, which drops the inherited share card, so the
  // default (the CMS's default image, else app/opengraph-image.tsx, 1200 × 630) is named here.
  const image = seo.image ?? siteSeo.image
  const images = [
    image
      ? { url: image }
      : { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteSeo.name} – Understand the world within seconds.` },
  ]

  return {
    title: { absolute: fullTitle },
    description: seo.description,
    ...(seo.keywords?.length && { keywords: seo.keywords }),
    alternates: { canonical },
    ...((seo.noindex || seo.nofollow) && { robots: { index: !seo.noindex, follow: !seo.nofollow } }),
    openGraph: {
      type: "website",
      siteName: siteSeo.name,
      locale: site.locale,
      url: canonical,
      title: shareTitle,
      description: shareDescription,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images,
      ...(siteSeo.twitterHandle && { site: siteSeo.twitterHandle, creator: siteSeo.twitterHandle }),
    },
  }
}
