import Image from "next/image"
import Link from "next/link"

import { storyHref } from "@/components/news/stories"
import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { getPixShowcase } from "@/lib/news"
import { realStories, type PixStory } from "./content"
import { PixSlideCard } from "./pix-slides"
import { PixSectionIntro, PixTag } from "./primitives"

function StoryCard({ story }: { story: PixStory }) {
  return (
    <Link
      href={story.href}
      className="group flex h-full flex-col overflow-hidden rounded-[1rem] border border-[#ebebeb] bg-white transition-shadow hover:shadow-[0rem_0.5rem_1.5rem_rgba(16,24,40,0.08)]"
    >
      <div className="relative h-[13.75rem] shrink-0 overflow-hidden bg-[#e6e7ea]">
        {story.image && (
          <Image
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 1024px) 282px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: story.image.position }}
          />
        )}
      </div>
      <div className="flex flex-col items-start gap-2.5 px-5 pt-5 pb-6">
        <PixTag>{story.category}</PixTag>
        <h3 className="text-lg leading-6 font-bold tracking-[-0.0125rem] text-black">
          {story.headline}
        </h3>
        <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{story.fact}</p>
      </div>
    </Link>
  )
}

/**
 * Story card row (Figma 8632:2261): real Pix from the Pix database (lib/news.ts
 * getPixShowcase), the newest World, Business, Entertainment and Sports story, each as its
 * swipeable slides with a "Read the story" button on them. Falls back to the design's
 * placeholder cards when Pix can't be read.
 */
export async function PixStories() {
  const showcase = await getPixShowcase()

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <PixSectionIntro eyebrow={realStories.eyebrow} title={realStories.title} />

        {showcase.length > 0 ? (
          // Phones and tablets: one row swiped sideways (like the home page's Pix row), so each
          // card stays wide enough to read the text on its slides. Desktop: four columns.
          <div className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:snap-none lg:mt-16 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {showcase.map(({ story, slides }, i) => (
              <FadeIn key={story.id} delay={revealDelay(i, 4)} className="w-[16rem] shrink-0 snap-start snap-always sm:w-[18rem] lg:w-auto">
                <PixSlideCard slides={slides} headline={story.headline} href={storyHref(story)} />
              </FadeIn>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {realStories.stories.map((story, i) => (
              <FadeIn key={story.id} delay={revealDelay(i, 4)} className="h-full">
                <StoryCard story={story} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
