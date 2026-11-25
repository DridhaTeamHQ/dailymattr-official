"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, Eye, EyeOff, Newspaper, Search, SlidersHorizontal, X } from "lucide-react"

import { IconChip } from "@/components/cms/icon-chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { NewsFilters, NewsItem, NewsStatus } from "@/lib/news/data"
import { newsSections, OTHER_SECTION } from "@/lib/news/format"
import { cn } from "@/lib/utils"

import { CustomizeDialog } from "./customize-dialog"
import { StoryPhoto, VisibilityChip } from "./story-parts"

const sections = [{ slug: "", label: "All sections" }, ...newsSections, OTHER_SECTION]

const statuses: { value: NewsStatus; label: string; icon?: typeof Eye }[] = [
  { value: "all", label: "All" },
  { value: "showing", label: "Showing", icon: Eye },
  { value: "hidden", label: "Hidden", icon: EyeOff },
]

/**
 * The News page's search, filters and story grid. Filters live in the URL
 * (?q=&section=&status=&date=&page=), so the server reads only the page of stories shown.
 */
export function NewsBrowser({
  filters,
  items,
  matching,
  sectionCounts,
  pageSize,
}: {
  filters: NewsFilters
  items: NewsItem[]
  matching: number
  sectionCounts: Record<string, number>
  pageSize: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState(filters.q)
  const [open, setOpen] = useState<NewsItem | null>(null)

  function go(next: Partial<NewsFilters>) {
    const merged = { ...filters, page: 1, ...next }
    const params = new URLSearchParams()
    if (merged.q.trim()) params.set("q", merged.q.trim())
    if (merged.section) params.set("section", merged.section)
    if (merged.status !== "all") params.set("status", merged.status)
    if (merged.date) params.set("date", merged.date)
    if (merged.page > 1) params.set("page", String(merged.page))
    const qs = params.toString()
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }))
  }

  // Search as you type, a moment after the last key.
  useEffect(() => {
    if (query.trim() === filters.q.trim()) return
    const timer = setTimeout(() => go({ q: query }), 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const pages = Math.max(1, Math.ceil(matching / pageSize))
  const first = matching === 0 ? 0 : (filters.page - 1) * pageSize + 1
  const last = Math.min(filters.page * pageSize, matching)
  const filtered = filters.q || filters.section || filters.status !== "all" || filters.date

  // Keep the open dialog in step with fresh data after a save.
  const openItem = open ? (items.find((item) => item.id === open.id) ?? open) : null

  return (
    <div className="flex flex-col gap-5">
      <Card size="sm">
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <InputGroup className="h-10 rounded-full bg-background lg:max-w-sm">
              <InputGroupAddon className="pl-3.5">
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && go({ q: query })}
                placeholder="Search headlines or a Pix ID"
                aria-label="Search stories"
              />
              {query && (
                <InputGroupAddon align="inline-end" className="pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      go({ q: "" })
                    }}
                    aria-label="Clear the search"
                    className="grid size-6 place-items-center rounded-full hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                </InputGroupAddon>
              )}
            </InputGroup>

            <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
              <div role="radiogroup" aria-label="Website visibility" className="flex h-10 items-center rounded-full bg-muted p-1">
                {statuses.map(({ value, label, icon: Icon }) => {
                  const active = filters.status === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => go({ status: value })}
                      className={cn(
                        "flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors",
                        active ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {Icon && <Icon className="size-3.5" aria-hidden />}
                      {label}
                    </button>
                  )
                })}
              </div>

              <label className="flex h-10 items-center gap-2 rounded-full border border-input bg-background pr-1.5 pl-3.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="sr-only">Published on</span>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(event) => go({ date: event.target.value })}
                  className="min-w-0 bg-transparent text-sm outline-none [color-scheme:light]"
                />
                {filters.date && (
                  <button
                    type="button"
                    onClick={() => go({ date: "" })}
                    aria-label="Clear the date"
                    className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </label>
            </div>
          </div>

          <nav aria-label="News sections">
            <ul className="flex flex-wrap gap-2">
              {sections.map((section) => {
                const active = filters.section === section.slug
                const count = sectionCounts[section.slug] ?? 0
                return (
                  <li key={section.slug || "all"}>
                    <button
                      type="button"
                      aria-current={active ? "true" : undefined}
                      onClick={() => go({ section: section.slug })}
                      className={cn(
                        "flex h-8 items-center gap-2 rounded-full pr-1.5 pl-3.5 text-[0.8125rem] font-semibold whitespace-nowrap transition-colors",
                        active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-secondary"
                      )}
                    >
                      {section.label}
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[0.6875rem] leading-none tabular-nums",
                          active ? "bg-primary-foreground/20" : "bg-background text-muted-foreground"
                        )}
                      >
                        {count.toLocaleString("en-IN")}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <p aria-live="polite">
          {matching === 0
            ? "No stories"
            : matching === 1
              ? "1 story"
              : `${first.toLocaleString("en-IN")}–${last.toLocaleString("en-IN")} of ${matching.toLocaleString("en-IN")} stories`}
          {pending && <span className="ml-2 text-primary">Loading…</span>}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              go({ q: "", section: "", status: "all", date: "" })
            }}
            className="font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {items.length > 0 ? (
        <ul
          className={cn(
            "grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4",
            pending && "pointer-events-none opacity-60"
          )}
        >
          {items.map((item, i) => (
            <li key={item.id}>
              <StoryCard item={item} priority={i < 4} onCustomize={() => setOpen(item)} />
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <IconChip icon={Newspaper} tone="blue" size="lg" />
            <p className="text-base font-semibold">No stories match</p>
            <p className="max-w-sm text-muted-foreground">
              {filters.status === "hidden" && !filters.q && !filters.date
                ? "Nothing is hidden. Every published Pix story is showing on the website."
                : "Try another search, section or date."}
            </p>
            {filtered && (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("")
                  go({ q: "", section: "", status: "all", date: "" })
                }}
              >
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {pages > 1 && (
        <nav aria-label="Pages" className="flex items-center justify-between gap-4 pt-2">
          <Button variant="outline" disabled={filters.page <= 1} onClick={() => go({ page: filters.page - 1 })}>
            ← Newer
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            Page {filters.page.toLocaleString("en-IN")} of {pages.toLocaleString("en-IN")}
          </span>
          <Button variant="outline" disabled={filters.page >= pages} onClick={() => go({ page: filters.page + 1 })}>
            Older →
          </Button>
        </nav>
      )}

      <CustomizeDialog item={openItem} onOpenChange={(next) => !next && setOpen(null)} />
    </div>
  )
}

/** A story as the website lists it (photo, headline, date and section), with its status. */
function StoryCard({ item, priority, onCustomize }: { item: NewsItem; priority: boolean; onCustomize: () => void }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl bg-card p-2 ring-1 ring-foreground/8 transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onCustomize}
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-muted"
      >
        <StoryPhoto
          src={item.image}
          priority={priority}
          sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
          className={cn(
            "transition-[scale,filter,opacity] duration-500 group-hover:scale-[1.03]",
            !item.show && "opacity-55 grayscale"
          )}
        />
        <span className="absolute top-2 left-2">
          <VisibilityChip show={item.show} />
        </span>
        <span className="absolute top-2 right-2 rounded-full bg-foreground/75 px-2 py-0.5 text-[0.6875rem] font-semibold text-background tabular-nums">
          #{item.pixId}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 px-1.5 pt-3 pb-1">
        <h3 className="line-clamp-3 text-[0.9375rem] leading-snug font-semibold tracking-[-0.01em]">{item.headline}</h3>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <time dateTime={item.publishedAt}>
            {item.day}, {item.time}
          </time>
          {item.section && <span className="font-semibold text-primary">{item.section.label}</span>}
        </p>
        <div className="mt-auto pt-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onCustomize}>
            <SlidersHorizontal data-icon="inline-start" />
            Customize
          </Button>
        </div>
      </div>
    </article>
  )
}
