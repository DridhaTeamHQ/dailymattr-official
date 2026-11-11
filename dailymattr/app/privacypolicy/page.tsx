import { seoMetadata } from "@/lib/seo"

import { PrivacyChoices, PrivacyHero, PrivacyPolicy } from "@/components/privacy/sections"

export const generateMetadata = () => seoMetadata("/privacypolicy")

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-white">
      <PrivacyHero />
      <PrivacyPolicy />
      <PrivacyChoices />
    </main>
  )
}
