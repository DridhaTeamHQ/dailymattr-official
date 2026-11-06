import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import {
  PixGetStarted,
  PixHero,
  PixHowItWorks,
  PixStories,
  PixWhyPix,
} from "@/components/pix"

// The floating cards in the "Why Pix" collage use Plus Jakarta Sans; exposed as font-jakarta.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--nf-jakarta",
})

export const metadata: Metadata = {
  title: "Pix · dailyMattr",
  description:
    "Pix turns the news into visual stories: the important facts, stripped of noise. Swipe through the story and get to what matters.",
}

export default function PixPage() {
  return (
    <main className={`flex-1 bg-white ${jakarta.variable}`}>
      <PixHero />
      <PixHowItWorks />
      <PixWhyPix />
      <PixStories />
      <PixGetStarted />
    </main>
  )
}
