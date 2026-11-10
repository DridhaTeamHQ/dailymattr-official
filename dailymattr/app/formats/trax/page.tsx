import type { Metadata } from "next"

import {
  TraxExperiences,
  TraxFeatured,
  TraxGetStarted,
  TraxHero,
  TraxWhyAudio,
} from "@/components/trax"

export const metadata: Metadata = {
  title: "Trax · dailyMattr",
  description:
    "Trax lets you listen to the stories that matter: daily wraps, audio explainers and stories on the go, hands-free.",
}

export default function TraxPage() {
  return (
    <main className="flex-1 bg-white">
      <TraxHero />
      <TraxExperiences />
      <TraxWhyAudio />
      <TraxFeatured />
      <TraxGetStarted />
    </main>
  )
}
