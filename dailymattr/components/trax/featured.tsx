"use client"

import { useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"

import { FadeIn } from "@/components/shared/fade-in"
import { revealDelay } from "@/components/shared/reveal-delay"
import { cn } from "@/lib/utils"
import { featured, type TraxEpisode } from "./content"
import { traxGlow, TraxSectionIntro, TraxTag } from "./primitives"
import { formatMinutes, formatTime, useTrack } from "./use-track"

/**
 * Progress bar from the Figma lines: a grey track with a round-capped blue fill that grows
 * with the playhead. The featured bar is 6px with a soft violet glow (8595:12023); the cards'
 * are 4px (8595:12150).
 *
 * It is also a slider: click anywhere to jump there, or drag the playhead (a handle shows on
 * hover and while dragging). Arrow keys step 5s, Home / End go to the start / end.
 */
function ProgressBar({
  fillRef,
  duration,
  elapsed,
  seek,
  label,
  size,
}: {
  fillRef: React.RefObject<HTMLDivElement | null>
  duration: number
  elapsed: number
  seek: (fraction: number) => void
  label: string
  size: "lg" | "sm"
}) {
  const lg = size === "lg"
  const [dragging, setDragging] = useState(false)

  const seekTo = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    seek((event.clientX - box.left) / box.width)
  }

  const step = (seconds: number) => duration && seek((elapsed + seconds) / duration)

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={`Seek ${label}`}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={elapsed}
      aria-valuetext={`${formatTime(elapsed)} of ${formatTime(duration)}`}
      // A taller hit area than the line itself, so it is easy to grab.
      className="group/seek relative flex h-5 w-full cursor-pointer touch-none items-center outline-none"
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
        seekTo(event)
      }}
      onPointerMove={(event) => dragging && seekTo(event)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(event) => {
        const keys: Record<string, () => void> = {
          ArrowRight: () => step(5),
          ArrowUp: () => step(5),
          ArrowLeft: () => step(-5),
          ArrowDown: () => step(-5),
          Home: () => seek(0),
          End: () => seek(0.999),
        }
        if (!keys[event.key]) return
        event.preventDefault()
        keys[event.key]()
      }}
    >
      <div className={cn("relative w-full rounded-full bg-[#d1d1d6]", lg ? "h-1.5" : "h-1")}>
        <div
          ref={fillRef}
          className={cn(
            "absolute inset-y-0 left-0 w-0 rounded-full bg-[#3979ff]",
            lg && "shadow-[0_0_30px_rgba(122,81,226,0.25)]"
          )}
        >
          {/* Playhead handle at the end of the fill. */}
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#3979ff] shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-[opacity,transform]",
              lg ? "size-4" : "size-3.5",
              dragging
                ? "scale-110 opacity-100"
                : "opacity-0 group-hover/seek:opacity-100 group-focus-visible/seek:opacity-100"
            )}
          />
        </div>
      </div>
    </div>
  )
}

