import { seoMetadata } from "@/lib/seo"

import { QixExperience, QixGallery, QixGetStarted, QixHero, QixPillars } from "@/components/qix"

export const generateMetadata = () => seoMetadata("/formats/qix")

export default function QixPage() {
  return (
    <main className="flex-1 bg-white">
      <QixHero />
      <QixExperience />
      <QixPillars />
      <QixGallery />
      <QixGetStarted />
    </main>
  )
}
