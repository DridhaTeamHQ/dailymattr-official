import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { appStoreLinks } from "@/components/footer/footer-links"
import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { cn } from "@/lib/utils"
import logoMark from "@/public/Figma_logos/LOGO with blue background (2).svg"
import { storyBodies } from "./articles"
import { getNewsCategory, newsPath } from "./content"
import { NEWS_GUTTER } from "./sections"
import { NewsCard } from "./story-card"
import { stories, storiesFor, storyHref, storyImage, type Story } from "./stories"

// A story's page (/news/<slug>), after the old site's story page: breadcrumb, the tall photo
// beside the headline, byline, key points and source, the app banner, then the previous story
// and older ones from the same section. Round arrows at the screen edges step through the
// section. UI only, on sample stories (stories.ts, articles.ts).

const label = "text-[0.6875rem] leading-4 font-semibold tracking-[0.08em] text-[#6b6b73] uppercase"

/** Dark "get the app" strip with the store badges, as on the old story page. */
function AppBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#141417] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image src={logoMark} alt="" className="size-10 shrink-0 rounded-xl" />
        <div className="flex flex-col gap-0.5">
          <p className="text-sm leading-5 font-semibold text-white">Get 100 stories a day on the app</p>
          <p className="text-xs leading-4 text-white/60">Read, watch &amp; listen · Free on iOS &amp; Android</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <a
          href={appStoreLinks.google}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-85"
        >
          <Image src="/downlods/Text.png" alt="Get it on Google Play" width={134} height={40} className="block h-9 w-auto" />
        </a>
        <a
          href={appStoreLinks.apple}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-opacity hover:opacity-85"
        >
          <Image src="/downlods/apple.png" alt="Download on the App Store" width={126} height={40} className="block h-9 w-auto" />
        </a>
      </div>
    </div>
  )
}

