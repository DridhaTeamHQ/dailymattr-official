import Image from "next/image"
import Link from "next/link"

import { Carousel } from "@/components/ui/apple-cards-carousel"
import { FadeIn } from "@/components/shared/fade-in"

// Figma 8859:13168 "Happening now" — header block (24px gaps) 80px above a full-width row of
// 300 × 478 story cards with 20px gaps. Each story image already carries its headline and date.
type Story = { tag: string; src?: string; href: string }

const stories: Story[] = [
  { tag: "India", src: "/happening-now/story-1.png", href: "/" },
  { tag: "India", src: "/happening-now/story-2.png", href: "/" },
  // Figma leaves this card as an empty #2a2b30 fill.
  { tag: "India", href: "/" },
  { tag: "India", src: "/happening-now/story-3.png", href: "/" },
  { tag: "India", src: "/happening-now/story-1.png", href: "/" },
  { tag: "India", src: "/happening-now/story-1.png", href: "/" },
  { tag: "India", src: "/happening-now/story-1.png", href: "/" },
]

function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={story.href}
      className="group relative block aspect-[300/478] w-[13.75rem] overflow-hidden rounded-2xl bg-[#2a2b30] sm:w-[18.75rem]"
    >
      {story.src && (
        // Figma: the image layer is 556px tall, starting 52px above the 478px card, object-cover.
        <Image
          src={story.src}
          alt=""
          fill
          sizes="300px"
          className="top-[-10.88%]! h-[116.32%]! object-cover"
        />
      )}
      <span className="absolute top-3 left-3 rounded-lg bg-black/20 px-2 py-1.5 text-[0.8125rem] leading-none tracking-[0.05rem] text-white uppercase backdrop-blur-[20px]">
        {story.tag}
      </span>
      <span className="absolute right-4 bottom-4 flex h-10 items-center gap-2 rounded-[0.8125rem] bg-white pr-3 pl-4 text-base leading-6 font-medium tracking-[-0.01rem] text-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)] transition-transform group-hover:-translate-y-0.5">
        Read the story
        <img src="/happening-now/arrow-up-right.svg" alt="" width={20} height={21} />
      </span>
    </Link>
  )
}

export function TemplatesSection() {
  return (
    <section className="flex w-full flex-col items-center gap-20 py-20">
      <FadeIn className="flex flex-col items-center gap-6 px-6 text-center">
        <p className="text-lg leading-[1.125rem] font-medium text-[#3979ff] uppercase">
          Happening now
        </p>
        <h2 className="font-tight text-3xl leading-tight font-medium tracking-[-0.0625rem] text-[#1c1b17] sm:text-4xl lg:text-5xl lg:leading-[3.6rem] lg:tracking-[-0.12rem]">
          Start with today&rsquo;s stories.
        </h2>
        <p className="max-w-[28.375rem] text-base tracking-[-0.025rem] text-[#1c1b17] lg:text-xl lg:leading-7">
          Explore the latest updates, then follow the stories that catch your attention.
        </p>
        <Link
          href="/"
          className="flex h-10 items-center gap-2 rounded-[0.8125rem] bg-[#3979ff] pr-3 pl-4 text-base leading-6 font-medium tracking-[-0.01rem] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)] hover:bg-[#3979ff]/90"
        >
          See all latest stories
          <img src="/happening-now/arrow-up-right-white.svg" alt="" width={20} height={20} />
        </Link>
      </FadeIn>

      {/* Card row bleeds to the full screen width. */}
      <FadeIn className="w-full">
        <Carousel
          className="[&>div]:rounded-none [&>div>div]:gap-5"
          items={stories.map((story, index) => (
            <StoryCard key={index} story={story} />
          ))}
        />
      </FadeIn>
    </section>
  )
}
