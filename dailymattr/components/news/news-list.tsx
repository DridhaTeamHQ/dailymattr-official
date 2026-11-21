"use client"

import Link from "next/link"
import { useLenis } from "lenis/react"
import { CalendarDays, X } from "lucide-react"
import { useRef, useState } from "react"

import { useNavHeight } from "@/components/navbar/nav-height"
import { cn } from "@/lib/utils"
import { newsCategories, newsPath } from "./content"
import { NewsCard } from "./story-card"
import type { Story } from "./stories"

/**
 * Cards per page: whole rows at four columns and at five. The old site pages by 30 on the
 * server; this pages on the client (UI only).
 */
const PAGE_SIZE = 20

const tabs = [
  { slug: undefined, label: "Latest", href: "/news" },
  ...newsCategories.map((c) => ({ slug: c.slug, label: c.label, href: newsPath(c.slug) })),
]

const pill = "flex h-[2.0625rem] items-center rounded-full px-3.5 text-[0.84375rem] leading-none font-semibold whitespace-nowrap transition-colors"
const pagerButton =
  "flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-[#e5e4e8] px-[1.125rem] text-sm leading-none font-semibold text-[#141417] transition-colors hover:bg-[#f7f7f9]"

const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

/**
 * Section pills and the date filter, then the story grid and its Newer / Older pager, after the
 * old site's /news page. The pills are links to the section pages; the date filter and paging
 * work on the stories passed in.
 */
export function NewsList({ stories, active, sectionLabel }: { stories: Story[]; active?: string; sectionLabel?: string }) {
  const [date, setDate] = useState("")
  const [page, setPage] = useState(0)
  const topRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const navHeight = useNavHeight()

  const filtered = date ? stories.filter((s) => s.published === date) : stories
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function chooseDate(value: string) {
    setDate(value)
    setPage(0)
  }

  /** Change page and bring the top of the list back under the nav. */
  function goTo(next: number) {
    setPage(next)
    const top = topRef.current
    if (!top) return
    if (lenis) {
      lenis.scrollTo(top, { offset: -navHeight - 16 })
    } else {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      window.scrollTo({
        top: top.getBoundingClientRect().top + window.scrollY - navHeight - 16,
        behavior: reduce ? "auto" : "smooth",
      })
    }
  }

  return (
    <>
      <div ref={topRef} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
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

        <label className="flex h-9 w-full shrink-0 items-center gap-2 rounded-full border border-[#e0e0e6] bg-white pr-1.5 pl-3.5 text-[#141417] transition-colors focus-within:border-[#3979ff] md:w-auto">
          <CalendarDays className="size-4 shrink-0 text-[#6b6b73]" aria-hidden />
          <span className="sr-only">Filter by date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => chooseDate(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm leading-none text-[#141417] outline-none [color-scheme:light]"
          />
          {date && (
            <button
              type="button"
              onClick={() => chooseDate("")}
              aria-label="Clear the date"
              className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-[#6b6b73] hover:bg-[#f3f3f6] hover:text-[#141417]"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </label>
      </div>

      {visible.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-[1.375rem] gap-y-[1.625rem] pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {visible.map((story, i) => (
            <li key={story.slug}>
              <NewsCard story={story} priority={page === 0 && i < 5} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl bg-[#f7f7f9] px-6 py-16 text-center">
          <p className="text-base leading-6 font-semibold text-[#141417]">
            {date
              ? `No ${sectionLabel ? `${sectionLabel} ` : ""}stories on ${formatDay(date)}.`
              : `No ${sectionLabel ? `${sectionLabel} ` : ""}stories yet.`}
          </p>
          {date ? (
            <button type="button" onClick={() => chooseDate("")} className={pagerButton}>
              Show all dates
            </button>
          ) : (
            <Link href="/news" className={pagerButton}>
              See the latest news
            </Link>
          )}
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="mt-12 flex items-center justify-between gap-4">
          {page > 0 ? (
            <button type="button" onClick={() => goTo(page - 1)} className={pagerButton}>
              ← Newer
            </button>
          ) : (
            <span />
          )}
          <span className="text-sm text-[#6b6b73]">
            Page {page + 1} of {pages}
          </span>
          {page < pages - 1 ? (
            <button type="button" onClick={() => goTo(page + 1)} className={pagerButton}>
              Older →
            </button>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  )
}
