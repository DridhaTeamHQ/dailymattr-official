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
        // Figma 9108:5367: 24/32, 24px below the title.
        description="Your daily catch-up. With a clear place to stop."
        descriptionClassName="mt-6 text-lg font-medium tracking-[-0.025rem] text-[#1c1b17] lg:text-2xl lg:leading-8"
      />

      <FadeIn className="mt-10 sm:mt-12 lg:mt-24">
        <StoryCarousel />
      </FadeIn>
    </section>
  )
}
