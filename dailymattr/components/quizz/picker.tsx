import { SITE_GUTTER } from "@/components/shared/layout"
import { cn } from "@/lib/utils"
import { editionDate, editions, intro, quizPath } from "./content"
import { SeriesBar, StoryPickCard } from "./parts"

/** Page frame shared by /quizz and /quizz/<slug>. */
export function QuizMain({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 bg-paper">
      <section className={cn(SITE_GUTTER, "pt-6 pb-10 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24")}>{children}</section>
    </main>
  )
}

/** Placeholder for a quiz page while it streams in: the start screen's shape in grey. */
export function QuizSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the quiz" className="mx-auto w-full max-w-[37.5rem] lg:max-w-[66rem]">
      <SeriesBar date={editionDate} />
      <div className="mt-6 grid animate-pulse gap-6 sm:mt-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-12">
        <i className="block aspect-[4/3] rounded-[1.5rem] bg-track sm:aspect-[3/2] lg:aspect-[2/3]" />
        <div className="flex flex-col gap-6 lg:pt-2">
          <div className="grid gap-3">
            <i className="h-4 w-40 rounded-md bg-track" />
            <i className="h-9 w-full rounded-md bg-track" />
            <i className="h-9 w-4/5 rounded-md bg-track" />
            <i className="mt-1 h-5 w-full rounded-md bg-track" />
          </div>
          <div className="grid gap-3">
            {[0, 1, 2].map((i) => (
              <i key={i} className="h-7 w-3/4 rounded-md bg-track" />
            ))}
          </div>
          <i className="mt-2 h-13 rounded-[1rem] bg-white shadow-[inset_0_0_0_1px_var(--color-hairline)]" />
        </div>
      </div>
    </div>
  )
}

/** /quizz: the headline and today's stories. Each card links to /quizz/<slug>. */
export function QuizPicker() {
  return (
    <div className="mx-auto w-full max-w-[37.5rem] lg:max-w-[66rem]">
      <SeriesBar date={editionDate} />
      <div className="mt-6 flex flex-col gap-8 sm:mt-8 lg:gap-10">
        <h1
          // One line from laptop width up; phones and tablets wrap it.
          className="text-3xl leading-9 font-extrabold tracking-[-0.025em] text-balance text-ink sm:text-4xl sm:leading-[2.75rem] lg:text-display lg:leading-[3rem] lg:whitespace-nowrap"
        >
          {intro.title.before}
          <span className="text-brand-blue">{intro.title.accent}</span>
        </h1>

        <section aria-labelledby="pick-heading" className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-3">
            <h2
              id="pick-heading"
              className="text-2xl leading-8 font-bold tracking-[-0.02em] text-ink sm:text-[1.75rem] sm:leading-9 lg:text-3xl lg:leading-[2.375rem]"
            >
              Pick a story to start
            </h2>
            <span className="pb-1 text-sm leading-5 font-medium text-ink-muted lg:text-base">
              {editions.length} stories today
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {editions.map((e) => (
              <StoryPickCard key={e.slug} edition={e} href={quizPath(e.slug)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
