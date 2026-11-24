import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { whyPix, type PixFeature } from "./content"
import { PixSectionIntro } from "./primitives"
import { WhyPixVisual } from "./why-pix-visual"

function FeatureItem({ feature }: { feature: PixFeature }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-[0.75rem] bg-white drop-shadow-[0rem_0.0625rem_0.0625rem_rgba(16,24,40,0.06)] drop-shadow-[0rem_0.25rem_0.375rem_rgba(16,24,40,0.04)]">
        <Image src={feature.icon} alt="" width={24} height={24} className="block" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg leading-6 font-bold tracking-[-0.0125rem] text-black">
          {feature.title}
        </h3>
        <p className="max-w-[15rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969]">
          {feature.description}
        </p>
      </div>
    </div>
  )
}

/**
 * Feature list beside the woman-with-phone collage. Figma 8632:2200.
 * Clipped sideways only (overflow-x: clip), so the collage, which sits on the bottom edge,
 * can rise into place from below without being cut off.
 */
export function PixWhyPix() {
  return (
    <section className="relative overflow-x-clip bg-[#f5f5f7] px-4 pt-20 sm:px-6 lg:px-8 xl:py-[10rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] gap-12 xl:grid-cols-[37.5rem_32.5rem] xl:gap-20">
        <div className="flex flex-col self-center">
          <PixSectionIntro align="start" eyebrow={whyPix.eyebrow} title={whyPix.title} />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:mt-12">
            {whyPix.features.map((feature, i) => (
              <FadeIn key={feature.title} delay={revealDelay(i, 2)}>
                <FeatureItem feature={feature} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* On xl the collage hangs off the right column and sits on the section's bottom
            edge, as in the frame; below that it stacks under the copy. */}
        <div className="relative xl:min-h-[35rem]">
          <WhyPixVisual className="mx-auto w-full max-w-[40.75rem] xl:absolute xl:-bottom-[10rem] xl:left-0 xl:w-[min(40.75rem,calc(50vw-6rem))] xl:max-w-none" />
        </div>
      </div>
    </section>
  )
}
