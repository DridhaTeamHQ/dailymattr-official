import { seoMetadata } from "@/lib/seo"

import {
  NiaCapabilities,
  NiaHero,
  NiaHowItWorks,
  NiaResponsible,
} from "@/components/nia"
import { NiaScaledMain } from "@/components/nia/nia-scale"

export const generateMetadata = () => seoMetadata("/nia")

export default function NiaPage() {
  return (
    // On desktop the content zooms to keep the 1920px Figma frame's proportions.
    <NiaScaledMain>
      <NiaHero />
      <NiaHowItWorks />
      <NiaCapabilities />
      <NiaResponsible />
    </NiaScaledMain>
  )
}
