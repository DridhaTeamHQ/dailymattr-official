import { seoMetadata } from "@/lib/seo"
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

export const generateMetadata = () => seoMetadata("/formats/pix")

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
