import { seoMetadata } from "@/lib/seo"

import {
  TraxExperiences,
  TraxFeatured,
  TraxGetStarted,
  TraxHero,
  TraxWhyAudio,
} from "@/components/trax"

export const generateMetadata = () => seoMetadata("/formats/trax")

export default function TraxPage() {
  return (
    <main className="flex-1 bg-white">
      <TraxHero />
      <TraxExperiences />
      <TraxWhyAudio />
      <TraxFeatured />
      <TraxGetStarted />
    </main>
  )
}
