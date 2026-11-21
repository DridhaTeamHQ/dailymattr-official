import { FadeIn } from "@/components/shared/fade-in"
import { StoryCarousel } from "@/components/stories/story-carousel"
import { QixExperienceSequence } from "./experience-sequence"
import { experience, gallery, getStarted } from "./content"
import { QIX_H2, QixButton, QixEyebrow } from "./primitives"

/** Copy beside four numbered frames on a shared baseline, each playing one beat of the same explainer. Figma 8646:2760. */
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
          <QixExperienceSequence frames={experience.frames} />
        </FadeIn>
      </div>
    </section>
  )
}

/**
 * The home page's story row (StoryCarousel): the same story covers and videos, scrolling on its
 * own in a loop. Hovering a card pauses the row and plays that card's video; tap on phones.
 */
export function QixGallery() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-white py-20 lg:py-[10rem]">
      <FadeIn className="flex flex-col items-center gap-3 px-4 text-center lg:gap-4">
        <QixEyebrow>{gallery.eyebrow}</QixEyebrow>
        <h2 className={QIX_H2}>{gallery.title}</h2>
      </FadeIn>

      {/* Kept inside the centred 1200px column (Figma 8646:2798); cards scroll within its edges. */}
      <FadeIn delay={0.1} className="mx-auto mt-10 max-w-[75rem] px-4 sm:px-6 lg:mt-16 lg:box-content lg:px-8">
        <StoryCarousel />
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
