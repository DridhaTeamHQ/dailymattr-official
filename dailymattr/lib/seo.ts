import type { Metadata } from "next"

import { latestNews, newsCategories, newsPath } from "@/components/news/content"
import { editions, quizPath } from "@/components/quizz/content"
import { getCmsSeo, type ChangeFrequency } from "./cms"
import { getSiteSeo } from "./site-seo"
import { absoluteUrl, organizationId, organizationLd, site, websiteId } from "./site"
import { canonicalPath } from "./urls"

/**
 * Per-page SEO. The defaults below live in code; the CMS (lib/cms.ts) can override any
 * field of any page, and add pages that aren't listed here. getPageSeo() layers the CMS
 * entry for a path over its default, and every page, the sitemap and the share cards
 * read from it. The CMS shows these defaults through app/api/seo/defaults.
 *
 * The titles, descriptions, canonical URLs and structured data of the pages the old site
 * had are copied from it (README-OLD-SITE.md), so search engines see the same pages after
 * the move. Paths are written without the trailing slash; the public URL adds it
 * (canonicalPath in lib/urls.ts: "/about" -> "/about/").
 */
export type PageSeo = {
  /** Short page title; the site's title template ("%s - dailymattr") is added around it. */
  title: string
  description: string
  /** Use the title as it is, without the title template (like the home page). */
  absoluteTitle?: boolean
  /** Absolute or site-relative share image; omit to use the site's default share card. */
  image?: string
  /** The share image's size and alt text, when known. */
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
  /** Open Graph type: "website" unless set. */
  ogType?: "website" | "article"
  /** A news story's dates and section (og:type article). */
  article?: { publishedTime: string; modifiedTime: string; section?: string }
  /** Keep this page out of search results (it is also left out of the sitemap). */
  noindex?: boolean
  /** Sitemap hints. */
  priority?: number
  changeFrequency?: ChangeFrequency
  /** The page's schema.org type in its structured data (WebPage unless set). */
  schemaType?: "WebPage" | "AboutPage"
  /** The page's name in its breadcrumb trail (its title unless set). */
  breadcrumb?: string
  /** Pages between Home and this page in the breadcrumb trail. */
  breadcrumbParents?: { name: string; path: string }[]
  // Set from the CMS only:
  /** Focus keywords (the first is the main one); without them the site keywords apply. */
  keywords?: string[]
  /** Canonical URL when another address is the main copy; defaults to the page's own URL. */
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
  // ---- Pages the old site had: its titles and descriptions ----
  "/": {
    title: site.title,
    description: site.description,
    absoluteTitle: true,
    priority: 1,
    changeFrequency: "daily",
  },
  "/about": {
    title: "About Us",
    description:
      "dailymattr is a finishable daily news briefing built for urban India: the 100 stories that matter each day, fact-checked and in clean, swipeable cards.",
    schemaType: "AboutPage",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/newsletter": {
    title: "Newsletter",
    description:
      "Subscribe to the dailymattr newsletter - the day's news, minus the noise. Five stories that actually mattr, every morning.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/support": {
    title: "Support",
    description: "Get support for dailymattr from the Dridha Technologies team.",
    priority: 0.4,
    changeFrequency: "yearly",
  },
  "/privacypolicy": {
    title: "Privacy Policy",
    description: "Privacy Policy for dailymattr, the news & infotainment app by Dridha Technologies Private Limited.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  "/termsandconditions": {
    title: "Terms & Conditions",
    description:
      "Terms and Conditions of Use for dailymattr, the news & infotainment app by Dridha Technologies Private Limited.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  // The news list and its sections. Story pages (/news/<slug>) aren't listed: they come from
  // the Pix database and build their SEO from the story itself (storySeo below). The CMS can
  // still override one.
  "/news": {
    title: latestNews.heading,
    description: latestNews.description,
    breadcrumb: "News",
    changeFrequency: "hourly",
  },
  ...Object.fromEntries(
    newsCategories.map((c): [string, PageSeo] => [
      newsPath(c.slug),
      {
        title: c.heading,
        description: c.description,
        breadcrumb: c.label,
        breadcrumbParents: [{ name: "News", path: "/news" }],
        changeFrequency: "hourly",
      },
    ])
  ),

  // ---- Pages only on the new site ----
  "/nia": {
    title: "NIA - AI News Assistant",
    description:
      "NIA is dailymattr's AI assistant. Ask it to explain a story, simplify a complex topic, or help you connect the dots.",
    breadcrumb: "NIA",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/formats/pix": {
    title: "Pix - Visual News Stories",
    description:
      "Pix turns the news into visual stories: the important facts, stripped of noise. Swipe through the story and get to what matters.",
    breadcrumb: "Pix",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/formats/qix": {
    title: "Qix - Short Video Explainers",
    description:
      "Qix makes learning visual: short video explainers that break today's biggest developments and the ideas behind them into clear, easy-to-follow moments.",
    breadcrumb: "Qix",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/formats/trax": {
    title: "Trax - Listen to the News",
    description:
      "Trax lets you listen to the stories that matter: daily wraps, audio explainers and stories on the go, hands-free.",
    breadcrumb: "Trax",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/benchmark": {
    title: "Newsroom",
    description:
      "The people, the process and the stories behind dailymattr: how our editorial team researches, checks and explains the news with facts and context.",
    breadcrumb: "Benchmark",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/advertise": {
    title: "Advertise",
    description:
      "Advertise with dailymattr: display advertising, clearly labelled sponsored content and brand campaigns that respect the reader's experience and editorial independence.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/quizz": {
    title: "News IQ - Take a Quiz on Today's News",
    description:
      "Pick one of today's stories and answer three questions to test how well you know it. Get your Awareness score, your thinking style, and every answer explained.",
    breadcrumb: "News IQ",
    priority: 0.6,
    changeFrequency: "daily",
  },
  // One quiz page per News IQ story (/quizz/<slug>), with the story photo as its share image.
  ...Object.fromEntries(
    editions.map((e): [string, PageSeo] => [
      quizPath(e.slug),
      {
        title: `${e.shareHeadline} - News IQ Quiz`,
        description: `Three questions on "${e.headline}". Test how well you know the story and get your Awareness score.`,
        image: e.image.src,
        breadcrumb: e.shareHeadline,
        breadcrumbParents: [{ name: "News IQ", path: "/quizz" }],
        priority: 0.5,
        changeFrequency: "weekly",
      },
    ])
  ),
  // Starter content only (placeholder roles): drop noindex when real openings are added.
  "/careers": {
    title: "Careers",
    description: "Careers at dailymattr and Dridha Technologies Private Limited.",
    noindex: true,
  },
  // Empty placeholder pages (components/shared/empty-page.tsx), so the navbar's links resolve.
  // noindex keeps them out of search and the sitemap; drop it when a page gets its content.
  "/inside": {
    title: "Inside dailymattr",
    description: "Inside dailymattr: the team, the newsroom and how the platform is built.",
    noindex: true,
  },
  "/login": {
    title: "Log in",
    description: "Log in to your dailymattr account.",
    noindex: true,
  },
  // Shown on the card when the link is shared (WhatsApp, Telegram, ...). Kept out of search:
  // Google's smartphone crawler reports Android, so proxy.ts sends it on to Google Play.
  "/download": {
    title: "Get the App",
    description:
      "100 fact-checked, human-picked stories a day. Download dailymattr free on the App Store or Google Play.",
    noindex: true,
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

type SiteSeo = Awaited<ReturnType<typeof getSiteSeo>>

/** The page's <title>: through the title template, except the home page and absolute titles. */
function fullTitleOf(path: string, seo: PageSeo, siteSeo: SiteSeo) {
  return path === "/" || seo.absoluteTitle ? seo.title : siteSeo.titleTemplate.replace("%s", seo.title)
}

/** The page's public URL path: the CMS's canonical, else the old site's form of its path. */
const canonicalOf = (path: string, seo: PageSeo) => seo.canonical ?? canonicalPath(path)

/**
 * Builds a page's metadata from its SEO entry: title, description, canonical URL, robots and
 * matching Open Graph / Twitter cards. Use it as a page's generateMetadata:
 *
 *   export const generateMetadata = () => seoMetadata("/about")
 *
 * `fallback` is the default for a page that isn't in defaultSeo (e.g. a news story).
 * `adjust` changes the final entry after the CMS overrides (e.g. "page 2" on a news list).
 * Next replaces (not merges) a parent's openGraph object, so the full set is built here.
 */
export async function seoMetadata(
  path: string,
  fallback?: PageSeo,
  adjust?: (seo: PageSeo) => PageSeo
): Promise<Metadata> {
  const [pageSeo, siteSeo] = await Promise.all([getPageSeo(path, fallback), getSiteSeo()])
  const seo = adjust ? adjust(pageSeo) : pageSeo
  const fullTitle = fullTitleOf(path, seo, siteSeo)
  const shareTitle = seo.ogTitle ?? fullTitle
  const shareDescription = seo.ogDescription ?? seo.description
  const canonical = canonicalOf(path, seo)
  // A page's openGraph replaces the layout's, so the default share card is named here: the
  // CMS's default image, else the old site's card (site.shareImage, 1200 x 630).
  const image = seo.image ?? siteSeo.image
  const images = [
    image
      ? {
          url: image,
          ...(seo.imageWidth && seo.imageHeight && { width: seo.imageWidth, height: seo.imageHeight }),
          ...(seo.imageAlt && { alt: seo.imageAlt }),
        }
      : { url: site.shareImage.url, width: site.shareImage.width, height: site.shareImage.height },
  ]
  const article = seo.ogType === "article" ? seo.article : undefined

  return {
    title: { absolute: fullTitle },
    description: seo.description,
    ...(seo.keywords?.length && { keywords: seo.keywords }),
    alternates: { canonical },
    // The old site's robots: "noindex,follow" for hidden pages, the full snippet set for stories;
    // other pages keep the layout's "index, follow, max-image-preview:large".
    ...(seo.noindex || seo.nofollow
      ? { robots: { index: !seo.noindex, follow: !seo.nofollow } }
      : article && {
          robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        }),
    openGraph: {
      siteName: siteSeo.name,
      locale: site.locale,
      url: canonical,
      title: shareTitle,
      description: shareDescription,
      images,
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            ...(article.section && { section: article.section }),
          }
        : { type: "website" }),
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

/* ---------- Structured data ---------- */

/** Home > ... > this page, as on the old site (absolute URLs in the public form). */
export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: absoluteUrl(canonicalPath(t.path)),
    })),
  }
}

/** The page's place in the site: Home, its parents, then the page itself. */
export const pageTrail = (path: string, seo: PageSeo) => [
  { name: "Home", path: "/" },
  ...(seo.breadcrumbParents ?? []),
  { name: seo.breadcrumb ?? seo.title, path },
]

/** The two app listings, as on the old home page. */
function mobileAppsLd() {
  return (
    [
      ["Android", site.apps.android],
      ["iOS", site.apps.ios],
    ] as const
  ).map(([os, url]) => ({
    "@type": "MobileApplication",
    name: site.name,
    operatingSystem: os,
    applicationCategory: "NewsApplication",
    installUrl: url,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": organizationId },
  }))
}

/**
 * A page's own structured data, as the old site had it: the home page lists the apps and its
 * WebPage; other pages a WebPage (AboutPage for About) and their breadcrumb trail. The
 * site-wide NewsMediaOrganization and WebSite are in the root layout. Pages kept out of
 * search get none. Rendered by components/shared/seo-json-ld.tsx.
 */
export async function pageJsonLd(path: string) {
  const [seo, siteSeo] = await Promise.all([getPageSeo(path), getSiteSeo()])
  if (seo.noindex) return null
  const url = absoluteUrl(canonicalOf(path, seo))
  const name = fullTitleOf(path, seo, siteSeo)
  const common = {
    url,
    name,
    description: seo.description,
    inLanguage: site.language,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
  }

  if (path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [...mobileAppsLd(), { "@type": "WebPage", "@id": `${site.url}/#webpage`, ...common }],
    }
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": seo.schemaType ?? "WebPage",
        "@id": url,
        ...common,
        ...(seo.schemaType === "AboutPage" && { about: { "@id": organizationId } }),
      },
      breadcrumbLd(pageTrail(path, seo)),
    ],
  }
}

/** The publisher as a full object, the way the old site put it in every NewsArticle. */
export const publisherLd = organizationLd
