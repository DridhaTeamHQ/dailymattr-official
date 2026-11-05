import { HeroActions } from "./hero-actions"
import { HeroShowcase } from "./hero-showcase"

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-16 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8">
      <p className="text-xs font-medium tracking-wide text-primary uppercase sm:text-sm">
        For curious minds. Busy lives.
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Know what matters.
        <br />
        Get on with your day.
      </h1>
      <p className="mt-6 max-w-lg text-base text-muted-foreground">
        100 handpicked, fact-checked stories a day. Quick reads, video explainers and audio
        stories that help you make sense of what&rsquo;s happening.
      </p>
      <div className="mt-8">
        <HeroActions />
      </div>

      <div className="mt-14 w-full">
        <HeroShowcase />
      </div>

      <p className="mt-10 text-base font-medium text-foreground sm:text-lg">
        Your daily catch-up. With a clear place to stop.
      </p>
    </section>
  )
}
