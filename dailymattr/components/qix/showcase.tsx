"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { SiteVideo } from "@/components/shared/site-video"
import { cn } from "@/lib/utils"
import { showcase, type QixShowcaseCard } from "./content"

const ICONS = "/qix/showcase"

/**
 * Netflix-style cards at the top of the Qix page (Figma 9831:7101). A row of 584×730 cards,
 * three to a page on laptops and up (two on tablets, one and a peek on phones). The row only moves when asked: the arrows and the pager step a page at a time,
 * and a swipe or trackpad scroll slides it, snapping to a card.
 *
 * At 1920 wide everything is the Figma size: 60px sides, 584px cards 24px apart, 40px card
 * padding, 52px buttons. Smaller screens scale the card padding, type and buttons down so the
 * two buttons still sit side by side on a narrower card.
 */
export function QixShowcase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [playingId, setPlayingId] = useState<string | null>(null)

  // Pages = how many screens of cards the row holds at this width; the current one follows
  // the scroll position, so swiping and the arrows keep the pager in step.
  const measure = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const { perPage, step } = layout(el)
    const count = Math.max(1, Math.ceil(el.children.length / perPage))
    const max = el.scrollWidth - el.clientWidth
    const current = max <= 1 ? 0 : el.scrollLeft >= max - 2 ? count - 1 : Math.round(el.scrollLeft / (perPage * step))
    setPages(count)
    setPage(Math.min(current, count - 1))
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [measure])

  /** Scroll so the first card of page `n` sits at the left edge. */
  function goTo(n: number) {
    const el = trackRef.current
    if (!el) return
    const target = Math.max(0, Math.min(n, pages - 1))
    const cards = Array.from(el.children) as HTMLElement[]
    const { perPage } = layout(el)
    const card = cards[Math.min(target * perPage, cards.length - 1)]
    const max = el.scrollWidth - el.clientWidth
    const left = target === pages - 1 ? max : card ? Math.min(max, card.offsetLeft - el.offsetLeft) : 0
    glide(el, left)
  }

  return (
    <section
      id="stories"
      aria-roledescription="carousel"
      aria-label="Qix stories"
      className="bg-[#050505] px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8 lg:pb-16 xl:px-[3.75rem]"
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {showcase.cards.map((card, i) => (
          <ShowcaseCard
            key={card.id}
            card={card}
            priority={i < 3}
            playing={playingId === card.id}
            onPlay={() => setPlayingId((id) => (id === card.id ? null : card.id))}
          />
        ))}
      </div>

      {/* Figma 9831:7410: pager on the left, arrows on the right, 32px under the cards */}
      <div className="mt-6 flex items-center justify-between sm:mt-8">
        <div className="flex items-center gap-2" role="group" aria-label="Choose a page">
          {Array.from({ length: pages }, (_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => goTo(n)}
              aria-label={`Page ${n + 1} of ${pages}`}
              aria-current={n === page ? "true" : undefined}
              className="group flex h-4 items-center outline-none"
            >
              <span
                className={cn(
                  "block h-1 rounded-[2px] transition-[width,background-color] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-focus-visible:ring-2 group-focus-visible:ring-white/60",
                  n === page ? "w-10 bg-white" : "w-4 bg-white/28 group-hover:bg-white/50"
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <ArrowButton direction="left" disabled={page === 0} onClick={() => goTo(page - 1)} />
          <ArrowButton direction="right" disabled={page >= pages - 1} onClick={() => goTo(page + 1)} />
        </div>
      </div>
    </section>
  )
}

/** Cards that fit wholly on screen at once, and the distance from one card to the next. */
function layout(el: HTMLElement) {
  const [a, b] = Array.from(el.children) as HTMLElement[]
  const step = a && b ? b.offsetLeft - a.offsetLeft : el.clientWidth
  const width = a?.offsetWidth ?? el.clientWidth
  return { perPage: Math.max(1, Math.floor((el.clientWidth - width) / step + 1.01)), step }
}

/** The page slide: long and soft, easing out so the cards settle rather than stop. */
const GLIDE_MS = 800
const GLIDE_EASE = "cubic-bezier(0.25, 1, 0.5, 1)"

/**
 * Slide the row to `left`, smoothly. Stepping scrollLeft frame by frame moves in whole pixels
 * and stutters, so this jumps the scroll to the end position at once, offsets the cards back
 * to where they were with a transform, and lets the GPU ease that transform to zero. A press
 * mid-slide starts from wherever the cards are on screen at that moment, so it never jumps.
 * Snapping is paused while it runs.
 */
const glides = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()
function glide(el: HTMLElement, left: number) {
  const cards = Array.from(el.children) as HTMLElement[]
  // Where the cards appear now: the scroll position less any slide still in flight.
  const shift = cards[0] ? new DOMMatrixReadOnly(getComputedStyle(cards[0]).transform).m41 : 0
  const from = el.scrollLeft - shift
  const distance = left - from
  clearTimeout(glides.get(el))
  if (Math.abs(distance) < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (const c of cards) Object.assign(c.style, { transition: "", transform: "" })
    el.scrollLeft = left
    return
  }

  el.style.scrollSnapType = "none"
  el.scrollLeft = left
  for (const c of cards) Object.assign(c.style, { transition: "none", transform: `translate3d(${distance}px,0,0)` })
  void el.offsetWidth // commit the offset before easing it away
  for (const c of cards) {
    c.style.transition = `transform ${GLIDE_MS}ms ${GLIDE_EASE}`
    c.style.transform = "translate3d(0,0,0)"
  }
  glides.set(
    el,
    setTimeout(() => {
      for (const c of cards) Object.assign(c.style, { transition: "", transform: "" })
      el.style.scrollSnapType = ""
      el.dispatchEvent(new Event("scroll"))
    }, GLIDE_MS + 40)
  )
}

function ShowcaseCard({
  card,
  priority,
  playing,
  onPlay,
}: {
  card: QixShowcaseCard
  priority: boolean
  playing: boolean
  onPlay: () => void
}) {
  return (
    <article
      aria-label={card.alt}
      className="relative flex aspect-[584/730] shrink-0 will-change-transform basis-[85%] snap-start flex-col justify-end overflow-hidden rounded-3xl bg-[#111] p-5 sm:basis-[calc((100%_-_1.5rem)/2)] sm:p-6 lg:basis-[calc((100%_-_3rem)/3)] xl:p-8 2xl:p-10"
    >
      <Image
        src={card.image}
        alt={card.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
        className="object-cover"
      />
      {card.video && playing && (
        <SiteVideo
          video={card.video}
          sound
          priority
          className="absolute inset-0 size-full object-cover"
          aria-label={`${card.alt}, playing`}
        />
      )}

      {/* Figma scrim: clear for the top half, then darkening to 94% black at the foot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.62)_74%,rgba(0,0,0,0.94)_100%)]"
      />

      <div className="relative flex flex-col gap-4 sm:gap-5 2xl:gap-6">
        <div className="flex flex-col gap-1.5 2xl:gap-2">
          <p className="flex items-center gap-2 text-xs leading-5 font-medium text-white/72 sm:text-sm">
            <span className="tracking-[0.08em] uppercase">{card.series}</span>
            <span aria-hidden>·</span>
            <span className="tracking-[0.08em] uppercase">{card.length}</span>
          </p>
          <p className="text-base leading-6 text-white/86 sm:text-lg sm:leading-7 lg:text-base lg:leading-6 xl:text-lg xl:leading-7 2xl:text-xl">{card.line}</p>
        </div>

        <div className="flex flex-wrap gap-2.5 2xl:gap-3">
          {card.video ? (
            <button type="button" onClick={onPlay} aria-pressed={playing} className={PILL_LIGHT}>
              {playing ? <PauseIcon /> : <Image src={`${ICONS}/icon-play.svg`} alt="" width={20} height={20} className="size-4 sm:size-5" />}
              {playing ? "Pause" : "Play"}
            </button>
          ) : (
            <Link href={showcase.moreInfoHref} className={PILL_LIGHT}>
              <Image src={`${ICONS}/icon-play.svg`} alt="" width={20} height={20} className="size-4 sm:size-5" />
              Play
            </Link>
          )}
          <Link href={showcase.moreInfoHref} className={PILL_GLASS} aria-label={`More info about ${card.alt}`}>
            {/* Figma's Icon / Info: a 17.5px glyph centred in a 20px box */}
            <span className="flex size-4 items-center justify-center sm:size-5">
              <Image src={`${ICONS}/icon-info.svg`} alt="" width={17.5} height={17.5} className="size-[87.5%]" />
            </span>
            More info
          </Link>
        </div>
      </div>
    </article>
  )
}

const PILL =
  "inline-flex h-10 items-center gap-2 rounded-full pr-5 pl-4 text-sm leading-6 font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-white/50 sm:h-11 sm:text-base lg:h-10 lg:text-sm xl:h-12 xl:text-base 2xl:h-13 2xl:gap-2.5 2xl:pr-7 2xl:pl-[1.375rem] 2xl:text-lg"
const PILL_LIGHT = cn(PILL, "bg-white text-black hover:bg-white/90")
const PILL_GLASS = cn(PILL, "bg-white/18 text-white backdrop-blur-[8px] hover:bg-white/26")

function PauseIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4 sm:size-5" fill="black">
      <rect x="5" y="3.5" width="3.5" height="13" rx="1" />
      <rect x="11.5" y="3.5" width="3.5" height="13" rx="1" />
    </svg>
  )
}

/** Figma 9831:7416 / 9831:7419: 48px rings, 6% white fill, 20% white edge. */
function ArrowButton({ direction, disabled, onClick }: { direction: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous stories" : "Next stories"}
      className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/6 outline-none transition-[background-color,opacity] hover:bg-white/14 focus-visible:ring-3 focus-visible:ring-white/50 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-white/6 lg:size-12"
    >
      <Image src={`${ICONS}/icon-chevron-${direction}.svg`} alt="" width={24} height={24} className="size-6" />
    </button>
  )
}
