"use client"

import Image from "next/image"
import { motion, useMotionValue } from "motion/react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { heroPlayer, type TraxHeroEpisode } from "./content"

const { episodes } = heroPlayer
const count = episodes.length
const wrap = (i: number) => ((i % count) + count) % count

/** Card sizes per cover-flow depth (Figma 9278:728 centre, 9278:716 near, 9278:704 far). */
const TIERS = {
  center: {
    card: "gap-4 rounded-[2rem] pb-5",
    art: "size-[31.5rem] rounded-[1.5rem] from-[#5a5a60] to-[#232326]",
    title: "text-2xl leading-8",
    topic: "leading-6",
  },
  near: {
    card: "gap-3 rounded-[1.5rem] pb-4",
    art: "size-[27rem] rounded-[1rem] from-[#5a5a60] to-[#232326]",
    title: "text-base leading-6",
    topic: "leading-6",
  },
  far: {
    card: "gap-3 rounded-[1.25rem] pb-4 opacity-72",
    art: "size-[22.5rem] rounded-[0.75rem] from-[#4a4a4f] to-[#1c1c1e]",
    title: "text-base leading-5",
    topic: "leading-5",
  },
} as const

/**
 * The five slots, by distance from the playing card, on the 1520×604 stage. Outer edges tip
 * away from the viewer; nearer cards stack above farther ones.
 */
const SLOTS = [
  { tier: "far", place: "top-[5.25rem] left-[4.75rem] z-10 [transform:rotateY(-24deg)]" },
  { tier: "near", place: "top-[2.75rem] left-[15.25rem] z-20 [transform:rotateY(-14deg)]" },
  { tier: "center", place: "top-0 left-[31.25rem] z-30 [transform:rotateY(0deg)]" },
  { tier: "near", place: "top-[2.75rem] left-[51.75rem] z-20 [transform:rotateY(14deg)]" },
  { tier: "far", place: "top-[5.25rem] left-[66.75rem] z-10 [transform:rotateY(24deg)]" },
] as const

/**
 * Entrance, played once from the first paint (CSS, keyframes `trax-intro` in globals.css):
 * 1. the playing card drops in, 2. the near pair slides out from behind it, then the far pair,
 * 3. the player bar fades up, slowly. Indexed by each card's starting slot, like SLOTS; the x
 * offsets put every card's centre on the stage's centre, hidden behind the playing card.
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

/** Height-fit numbers for browsers without CSS length ÷ length (the CSS version is in hero.tsx). */
const FIT_REM = 56
const MIN_FIT = 0.6

/** Same expo-out curve as FadeIn, so cards settle the way the rest of the site does. */
const SLIDE = "duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"

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
  const [active, setActive] = useState(heroPlayer.initial)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const progress = useMotionValue(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Fallback for --trax-hero-fit (see TraxHero) where CSS can't divide lengths
  useLayoutEffect(() => {
    if (CSS.supports("zoom", "calc(1px / 1px)")) return
    const root = document.documentElement
    const update = () => {
      const styles = getComputedStyle(root)
      const chrome = parseFloat(styles.getPropertyValue("--chrome-height")) || 0
      const rem = parseFloat(styles.fontSize)
      const fit = (window.innerHeight - chrome) / (FIT_REM * rem)
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
    audio.play().catch((error: DOMException) => {
      // AbortError: a quick skip replaced the song before it started. Anything else (e.g.
      // the browser refused to play) leaves the player paused.
      if (error.name !== "AbortError") setPlaying(false)
    })
  }, [playing, active])

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
    if (wrap(index) === active) return
    progress.set(0)
    setActive(wrap(index))
  }

  const current = episodes[active]

  return (
    <div className="relative flex w-full flex-col items-center lg:[zoom:var(--trax-hero-fit,1)]">
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
            let offset = wrap(i - active)
            if (offset > count / 2) offset -= count
            const slot = SLOTS[offset + 2]
            if (!slot) return null
            const isCurrent = offset === 0
            // Fixed per card (from where it starts), so skipping never replays the entrance
            let start = wrap(i - heroPlayer.initial)
            if (start > count / 2) start -= count
            return (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                tier={slot.tier}
                className={cn(slot.place, INTRO[start + 2], "motion-reduce:animate-none")}
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
        className={cn(
          "mt-6 flex h-20 w-full max-w-[73.625rem] items-center gap-3 rounded-[2.5rem] from-white/14 to-white/6 px-3 sm:mt-10 sm:gap-6 sm:px-6 lg:mt-16 lg:gap-[5.75rem] lg:px-16",
          GLASS,
          BAR_EDGE,
          BAR_INTRO,
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
          <BarIcon name="wave" size={24} className="hidden sm:block" />
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
  tier,
  className,
  isCurrent,
  preload,
  label,
  onClick,
}: {
  episode: TraxHeroEpisode
  tier: keyof typeof TIERS
  className: string
  isCurrent: boolean
  preload: boolean
  label: string
  onClick: () => void
}) {
  const t = TIERS[tier]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={isCurrent || undefined}
      className={cn(
        "absolute flex cursor-pointer flex-col items-center overflow-hidden from-white/22 to-white/8 px-2 pt-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-white",
        CARD_EDGE,
        GLASS,
        "transition-[left,top,transform,opacity,gap,padding,border-radius]",
        SLIDE,
        t.card,
        className,
      )}
    >
      <span
        className={cn(
          "relative block shrink-0 overflow-hidden bg-linear-to-b transition-[width,height,border-radius]",
          SLIDE,
          t.art,
        )}
      >
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
        <span
          className={cn(
            "font-semibold text-white transition-[font-size,line-height]",
            SLIDE,
            t.title,
          )}
        >
          {episode.title}
        </span>
        <span className={cn("text-base text-white/60", t.topic)}>{episode.topic}</span>
      </span>
    </button>
  )
}

const ICONS = {
  rewind: "/trax/hero/icon-rewind.svg",
  pause: "/trax/hero/icon-pause.svg",
  // Not drawn in the hero frame; the Trax page's own white play glyph, at the pause icon's size.
  play: "/trax/play-small.svg",
  forward: "/trax/hero/icon-forward.svg",
  wave: "/trax/hero/icon-wave.svg",
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
