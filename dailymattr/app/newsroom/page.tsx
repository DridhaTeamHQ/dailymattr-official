import { seoMetadata } from "@/lib/seo"

import { NewsroomArticle, NewsroomCta, NewsroomHero } from "@/components/newsroom/sections"

export const generateMetadata = () => seoMetadata("/newsroom")

export default function NewsroomPage() {
  return (
    <main className="flex-1 bg-[#0e0e0e]">
      <NewsroomHero />
      <NewsroomArticle />
      <NewsroomCta />
    </main>
  )
}
