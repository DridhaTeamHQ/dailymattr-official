import { Suspense } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { latestNews, type NewsCategory } from "./content"
import { DateFilter, DateFilterPlaceholder } from "./date-filter"
import { NewsResults, NewsResultsSkeleton, SectionPills } from "./news-list"

// News pages (/news and /news/<category>), laid out after the old site's /news page: breadcrumb,
// title and intro, section pills with a date filter, then a page of story cards and the page
// numbers. No reveal animations here: the list shows as soon as it loads. The stories come
// from the Pix database (lib/news.ts), one page at a time (?page=, ?date=).

/**
 * Side gutters of the news pages: full width with 64px a side from lg, a true 64px like the
 * navbar's (components/navbar/index.tsx), so the content lines up with the nav links.
 */
export const NEWS_GUTTER = "px-4 sm:px-6 lg:px-[64px]"

/** A whole news page: Latest (no category) or one section's stories. */
export function NewsPageView({
  category,
  searchParams,
}: {
  category?: NewsCategory
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const current = "text-[#141417]"

  return (
    <main className="flex-1 bg-white">
      <section className={cn(NEWS_GUTTER, "pt-8 pb-20 sm:pt-10 lg:pb-28")}>
        <div className="w-full">
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
                    <Link href="/news/" className="hover:text-[#141417]">
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

          <div className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
              <SectionPills active={category?.slug} />
              <Suspense fallback={<DateFilterPlaceholder />}>
                <DateFilter />
              </Suspense>
            </div>
            <Suspense fallback={<NewsResultsSkeleton />}>
              <NewsResults category={category?.slug} sectionLabel={category?.label} searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}
