import { getQixContent } from "@/lib/formats"
import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { QixExperience, QixGetStarted, QixHero, QixShowcase } from "@/components/qix"

export const generateMetadata = () => seoMetadata("/formats/qix")

export default async function QixPage() {
  // Videos from the CMS (cached; refreshed when it saves)
  const qix = await getQixContent()
  return (
    <main className="flex-1 bg-white">
      <SeoJsonLd path="/formats/qix" />
      <QixShowcase covers={qix.showcaseCovers} />
      <QixHero covers={qix.heroCovers} />
      <QixExperience frames={qix.frames} />
      <QixGetStarted />
    </main>
  )
}
