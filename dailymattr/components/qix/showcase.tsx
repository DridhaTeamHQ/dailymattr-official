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

/**
 * The page change, like the recent-apps switcher in Samsung One UI. Going forward:
 *  1. the cards on screen draw together into an overlapping stack on the left, shrinking a
 *     little, and the stack slides away off the left edge as it fades;
 *  2. the next cards arrive from the right already stacked, settle at the right-hand slot,
 *     then fan out, one after another, into their places at full size.
 * Going back is the mirror image. A swipe keeps the plain native scroll.
 *
 * How: the row's scroll jumps straight to the new page (snapping paused), then each card is
 * drawn back to where it should appear with a transform, animated on the GPU with the Web
 * Animations API. When it ends the transforms are dropped, leaving the cards in their places.
 */
const STACK_MS = 1000
/** How much of each stacked card peeks out from under the next one. */
const STACK_PEEK = 28
const STACK_SCALE = 0.86
const EASE_GATHER = "cubic-bezier(0.4, 0, 0.2, 1)"
const EASE_SETTLE = "cubic-bezier(0.22, 1, 0.36, 1)"

type Slide = { anims: Animation[]; done: () => void }
const slides = new WeakMap<HTMLElement, Slide>()

function glide(el: HTMLElement, left: number) {
  // A press mid-change: jump the running one to its end first, then start from there.
  const running = slides.get(el)
  if (running) {
    running.anims.forEach((a) => a.finish())
    running.done()
  }

  const cards = Array.from(el.children) as HTMLElement[]
  const from = el.scrollLeft
  if (Math.abs(left - from) < 1) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollLeft = left
    return
  }

  const forward = left > from
  const view = el.getBoundingClientRect()
  const onScreen = (r: DOMRect) => r.left >= view.left - 2 && r.right <= view.right + 2
  const before = cards.map((c) => c.getBoundingClientRect())
  const leaving = cards.filter((_, i) => onScreen(before[i]))

  el.style.scrollSnapType = "none"
  el.scrollLeft = left
  const after = cards.map((c) => c.getBoundingClientRect())
  const arriving = cards.filter((c, i) => onScreen(after[i]) && !leaving.includes(c))
  const width = after[0]?.width ?? view.width

  const anims: Animation[] = []
  // x: where the card's left edge should appear on screen; turned into a shift from its place.
  const frame = (i: number, x: number, scale: number, opacity: number, offset: number, easing?: string): Keyframe => ({
    transform: `translate3d(${x - after[i].left}px,0,0) scale(${scale})`,
    opacity,
    offset,
    ...(easing ? { easing } : {}),
  })

  // 1. Leaving: gather into a stack on the side they move towards, then slide off and fade.
  const lefts = leaving.map((c) => before[cards.indexOf(c)].left)
  const gatherAt = forward ? Math.min(...lefts) : Math.max(...lefts)
  leaving.forEach((c, k) => {
    const i = cards.indexOf(c)
    const n = leaving.length
    const stackX = forward ? gatherAt + k * STACK_PEEK : gatherAt - (n - 1 - k) * STACK_PEEK
    const exitX = forward ? view.left - width * 1.05 + k * STACK_PEEK : view.right + width * 0.05 + k * STACK_PEEK
    c.style.zIndex = String(forward ? 10 + k : 10 + n - k)
    anims.push(
      c.animate(
        [
          frame(i, before[i].left, 1, 1, 0, EASE_GATHER),
          frame(i, stackX, STACK_SCALE, 1, 0.42, EASE_GATHER),
          frame(i, exitX, STACK_SCALE * 0.94, 0, 0.78),
          frame(i, exitX, STACK_SCALE * 0.94, 0, 1),
        ],
        { duration: STACK_MS, delay: (forward ? n - 1 - k : k) * 30, fill: "both" }
      )
    )
  })

  // 2. Arriving: come in stacked from the far side, rest at the near slot, then fan out.
  const slots = arriving.map((c) => after[cards.indexOf(c)].left)
  const restAt = forward ? Math.max(...slots) : Math.min(...slots)
  arriving.forEach((c, k) => {
    const i = cards.indexOf(c)
    const n = arriving.length
    const stackX = forward ? restAt - (n - 1 - k) * STACK_PEEK : restAt + k * STACK_PEEK
    const enterX = forward ? view.right + k * STACK_PEEK : view.left - width - (n - 1 - k) * STACK_PEEK
    c.style.zIndex = String(forward ? 20 + k : 20 + n - k)
    anims.push(
      c.animate(
        [
          frame(i, enterX, STACK_SCALE, 0, 0, EASE_GATHER),
          frame(i, enterX, STACK_SCALE, 0, 0.2, EASE_GATHER),
          frame(i, stackX, STACK_SCALE, 1, 0.5, EASE_SETTLE),
          frame(i, after[i].left, 1, 1, 1),
        ],
        // the card that ends nearest the stack opens first
        { duration: STACK_MS, delay: (forward ? n - 1 - k : k) * 60, fill: "both" }
      )
    )
  })

  let finished = false
  const done = () => {
    if (finished) return
    finished = true
    anims.forEach((a) => a.cancel())
    for (const c of [...leaving, ...arriving]) c.style.zIndex = ""
    el.style.scrollSnapType = ""
    slides.delete(el)
    // Settle the pager on where the change ended.
    el.dispatchEvent(new Event("scroll"))
  }
  slides.set(el, { anims, done })
  Promise.all(anims.map((a) => a.finished)).then(done, () => {})
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
      className="relative flex aspect-[584/730] shrink-0 basis-[85%] snap-start flex-col justify-end overflow-hidden rounded-3xl bg-[#111] p-5 sm:basis-[calc((100%_-_1.5rem)/2)] sm:p-6 lg:basis-[calc((100%_-_3rem)/3)] xl:p-8 2xl:p-10"
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
