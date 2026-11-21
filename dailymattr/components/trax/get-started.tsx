import { PhotoCta } from "@/components/shared/photo-cta"
import { getStarted } from "./content"
import { TraxButton } from "./primitives"

/**
 * Closing CTA over a full-bleed photo. Figma 9344:7320. The heading steps up to 48px only at
 * xl: any larger at lg, it would run into the woman's hair.
 */
export function TraxGetStarted() {
  return (
    <PhotoCta image={getStarted.image} phoneFocus="object-[72%_50%]" className="font-helvetica">
      <h2 className="max-w-[7.6em] text-3xl leading-none font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display md:text-white xl:text-5xl xl:leading-13 xl:tracking-[-0.0938rem]">
        {getStarted.title}
      </h2>
      <TraxButton href={getStarted.cta.href}>{getStarted.cta.label}</TraxButton>
    </PhotoCta>
  )
}
