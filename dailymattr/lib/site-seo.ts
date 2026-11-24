import "server-only"

import { getCmsSeo } from "./cms"
import { site } from "./site"

/**
 * Site-wide SEO with the CMS's site settings layered over the defaults in lib/site.ts.
 * Server only: kept out of lib/site.ts, which client components import too.
 */

/** The site-wide SEO defaults in code, as the CMS shows them (app/api/seo/defaults). */
export const siteSeoDefaults = {
  url: site.url,
  name: site.name,
  titleTemplate: `%s · ${site.name}`,
  description: site.description,
  keywords: [...site.keywords],
  // app/opengraph-image.tsx, the generated 1200 × 630 share card.
  image: "/opengraph-image",
  twitterHandle: null as string | null,
  googleVerification: site.googleSiteVerification ?? null,
  bingVerification: null as string | null,
}

/** Site-wide SEO as used on the page: the CMS settings over the defaults above. */
export async function getSiteSeo() {
  const { settings } = await getCmsSeo()
  const name = settings.name ?? siteSeoDefaults.name
  return {
    name,
    // A renamed site keeps the default " · name" pattern unless the CMS sets its own.
    titleTemplate: settings.titleTemplate ?? `%s · ${name}`,
    description: settings.description ?? siteSeoDefaults.description,
    keywords: settings.keywords ?? siteSeoDefaults.keywords,
    /** null = the generated card in app/opengraph-image.tsx. */
    image: settings.image ?? null,
    twitterHandle: settings.twitterHandle ?? siteSeoDefaults.twitterHandle,
    googleVerification: settings.googleVerification ?? siteSeoDefaults.googleVerification,
    bingVerification: settings.bingVerification ?? siteSeoDefaults.bingVerification,
  }
}
