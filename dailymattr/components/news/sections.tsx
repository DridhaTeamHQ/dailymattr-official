import Link from "next/link"

import { FadeIn } from "@/components/shared/fade-in"
import { cn } from "@/lib/utils"
import { latestNews, type NewsCategory } from "./content"
import { NewsList } from "./news-list"
import { storiesFor } from "./stories"

// News pages (/news and /news/<category>), laid out after the old site's /news page: breadcrumb,
// title and intro, section pills with a date filter, then a grid of story cards.
// UI only, on sample stories (stories.ts).

/**
 * Side gutters of the news pages: full width with 64px a side from lg, a true 64px like the
 * navbar's (components/navbar/index.tsx), so the content lines up with the nav links.
 */
export const NEWS_GUTTER = "px-4 sm:px-6 lg:px-[64px]"

/** A whole news page: Latest (no category) or one section's stories. */
export function NewsPageView({ category }: { category?: NewsCategory }) {
  const current = "text-[#141417]"

  return (
    <main className="flex-1 bg-white">
      <section className={cn(NEWS_GUTTER, "pt-8 pb-20 sm:pt-10 lg:pb-28")}>
        <div className="w-full">
          <FadeIn>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[0.8125rem] leading-4 text-[#6b6b73]">
                <li>
                  <Link href="/" className="hover:text-[#141417]">
                    Home
                  </Link>
                </li>
                <li aria-hidden>›</li>
                {category ? (
                  <>
                    <li>
                      <Link href="/news" className="hover:text-[#141417]">
                        News
                      </Link>
                    </li>
                    <li aria-hidden>›</li>
                    <li aria-current="page" className={current}>
                      {category.label}
                    </li>
                  </>
                ) : (
                  <li aria-current="page" className={current}>
                    News
                  </li>
                )}
              </ol>
            </nav>

            <h1 className="mt-6 text-[1.625rem] leading-[1.15] font-bold tracking-[-0.02em] text-[#141417] sm:mt-8 sm:text-[2.5rem]">
              {category?.title ?? latestNews.title}
            </h1>
            <p className="mt-3 max-w-[39.25rem] text-[0.9375rem] leading-[1.35] text-[#6b6b73]">
              {category?.description ?? latestNews.description}
            </p>
          </FadeIn>

          <div className="pt-6">
            <NewsList stories={storiesFor(category?.slug)} active={category?.slug} sectionLabel={category?.label} />
          </div>
        </div>
      </section>
    </main>
  )
}
