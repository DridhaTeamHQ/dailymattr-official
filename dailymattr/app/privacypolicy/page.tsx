import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { PrivacyChoices, PrivacyHero, PrivacyPolicy } from "@/components/privacy/sections"

export const generateMetadata = () => seoMetadata("/privacypolicy")

export default function PrivacyPage() {
  return (
    <main data-footer-divider className="flex-1 bg-white">
      <SeoJsonLd path="/privacypolicy" />
      <PrivacyHero />
      <PrivacyPolicy />
      <PrivacyChoices />
    </main>
  )
}
