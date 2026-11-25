import { getTraxContent } from "@/lib/formats"
import { seoMetadata } from "@/lib/seo"

import {
  TraxExperiences,
  TraxFeatured,
  TraxGetStarted,
  TraxHero,
  TraxWhyAudio,
} from "@/components/trax"

export const generateMetadata = () => seoMetadata("/formats/trax")

export default async function TraxPage() {
  // Episodes from the CMS (cached; refreshed when it saves)
  const trax = await getTraxContent()
  return (
    <main className="flex-1 bg-white">
      <TraxHero content={trax} />
      <TraxExperiences />
      <TraxWhyAudio />
      <TraxFeatured playlist={trax.playlist} cards={trax.cards} />
      <TraxGetStarted />
    </main>
  )
}
