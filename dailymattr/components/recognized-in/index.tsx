import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { Separator } from "@/components/ui/separator"
import ambitionBox from "@/public/carousal/ambition-box.png"
import clutch from "@/public/carousal/clutch.png"
import glassdoor from "@/public/carousal/glassdoor.svg"
import goodFirms from "@/public/carousal/Good Firms 1.svg"
import superbCompanies from "@/public/carousal/Superb Companies 2.svg"
import yourStory from "@/public/carousal/headerV3_YS 1.svg"
import tracxn from "@/public/carousal/tracxn-logo-full.svg"

// Press logos, in the Figma order (Tracxn · YourStory · Superb Companies · AmbitionBox ·
// Glassdoor · Clutch · Goodfirms). Heights are the Figma sizes in rem (40px / 32px / 28px), so they scale with the laptop root font size like the rest
// of the site; widths follow each SVG's own aspect ratio.
const logos = [
  { src: tracxn, alt: "Tracxn", className: "h-8" },
  { src: yourStory, alt: "YourStory", className: "h-7" },
  { src: superbCompanies, alt: "Superb Companies", className: "h-8" },
  { src: ambitionBox, alt: "AmbitionBox", className: "h-10" },
  { src: glassdoor, alt: "Glassdoor", className: "h-10" },
  { src: clutch, alt: "Clutch", className: "h-8" },
  { src: goodFirms, alt: "Goodfirms", className: "h-8" },
]

// Enough copies of the logos to overflow a 1920px screen, so one set always fills the row
// while the other slides in behind it.
const SET = Array.from({ length: 2 }, () => logos).flat()

function LogoSet({ hidden }: { hidden?: boolean }) {
  return (
    // pr matches the gap, so the seam between the two sets is the same 97px as inside a set.
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-16 pr-16 lg:gap-[6.0625rem] lg:pr-[6.0625rem]"
    >
      {SET.map((logo, i) => (
        <li key={i} className="shrink-0">
          <Image src={logo.src} alt={hidden ? "" : logo.alt} className={`${logo.className} w-auto`} />
        </li>
      ))}
    </ul>
  )
}

/**
 * "As recognized in" press strip, Figma 8859:12686: eyebrow Helvetica Neue Medium 18/18
 * −0.16px #3979ff, 56px above a row of logos 97px apart. The row loops sideways (two
 * identical sets, the track moves by one set's width), pauses on hover, and stands still for
 * people who prefer reduced motion.
 */
export function RecognizedInSection() {
  return (
    <section aria-labelledby="recognized-in" className="w-full overflow-hidden pt-12 lg:pt-16">
      <FadeIn className="flex flex-col items-center gap-10 lg:gap-14">
        <h2
          id="recognized-in"
          className="px-4 text-center text-sm leading-none font-medium tracking-[-0.01rem] text-[#3979ff] uppercase lg:text-lg"
        >
          As recognized in
        </h2>

        <div className="group w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <LogoSet />
            <LogoSet hidden />
          </div>
        </div>
      </FadeIn>

      {/* Hairline closing the strip, inset to the page's side gutters (as in the Figma frame) */}
      <div className="px-4 pt-12 sm:px-6 lg:px-16 lg:pt-[4.75rem]">
        <Separator />
      </div>
    </section>
  )
}
