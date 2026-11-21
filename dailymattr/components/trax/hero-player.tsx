"use client"

import Image from "next/image"
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react"
import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { heroPlayer, type TraxHeroEpisode } from "./content"
import { useActiveEpisode } from "./hero-state"
import { announceTraxPlay, useOnOtherTraxPlay } from "./use-track"

const { episodes } = heroPlayer
const count = episodes.length
const wrap = (i: number) => ((i % count) + count) % count
/** Shortest signed distance on the ring, in [-count/2, count/2). */
const ringOffset = (d: number) => {
  const o = ((d % count) + count) % count
  return o >= count / 2 ? o - count : o
}

/**
 * Cover-flow depth, by a card's (fractional) distance from the playing card. Every card is
 * laid out once at the centre size (Figma 9278:728) and placed with transforms only, so a skip
 * moves GPU layers and never re-runs layout. At 1 and 2 the values land on Figma's near
 * (9278:716) and far (9278:704) cards: 27rem and 22.5rem art, centres 18.25rem and 31rem from
 * the middle, tipped 14° and 24°; ±2.5 is where the card leaving one end fades out and
 * reappears at the other, so the wrap is never seen.
 */
const DEPTH = [-2.5, -2, -1, 0, 1, 2, 2.5]
const NEAR = 27 / 31.5
const FAR = 22.5 / 31.5
const SCALE = [0.65, FAR, NEAR, 1, NEAR, FAR, 0.65]
const FLOW = {
  x: ["-34.5rem", "-31rem", "-18.25rem", "0rem", "18.25rem", "31rem", "34.5rem"],
  rotateY: [-27, -24, -14, 0, 14, 24, 27],
  scale: SCALE,
  opacity: [0, 0.72, 1, 1, 1, 0.72, 0],
  // Type held at Figma's sizes while the card scales: title 24px at the centre and 16px on
  // the sides, topic 16px everywhere.
  title: SCALE.map((s) => (s === 1 ? 1 : 16 / 24 / s)),
  topic: SCALE.map((s) => 1 / s),
}

/** Interruptible: a skip mid-slide carries the cards' speed into the next one. */
const SLIDE_SPRING = {
  type: "spring",
  visualDuration: 0.65,
  bounce: 0,
} as const

/**
 * Entrance, played from the first paint and again each time the visitor comes back to the page
 * (CSS, keyframes `trax-intro` in globals.css): 1. the playing card drops in, 2. the near pair
 * slides out from behind it, then the far pair, 3. the player bar fades up, slowly. Indexed by
 * each card's depth (-2…2) from the card in the centre when the entrance starts; the x offsets
 * put every card's centre on the stage's centre, hidden behind the playing card.
 */
const INTRO = [
  "[--intro-x:31rem] animate-[trax-intro_1s_cubic-bezier(0.16,1,0.3,1)_1.15s_backwards]",
  "[--intro-x:18.25rem] animate-[trax-intro_1s_cubic-bezier(0.16,1,0.3,1)_0.75s_backwards]",
  "[--intro-y:-3rem] [--intro-scale:0.94] animate-[trax-intro_1s_cubic-bezier(0.16,1,0.3,1)_0.15s_backwards]",
  "[--intro-x:-18.25rem] animate-[trax-intro_1s_cubic-bezier(0.16,1,0.3,1)_0.75s_backwards]",
  "[--intro-x:-31rem] animate-[trax-intro_1s_cubic-bezier(0.16,1,0.3,1)_1.15s_backwards]",
] as const
/**
 * The bar settles the same way as the playing card (drops in from above on the cards' curve),
 * a little slower, starting as the far pair lands so the whole entrance reads as one motion.
 */
const BAR_INTRO =
  "[--intro-y:-2rem] [--intro-scale:0.96] animate-[trax-intro_1.4s_cubic-bezier(0.16,1,0.3,1)_1.45s_backwards] motion-reduce:animate-none"

/**
 * Height-fit floor for browsers without CSS length ÷ length (the CSS version is in hero.tsx,
 * which also sets the height needed, --trax-hero-need, per breakpoint).
 */
const MIN_FIT = 0.6

/** Frosted glass used by the cards and the player bar. */
const GLASS = "bg-linear-to-b backdrop-blur-[1.25rem]"
/** 1px white/28 border drawn inside the box, as Figma's inside stroke (adds no size). */
const BAR_EDGE = "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28)]"
const CARD_EDGE = "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.28),0_2rem_4rem_0_rgba(0,0,0,0.45)]"

