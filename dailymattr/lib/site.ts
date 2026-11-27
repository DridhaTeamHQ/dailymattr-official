/**
 * Site-wide SEO settings. Everything search engines see (canonical URLs, Open Graph, the
 * sitemaps, robots.txt, structured data) is built from this one place.
 *
 * The values match the old dailymattr site (README-OLD-SITE.md) so search engines see the
 * same brand, titles and structured data after the move: the brand is written in lower case
 * ("dailymattr") in titles and metadata, with "Daily Mattr" and the common misspellings as
 * alternate names in the structured data.
 *
 * These are the defaults. The CMS can override the name, title template, default
 * description, keywords and share image, the X handle and the verification codes: read
 * them through getSiteSeo() in lib/site-seo.ts. This file stays free of CMS code because
 * client components (the support and advertise forms) import it too.
 *
 * - NEXT_PUBLIC_SITE_URL: the live domain, e.g. https://www.dailymattr.com. Canonical and
 *   social-card URLs must be absolute, so set it in the production environment.
 * - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: the Google Search Console "HTML tag" code (just the
 *   content="..." value). When set, the verification meta tag is added to every page.
 */
export const site = {
  name: "dailymattr",
  /** Other names people search for; listed as alternateName in the structured data. */
  alternateNames: ["Daily Mattr", "Daily Matter", "Dailymatter"],
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dailymattr.com").replace(/\/$/, ""),
  title: "dailymattr | Short News, Video & Audio Explainers",
  description:
    "Discover 100 fact-checked stories a day with dailymattr. Read short news, watch video explainers and listen to audio. Free on Android and iOS.",
  locale: "en_IN",
  language: "en-IN",
  /** The old site had no keywords meta tag; the CMS can still set site-wide keywords. */
  keywords: [] as string[],
  /** The share card for pages without their own image (1200 x 630, from the old site). */
  shareImage: { url: "/assets/og-default.jpg", width: 1200, height: 630 },
  /** Rectangular raster logo for the structured data: Google rejects SVG and square marks. */
  publisherLogo: { url: "/assets/publisher-logo.png", width: 1560, height: 320 },
  supportEmail: "support@dailymattr.com",
  /** The byline on every story (NewsArticle.author), as on the old site. */
  editorialTeam: { name: "dailymattr Editorial Team" },
  apps: {
    android: "https://play.google.com/store/apps/details?id=com.dailymattr&pcampaignid=web_share",
    ios: "https://apps.apple.com/in/app/dailymattr/id6791996138",
  },
  socialProfiles: [
    "https://www.instagram.com/dailymattr/",
    "https://youtube.com/@dailymattr",
    "https://x.com/dailymattr_news",
    "https://www.linkedin.com/company/dailymattr/",
    "https://www.facebook.com/profile.php?id=61595620943543",
  ],
  publisher: {
    name: "Dridha Technologies Private Limited",
    email: "admin@dridhatechnologies.com",
    address: {
      locality: "Madhapur, Hyderabad",
      region: "Telangana",
      postalCode: "500081",
      country: "IN",
    },
  },
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
} as const

/** An absolute URL on this site for a site-relative path ("/about/" -> "https://.../about/"). */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${site.url}${path}`)

export const organizationId = `${site.url}/#organization`
export const websiteId = `${site.url}/#website`

/** The publisher (NewsMediaOrganization), as on the old site. */
export function organizationLd() {
  return {
    "@type": "NewsMediaOrganization",
    "@id": organizationId,
    name: site.name,
    alternateName: [...site.alternateNames],
    legalName: site.publisher.name,
    url: `${site.url}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(site.publisherLogo.url),
      width: site.publisherLogo.width,
      height: site.publisherLogo.height,
    },
    sameAs: [site.apps.android, site.apps.ios, ...site.socialProfiles],
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.supportEmail },
  }
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${site.url}/`,
    name: site.name,
    alternateName: [...site.alternateNames],
    inLanguage: site.language,
    publisher: { "@id": organizationId },
  }
}

/** NewsMediaOrganization + WebSite structured data, rendered once in the root layout. */
export function siteJsonLd() {
  return { "@context": "https://schema.org", "@graph": [organizationLd(), websiteLd()] }
}

/** Serialises structured data for a <script type="application/ld+json">, escaping "<". */
export const jsonLdHtml = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c")
