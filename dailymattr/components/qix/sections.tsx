import { FadeIn } from "@/components/shared/fade-in"
import { PhotoCta } from "@/components/shared/photo-cta"
import type { StoryCover } from "@/components/stories/covers"
import { StoryCarousel } from "@/components/stories/story-carousel"
import type { QixContent } from "@/lib/formats"
import { cn } from "@/lib/utils"
import { QixExperienceSequence } from "./experience-sequence"
import { experience, gallery, getStarted } from "./content"
import { QIX_H2, QixButton, QixEyebrow } from "./primitives"

/** Copy beside four numbered frames on a shared baseline, each playing one beat of the same explainer. Figma 8646:2760. */
export function QixExperience({ frames }: { frames: QixContent["frames"] }) {
  return (
    <section className="bg-white px-4 pt-8 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-[10rem]">
      <div className="mx-auto grid max-w-[75rem] grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[30rem_41rem] lg:justify-between lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <FadeIn className="flex flex-col items-start gap-4">
            <QixEyebrow>{experience.eyebrow}</QixEyebrow>
            <h2 className={QIX_H2}>{experience.title}</h2>
          </FadeIn>
          <FadeIn
            as="p"
            delay={0.2}
            className="max-w-[30rem] pt-2 text-base leading-6 tracking-[-0.0188rem] text-[#696969] lg:text-xl lg:leading-[1.875rem]"
          >
            {experience.description}
          </FadeIn>
        </div>

        {/* Not revealed: the sequence starts its own timed playback once on screen, and this box is
            the sideways scroller it drives on phones. */}
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <QixExperienceSequence frames={frames} />
        </div>
      </div>
    </section>
  )
}

/**
 * The home page's story row (StoryCarousel): the same story covers and videos, scrolling on its
 * own in a loop. Hovering a card pauses the row and plays that card's video; tap on phones.
 */
export function QixGallery({ covers }: { covers: StoryCover[] }) {
  return (
    <section id="gallery" className="scroll-mt-24 bg-white py-20 lg:py-[10rem]">
      <FadeIn className="flex flex-col items-center gap-3 px-4 text-center lg:gap-4">
        <QixEyebrow>{gallery.eyebrow}</QixEyebrow>
        <h2 className={QIX_H2}>{gallery.title}</h2>
      </FadeIn>

      {/* Kept inside the centred 1200px column (Figma 8646:2798); cards scroll within its edges. */}
      <FadeIn delay={0.4} className="mx-auto mt-10 max-w-[75rem] px-4 sm:px-6 lg:mt-16 lg:box-content lg:px-8">
        {covers.length > 0 && <StoryCarousel covers={covers} />}
      </FadeIn>
    </section>
  )
}

/**
 * Closing CTA over a full-bleed photo. Figma 9344:7440. No top padding of its own: the
 * gallery's 160px bottom padding is the gap above the photo.
 */
export function QixGetStarted() {
  return (
    <PhotoCta image={getStarted.image} phoneFocus="object-[83%_50%]" overlay={getStarted.overlay}>
      <h2 className={cn(QIX_H2, "max-w-[7.6em] md:text-white")}>{getStarted.title}</h2>
      <QixButton href={getStarted.cta.href}>{getStarted.cta.label}</QixButton>
    </PhotoCta>
  )
}