/**
 * Cover-flow player that opens the Trax page (Figma 9278:702). Starts paused; play, the skip
 * buttons and the side cards drive it. Each episode has a song: the bar shows its progress,
 * and when it ends the next card slides into the centre and plays.
 */
export function TraxHeroPlayer() {
  // Shared with the wash behind the hero, which takes the centre cover's colours
  const [active, setActive] = useActiveEpisode()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  // The entrance (INTRO): which card it is built around, and whether it has played (the bar's,
  // the last to finish, ended; the classes then come off, so skipping never touches it).
  // Next keeps this page mounted but hidden while the visitor is elsewhere, and showing it
  // again restarts its CSS animations. So as the page is hidden (this cleanup runs then), the
  // entrance is set up again around the card in the centre now, not the one the page first
  // opened on, and it plays from there when the visitor comes back.
  const [introCenter, setIntroCenter] = useState(heroPlayer.initial)
  const [entered, setEntered] = useState(false)
  const setUpEntrance = useEffectEvent(() => {
    setIntroCenter(active)
    setEntered(false)
  })
  useLayoutEffect(() => () => setUpEntrance(), [])
  const progress = useMotionValue(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  // Where the ring is, in episodes; never wrapped, so it can spring smoothly past either end.
  const position = useMotionValue<number>(heroPlayer.initial)
  const target = useRef<number>(heroPlayer.initial)
  const reduceMotion = useReducedMotion()

  // Fallback for --trax-hero-fit (see TraxHero) where CSS can't divide lengths
  useLayoutEffect(() => {
    if (CSS.supports("zoom", "calc(1px / 1px)")) return
    const root = document.documentElement
    const el = rootRef.current
    const update = () => {
      const styles = getComputedStyle(root)
      const chrome = parseFloat(styles.getPropertyValue("--chrome-height")) || 0
      const rem = parseFloat(styles.fontSize)
      // In rem, per breakpoint (TraxHero)
      const need = el ? parseFloat(getComputedStyle(el).getPropertyValue("--trax-hero-need")) : NaN
      if (!need) return
      const fit = (window.innerHeight - chrome) / (need * rem)
      root.style.setProperty("--trax-hero-fit", String(Math.min(1, Math.max(MIN_FIT, fit))))
    }
    update()
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("resize", update)
      root.style.removeProperty("--trax-hero-fit")
    }
  }, [])

  // The <audio> follows `playing`; a new episode swaps its src, so this starts the new song.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!playing) return audio.pause()
    announceTraxPlay("trax-hero")
    audio.play().catch((error: DOMException) => {
      // AbortError: a quick skip replaced the song before it started. Anything else (e.g.
      // the browser refused to play) leaves the player paused.
      if (error.name !== "AbortError") setPlaying(false)
    })
  }, [playing, active])

  // One Trax player at a time: pause when a featured episode starts.
  useOnOtherTraxPlay("trax-hero", () => setPlaying(false))

  // Next keeps a page you leave mounted but hidden (cacheComponents), <audio> and all, so the
  // song would play on under the next page. Effects clean up when that happens: stop it here,
  // and show it paused when the visitor comes back.
  useLayoutEffect(() => {
    const audio = audioRef.current
    return () => {
      audio?.pause()
      setPlaying(false)
    }
  }, [])

  // Progress bar: read the playhead every frame while playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !playing) return
    let frame = 0
    const tick = () => {
      if (audio.duration) progress.set(audio.currentTime / audio.duration)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, active, progress])

  const goTo = (index: number) => {
    const step = ringOffset(index - active)
    if (step === 0) return
    progress.set(0)
    setActive(wrap(index))
    target.current += step
    animate(position, target.current, reduceMotion ? { duration: 0 } : SLIDE_SPRING)
  }

  const current = episodes[active]

  return (
    <div
      ref={rootRef}
      className="relative flex w-full flex-col items-center [zoom:var(--trax-hero-fit,1)]"
    >
      <audio
        ref={audioRef}
        src={current.audio}
        preload="none"
        muted={muted}
        onEnded={() => goTo(active + 1)}
      />

      {/* Stage: 1520×604 at desktop; zoomed down whole on smaller screens, where the side
          cards run off the edges. */}
      <div className="flex w-full justify-center">
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Trax episodes"
          className="relative h-[37.75rem] w-[95rem] shrink-0 [zoom:0.42] [perspective:137.5rem] sm:[zoom:0.6] md:[zoom:0.7] lg:[zoom:1]"
        >
          {episodes.map((episode, i) => {
            const isCurrent = i === active
            // From the card the entrance is built around (fixed while it plays)
            const start = ringOffset(i - introCenter)
            return (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                index={i}
                position={position}
                className={cn(!entered && INTRO[start + 2], "motion-reduce:animate-none")}
                isCurrent={isCurrent}
                preload={i === heroPlayer.initial}
                onClick={() => {
                  if (isCurrent) return setPlaying(!playing)
                  goTo(i)
                  setPlaying(true)
                }}
                label={
                  isCurrent
                    ? `${playing ? "Pause" : "Play"} ${episode.title}`
                    : `Play ${episode.title}, ${episode.topic}`
                }
              />
            )
          })}
        </div>
      </div>

      {/* Player bar (Figma 9278:733) */}
      <div
        onAnimationEnd={(e) => {
          if (e.target === e.currentTarget) setEntered(true)
        }}
        className={cn(
          "mt-6 flex h-20 w-full max-w-[73.625rem] items-center gap-3 rounded-[2.5rem] from-white/14 to-white/6 px-3 sm:mt-10 sm:gap-6 sm:px-6 lg:mt-16 lg:gap-[5.75rem] lg:px-16",
          GLASS,
          BAR_EDGE,
          !entered && BAR_INTRO,
        )}
      >
        <div className="flex shrink-0 items-center gap-2 sm:gap-6 lg:gap-16">
          <BarButton icon="rewind" label="Previous episode" onClick={() => goTo(active - 1)} />
          <BarButton
            icon={playing ? "pause" : "play"}
            label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying(!playing)}
          />
          <BarButton icon="forward" label="Next episode" onClick={() => goTo(active + 1)} />
        </div>

        <div className="relative flex h-16 min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-[1.25rem] bg-black/40 py-2 pr-4 pl-2 sm:gap-4">
          <span className="relative size-12 shrink-0 overflow-hidden rounded-[0.75rem]">
            <Image
              key={current.id}
              src={current.art}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
              style={{ objectPosition: `50% ${current.focusY}%` }}
            />
          </span>
          <span className="flex min-w-0 flex-1 flex-col text-base leading-6 tracking-[-0.0125rem]">
            <span className="truncate font-medium text-white">{current.title}</span>
            <span className="truncate text-white/60">{current.topic}</span>
          </span>
          <LevelMeter playing={playing} bpm={current.bpm} className="hidden sm:flex" />
          <BarIcon name="more" size={24} className="hidden sm:block" />

          {/* The track runs the panel's full width; its rounded corners clip both ends. */}
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-white/16" />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-1 w-full origin-left rounded-r-[2px] bg-white"
            style={{ scaleX: progress }}
          />
        </div>

        <div className="hidden shrink-0 items-center gap-6 md:flex lg:gap-16">
          <BarIcon name="quote" size={32} />
          <BarIcon name="list" size={32} />
          <BarButton
            icon="volume"
            label="Mute"
            pressed={muted}
            onClick={() => setMuted(!muted)}
          />
        </div>
      </div>
    </div>
  )
}

