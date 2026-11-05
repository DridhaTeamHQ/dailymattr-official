import { HeroActions } from "./hero-actions"
import { HeroVideoExpand } from "./hero-video-expand"
import { FadeIn } from "@/components/shared/fade-in"
import { WordsReveal } from "@/components/shared/words-reveal"
import { dummyVideo } from "@/lib/dummy-media"

export function Hero() {
  return (
    <>
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
      <WordsReveal
        as="p"
        className="text-xs font-medium tracking-wide text-primary uppercase sm:text-sm"
        text="For curious minds. Busy lives."
        stagger={0.05}
      />
      <WordsReveal
        as="h1"
        className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        text={"Know what matters.\nGet on with your day."}
        // First line lands whole; the second then builds word by word.
        per={["line", "word"]}
        delay={0.18}
        stagger={0.07}
      />
      <WordsReveal
        as="p"
        // Wide enough that the sentence settles on two lines, balanced evenly.
        className="mt-6 max-w-2xl text-base text-balance text-muted-foreground"
        text={"100 handpicked, fact-checked stories a day. Quick reads, video explainers and audio stories that help you make sense of what’s happening."}
        delay={0.7}
        stagger={0.018}
      />
      <FadeIn className="mt-8" delay={0.24}>
        <HeroActions />
      </FadeIn>

    </section>

    {/* Full-bleed, outside the max-w container, so the video can open out to the screen edges. */}
    <HeroVideoExpand src={dummyVideo(0)} />

    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-12 text-center sm:px-6 lg:px-8">
      <FadeIn className="mt-10">
        <p className="text-base font-medium text-foreground sm:text-lg">
          Your daily catch-up. With a clear place to stop.
        </p>
      </FadeIn>
    </section>
    </>
  )
}
