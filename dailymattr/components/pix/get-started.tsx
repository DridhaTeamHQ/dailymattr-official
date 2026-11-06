import { FadeIn } from "@/components/shared/fade-in"
import { getStarted } from "./content"
import { PixButton } from "./primitives"

/** Closing CTA card. Figma 8632:2306. */
export function PixGetStarted() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-[160px]">
      <FadeIn className="mx-auto flex max-w-[1200px] flex-col gap-10 overflow-hidden rounded-[24px] bg-[#f7f7f7] p-8 sm:p-12 lg:h-[460px] lg:flex-row lg:items-center lg:justify-between lg:p-20">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 font-helvetica">
          <p className="text-[13px] leading-4 font-medium tracking-[0.78px] text-[#3979ff] uppercase lg:text-[15px]">
            {getStarted.eyebrow}
          </p>
          <h2 className="max-w-[580px] text-[32px] leading-[1.1] font-medium tracking-[-1px] text-[#1c1c1e] sm:text-[40px] lg:text-[48px] lg:leading-[52px] lg:tracking-[-1.5px]">
            {getStarted.title}
          </h2>
          <div className="pt-4">
            <PixButton href={getStarted.cta.href}>{getStarted.cta.label}</PixButton>
          </div>
        </div>

        {/* Empty media slot in the frame (8632:2319), kept as-is until art is supplied. */}
        <div
          aria-hidden
          className="h-[220px] w-full shrink-0 rounded-[16px] bg-white sm:h-[300px] lg:w-[363px]"
        />
      </FadeIn>
    </section>
  )
}
