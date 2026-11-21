import { seoMetadata } from "@/lib/seo"

import { TermsArticle, TermsCta, TermsHero } from "@/components/terms/sections"

export const generateMetadata = () => seoMetadata("/termsandconditions")

export default function TermsPage() {
  return (
    <main className="flex-1 bg-white">
      <TermsHero />
      <TermsArticle />
      <TermsCta />
    </main>
  )
}
