import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import {
  PixGetStarted,
  PixHero,
  PixHowItWorks,
  PixStories,
  PixWhyPix,
} from "@/components/pix"

export const generateMetadata = () => seoMetadata("/formats/pix")

export default function PixPage() {
  return (
    <main className="flex-1 bg-white">
      <SeoJsonLd path="/formats/pix" />
      <PixHero />
      <PixHowItWorks />
      <PixWhyPix />
      <PixStories />
      <PixGetStarted />
    </main>
  )
}
