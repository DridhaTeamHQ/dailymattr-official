"use client"

import { useRef, useState, useTransition } from "react"
import { Disc3, EyeOff, LayoutGrid, Pause, Pencil, Play, Plus, Star } from "lucide-react"

import { DragHandle, useDragSort } from "@/components/cms/media/drag-sort"
import { moved } from "@/components/cms/media/list-controls"
import type { UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { TraxEpisodeItem } from "@/lib/formats/data"
import { mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { EmptyState, PanelIntro } from "../qix/qix-board"
import { reorderTraxEpisodes, setTraxFlags } from "./actions"
import { EpisodeDialog } from "./episode-dialog"

type Flags = Partial<Pick<TraxEpisodeItem, "published" | "inHero" | "inFeaturedCards" | "heroStart">>

export function TraxBoard({
  episodes,
  websiteUrl,
  uploads,
}: {
  episodes: TraxEpisodeItem[]
  websiteUrl: string
  uploads: UploadSetup
}) {
  const key = episodes.map((e) => `${e.id}:${e.updatedAt}`).join("|")
  const [state, setState] = useState({ key, list: episodes })
  if (state.key !== key) setState({ key, list: episodes })
  const list = state.list
  const setList = (next: TraxEpisodeItem[]) => setState({ key, list: next })

  const [editing, setEditing] = useState<TraxEpisodeItem | "new" | null>(null)
  const [busy, startBusy] = useTransition()
  const [playing, setPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const cards = list.filter((e) => e.published && e.inFeaturedCards).length

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= list.length) return
    const next = moved(list, from, to)
    setList(next)
    startBusy(async () => showSaveToast(await reorderTraxEpisodes(next.map((e) => e.id)), "Order saved"))
  }
  const { itemProps } = useDragSort(move, busy)

  function flag(episode: TraxEpisodeItem, flags: Flags) {
    setList(
      list.map((e) =>
        e.id === episode.id ? { ...e, ...flags } : flags.heroStart ? { ...e, heroStart: false } : e
      )
    )
    startBusy(async () => showSaveToast(await setTraxFlags(episode.id, flags)))
  }

  function listen(episode: TraxEpisodeItem) {
    const audio = audioRef.current
    if (!audio) return
    if (playing === episode.id) {
      audio.pause()
      setPlaying(null)
      return
    }
    audio.src = mediaSrc(episode.audioUrl, websiteUrl)
    audio.play().then(() => setPlaying(episode.id)).catch(() => setPlaying(null))
  }

  return (
    <div className="flex flex-col gap-4">
      <audio ref={audioRef} onEnded={() => setPlaying(null)} className="hidden" />
      <PanelIntro
        title="Episodes"
        text="Cover-flow: a card in the player at the top of the Trax page, and a track in the big featured player. Featured card: one of the cards under the big player. The order here is the order on the website: drag a card to move it."
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus data-icon="inline-start" />
            Add episode
          </Button>
        }
      />
      {cards !== 3 && list.length > 0 && (
        <p className="rounded-xl bg-warning/8 px-4 py-2.5 text-sm text-warning ring-1 ring-warning/25">
          {cards} featured card{cards === 1 ? " is" : "s are"} showing. The row is laid out for 3.
        </p>
      )}

      {list.length === 0 ? (
        <EmptyState text="No episodes yet. The website shows its built-in episodes until you add one." onAdd={() => setEditing("new")} />
      ) : (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((episode, i) => (
            <li
              key={episode.id}
              {...itemProps(i)}
            >
              <Card className={cn("h-full gap-0 overflow-hidden p-0", !episode.published && "opacity-75")}>
                {/* Artwork: click to listen */}
                <button
                  type="button"
                  onClick={() => listen(episode)}
                  className="group relative block aspect-square w-full overflow-hidden bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label={playing === episode.id ? `Pause ${episode.title}` : `Listen to ${episode.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- media from any host */}
                  <img
                    src={mediaSrc(episode.artUrl, websiteUrl)}
                    alt=""
                    draggable={false}
                    className={cn("absolute inset-0 size-full object-cover", !episode.published && "grayscale")}
                    style={{ objectPosition: `50% ${episode.focusY}%` }}
                  />
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-black/35 text-white transition-opacity",
                      playing === episode.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {playing === episode.id ? <Pause className="size-7" /> : <Play className="size-7" />}
                  </span>
                  <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold tabular-nums shadow-sm">
                    {i + 1}
                  </span>
                  {!episode.published && (
                    <span className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-lg bg-background px-2 py-1 text-xs font-medium shadow-sm">
                      <EyeOff className="size-3.5 text-warning" aria-hidden />
                      Hidden
                    </span>
                  )}
                </button>

                <CardContent className="flex flex-1 flex-col gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold" title={episode.title}>
                      {episode.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground" title={episode.topic}>
                      {episode.topic}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Pill on={episode.inHero} icon={Disc3} label="Cover-flow" disabled={busy} onClick={() => flag(episode, { inHero: !episode.inHero })} />
                    <Pill
                      on={episode.inFeaturedCards}
                      icon={LayoutGrid}
                      label="Featured card"
                      disabled={busy}
                      onClick={() => flag(episode, { inFeaturedCards: !episode.inFeaturedCards })}
                    />
                    <Pill
                      on={episode.heroStart}
                      icon={Star}
                      label="Opens here"
                      disabled={busy || !episode.inHero}
                      onClick={() => flag(episode, { heroStart: !episode.heroStart })}
                    />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-1 pt-1">
                    <DragHandle index={i} count={list.length} onMove={move} disabled={busy} label={episode.title} />
                    <Switch
                      checked={episode.published}
                      onCheckedChange={(published) => flag(episode, { published })}
                      disabled={busy}
                      aria-label={`Show ${episode.title} on the website`}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setEditing(episode)}>
                    <Pencil data-icon="inline-start" />
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <EpisodeDialog editing={editing} onClose={() => setEditing(null)} websiteUrl={websiteUrl} uploads={uploads} />
    </div>
  )
}

function Pill({
  on,
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  on: boolean
  icon: typeof Star
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={on}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 transition-colors disabled:opacity-50",
        on ? "bg-brand-blue-soft text-primary ring-primary/20" : "text-muted-foreground ring-border hover:bg-muted"
      )}
    >
      <Icon className={cn("size-3", on && label === "Opens here" && "fill-current")} aria-hidden />
      {label}
    </button>
  )
}
