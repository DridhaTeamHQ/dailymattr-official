"use client"

import { useEffect, useState } from "react"
import { useLenis } from "lenis/react"

import { cn } from "@/lib/utils"

/**
 * "On this page" sidebar (Figma 8697:529). Highlights the section currently being read and
 * glides to a section on click (through Lenis when smooth scrolling is on, else natively).
 */
export function ContentsNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  const lenis = useLenis()

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => !!el)
    // The section being read: the last one whose top has passed a line 20% down the screen, or
    // the first while the page is above it (the hero). Worked out from the scroll position each
    // time, so a jump or a fast scroll back to the top never leaves an old item highlighted.
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.2
      let current = targets[0]?.id
      for (const t of targets) {
        if (t.getBoundingClientRect().top <= line) current = t.id
        else break
      }
      if (current) setActive(current)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [items])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    e.preventDefault()
    setActive(id)
    if (lenis) lenis.scrollTo(target, { offset: -96 })
    else target.scrollIntoView({ behavior: "smooth" })
    history.replaceState(null, "", `#${id}`)
  }

  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold tracking-[0.09375rem] text-[#97979e] uppercase [.theme-nia_&]:text-white/45">On this page</p>
      <ol className="mt-4">
        {items.map((item, i) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => go(e, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-l-2 px-3 py-[0.4375rem] text-[0.8125rem] leading-[1.1375rem] transition-colors",
                  isActive
                    ? "border-[#3979ff] font-semibold text-[#3979ff]"
                    : "border-[#e5e4e8] font-medium text-[#6b6b73] hover:text-[#141417] [.theme-nia_&]:border-white/10 [.theme-nia_&]:text-white/55 [.theme-nia_&]:hover:text-white",
                )}
              >
                {i + 1}. {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
