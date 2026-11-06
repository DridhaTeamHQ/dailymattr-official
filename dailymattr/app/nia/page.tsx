import type { Metadata } from "next"
import { Inter_Tight, Roboto } from "next/font/google"

import {
  NiaCapabilities,
  NiaHero,
  NiaHowItWorks,
  NiaResponsible,
} from "@/components/nia"
import { NiaScaledMain } from "@/components/nia/nia-scale"
import { cn } from "@/lib/utils"

// Fonts the NIA frame uses besides Inter; exposed as the font-tight / font-roboto utilities.
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--nf-inter-tight" })
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "600"], variable: "--nf-roboto" })

export const metadata: Metadata = {
  title: "NIA · dailyMattr",
  description:
    "NIA is dailyMattr's AI assistant. Ask it to explain a story, simplify a complex topic, or help you connect the dots.",
}

export default function NiaPage() {
  return (
    // On desktop the content zooms to keep the 1920px Figma frame's proportions.
    <NiaScaledMain className={cn(interTight.variable, roboto.variable)}>
      <NiaHero />
      <NiaHowItWorks />
      <NiaCapabilities />
      <NiaResponsible />
    </NiaScaledMain>
  )
}
