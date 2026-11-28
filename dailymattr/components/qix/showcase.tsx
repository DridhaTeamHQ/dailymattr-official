"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { SiteVideo } from "@/components/shared/site-video"
import { cn } from "@/lib/utils"
import type { VideoAsset } from "@/lib/videos"
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

      {/* Figma 9831:7410: pager on the left, arrows on the right; raised to 16px under the cards */}
      <div className="mt-3 flex items-center justify-between sm:mt-4">
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
 * The page change. The cards travel as one row, one after another: going forward the
 * leftmost card sets off first and each card to its right follows a beat later, so they never
 * overlap or stack. Going back is the mirror image. A swipe keeps the
 * plain native scroll.
 *
 * How: the row's scroll jumps straight to the new page (snapping paused), then each card is
 * drawn back to where it was with a transform and eased to its new place on the GPU with the
 * Web Animations API. Every card follows the same path shape, only later, so the gaps between
 * them can only widen. When it ends the transforms are dropped, leaving the cards in place.
 * Each card eases straight into its place: no overshoot, so nothing wobbles as they settle.
 */
/** Gap between one card setting off and the next. */
const CARD_STAGGER = 80
const CARD_MS = 820
/** Gentle start, long soft landing. */
const EASE_TRAVEL = "cubic-bezier(0.45, 0, 0.15, 1)"

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
  const distance = left - from
  if (Math.abs(distance) < 1) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollLeft = left
    return
  }

  const forward = distance > 0
  const view = el.getBoundingClientRect()
  const before = cards.map((c) => c.getBoundingClientRect().left)
  // The leading card goes first: leftmost going forward, rightmost going back. Cards already
  // past the leading edge (off screen that side) just go with the first.
  const order = cards.map((_, i) => i).sort((p, q) => (before[p] - before[q]) * (forward ? 1 : -1))
  const firstShown = order.findIndex((i) => before[i] + cards[i].offsetWidth > view.left + 2 && before[i] < view.right - 2)

  el.style.scrollSnapType = "none"
  el.scrollLeft = left
  const shift = (x: number, offset?: number, easing?: string): Keyframe => ({
    transform: `translate3d(${x}px,0,0)`,
    ...(offset !== undefined ? { offset } : {}),
    ...(easing ? { easing } : {}),
  })

  const anims = order.map((i, rank) =>
    cards[i].animate(
      [
        shift(distance, 0, EASE_TRAVEL),
        shift(0, 1),
      ],
      { duration: CARD_MS, delay: Math.max(0, rank - firstShown) * CARD_STAGGER, fill: "both" }
    )
  )

  let finished = false
  const done = () => {
    if (finished) return
    finished = true
    anims.forEach((a) => a.cancel())
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
  // No video yet: Play shows a short note on the card instead, which fades away by itself.
  const [notice, setNotice] = useState(false)
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(noticeTimer.current), [])
  function showNotice() {
    setNotice(true)
    clearTimeout(noticeTimer.current)
    noticeTimer.current = setTimeout(() => setNotice(false), 2600)
  }

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
      {card.video && <CardVideo video={card.video} playing={playing} label={card.alt} />}

      {!card.video && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 top-[38%] z-10 flex justify-center px-5"
        >
          <span className="sr-only">{notice ? "Video not available yet" : ""}</span>
          <p
            aria-hidden
            className={cn(
              "flex items-center gap-2 rounded-full bg-black/70 px-4 py-2.5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-base",
              notice ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
          >
            <VideoOffIcon />
            Video not available yet
          </p>
        </div>
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
            <button type="button" onClick={showNotice} className={PILL_LIGHT}>
              <Image src={`${ICONS}/icon-play.svg`} alt="" width={20} height={20} className="size-4 sm:size-5" />
              Play
            </button>
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

/**
 * The story video over the card, brought in gently rather than cut to: it loads unseen on the
 * first Play, then, once frames are actually moving, fades up over the cover while easing from a
 * slight zoom, and its sound swells in over the same time. Pause fades it back out to the
 * cover (the frame it stopped on stays underneath, so playing again picks up from there).
 */
function CardVideo({ video, playing, label }: { video: VideoAsset; playing: boolean; label: string }) {
  const [requested, setRequested] = useState(playing)
  const [moving, setMoving] = useState(false)
  if (playing && !requested) setRequested(true)
  if (!requested) return null

  const shown = playing && moving
  return (
    <SiteVideo
      video={video}
      sound
      priority
      playing={playing}
      onPlaying={(e) => {
        setMoving(true)
        fadeInSound(e.currentTarget)
      }}
      className={cn(
        "absolute inset-0 size-full object-cover transition-[opacity,scale] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        shown ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
      )}
      aria-label={`${label}, ${playing ? "playing" : "paused"}`}
    />
  )
}

/** Raise the volume from silent to full over 0.7s, so the sound eases in with the picture. */
function fadeInSound(el: HTMLVideoElement) {
  const start = performance.now()
  el.volume = 0
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / 700)
    el.volume = t * t
    if (t < 1 && !el.paused) requestAnimationFrame(step)
    else el.volume = 1
  }
  requestAnimationFrame(step)
}

const PILL =
  "inline-flex h-10 items-center gap-2 rounded-full pr-5 pl-4 text-sm leading-6 font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-white/50 sm:h-11 sm:text-base lg:h-10 lg:text-sm xl:h-12 xl:text-base 2xl:h-13 2xl:gap-2.5 2xl:pr-7 2xl:pl-[1.375rem] 2xl:text-lg"
const PILL_LIGHT = cn(PILL, "bg-white text-black hover:bg-white/90")
const PILL_GLASS = cn(PILL, "bg-white/18 text-white backdrop-blur-[8px] hover:bg-white/26")

function VideoOffIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 sm:size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.25-3.07a.5.5 0 0 1 .75.43v8.14" />
      <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
      <path d="m2 2 20 20" />
    </svg>
  )
}

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
