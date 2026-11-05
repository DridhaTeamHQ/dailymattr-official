import { SectionHeading } from "@/components/shared/section-heading"
import { StoryCarousel } from "./story-carousel"

export function StoriesSection() {
  return (
    <section className="w-full overflow-hidden py-16 sm:py-20">
      <SectionHeading
        className="mx-auto px-4 sm:px-6"
        title={
          <>
            A whole world of stories.
            <br />
            One place to catch up.
          </>
        }
        description="From decisions that shape the country to discoveries that change everyday life."
      />

      <div className="mt-10 sm:mt-12">
        <StoryCarousel />
      </div>
    </section>
  )
}
