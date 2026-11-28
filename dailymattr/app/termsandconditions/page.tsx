import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { TermsArticle, TermsCta, TermsHero } from "@/components/terms/sections"

export const generateMetadata = () => seoMetadata("/termsandconditions")

export default function TermsPage() {
  return (
    <main data-footer-divider className="flex-1 bg-white">
      <SeoJsonLd path="/termsandconditions" />
      <TermsHero />
      <TermsArticle />
      <TermsCta />
    </main>
  )
}
