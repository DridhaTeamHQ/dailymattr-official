import { seoMetadata } from "@/lib/seo"
import { SeoJsonLd } from "@/components/shared/seo-json-ld"

import {
  AdvertiseEnquiry,
  AdvertiseEnvironment,
  AdvertiseHero,
  AdvertisePartnerships,
  AdvertisePrinciples,
} from "@/components/advertise/sections"

export const generateMetadata = () => seoMetadata("/advertise")

export default function AdvertisePage() {
  return (
    <main className="flex-1 bg-white">
      <SeoJsonLd path="/advertise" />
      <AdvertiseHero />
      <AdvertiseEnvironment />
      <AdvertisePartnerships />
      <AdvertisePrinciples />
      <AdvertiseEnquiry />
    </main>
  )
}
