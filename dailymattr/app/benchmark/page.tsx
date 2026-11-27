import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import { NewsroomArticle, NewsroomCta, NewsroomHero } from "@/components/newsroom/sections"

export const generateMetadata = () => seoMetadata("/benchmark")

export default function BenchmarkPage() {
  return (
    <main className="flex-1 bg-[#0e0e0e]">
      <SeoJsonLd path="/benchmark" />
      <NewsroomHero />
      <NewsroomArticle />
      <NewsroomCta />
    </main>
  )
}
