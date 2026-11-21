import { seoMetadata } from "@/lib/seo"

import { NewsletterHabit, NewsletterHero } from "@/components/newsletter/sections"

export const generateMetadata = () => seoMetadata("/newsletter")

/**
 * /newsletter: the navbar's Newsletter link, the footer's "Subscribe to newsletter", and where
 * the home page's newsletter card submits to. Copy from the old site's /newsletter page.
 */
export default function NewsletterPage() {
  return (
    <main className="flex-1 bg-white">
      <NewsletterHero />
      <NewsletterHabit />
    </main>
  )
}
