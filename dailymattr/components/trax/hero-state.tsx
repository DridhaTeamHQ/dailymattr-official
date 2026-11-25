"use client"

import { createContext, use, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

import type { TraxHeroEpisode } from "./content"

type ActiveEpisode = [number, Dispatch<SetStateAction<number>>]

const ActiveEpisodeContext = createContext<ActiveEpisode | null>(null)
const EpisodesContext = createContext<{ episodes: TraxHeroEpisode[]; initial: number } | null>(null)

/**
 * The hero's episodes (from the CMS, lib/formats.ts) and which one is in the centre, shared by
 * the hero's player and the wash behind it.
 */
export function TraxHeroState({
  episodes,
  initial,
  children,
}: {
  episodes: TraxHeroEpisode[]
  initial: number
  children: ReactNode
}) {
  const start = Math.min(Math.max(0, initial), Math.max(0, episodes.length - 1))
  const state = useState(start)
  // A list from the CMS can shrink under a visitor (a page cached across a save): stay in range.
  if (episodes.length && state[0] >= episodes.length) state[1](start)
  return (
    <EpisodesContext value={{ episodes, initial: start }}>
      <ActiveEpisodeContext value={state}>{children}</ActiveEpisodeContext>
    </EpisodesContext>
  )
}

export function useActiveEpisode() {
  const state = use(ActiveEpisodeContext)
  if (!state) throw new Error("useActiveEpisode needs a <TraxHeroState> around it")
  return state
}

export function useHeroEpisodes() {
  const value = use(EpisodesContext)
  if (!value) throw new Error("useHeroEpisodes needs a <TraxHeroState> around it")
  return value
}
