import { FadeIn } from "@/components/shared/fade-in"
import { getStarted } from "./content"
import { traxGlow, TraxButton } from "./primitives"

/** Closing CTA card. Figma 8595:12344. */
export function TraxGetStarted() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pb-[10rem]">
      <FadeIn className="mx-auto max-w-[75rem]">
        <div
          className="flex flex-col items-center gap-6 overflow-hidden rounded-[1.5rem] px-6 py-14 text-center font-helvetica sm:px-12 sm:py-20 lg:px-20 lg:py-24"
          style={{ backgroundImage: traxGlow("linear-gradient(#f7f7f7, #f7f7f7)") }}
        >
          <h2 className="text-3xl leading-none font-medium tracking-[-0.0625rem] text-[#1c1c1e] sm:text-display lg:text-5xl lg:leading-13 lg:tracking-[-0.0938rem]">
            {getStarted.title}
          </h2>
          <TraxButton href={getStarted.cta.href}>{getStarted.cta.label}</TraxButton>
        </div>
      </FadeIn>
    </section>
  )
}
