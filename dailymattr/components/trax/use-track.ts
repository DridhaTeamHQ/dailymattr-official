"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"

/**
 * Only one Trax player sounds at a time: a player that starts announces itself on this event,
 * and every other player (the hero's included) pauses.
 */
export const TRAX_PLAY_EVENT = "trax:play"

export function announceTraxPlay(id: string) {
  window.dispatchEvent(new CustomEvent(TRAX_PLAY_EVENT, { detail: id }))
}

/** Calls `onOther` whenever a different Trax player starts. */
export function useOnOtherTraxPlay(id: string, onOther: () => void) {
  const onOtherRef = useRef(onOther)
  useLayoutEffect(() => {
    onOtherRef.current = onOther
  })
  useEffect(() => {
    const handle = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) onOtherRef.current()
    }
    window.addEventListener(TRAX_PLAY_EVENT, handle)
    return () => window.removeEventListener(TRAX_PLAY_EVENT, handle)
  }, [id])
}

/** 54.4 → "0:54". */
export function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

/** 54.4 → "1 min" (never "0 min"). */
export function formatMinutes(seconds: number) {
  return `${Math.max(1, Math.round(seconds / 60))} min`
}

/**
 * One <audio> track: play / pause (pausing keeps the playhead, so play resumes from there),
 * elapsed and total time, and a progress fill driven every frame while it plays. A new `src`
 * starts from the beginning, and keeps playing if it was.
 */
export function useTrack(src: string, { onEnded }: { onEnded?: () => void } = {}) {
  const id = useId()
  const audioRef = useRef<HTMLAudioElement>(null)
  /** The bar's blue fill; its width is set directly each frame, without re-rendering. */
  const fillRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [duration, setDuration] = useState(0)

  const setFill = (fraction: number) => {
    if (fillRef.current) fillRef.current.style.width = `${Math.min(1, Math.max(0, fraction)) * 100}%`
  }

  // A new track starts at 0:00 with an empty bar (state reset while rendering, bar in the DOM).
  const [trackSrc, setTrackSrc] = useState(src)
  if (trackSrc !== src) {
    setTrackSrc(src)
    setElapsed(0)
    setDuration(0)
  }
  useLayoutEffect(() => setFill(0), [src])

  // Read the track's length. The file can finish loading before the page is interactive (and
  // before React would see onLoadedMetadata), so also read it if it is already known.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const read = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    }
    audio.addEventListener("durationchange", read)
    if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) read()
    return () => audio.removeEventListener("durationchange", read)
  }, [src])

  // The <audio> follows `playing`.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!playing) return audio.pause()
    announceTraxPlay(id)
    audio.play().catch((error: DOMException) => {
      // AbortError: a quick skip swapped the track before it started.
      if (error.name !== "AbortError") setPlaying(false)
    })
  }, [playing, src, id])

  // While playing, move the bar every frame and the clock every second. The audio's own
  // timeupdate (a few times a second) and pause events keep both right even where the
  // browser slows animation frames down (a background or throttled window).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !playing) return
    const sync = () => {
      if (audio.duration) setFill(audio.currentTime / audio.duration)
      setElapsed(Math.floor(audio.currentTime))
    }
    let frame = 0
    const tick = () => {
      sync()
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    audio.addEventListener("timeupdate", sync)
    audio.addEventListener("pause", sync)
    return () => {
      cancelAnimationFrame(frame)
      audio.removeEventListener("timeupdate", sync)
      audio.removeEventListener("pause", sync)
    }
  }, [playing, src])

  useOnOtherTraxPlay(id, () => setPlaying(false))

  // Next keeps a page you leave mounted but hidden (cacheComponents): stop the sound then, and
  // rewind, so the episode is back at its beginning when the visitor returns.
  useLayoutEffect(() => {
    const audio = audioRef.current
    return () => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      setPlaying(false)
      setElapsed(0)
      setFill(0)
    }
  }, [])

  const audioProps = {
    ref: audioRef,
    src,
    preload: "metadata" as const,
    onEnded: () => {
      if (onEnded) return onEnded()
      // Back to the beginning, ready to play again.
      const audio = audioRef.current
      if (audio) audio.currentTime = 0
      setPlaying(false)
      setElapsed(0)
      setFill(0)
    },
  }

  /** Jump to a point in the track (0–1 of its length), playing or paused. */
  const seek = (fraction: number) => {
    const audio = audioRef.current
    const length = audio?.duration || duration
    if (!audio || !length) return
    const time = Math.min(1, Math.max(0, fraction)) * length
    audio.currentTime = time
    setFill(time / length)
    setElapsed(Math.floor(time))
  }

  return {
    audioProps,
    fillRef,
    playing,
    setPlaying,
    toggle: () => setPlaying((p) => !p),
    seek,
    elapsed,
    duration,
  }
}
