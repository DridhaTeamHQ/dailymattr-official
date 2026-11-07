import { FadeIn } from "@/components/shared/fade-in"
import { getStarted } from "./content"
import { PixButton } from "./primitives"

/** Closing CTA card. Figma 8632:2306. */
export function PixGetStarted() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-[10rem]">
      <FadeIn className="mx-auto flex max-w-[75rem] flex-col gap-10 overflow-hidden rounded-[1.5rem] bg-[#f7f7f7] p-8 sm:p-12 lg:h-[28.75rem] lg:flex-row lg:items-center lg:justify-between lg:p-20">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 font-helvetica">
          <p className="text-sm leading-4 font-medium tracking-[0.0488rem] text-[#3979ff] uppercase lg:text-md">
            {getStarted.eyebrow}
          </p>
          <h2 className="max-w-[36.25rem] text-3xl leading-none font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]">
            {getStarted.title}
          </h2>
          <div className="pt-4">
            <PixButton href={getStarted.cta.href}>{getStarted.cta.label}</PixButton>
          </div>
        </div>

        {/* Empty media slot in the frame (8632:2319), kept as-is until art is supplied. */}
        <div
          aria-hidden
          className="h-[13.75rem] w-full shrink-0 rounded-[1rem] bg-white sm:h-[18.75rem] lg:w-[22.6875rem]"
        />
      </FadeIn>
    </section>
  )
}
