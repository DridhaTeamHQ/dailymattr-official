import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { featured, type TraxEpisode } from "./content"
import { ProgressLine, traxGlow, TraxSectionIntro, TraxTag } from "./primitives"

/** Large "now playing" card. Figma 8595:12023. */
function FeaturedPlayer() {
  const { episode } = featured

  return (
    <div
      className="grid gap-8 overflow-hidden rounded-[1.5rem] p-5 font-helvetica sm:p-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-center lg:h-[25rem] lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12 lg:p-10"
      style={{ backgroundImage: traxGlow("linear-gradient(#f7f7f7, #f7f7f7)") }}
    >
      <div className="aspect-square w-full rounded-[1.25rem] bg-[#e6e7ea]" />

      <div className="flex min-w-0 flex-col gap-[1.125rem]">
        <div className="flex items-center gap-3">
          <TraxTag>{episode.topic}</TraxTag>
          <span className="text-sm leading-5 text-[#696969]">{episode.duration}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-3xl leading-tight font-medium tracking-[-0.0625rem] text-[#1c1b17] lg:text-display lg:leading-11 lg:tracking-[-0.0938rem]">
            {episode.title}
          </h3>
          <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969] lg:text-lg lg:leading-7">
            {episode.description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <ProgressLine src="/trax/progress-featured.svg" overhang="3.85%" top={36} bottom={30} />
            <div className="mt-2 flex justify-between text-base leading-normal text-[#1c1c1e] lg:text-lg">
              <span>{episode.elapsed}</span>
              <span>{episode.total}</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <button type="button" aria-label="Previous" className="transition-opacity hover:opacity-70">
              <Image src="/trax/skip-back.svg" alt="" width={25} height={24} />
            </button>
            <button
              type="button"
              aria-label="Pause"
              className="rounded-full transition-transform hover:scale-105"
            >
              <Image src="/trax/play-large.svg" alt="" width={68} height={68} />
            </button>
            <button type="button" aria-label="Next" className="transition-opacity hover:opacity-70">
              <Image src="/trax/skip-forward.svg" alt="" width={25} height={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Episode card with a mini progress bar. Figma 8595:12150. */
function EpisodeCard({ episode }: { episode: TraxEpisode }) {
  return (
    <div className="flex h-full flex-col gap-3.5 rounded-[1rem] border border-[#ebebeb] bg-white p-6 font-helvetica">
      <div className="h-[11.25rem] w-full shrink-0 rounded-[0.875rem] bg-[#e6e7ea]" />

      <div className="flex items-center justify-between">
        <TraxTag>{episode.topic}</TraxTag>
        <span className="text-sm leading-5 text-[#696969]">{episode.duration}</span>
      </div>

      <h3 className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">
        {episode.title}
      </h3>
      <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{episode.description}</p>

      <div className="mt-auto flex items-center gap-3 pt-1">
        <button
          type="button"
          aria-label={`Play ${episode.title}`}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#3979ff] transition-colors hover:bg-[#2f6bf0]"
        >
          <Image src="/trax/play-small.svg" alt="" width={14} height={14} />
        </button>
        <ProgressLine src={episode.progress} overhang="10.14%" top={35} bottom={30} />
      </div>
    </div>
  )
}

/** Featured player plus three episode cards. Figma 8595:12017. */
export function TraxFeatured() {
  return (
    <section
      id="featured"
      className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]"
    >
      <div className="mx-auto max-w-[75rem]">
        <TraxSectionIntro eyebrow={featured.eyebrow} title={featured.title} />

        <FadeIn className="mt-10 lg:mt-16">
          <FeaturedPlayer />
        </FadeIn>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6">
          {featured.episodes.map((episode, i) => (
            <FadeIn key={episode.id} delay={i * 0.06} className="h-full">
              <EpisodeCard episode={episode} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
