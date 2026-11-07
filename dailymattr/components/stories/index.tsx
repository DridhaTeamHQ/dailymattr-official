import { SectionHeading } from "@/components/shared/section-heading"
import { StoryCarousel } from "./story-carousel"
import { FadeIn } from "@/components/shared/fade-in"

export function StoriesSection() {
  return (
    <section className="w-full overflow-hidden py-16 sm:py-20 lg:pt-44 lg:pb-10">
      <SectionHeading
        className="mx-auto px-4 sm:px-6"
        title={
          <>
            A whole world of stories.
            <br />
            One place to catch up.
          </>
        }
      />

      <FadeIn className="mt-10 sm:mt-12 lg:mt-24">
        <StoryCarousel />
      </FadeIn>
    </section>
  )
}
