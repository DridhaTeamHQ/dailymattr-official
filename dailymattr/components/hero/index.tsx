import { HeroActions } from "./hero-actions"
import { HeroShowcase } from "./hero-showcase"
import { FadeIn } from "@/components/shared/fade-in"
import { dummyVideo } from "@/lib/dummy-media"

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8">
      <FadeIn>
        <p className="text-xs font-medium tracking-wide text-primary uppercase sm:text-sm">
          For curious minds. Busy lives.
        </p>
      </FadeIn>
      <FadeIn className="mt-4" delay={0.08}>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Know what matters.
          <br />
          Get on with your day.
        </h1>
      </FadeIn>
      <FadeIn className="mt-6" delay={0.16}>
        <p className="max-w-lg text-base text-muted-foreground">
          100 handpicked, fact-checked stories a day. Quick reads, video explainers and audio
          stories that help you make sense of what&rsquo;s happening.
        </p>
      </FadeIn>
      <FadeIn className="mt-8" delay={0.24}>
        <HeroActions />
      </FadeIn>

      <FadeIn className="mt-14 w-full" delay={0.32}>
        <HeroShowcase>
          <video src={dummyVideo(0)} autoPlay muted loop playsInline className="size-full object-cover" />
        </HeroShowcase>
      </FadeIn>

      <FadeIn className="mt-10">
        <p className="text-base font-medium text-foreground sm:text-lg">
          Your daily catch-up. With a clear place to stop.
        </p>
      </FadeIn>
    </section>
  )
}
