import Image, { type StaticImageData } from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import ambitionBox from "@/public/carousal/ambition-box.png"
import clutch from "@/public/carousal/clutch.svg"
import glassdoor from "@/public/carousal/glassdoor.svg"
import goodFirms from "@/public/carousal/goodfirms.svg"
import superbCompanies from "@/public/carousal/superb-companies.svg"
import yourStory from "@/public/carousal/yourstory.svg"
import tracxn from "@/public/carousal/tracxn.svg"

// Press logos, in the Figma order (Tracxn · YourStory · Superb Companies · AmbitionBox ·
// Glassdoor · Clutch · Goodfirms), exported straight from Figma 9109:5423 so their colours
// match. Heights are the Figma sizes in rem, so they scale with the laptop root font size like
// the rest of the site; widths follow each file's own aspect ratio.
type Logo = {
  src: StaticImageData
  alt: string
  className: string
  /** Figma frame around the artwork, when the artwork doesn't fill it. */
  frame?: string
}

const logos: Logo[] = [
  { src: tracxn, alt: "Tracxn", className: "h-8" }, // 145.455 × 32
  { src: yourStory, alt: "YourStory", className: "h-7" }, // 142.625 × 28
  // 110.446 × 39.024 artwork, 0.864px from the top of a 111.22 × 40 frame
  {
    src: superbCompanies,
    alt: "Superb Companies",
    className: "h-[2.439rem]",
    frame: "h-10 w-[6.95125rem] pt-[0.054rem]",
  },
  { src: ambitionBox, alt: "AmbitionBox", className: "h-12" }, // 192 × 48
  { src: glassdoor, alt: "Glassdoor", className: "h-10" }, // 133.333 × 40
  { src: clutch, alt: "Clutch", className: "h-8" }, // 115.365 × 32
  { src: goodFirms, alt: "Goodfirms", className: "h-10" }, // 206.452 × 40
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
        <li key={i} className={`shrink-0 ${logo.frame ?? ""}`}>
          <Image src={logo.src} alt={hidden ? "" : logo.alt} className={`${logo.className} w-auto`} />
        </li>
      ))}
    </ul>
  )
}

/**
 * "As recognized in" press strip, Figma 8859:12685: a band tinted brand blue at 5%
 * (rgba(57,121,255,0.05)), 64px top and bottom and 40px at the sides. Its top edge meets the
 * bottom of the hero's hand-and-phone image; a 64px margin below keeps it off the stories.
 * Eyebrow Helvetica Neue
 * Medium 18/18 −0.16px brand blue, 56px above a row of logos 97px apart. The row loops sideways
 * (two identical sets, the track moves by one set's width), pauses on hover, and stands still
 * for people who prefer reduced motion.
 */
export function RecognizedInSection() {
  return (
    <section
      aria-labelledby="recognized-in"
      className="mb-12 w-full overflow-hidden bg-brand-blue/5 py-12 lg:mb-16 lg:px-10 lg:py-16"
    >
      <FadeIn className="flex flex-col items-center gap-10 lg:gap-14">
        <h2
          id="recognized-in"
          className="px-4 text-center text-sm leading-none font-medium tracking-[-0.01rem] text-brand-blue uppercase lg:text-lg"
        >
          As recognized in
        </h2>

        <div className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <LogoSet />
            <LogoSet hidden />
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
