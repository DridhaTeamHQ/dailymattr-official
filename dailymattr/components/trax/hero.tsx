import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { hero, phonePlayer } from "./content"
import { traxGlow, TraxButton, TraxTag, Waveform } from "./primitives"

/** Phone mock-up with the Trax player. Figma 8595:11824. */
function PhonePlayer() {
  return (
    <div
      className="relative w-[18.75rem] shrink-0 rounded-[3rem] bg-[#101114] p-2.5 drop-shadow-[0px_40px_40px_rgba(16,24,40,0.18)]"
      aria-hidden
    >
      {/* Dynamic island */}
      <span className="absolute top-5 left-1/2 z-10 h-[1.625rem] w-[5.625rem] -translate-x-1/2 rounded-[0.8125rem] bg-black" />

      <div className="flex h-[37.5rem] flex-col gap-4 overflow-hidden rounded-[2.375rem] bg-white px-[1.375rem] pt-16 pb-[1.375rem] font-helvetica">
        <div className="h-[16.75rem] w-full shrink-0 rounded-[1.25rem] bg-[#e6e7ea]" />

        <div className="flex items-center justify-between">
          <TraxTag>{phonePlayer.topic}</TraxTag>
          <span className="text-sm leading-5 text-[#696969]">{phonePlayer.elapsed}</span>
        </div>

        <p className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">
          {phonePlayer.title}
        </p>

        <Waveform
          bars={phonePlayer.bars}
          played={phonePlayer.played}
          barWidth="2.97px"
          className="h-8 overflow-hidden"
        />

        <div className="flex items-start justify-between text-sm leading-5 text-[#696969]">
          <span>{phonePlayer.elapsed}</span>
          <span>{phonePlayer.remaining}</span>
        </div>

        <div className="flex items-center justify-center gap-7">
          <Image src="/trax/player-rewind.svg" alt="" width={22} height={22} />
          <span className="grid size-14 place-items-center rounded-full bg-[#3979ff]">
            <Image src="/trax/player-play.svg" alt="" width={22} height={22} />
          </span>
          <Image src="/trax/player-forward.svg" alt="" width={22} height={22} />
        </div>
      </div>
    </div>
  )
}

/** Copy beside the phone player on a glowing panel. Figma 8595:11807. */
export function TraxHero() {
  return (
    <section className="bg-white px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-[7rem] lg:pb-[7.5rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,33.75rem)_minmax(0,36.75rem)] lg:justify-between lg:gap-[4.5rem]">
        <FadeIn className="flex flex-col items-start gap-5 font-helvetica lg:gap-6">
          <TraxTag>{hero.tag}</TraxTag>

          <h1 className="text-display leading-none font-medium tracking-[-0.0938rem] text-[#1c1c1e] sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
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

        <FadeIn delay={0.1}>
          <div
            className="grid place-items-center overflow-hidden rounded-[1.5rem] px-4 py-8 sm:py-10 lg:h-[40rem] lg:py-0"
            style={{ backgroundImage: traxGlow("linear-gradient(#f7f7f7, #f7f7f7)") }}
          >
            <PhonePlayer />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
