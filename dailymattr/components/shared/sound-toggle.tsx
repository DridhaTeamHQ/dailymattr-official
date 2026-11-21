"use client"

import { useSyncExternalStore } from "react"
import { Volume2, VolumeX } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * The visitor's mute choice for videos that play with sound (home story cards, explainers
 * gallery), shared so muting one keeps the next one quiet too. Lasts for the visit.
 */
let muted = false
const listeners = new Set<() => void>()

export function setVideosMuted(next: boolean) {
  if (next === muted) return
  muted = next
  listeners.forEach((l) => l())
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

/** True once the visitor has muted videos with a SoundToggle. */
export function useVideosMuted() {
  return useSyncExternalStore(subscribe, () => muted, () => false)
}

/**
 * True when a pointer or key event came from a SoundToggle. Players that turn the sound on
 * at the first click anywhere skip these, so the toggle alone decides.
 */
export const fromSoundToggle = (e: Event) => e.target instanceof Element && !!e.target.closest("[data-sound-toggle]")

/** Small round mute / unmute button for the bottom-right corner of a playing video. */
export function SoundToggle({
  muted,
  onToggle,
  className,
}: {
  /** What the visitor hears now: muted by choice or because the browser refused sound. */
  muted: boolean
  onToggle: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      data-sound-toggle
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      // Don't let the card or panel underneath treat this as its own click (play, open, drag)
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "absolute right-3 bottom-3 z-10 grid size-8 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-[background-color,scale] duration-200 hover:scale-105 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
    >
      {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
    </button>
  )
}
