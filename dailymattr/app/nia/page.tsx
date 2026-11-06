import type { Metadata } from "next"

import {
  NiaCapabilities,
  NiaHero,
  NiaHowItWorks,
  NiaResponsible,
} from "@/components/nia"

export const metadata: Metadata = {
  title: "NIA · dailyMattr",
  description:
    "NIA is dailyMattr's AI assistant. Ask it to explain a story, simplify a complex topic, or help you connect the dots.",
}

export default function NiaPage() {
  return (
    <main className="flex-1 bg-[#0f0f0f]">
      <NiaHero />
      <NiaHowItWorks />
      <NiaCapabilities />
      <NiaResponsible />
    </main>
  )
}
