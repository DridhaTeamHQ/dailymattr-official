import { seoMetadata } from "@/lib/seo"

import { SupportChannels, SupportHero } from "@/components/support/sections"

export const generateMetadata = () => seoMetadata("/support")

/** /support: the footer's Contact link. */
export default function SupportPage() {
  return (
    <main className="flex-1 bg-white">
      <SupportHero />
      <SupportChannels />
    </main>
  )
}
