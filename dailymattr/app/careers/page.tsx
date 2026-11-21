import { seoMetadata } from "@/lib/seo"

import { CareersApply, CareersHero, CareersRoles, CareersValues } from "@/components/careers/sections"

export const generateMetadata = () => seoMetadata("/careers")

/** /careers: starter content with placeholder roles (components/careers/content.ts). */
export default function CareersPage() {
  return (
    <main className="flex-1 bg-white">
      <CareersHero />
      <CareersValues />
      <CareersRoles />
      <CareersApply />
    </main>
  )
}
