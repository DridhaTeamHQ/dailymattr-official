import { seoMetadata } from "@/lib/seo"

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
      <AdvertiseHero />
      <AdvertiseEnvironment />
      <AdvertisePartnerships />
      <AdvertisePrinciples />
      <AdvertiseEnquiry />
    </main>
  )
}
