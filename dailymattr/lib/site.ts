/**
 * Site-wide SEO settings. Everything search engines see (canonical URLs, Open Graph, the
 * sitemap, robots.txt, structured data) is built from this one place.
 *
 * - NEXT_PUBLIC_SITE_URL: the live domain, e.g. https://www.dailymattr.com. Canonical and
 *   social-card URLs must be absolute, so set it in the production environment.
 * - NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: the Google Search Console "HTML tag" code (just the
 *   content="…" value). When set, the verification meta tag is added to every page.
 */
export const site = {
  name: "dailyMattr",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dailymattr.com").replace(/\/$/, ""),
  title: "dailyMattr – News & Infotainment",
  description:
    "dailyMattr is a news and infotainment app that helps you understand the world within seconds: concise news summaries, visual stories, video explainers, audio and an AI assistant.",
  locale: "en_IN",
  keywords: [
    "dailyMattr",
    "news app",
    "infotainment",
    "news summaries",
    "India news",
    "visual stories",
    "video explainers",
    "audio news",
    "AI news assistant",
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

/** Organization + WebSite structured data, rendered once in the root layout. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.publisher.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        email: site.publisher.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.publisher.address.locality,
          addressRegion: site.publisher.address.region,
          postalCode: site.publisher.address.postalCode,
          addressCountry: site.publisher.address.country,
        },
        brand: { "@type": "Brand", name: site.name },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        description: site.description,
        inLanguage: "en-IN",
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  }
}

/** Serialises structured data for a <script type="application/ld+json">, escaping "<". */
export const jsonLdHtml = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c")
