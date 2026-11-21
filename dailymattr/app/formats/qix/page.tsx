import { seoMetadata } from "@/lib/seo"

import { QixExperience, QixGallery, QixGetStarted, QixHero } from "@/components/qix"

export const generateMetadata = () => seoMetadata("/formats/qix")

export default function QixPage() {
  return (
    <main className="flex-1 bg-white">
      <QixHero />
      <QixExperience />
      <QixGallery />
      <QixGetStarted />
    </main>
  )
}
