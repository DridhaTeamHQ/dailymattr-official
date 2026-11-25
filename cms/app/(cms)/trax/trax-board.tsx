"use client"

import { useRef, useState, useTransition } from "react"
import { Disc3, EyeOff, LayoutGrid, Pause, Pencil, Play, Plus, Star } from "lucide-react"

import { MoveButtons, moved } from "@/components/cms/media/list-controls"
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
    const next = moved(list, from, to)
    setList(next)
    startBusy(async () => showSaveToast(await reorderTraxEpisodes(next.map((e) => e.id)), "Order saved"))
  }

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
        text="Cover-flow: a card in the player at the top of the Trax page, and a track in the big featured player. Featured card: one of the cards under the big player. The order here is the order on the website."
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
        <ol className="flex flex-col gap-3">
          {list.map((episode, i) => (
            <li key={episode.id}>
              <Card className={cn("p-0", !episode.published && "opacity-75")}>
                <CardContent className="flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap">
                  <span className="w-5 shrink-0 text-center text-sm font-semibold text-muted-foreground tabular-nums">{i + 1}</span>

                  <button
                    type="button"
                    onClick={() => listen(episode)}
                    className="group relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label={playing === episode.id ? `Pause ${episode.title}` : `Listen to ${episode.title}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- media from any host */}
                    <img
                      src={mediaSrc(episode.artUrl, websiteUrl)}
                      alt=""
                      className={cn("absolute inset-0 size-full object-cover", !episode.published && "grayscale")}
                      style={{ objectPosition: `50% ${episode.focusY}%` }}
                    />
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/35 text-white transition-opacity",
                        playing === episode.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      {playing === episode.id ? <Pause className="size-6" /> : <Play className="size-6" />}
                    </span>
                  </button>

                  <div className="min-w-0 flex-1 basis-56">
                    <p className="flex items-center gap-2 font-semibold">
                      <span className="truncate">{episode.title}</span>
                      {!episode.published && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-warning">
                          <EyeOff className="size-3.5" aria-hidden />
                          Hidden
                        </span>
                      )}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{episode.topic}</p>
                    {episode.description && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{episode.description}</p>}
                    <div className="mt-2 flex flex-wrap gap-1">
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
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-3">
                    <MoveButtons index={i} count={list.length} onMove={move} disabled={busy} label={episode.title} />
                    <Switch
                      checked={episode.published}
                      onCheckedChange={(published) => flag(episode, { published })}
                      disabled={busy}
                      aria-label={`Show ${episode.title} on the website`}
                    />
                    <Button variant="outline" size="sm" onClick={() => setEditing(episode)}>
                      <Pencil data-icon="inline-start" />
                      Edit
                    </Button>
                  </div>
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
