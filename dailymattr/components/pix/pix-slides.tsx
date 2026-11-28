"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type PixCardSlide = { url: string; width: number; height: number; alt: string }

/**
 * One real Pix in the "Real stories" row: its rendered slides (the cover with the headline,
 * then the key points), swiped sideways like in the app, with arrows and dots. The slides
 * carry the story, so the card is only the Pix, with a bottom bar: "Read the story" on the left
 * (styled like the navbar's "Get the app", components/navbar/download-button.tsx) and the
 * previous / next arrows on the right.
 */
export function PixSlideCard({
  slides,
  headline,
  href,
}: {
  slides: PixCardSlide[]
  /** For screen readers: the slides themselves are pictures of text. */
  headline: string
  href: string
}) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const first = slides[0]

  function go(next: number) {
    const el = track.current
    if (!el) return
    const target = Math.max(0, Math.min(slides.length - 1, next))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setIndex(target)
    el.scrollTo({ left: target * el.clientWidth, behavior: reduce ? "auto" : "smooth" })
  }

  return (
    <article
      className="group/slides relative overflow-hidden rounded-[1rem] bg-[#111418]"
      style={{ aspectRatio: `${first.width} / ${first.height}` }}
    >
      <div
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
        // The slides change only with the arrows: the track can't be swiped or scrolled, so a
        // swipe over the card moves the row of Pix it sits in instead (one Pix at a time).
        className="absolute inset-0 flex overflow-hidden"
        role="group"
        aria-roledescription="carousel"
        aria-label={`Pix: ${headline}`}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.url}
            className="relative h-full w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <Image src={slide.url} alt={slide.alt} fill sizes="(min-width: 1024px) 282px, 50vw" className="object-cover" />
          </div>
        ))}
      </div>

      {/* Bottom: the slide marks centred under the headline, then a bar with "Read the story"
          on the left and previous / next on the right. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col gap-3 px-3 sm:bottom-4 sm:px-4">
        {slides.length > 1 && (
          <div className="flex justify-center gap-1.5" aria-hidden>
            {slides.map((slide, i) => (
              <span
                key={slide.url}
                className={cn(
                  "h-1.5 rounded-full bg-white transition-[width,opacity] duration-300",
                  i === index ? "w-4" : "w-1.5 opacity-50",
                )}
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <Button
            nativeButton={false}
            render={<Link href={href} />}
            className="pointer-events-auto h-8 gap-2 rounded-lg bg-[#141417] pr-1.5 pl-3 text-sm font-medium text-white hover:bg-[#141417]/85"
          >
            Read the story
            <span className="sr-only">: {headline}</span>
            <span className="flex size-5 items-center justify-center rounded-[0.3125rem] bg-white/15">
              <ArrowUpRight className="size-3" aria-hidden />
            </span>
          </Button>
          {slides.length > 1 && (
            <div className="pointer-events-auto flex shrink-0 gap-1.5">
              <SlideArrow side="left" disabled={index === 0} onClick={() => go(index - 1)} />
              <SlideArrow side="right" disabled={index === slides.length - 1} onClick={() => go(index + 1)} />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

/** Round previous / next button in the card's bottom bar; dims at the first / last slide. */
function SlideArrow({ side, disabled, onClick }: { side: "left" | "right"; disabled: boolean; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className="grid size-8 cursor-pointer place-items-center rounded-full bg-white text-[#141417] shadow-[0_4px_16px_rgba(16,24,40,0.18)] transition-opacity outline-none hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-default disabled:opacity-40"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
