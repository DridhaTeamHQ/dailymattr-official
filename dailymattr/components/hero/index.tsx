import { HeroActions } from "./hero-actions"
import { HeroVideoExpand } from "./hero-video-expand"
import { FadeIn } from "@/components/shared/fade-in"
import { WordsReveal } from "@/components/shared/words-reveal"
import { dummyVideo } from "@/lib/dummy-media"

export function Hero() {
  return (
    <>
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
      {/* Figma 8585:10494 — eyebrow Medium 18/18 −0.16px #3979ff; title Medium 64/64 −3px #1c1c1e */}
      <WordsReveal
        as="p"
        className="text-sm leading-none font-medium tracking-[-0.01rem] text-[#3979ff] uppercase lg:text-lg"
        text="For curious minds. Busy lives."
        stagger={0.05}
      />
      <WordsReveal
        as="h1"
        className="mt-4 text-4xl leading-none font-medium tracking-[-0.0938rem] text-[#1c1c1e] sm:text-5xl lg:text-6xl lg:tracking-[-0.1875rem]"
        text={"Understand the world\nwithin seconds."}
        // First line lands whole; the second then builds word by word.
        per={["line", "word"]}
        delay={0.18}
        stagger={0.07}
      />
      <FadeIn className="mt-8 lg:mt-10" delay={0.24}>
        <HeroActions />
      </FadeIn>

    </section>

    {/* Full-bleed, outside the max-w container, so the video can open out to the screen edges. */}
    <HeroVideoExpand src={dummyVideo(1)} />

    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-12 text-center sm:px-6 lg:px-8">
      <FadeIn className="mt-10">
        <p className="text-lg font-medium tracking-[-0.025rem] text-[#1c1b17] lg:text-2xl lg:leading-8">
          Your daily catch-up. With a clear place to stop.
        </p>
      </FadeIn>
    </section>
    </>
  )
}