function EpisodeCard({
  episode,
  index,
  position,
  className,
  isCurrent,
  preload,
  label,
  onClick,
}: {
  episode: TraxHeroEpisode
  index: number
  position: MotionValue<number>
  className: string
  isCurrent: boolean
  preload: boolean
  label: string
  onClick: () => void
}) {
  const depth = useTransform(() => ringOffset(index - position.get()))
  const x = useTransform(depth, DEPTH, FLOW.x)
  const rotateY = useTransform(depth, DEPTH, FLOW.rotateY)
  const scale = useTransform(depth, DEPTH, FLOW.scale)
  const opacity = useTransform(depth, DEPTH, FLOW.opacity)
  const titleScale = useTransform(depth, DEPTH, FLOW.title)
  const topicScale = useTransform(depth, DEPTH, FLOW.topic)
  // Nearer cards stack above farther ones; two cards swap as they pass the halfway point.
  const zIndex = useTransform(() => Math.round(30 - Math.abs(depth.get()) * 10))
  // A card out past the far slots (only with more than five episodes) can't be clicked.
  const pointerEvents = useTransform(() => (Math.abs(depth.get()) < 2.25 ? "auto" : "none"))

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isCurrent || undefined}
      style={{ x, rotateY, scale, opacity, zIndex, pointerEvents }}
      className={cn(
        "absolute top-0 left-[31.25rem] flex cursor-pointer flex-col items-center gap-4 overflow-hidden rounded-[2rem] from-white/22 to-white/8 px-2 pt-2 pb-5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-white",
        CARD_EDGE,
        GLASS,
        className,
      )}
    >
      <span className="relative block size-[31.5rem] shrink-0 overflow-hidden rounded-[1.5rem] bg-linear-to-b from-[#5a5a60] to-[#232326]">
        <Image
          src={episode.art}
          alt=""
          fill
          preload={preload}
          sizes="(min-width: 64rem) 32rem, 14rem"
          className="object-cover"
          style={{ objectPosition: `50% ${episode.focusY}%` }}
        />
      </span>
      <span className="flex w-full flex-col items-center text-center tracking-[-0.0125rem] whitespace-nowrap">
        <motion.span
          className="text-2xl leading-8 font-semibold text-white"
          style={{ scale: titleScale }}
        >
          {episode.title}
        </motion.span>
        <motion.span className="text-base leading-6 text-white/60" style={{ scale: topicScale }}>
          {episode.topic}
        </motion.span>
      </span>
    </motion.button>
  )
}

