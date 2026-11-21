"use client"

import { createContext, use, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

import { heroPlayer } from "./content"

type ActiveEpisode = [number, Dispatch<SetStateAction<number>>]

const ActiveEpisodeContext = createContext<ActiveEpisode | null>(null)

/** Which episode is in the centre, shared by the hero's player and the wash behind it. */
export function TraxHeroState({ children }: { children: ReactNode }) {
  const state = useState(heroPlayer.initial)
  return <ActiveEpisodeContext value={state}>{children}</ActiveEpisodeContext>
}

export function useActiveEpisode() {
  const state = use(ActiveEpisodeContext)
  if (!state) throw new Error("useActiveEpisode needs a <TraxHeroState> around it")
  return state
}
