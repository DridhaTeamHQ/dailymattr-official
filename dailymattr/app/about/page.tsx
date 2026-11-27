import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { AboutFormats } from "@/components/about/formats"
import { AboutHero, AboutMedia, AboutPurpose } from "@/components/about/sections"

export const generateMetadata = () => seoMetadata("/about")

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      <SeoJsonLd path="/about" />
      <AboutHero />
      <AboutPurpose />
      <AboutFormats />
      <AboutMedia />
    </main>
  )
}
