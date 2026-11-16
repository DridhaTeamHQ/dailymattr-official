import Image from "next/image"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"
import { experience, gallery, getStarted, hero, pillars } from "./content"
import { MediaPlaceholder, PlayDisc, QIX_H2, QixButton, QixEyebrow, QixTag } from "./primitives"

/** Phone-shaped video placeholder on a grey panel. Figma 8646:2678. */
function HeroVideo() {
  return (
    <div className="grid place-items-center overflow-hidden rounded-3xl bg-[#f7f7f7] px-4 py-8 sm:py-10 lg:h-[40rem] lg:py-0" aria-hidden>
      <div className="relative h-[35rem] w-[18.75rem] overflow-hidden rounded-[1.75rem] bg-[#e6e7ea] shadow-[0px_30px_70px_0px_rgba(16,24,40,0.18)]">
        <div className="grid size-full place-items-center">
          <MediaPlaceholder label="Qix video" />
        </div>
        <PlayDisc size="lg" />
        <div className="absolute top-[30.125rem] left-5 flex w-[16.25rem] flex-col gap-2.5">
          <span className="h-3 w-[13rem] rounded-[0.3125rem] bg-[#d3d5da]" />
          <span className="h-3 w-[8.9375rem] rounded-[0.3125rem] bg-[#d3d5da]" />
          <span className="mt-1.5 h-1 w-full rounded-[2px] bg-black/12">
            <span className="block h-full w-[38%] rounded-[2px] bg-[#3979ff]" />
          </span>
        </div>
      </div>
    </div>
  )
}

/** Copy beside the phone video. Figma 8646:2698: 112 / 120 padding, 540 + 588 columns. */
export function QixHero() {
  return (
    <section className="bg-white px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-[7rem] lg:pb-[7.5rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,33.75rem)_minmax(0,36.75rem)] lg:justify-between lg:gap-[4.5rem]">
        <FadeIn className="flex flex-col items-start gap-5 lg:gap-6">
          <QixTag>{hero.tag}</QixTag>
          <h1 className="max-w-[33.75rem] text-display leading-none font-medium tracking-[-0.0938rem] text-[#1c1c1e] sm:text-5xl sm:leading-none lg:text-6xl lg:leading-16 lg:tracking-[-0.1875rem]">
            {hero.title}
          </h1>
          <p className="max-w-[31.25rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969] lg:text-lg lg:leading-7">
            {hero.description}
          </p>
          <QixButton href={hero.cta.href}>{hero.cta.label}</QixButton>
        </FadeIn>

        <FadeIn delay={0.1}>
          <HeroVideo />
        </FadeIn>
      </div>
    </section>
  )
}

/** Copy beside four numbered frames on a shared baseline. Figma 8646:2760. */
export function QixExperience() {
  return (
    <section className="bg-white px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-[10rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[30rem_41rem] lg:justify-between lg:gap-16">
        <FadeIn className="flex flex-col items-start gap-4">
          <QixEyebrow>{experience.eyebrow}</QixEyebrow>
          <h2 className={QIX_H2}>{experience.title}</h2>
          <p className="max-w-[30rem] pt-2 text-base leading-6 tracking-[-0.0188rem] text-[#696969] lg:text-xl lg:leading-[1.875rem]">
            {experience.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ol className="relative grid w-[41rem] grid-cols-4 gap-4">
            {/* Hairline the step numbers sit on. Figma 8646:2713. */}
            <span aria-hidden className="absolute top-[16.75rem] left-4 h-px w-[39rem] bg-[#ebebeb]" />
            {experience.frames.map((n) => (
              <li key={n} className="relative flex flex-col gap-3">
                <span className="grid h-[14.75rem] w-[8.25rem] place-items-center overflow-hidden rounded-[0.875rem] bg-[#e6e7ea]">
                  <MediaPlaceholder label="Frame" />
                </span>
                <span className="grid size-8 place-items-center rounded-[0.625rem] bg-[#eaf1ff] text-[0.8125rem] leading-8 font-medium tracking-[0.0188rem] text-[#3979ff]">
                  {n}
                </span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  )
}

/** Three white cards on a grey band. Figma 8646:2761. */
export function QixPillars() {
  return (
    <section className="bg-[#f5f5f7] px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <FadeIn>
          <QixEyebrow className="text-center">{pillars.eyebrow}</QixEyebrow>
        </FadeIn>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-6">
          {pillars.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col items-start gap-4 rounded-2xl bg-white p-6 sm:p-8 lg:min-h-[16.25rem] lg:p-10">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eaf1ff]">
                  <Image src={item.icon} alt="" width={24} height={24} className="size-6" />
                </span>
                <h3 className="text-xl leading-7 font-medium tracking-[-0.025rem] text-black">{item.title}</h3>
                <p className="max-w-[19rem] text-base leading-6 tracking-[-0.0125rem] text-[#696969]">
                  {item.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * Row of tall video cards kept inside the centred 1200px column; the cards that don't fit
 * scroll sideways within it. The first card is wider (340 vs 252). Figma 8646:2798.
 */
export function QixGallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-white py-20 lg:py-[10rem]">
      <FadeIn className="flex flex-col items-center gap-3 px-4 text-center lg:gap-4">
        <QixEyebrow>{gallery.eyebrow}</QixEyebrow>
        <h2 className={QIX_H2}>{gallery.title}</h2>
      </FadeIn>

      <FadeIn delay={0.1} className="mx-auto mt-10 max-w-[75rem] px-4 sm:px-6 lg:mt-16 lg:box-content lg:px-8">
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.episodes.map((ep, i) => (
            <li
              key={ep.id}
              className={cn("flex shrink-0 snap-start flex-col gap-3", i === 0 ? "w-[17rem] lg:w-[21.25rem]" : "w-[13rem] lg:w-[15.75rem]")}
            >
              <div className="relative grid h-[22rem] place-items-center overflow-hidden rounded-2xl bg-[#e6e7ea] lg:h-[28rem]">
                <MediaPlaceholder label="Video" />
                <PlayDisc size={i === 0 ? "lg" : "sm"} />
              </div>
              <QixTag>{ep.topic}</QixTag>
              <p className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">{ep.title}</p>
            </li>
          ))}
        </ul>
      </FadeIn>
    </section>
  )
}

/** Closing CTA card. Figma 8646:2924: 160px above and below the 304px card. */
export function QixGetStarted() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 lg:pt-[10rem] lg:pb-[10rem]">
      <FadeIn className="mx-auto max-w-[75rem]">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-[#f7f7f7] px-6 py-14 text-center sm:px-12 sm:py-20 lg:h-[19rem] lg:px-20 lg:py-24">
          <h2 className={QIX_H2}>{getStarted.title}</h2>
          <QixButton href={getStarted.cta.href}>{getStarted.cta.label}</QixButton>
        </div>
      </FadeIn>
    </section>
  )
}
