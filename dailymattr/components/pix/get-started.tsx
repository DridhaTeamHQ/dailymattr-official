import { PhotoCta } from "@/components/shared/photo-cta"
import { getStarted } from "./content"
import { PixButton } from "./primitives"

/**
 * Closing CTA as a full-bleed banner, the same layout as Trax and Qix (PhotoCta). The banner
 * photo isn't made yet, so PhotoCta shows its placeholder: pass `image={...}` (a 1920 × 747
 * static import) when it exists, and switch the heading to white from md (`md:text-white`)
 * if the photo is dark behind the copy.
 */
export function PixGetStarted() {
  return (
    <PhotoCta phoneFocus="object-[72%_50%]">
      <p className="text-sm leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase lg:text-md">
        {getStarted.eyebrow}
      </p>
      <h2 className="max-w-[8em] text-3xl leading-none font-bold tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display xl:text-5xl xl:leading-13 xl:tracking-[-0.0938rem]">
        {getStarted.title}
      </h2>
      <PixButton href={getStarted.cta.href}>{getStarted.cta.label}</PixButton>
    </PhotoCta>
  )
}
