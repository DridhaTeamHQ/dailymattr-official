import Link from "next/link"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { getNewsPage, NEWS_PAGE_SIZE } from "@/lib/news"
import { cn } from "@/lib/utils"
import { JsonLd } from "@/components/shared/seo-json-ld"
import { newsCategories, newsPath, newsSectionHref } from "./content"
import { newsListHref, newsListJsonLd } from "./seo"
import { NewsCard } from "./story-card"

// The news list on /news and /news/<section>: section pills and a date filter, then a page of
// story cards with numbered pages under them. The page and day live in the URL, in the old
// site's form (/news/india/page/2/?date=2026-11-21; proxy.ts hands the page number to the
// page as ?page=), and the server reads only that page of stories (lib/news.ts).

const tabs = [
  { slug: undefined, label: "Latest", href: "/news/" },
  ...newsCategories.map((c) => ({ slug: c.slug, label: c.label, href: newsSectionHref(c.slug) })),
]

const pill = "flex h-[2.0625rem] items-center rounded-full px-3.5 text-[0.84375rem] leading-none font-semibold whitespace-nowrap transition-colors"
const pagerButton =
  "flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e4e8] px-[1.125rem] text-sm leading-none font-semibold text-[#141417] transition-colors hover:bg-[#f7f7f9]"

/** The same grid on every news page, and in the loading state. */
export const NEWS_GRID =
  "grid grid-cols-2 gap-x-3 gap-y-6 pt-6 sm:gap-x-[1.375rem] sm:gap-y-[1.625rem] md:grid-cols-4 2xl:grid-cols-5"

export type NewsQuery = { page: number; date: string }

/** ?page= (1 when missing or not a number) and ?date= (YYYY-MM-DD, else none). */
export function parseNewsQuery(params: Record<string, string | string[] | undefined>): NewsQuery {
  const page = Number.parseInt(typeof params.page === "string" ? params.page : "", 10)
  const date = typeof params.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : ""
  return { page: Number.isFinite(page) && page > 0 ? Math.min(page, 100_000) : 1, date }
}

/** A list page's address: /news/india/page/3/?date=..., leaving out page 1 and an empty date. */
export const newsHref = newsListHref

const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

/** Section pills, after the old site's /news page: links to each section's page. */
export function SectionPills({ active }: { active?: string }) {
  return (
    <nav aria-label="News sections">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const current = t.slug === active
          return (
            <li key={t.label}>
              <Link
                href={t.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  pill,
                  current ? "bg-brand-blue-deep text-white" : "bg-[#f3f3f6] text-[#141417] hover:bg-[#e9e9ee]",
                )}
              >
                {t.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/** One page of stories for the URL's ?page= and ?date=, with the page numbers. */
export async function NewsResults({
  category,
  sectionLabel,
  searchParams,
}: {
  category?: string
  sectionLabel?: string
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = parseNewsQuery(await searchParams)
  const basePath = category ? newsPath(category) : "/news"
  const { stories, total } = await getNewsPage({ category, date: query.date || undefined, page: query.page })
  const pages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE))
  const section = sectionLabel ? `${sectionLabel} ` : ""

  if (stories.length === 0) {
    const pastTheEnd = total > 0
    return (
      <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-[#f7f7f9] px-6 py-16 text-center">
        <p className="text-base leading-6 font-semibold text-[#141417]">
          {pastTheEnd
            ? `There are only ${pages} pages of ${section}stories.`
            : query.date
              ? `No ${section}stories on ${formatDay(query.date)}.`
              : `No ${section}stories yet.`}
        </p>
        {pastTheEnd ? (
          <Link href={newsHref(basePath, { page: 1, date: query.date })} className={pagerButton}>
            Go to the first page
          </Link>
        ) : query.date ? (
          <Link href={newsListHref(basePath, { page: 1, date: "" })} className={pagerButton}>
            Show all dates
          </Link>
        ) : (
          <Link href="/news/" className={pagerButton}>
            See the latest news
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      {/* CollectionPage of this page's stories, as on the old site */}
      <JsonLd data={await newsListJsonLd(basePath, query, stories, NEWS_PAGE_SIZE)} />
      <ul className={NEWS_GRID}>
        {stories.map((story, i) => (
          <li key={story.id}>
            <NewsCard story={story} priority={query.page === 1 && i < 5} />
          </li>
        ))}
      </ul>
      {pages > 1 && <NewsPagination basePath={basePath} query={query} pages={pages} />}
    </>
  )
}

/**
 * Page numbers to show: the first and last, the current one with its neighbours, and "…"
 * for the gaps (a gap of one page shows that page instead).
 */
function pageItems(current: number, last: number): (number | "gap")[] {
  const shown = new Set([1, last, current - 1, current, current + 1])
  // Near either end, show the first or last four so the row doesn't shrink to three numbers.
  if (current <= 3) [2, 3, 4].forEach((n) => shown.add(n))
  if (current >= last - 2) [last - 1, last - 2, last - 3].forEach((n) => shown.add(n))
  const pages = [...shown].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)

  const items: (number | "gap")[] = []
  pages.forEach((n, i) => {
    const gap = i > 0 ? n - pages[i - 1] : 1
    if (gap === 2) items.push(n - 1)
    else if (gap > 2) items.push("gap")
    items.push(n)
  })
  return items
}

/** shadcn Pagination: Previous, numbered pages and Next, each a link to its /page/N/. */
function NewsPagination({ basePath, query, pages }: { basePath: string; query: NewsQuery; pages: number }) {
  const current = Math.min(query.page, pages)
  const href = (page: number) => newsHref(basePath, { page, date: query.date })
  const number = "rounded-full font-semibold tabular-nums"
  const edge = "rounded-full font-semibold"
  const off = "pointer-events-none opacity-40"

  return (
    <Pagination className="mt-12">
      <PaginationContent className="flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious
            href={href(Math.max(1, current - 1))}
            aria-disabled={current === 1}
            tabIndex={current === 1 ? -1 : undefined}
            className={cn(edge, current === 1 && off)}
          />
        </PaginationItem>
        {pageItems(current, pages).map((item, i) =>
          item === "gap" ? (
            <PaginationItem key={`gap-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href={href(item)}
                isActive={item === current}
                aria-label={`Page ${item}`}
                className={cn(
                  number,
                  item === current && "border-transparent bg-brand-blue-deep text-white hover:bg-brand-blue-deep hover:text-white",
                )}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={href(Math.min(pages, current + 1))}
            aria-disabled={current === pages}
            tabIndex={current === pages ? -1 : undefined}
            className={cn(edge, current === pages && off)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

/** Placeholder cards while a page of stories loads. */
export function NewsResultsSkeleton() {
  return (
    <ul className={NEWS_GRID} aria-hidden>
      {Array.from({ length: NEWS_PAGE_SIZE }, (_, i) => (
        <li key={i} className="flex flex-col gap-2.5">
          <span className="block aspect-[3/4] rounded-2xl bg-[#ececf0]" />
          <span className="block h-4 w-11/12 rounded bg-[#ececf0]" />
          <span className="block h-4 w-2/3 rounded bg-[#ececf0]" />
        </li>
      ))}
    </ul>
  )
}
