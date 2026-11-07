import Image from "next/image"
import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { realStories, type PixStory } from "./content"
import { PixSectionIntro, PixTag } from "./primitives"

function StoryCard({ story }: { story: PixStory }) {
  return (
    <Link
      href={story.href}
      className="group flex h-full flex-col overflow-hidden rounded-[1rem] border border-[#ebebeb] bg-white font-helvetica transition-shadow hover:shadow-[0rem_0.5rem_1.5rem_rgba(16,24,40,0.08)]"
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
        <h3 className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">
          {story.headline}
        </h3>
        <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{story.fact}</p>
      </div>
    </Link>
  )
}

/** Story card row. Figma 8632:2261. */
export function PixStories() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <PixSectionIntro eyebrow={realStories.eyebrow} title={realStories.title} />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
          {realStories.stories.map((story, i) => (
            <FadeIn key={story.id} delay={i * 0.06} className="h-full">
              <StoryCard story={story} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
