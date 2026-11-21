import Image from "next/image"
import Link from "next/link"

import { getNewsCategory, newsPath } from "./content"
import { storyHref, storyImage, type Story } from "./stories"

/**
 * One story in the news grid, after the old site's /news card: a 3:4 photo with 16px corners
 * (cropped from the top, where the faces are), the headline below, then the date and the
 * section, which links to its page.
 */
export function NewsCard({
  story,
  priority,
  headingLevel = "h2",
}: {
  story: Story
  priority?: boolean
  /** h2 in the news grid; h3 where the cards sit under their own h2. */
  headingLevel?: "h2" | "h3"
}) {
  const category = story.category ? getNewsCategory(story.category) : undefined
  const href = storyHref(story)
  const Heading = headingLevel

  return (
    <article className="group flex flex-col gap-2.5">
      {/* The headline below is the link screen readers and keyboards use. */}
      <Link href={href} tabIndex={-1} aria-hidden className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#ececf0]">
        <Image
          src={storyImage(story)}
          alt=""
          fill
          preload={priority}
          sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </Link>
      <Heading className="text-[0.96875rem] leading-[1.35] font-semibold tracking-[-0.01em] text-[#141417]">
        <Link href={href} className="underline-offset-2 hover:underline">
          {story.headline}
        </Link>
      </Heading>
      <p className="flex items-center gap-2 text-xs leading-4">
        <time dateTime={story.published} className="text-[#6b6b73]">
          {story.date}
        </time>
        {category && (
          <Link href={newsPath(category.slug)} className="font-semibold text-brand-blue-deep hover:underline">
            {category.label}
          </Link>
        )}
      </p>
    </article>
  )
}
