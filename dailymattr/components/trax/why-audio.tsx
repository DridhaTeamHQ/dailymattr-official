import { FadeIn } from "@/components/shared/fade-in"
import { whyAudio } from "./content"
import { traxGlow, TraxSectionIntro, Waveform } from "./primitives"

/** Copy beside a large waveform on a grey band. Figma 8595:11944. */
export function TraxWhyAudio() {
  return (
    <section className="bg-[#f5f5f7] px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <TraxSectionIntro eyebrow={whyAudio.eyebrow} title={whyAudio.title} align="start">
          <p className="max-w-[35rem] pt-2 text-base leading-6 tracking-[-0.0188rem] text-[#696969] lg:text-xl lg:leading-[1.875rem]">
            {whyAudio.description}
          </p>
        </TraxSectionIntro>

        <FadeIn delay={0.1}>
          <div
            className="grid h-[15rem] place-items-center overflow-hidden rounded-[1.5rem] px-6 sm:h-[18rem] lg:h-[22.5rem]"
            style={{ backgroundImage: traxGlow("linear-gradient(#fff, #fff)") }}
          >
            {/* Scales the 333px-wide Figma waveform down on narrow panels. */}
            <Waveform
              bars={whyAudio.bars}
              played={whyAudio.played}
              barWidth="3px"
              className="h-[7.5rem] origin-center scale-[0.8] sm:scale-100"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
