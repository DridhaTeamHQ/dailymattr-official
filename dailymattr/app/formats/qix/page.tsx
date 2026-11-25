import { getQixContent } from "@/lib/formats"
import { seoMetadata } from "@/lib/seo"

import { QixExperience, QixGallery, QixGetStarted, QixHero } from "@/components/qix"

export const generateMetadata = () => seoMetadata("/formats/qix")

export default async function QixPage() {
  // Videos from the CMS (cached; refreshed when it saves)
  const qix = await getQixContent()
  return (
    <main className="flex-1 bg-white">
      <QixHero covers={qix.heroCovers} />
      <QixExperience frames={qix.frames} />
      <QixGallery covers={qix.galleryCovers} />
      <QixGetStarted />
    </main>
  )
}