/** Square / wide artwork: the episode's thumbnail, framed so its title stays whole. */
function Art({ episode, sizes, className }: { episode: TraxEpisode; sizes: string; className: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-[#e6e7ea]", className)}>
      <Image
        src={episode.art}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
        style={{ objectPosition: `50% ${episode.focusY}%` }}
      />
    </div>
  )
}

/**
 * Large "now playing" card (Figma 8595:12023): plays the playlist in order. Previous / next
 * step through it (wrapping), keeping it playing if it was; a finished episode moves on to
 * the next. Pause holds the playhead, so play picks up where it stopped.
 */
function FeaturedPlayer() {
  const { playlist } = featured
  const [index, setIndex] = useState(0)
  const episode = playlist[index]
  const go = (step: number) => setIndex((i) => (i + step + playlist.length) % playlist.length)
  const track = useTrack(episode.audio, { onEnded: () => go(1) })

  return (
    <div
      className="grid gap-8 overflow-hidden rounded-[1.5rem] p-5 font-helvetica sm:p-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:items-center lg:h-[25rem] lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-12 lg:p-10"
      style={{ backgroundImage: traxGlow("linear-gradient(#f7f7f7, #f7f7f7)") }}
    >
      <audio {...track.audioProps} />
      <Art episode={episode} sizes="(min-width: 1024px) 320px, (min-width: 768px) 240px, 90vw" className="aspect-square w-full rounded-[1.25rem]" />

      <div className="flex min-w-0 flex-col gap-[1.125rem]">
        <div className="flex items-center gap-3">
          <TraxTag>{episode.tag}</TraxTag>
          <span className="text-sm leading-5 text-[#696969]">
            {track.duration ? formatMinutes(track.duration) : " "}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-3xl leading-tight font-medium tracking-[-0.0625rem] text-[#1c1b17] lg:text-display lg:leading-11 lg:tracking-[-0.0938rem]">
            {episode.title}
          </h3>
          <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969] lg:text-lg lg:leading-7">
            {episode.description}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <ProgressBar
              fillRef={track.fillRef}
              duration={track.duration}
              elapsed={track.elapsed}
              seek={track.seek}
              label={episode.title}
              size="lg"
            />
            <div className="mt-3 flex justify-between text-base leading-normal text-[#1c1c1e] tabular-nums lg:text-lg">
              <span>{formatTime(track.elapsed)}</span>
              <span>{track.duration ? formatTime(track.duration) : "0:00"}</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <button type="button" aria-label="Previous episode" onClick={() => go(-1)} className="transition-opacity hover:opacity-70">
              <Image src="/trax/skip-back.svg" alt="" width={25} height={24} />
            </button>
            <button
              type="button"
              aria-label={track.playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
              onClick={track.toggle}
              className="grid size-[4.25rem] place-items-center rounded-full bg-[#3979ff] text-white transition-transform hover:scale-105"
            >
              {track.playing ? (
                <Pause className="size-7" fill="currentColor" strokeWidth={0} />
              ) : (
                <Play className="ml-1 size-7" fill="currentColor" strokeWidth={0} />
              )}
            </button>
            <button type="button" aria-label="Next episode" onClick={() => go(1)} className="transition-opacity hover:opacity-70">
              <Image src="/trax/skip-forward.svg" alt="" width={25} height={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Episode card (Figma 8595:12150): plays its own episode only. Pause keeps the playhead;
 * when it finishes it goes back to the start.
 */
function EpisodeCard({ episode }: { episode: TraxEpisode }) {
  const track = useTrack(episode.audio)

  return (
    <div className="flex h-full flex-col gap-3.5 rounded-[1rem] border border-[#ebebeb] bg-white p-6 font-helvetica">
      <audio {...track.audioProps} />
      <Art episode={episode} sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 90vw" className="h-[11.25rem] w-full shrink-0 rounded-[0.875rem]" />

      <div className="flex items-center justify-between">
        <TraxTag>{episode.tag}</TraxTag>
        <span className="text-sm leading-5 text-[#696969] tabular-nums">
          {track.playing || track.elapsed
            ? `${formatTime(track.elapsed)} / ${formatTime(track.duration)}`
            : track.duration
              ? formatMinutes(track.duration)
              : " "}
        </span>
      </div>

      <h3 className="text-lg leading-6 font-medium tracking-[-0.0125rem] text-black">{episode.title}</h3>
      <p className="text-base leading-6 tracking-[-0.0125rem] text-[#696969]">{episode.description}</p>

      <div className="mt-auto flex items-center gap-3 pt-1">
        <button
          type="button"
          aria-label={track.playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
          onClick={track.toggle}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-[#3979ff] text-white transition-colors hover:bg-[#2f6bf0]"
        >
          {track.playing ? (
            <Pause className="size-3.5" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play className="ml-0.5 size-3.5" fill="currentColor" strokeWidth={0} />
          )}
        </button>
        <ProgressBar
          fillRef={track.fillRef}
          duration={track.duration}
          elapsed={track.elapsed}
          seek={track.seek}
          label={episode.title}
          size="sm"
        />
      </div>
    </div>
  )
}

/** Featured player plus three episode cards. Figma 8595:12017. */
export function TraxFeatured() {
  return (
    <section id="featured" className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-[10rem]">
      <div className="mx-auto max-w-[75rem]">
        <TraxSectionIntro eyebrow={featured.eyebrow} title={featured.title} />

        <FadeIn delay={0.4} className="mt-10 lg:mt-16">
          <FeaturedPlayer />
        </FadeIn>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:grid-cols-3 lg:gap-6">
          {featured.episodes.map((episode, i) => (
            <FadeIn key={episode.id} delay={revealDelay(i, 3)} className="h-full">
              <EpisodeCard episode={episode} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
