"use client"

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarDays, X } from "lucide-react"

import { cn } from "@/lib/utils"

const field =
  "flex h-9 w-full shrink-0 items-center gap-2 rounded-full border border-[#e0e0e6] bg-white pr-1.5 pl-3.5 text-[#141417] transition-colors focus-within:border-[#3979ff] md:w-auto"

/**
 * The news list's date filter. Picking a day goes to ?date=YYYY-MM-DD (back to page 1);
 * clearing it drops the date. The server reads the date (components/news/news-list.tsx).
 */
export function DateFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const date = useSearchParams().get("date") ?? ""
  const [pending, startTransition] = useTransition()

  function choose(value: string) {
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(value)
    // Back to the first page of the list (/news/india/page/3/ -> /news/india/).
    const base = pathname.replace(/page\/\d+\/?$/, "")
    startTransition(() => router.push(valid ? `${base}?date=${value}` : base))
  }

  return (
    <label className={cn(field, pending && "opacity-60")}>
      <CalendarDays className="size-4 shrink-0 text-[#6b6b73]" aria-hidden />
      <span className="sr-only">Filter by date</span>
      <input
        type="date"
        value={date}
        onChange={(e) => choose(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm leading-none text-[#141417] outline-none [color-scheme:light]"
      />
      {date && (
        <button
          type="button"
          onClick={() => choose("")}
          aria-label="Clear the date"
          className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-[#6b6b73] hover:bg-[#f3f3f6] hover:text-[#141417]"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </label>
  )
}

/** The empty field shown while the page reads the URL. */
export function DateFilterPlaceholder() {
  return (
    <span className={field} aria-hidden>
      <CalendarDays className="size-4 shrink-0 text-[#6b6b73]" />
      <input
        type="date"
        disabled
        tabIndex={-1}
        className="min-w-0 flex-1 bg-transparent text-sm leading-none text-[#141417] outline-none [color-scheme:light]"
      />
    </span>
  )
}
