import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { SupportChannels, SupportHero } from "@/components/support/sections"

export const generateMetadata = () => seoMetadata("/support")

/** /support: the footer's Contact link. */
export default function SupportPage() {
  return (
    <main className="flex-1 bg-white">
      <SeoJsonLd path="/support" />
      <SupportHero />
      <SupportChannels />
    </main>
  )
}