/** Round arrow pinned to the screen edge, stepping to the neighbouring story (desktop). */
function EdgeArrow({ story, side }: { story: Story; side: "left" | "right" }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  return (
    <Link
      href={storyHref(story)}
      aria-label={`${side === "left" ? "Previous" : "Next"} story: ${story.headline}`}
      className={cn(
        "fixed top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white text-[#141417] shadow-[0_4px_16px_rgba(16,24,40,0.12)] ring-1 ring-black/5 transition-[translate,box-shadow] hover:shadow-[0_6px_20px_rgba(16,24,40,0.18)] lg:grid",
        side === "left" ? "left-2 hover:-translate-x-0.5" : "right-2 hover:translate-x-0.5",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </Link>
  )
}

export function StoryPageView({ story }: { story: Story }) {
  const body = storyBodies[story.slug]
  const category = story.category ? getNewsCategory(story.category) : undefined

  // Neighbours within the story's section (or all stories, if it has none). The list runs
  // newest first, so "previous" is the next one down, as on the old site.
  const section = storiesFor(story.category)
  const at = section.findIndex((s) => s.slug === story.slug)
  const newer = at > 0 ? section[at - 1] : undefined
  const previous = section[at + 1]
  const older = section.slice(at + 2, at + 5)

  const shown = new Set([story, previous, ...older].filter(Boolean).map((s) => s!.slug))
  const more = stories.filter((s) => !shown.has(s.slug)).slice(0, 5)

  return (
    <main className="flex-1 bg-white">
      <article className={cn(NEWS_GUTTER, "pt-8 pb-16 sm:pt-10 lg:pb-20")}>
        <FadeIn>
          <nav aria-label="Breadcrumb">
            <ol className="flex min-w-0 items-center gap-1.5 text-[0.8125rem] leading-4 text-[#6b6b73]">
              <li className="shrink-0">
                <Link href="/" className="hover:text-[#141417]">
                  Home
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className="shrink-0">
                <Link href="/news" className="hover:text-[#141417]">
                  News
                </Link>
              </li>
              {category && (
                <>
                  <li aria-hidden>›</li>
                  <li className="shrink-0">
                    <Link href={newsPath(category.slug)} className="hover:text-[#141417]">
                      {category.label}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden>›</li>
              <li aria-current="page" className="min-w-0 truncate text-[#141417]">
                {story.headline}
              </li>
            </ol>
          </nav>
        </FadeIn>

        <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-[3.6rem] xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
          <FadeIn delay={0.4} className="lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#ececf0] lg:aspect-[923/1704]">
              <Image
                src={storyImage(story)}
                alt=""
                fill
                preload
                sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 25rem, 100vw"
                className="object-cover object-top"
              />
            </div>
          </FadeIn>

          {/* Fills the column on laptops; capped on wide screens so the points stay readable. */}
          <div className="flex min-w-0 max-w-[56rem] flex-col">
            <FadeIn>
              <h1 className="text-[1.75rem] leading-[1.18] font-bold tracking-[-0.02em] text-[#141417] sm:text-[2.375rem]">
                {story.headline}
              </h1>

              <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] leading-4 text-[#6b6b73]">
                <span>
                  By <span className="font-semibold text-[#141417]">dailymattr Editorial Team</span>
                </span>
                <time dateTime={story.published}>{story.date}</time>
                {category && (
                  <Link href={newsPath(category.slug)} className="font-semibold text-brand-blue-deep hover:underline">
                    {category.label}
                  </Link>
                )}
              </p>
            </FadeIn>

            {body && (
              <FadeIn delay={0.2}>
                <ul className="mt-6 flex flex-col gap-4">
                  {body.points.map((point) => (
                    <li key={point} className="flex gap-3 text-base leading-[1.6] text-[#141417]">
                      <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-[#3979ff]" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-5 text-[#6b6b73]">
                  Source:{" "}
                  <a
                    href={body.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-blue-deep hover:underline"
                  >
                    {body.source.label}
                  </a>
                </p>
              </FadeIn>
            )}

            <FadeIn delay={0.2} className="mt-6">
              <AppBanner />
            </FadeIn>

            {previous && (
              <FadeIn delay={0.2} className="mt-6">
                <Link
                  href={storyHref(previous)}
                  className="flex flex-col gap-1 rounded-2xl border border-[#e5e4e8] p-4 transition-colors hover:bg-[#f7f7f9]"
                >
                  <span className={label}>Previous</span>
                  <span className="line-clamp-1 text-[0.9375rem] leading-6 font-semibold text-[#141417]">
                    {previous.headline}
                  </span>
                </Link>
              </FadeIn>
            )}

            {older.length > 0 && (
              <FadeIn delay={0.2} className="mt-8">
                <section aria-labelledby="older-stories">
                  <h2 id="older-stories" className={label}>
                    Older
                  </h2>
                  <ul className="mt-2 divide-y divide-[#ececf0]">
                    {older.map((s) => (
                      <li key={s.slug}>
                        <Link href={storyHref(s)} className="group flex items-center gap-4 py-3">
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#ececf0]">
                            <Image src={storyImage(s)} alt="" fill sizes="3.5rem" className="object-cover object-top" />
                          </span>
                          <span className="line-clamp-2 text-[0.9375rem] leading-[1.35] font-semibold text-[#141417] underline-offset-2 group-hover:underline">
                            {s.headline}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            )}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-stories" className={cn(NEWS_GUTTER, "border-t border-[#ececf0] pt-12 pb-20 lg:pb-28")}>
          <FadeIn className="flex items-end justify-between gap-4">
            <h2 id="more-stories" className="text-xl leading-7 font-bold tracking-[-0.02em] text-[#141417] sm:text-2xl">
              More stories
            </h2>
            <Link href="/news" className="text-sm leading-5 font-semibold text-brand-blue-deep hover:underline">
              See all news →
            </Link>
          </FadeIn>
          <ul className="grid grid-cols-1 gap-x-[1.375rem] gap-y-[1.625rem] pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 [&>li:nth-child(5)]:hidden 2xl:[&>li:nth-child(5)]:block">
            {more.map((s, i) => (
              <FadeIn as="li" key={s.slug} delay={revealDelay(i, 5)}>
                <NewsCard story={s} headingLevel="h3" />
              </FadeIn>
            ))}
          </ul>
        </section>
      )}

      {previous && <EdgeArrow story={previous} side="left" />}
      {newer && <EdgeArrow story={newer} side="right" />}
    </main>
  )
}