const ICONS = {
  rewind: "/trax/hero/icon-rewind.svg",
  pause: "/trax/hero/icon-pause.svg",
  // Not drawn in the hero frame; the Trax page's own white play glyph, at the pause icon's size.
  play: "/trax/play-small.svg",
  forward: "/trax/hero/icon-forward.svg",
  more: "/trax/hero/icon-more.svg",
  quote: "/trax/hero/icon-quote.svg",
  list: "/trax/hero/icon-list.svg",
  volume: "/trax/hero/icon-volume.svg",
}

function BarButton({
  icon,
  label,
  pressed,
  onClick,
}: {
  icon: keyof typeof ICONS
  label: string
  /** For toggles (mute): dims the glyph while on. */
  pressed?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "grid size-8 cursor-pointer place-items-center rounded-full transition-[opacity,scale] outline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-white active:scale-95",
        pressed && "opacity-40 hover:opacity-60",
      )}
    >
      <Image src={ICONS[icon]} alt="" width={32} height={32} className="block size-8" />
    </button>
  )
}

/**
 * Each bar's level (0–1 of the meter's 20px) for each eighth note of a 4/4 bar, looping. The
 * first is the bar's height in the wave glyph it replaces (icon-wave.svg: five 2px bars of
 * 6, 12, 18, 10 and 5px), so the meter rests as that glyph and starts from it.
 */
const METER_LEVELS = [
  [0.3, 0.75, 0.45, 1, 0.35, 0.6, 0.25, 0.8],
  [0.6, 0.35, 0.95, 0.5, 0.8, 0.3, 0.7, 0.45],
  [0.9, 0.5, 0.7, 0.35, 1, 0.6, 0.85, 0.4],
  [0.5, 1, 0.4, 0.7, 0.55, 0.95, 0.35, 0.75],
  [0.25, 0.55, 0.85, 0.4, 0.65, 0.3, 0.9, 0.5],
]

/**
 * The player bar's wave glyph as a level meter, like a DJ deck's: while a song plays, its five
 * bars bounce to their own patterns, a step per eighth note of the song's tempo; paused, they
 * spring back into the glyph. Reduced motion keeps the glyph still.
 */
function LevelMeter({
  playing,
  bpm,
  className,
}: {
  playing: boolean
  bpm: number
  className?: string
}) {
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const reduceMotion = useReducedMotion()
  const live = playing && !reduceMotion

  useEffect(() => {
    const eighth = 30 / bpm
    const controls = bars.current.map((bar, i) => {
      if (!bar) return null
      const levels = METER_LEVELS[i]
      return live
        ? animate(
            bar,
            { scaleY: [...levels, levels[0]] },
            { duration: eighth * levels.length, ease: "easeInOut", repeat: Infinity },
          )
        : animate(bar, { scaleY: levels[0] }, { type: "spring", visualDuration: 0.35, bounce: 0.25 })
    })
    return () => controls.forEach((c) => c?.stop())
  }, [live, bpm])

  return (
    <span
      aria-hidden
      className={cn("size-6 shrink-0 items-center justify-center gap-[0.125rem]", className)}
    >
      {METER_LEVELS.map((levels, i) => (
        <span
          key={i}
          ref={(el) => {
            bars.current[i] = el
          }}
          className="block h-5 w-[0.125rem] rounded-full bg-white"
          style={{ transform: `scaleY(${levels[0]})` }}
        />
      ))}
    </span>
  )
}

/** Player-bar glyphs with nothing behind them yet (transcript, queue): drawn, not buttons. */
function BarIcon({
  name,
  size,
  className,
}: {
  name: keyof typeof ICONS
  size: 24 | 32
  className?: string
}) {
  return (
    <Image
      src={ICONS[name]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn("shrink-0", size === 24 ? "size-6" : "size-8", className)}
    />
  )
}
