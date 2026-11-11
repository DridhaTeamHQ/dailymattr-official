import { seoMetadata } from "@/lib/seo"

import { AboutFormats, AboutHero, AboutMedia, AboutPress, AboutPurpose } from "@/components/about/sections"

export const generateMetadata = () => seoMetadata("/about")

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      <AboutHero />
      <AboutPurpose />
      <AboutFormats />
      <AboutPress />
      <AboutMedia />
    </main>
  )
}
