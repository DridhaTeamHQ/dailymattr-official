import { FadeIn } from "@/components/shared/fade-in"
import { hero } from "./content"
import { TraxButton, TraxTag } from "./primitives"

/** Copy on a black band; the right half of the 1200px grid is left empty. Figma 8595:11902. */
export function TraxHero() {
  return (
    <section className="bg-black px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:pt-[7rem] lg:pb-[7.5rem]">
      <div className="mx-auto flex max-w-[75rem] items-center lg:h-[40rem]">
        <FadeIn className="flex max-w-[33.75rem] flex-col items-start gap-5 lg:gap-6">
          <TraxTag className="bg-[rgba(28,104,255,0.2)] leading-[0.8125rem]">{hero.tag}</TraxTag>

          <h1 className="text-display leading-none font-medium tracking-[-0.0938rem] text-white sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="max-w-[31.25rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969] lg:text-lg lg:leading-7">
            {hero.description}
          </p>

          <TraxButton href={hero.cta.href}>{hero.cta.label}</TraxButton>
        </FadeIn>
      </div>
    </section>
  )
}
