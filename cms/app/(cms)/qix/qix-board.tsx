"use client"

import { useState, useTransition } from "react"
import { Clapperboard, EyeOff, GalleryHorizontal, House, Pencil, Plus } from "lucide-react"

import { DragHandle, useDragSort } from "@/components/cms/media/drag-sort"
import { moved } from "@/components/cms/media/list-controls"
import type { UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { QixStepItem, QixStoryItem } from "@/lib/formats/data"
import { MAX_QIX_STEPS as MAX_STEPS } from "@/lib/formats/limits"
import { mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { reorderQixStories, setQixStoryFlags } from "./actions"
import { StepsEditor } from "./steps-editor"
import { StoryDialog } from "./story-dialog"

/** A list the editor can reorder at once; it follows the saved list whenever that changes. */
function useLocalOrder<T extends { id: string; updatedAt: string }>(items: T[]) {
  const key = items.map((i) => `${i.id}:${i.updatedAt}`).join("|")
  const [state, setState] = useState({ key, list: items })
  if (state.key !== key) setState({ key, list: items })
  return [state.list, (list: T[]) => setState({ key, list })] as const
}

/** "new" opens an empty form; an item opens it filled in; null closes it. */
type Editing<T> = T | "new" | null

export function QixBoard({
  stories,
  steps,
  websiteUrl,
  uploads,
}: {
  stories: QixStoryItem[]
  steps: QixStepItem[]
  websiteUrl: string
  uploads: UploadSetup
}) {
  return (
    <Tabs defaultValue="stories" className="gap-5">
      <TabsList>
        <TabsTrigger value="stories">Stories · carousel &amp; story rows</TabsTrigger>
        <TabsTrigger value="steps">The experience · steps</TabsTrigger>
      </TabsList>
      <TabsContent value="stories">
        <StoriesPanel stories={stories} websiteUrl={websiteUrl} uploads={uploads} />
      </TabsContent>
      <TabsContent value="steps">
        <StepsPanel steps={steps} websiteUrl={websiteUrl} uploads={uploads} />
      </TabsContent>
    </Tabs>
  )
}

// ── Stories ───────────────────────────────────────────────────────────────────────────────

function StoriesPanel({ stories, websiteUrl, uploads }: { stories: QixStoryItem[]; websiteUrl: string; uploads: UploadSetup }) {
  const [list, setList] = useLocalOrder(stories)
  const [editing, setEditing] = useState<Editing<QixStoryItem>>(null)
  const [busy, startBusy] = useTransition()

  function move(from: number, to: number) {
    if (from === to || to < 0 || to >= list.length) return
    const next = moved(list, from, to)
    setList(next)
    startBusy(async () => showSaveToast(await reorderQixStories(next.map((s) => s.id)), "Order saved"))
  }
  const { itemProps } = useDragSort(move, busy)

  function flag(story: QixStoryItem, flags: Partial<Pick<QixStoryItem, "published" | "inHero" | "inGallery" | "inHome">>) {
    setList(list.map((s) => (s.id === story.id ? { ...s, ...flags } : s)))
    startBusy(async () => showSaveToast(await setQixStoryFlags(story.id, flags)))
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelIntro
        title="Stories"
        text="Each story is a 9:16 cover with a video that plays on it. Top cards: the big cards with Play at the very top of the Qix page, three at a time. Carousel: the 3D carousel under “See the bigger picture” on the Qix page. Home: the scrolling row under “One place to catch up” on the home page. Click a pill to switch a place on or off. The order here is the order on the website: drag a card to move it."
        action={
          <Button onClick={() => setEditing("new")}>
            <Plus data-icon="inline-start" />
            Add story
          </Button>
        }
      />

      {list.length === 0 ? (
        <EmptyState text="No stories yet. The website shows its built-in stories until you add one." onAdd={() => setEditing("new")} />
      ) : (
        <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((story, i) => (
            <li key={story.id} {...itemProps(i)}>
              <Card className={cn("h-full gap-0 overflow-hidden p-0", !story.published && "opacity-75")}>
                <button
                  type="button"
                  onClick={() => setEditing(story)}
                  className="group relative block aspect-[9/16] overflow-hidden bg-muted text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label={`Edit ${story.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- media from any host */}
                  <img
                    src={mediaSrc(story.coverUrl, websiteUrl)}
                    alt=""
                    draggable={false}
                    className={cn("absolute inset-0 size-full object-cover transition", !story.published && "grayscale")}
                  />
                  {story.videoUrl && (
                    <video
                      src={mediaSrc(story.videoUrl, websiteUrl)}
                      muted
                      loop
                      playsInline
                      preload="none"
                      className="absolute inset-0 size-full object-cover opacity-0 transition-opacity group-hover:opacity-100"
                      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />
                  )}
                  <span className="absolute top-2 left-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold tabular-nums shadow-sm">
                    {i + 1}
                  </span>
                  {!story.published && (
                    <span className="absolute inset-x-2 bottom-2 flex items-center gap-1.5 rounded-lg bg-background px-2 py-1 text-xs font-medium shadow-sm">
                      <EyeOff className="size-3.5 text-warning" aria-hidden />
                      Hidden
                    </span>
                  )}
                  <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-background/90 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                    <Pencil className="size-3.5" aria-hidden />
                  </span>
                </button>
                <CardContent className="flex flex-1 flex-col gap-2.5 p-3">
                  <p className="line-clamp-2 text-sm leading-snug font-semibold">{story.title}</p>
                  <div className="flex flex-wrap gap-1">
                    <PlaceToggle on={story.inGallery} icon={GalleryHorizontal} label="Top cards" disabled={busy} onClick={() => flag(story, { inGallery: !story.inGallery })} />
                    <PlaceToggle on={story.inHero} icon={Clapperboard} label="Carousel" disabled={busy} onClick={() => flag(story, { inHero: !story.inHero })} />
                    <PlaceToggle on={story.inHome} icon={House} label="Home" disabled={busy} onClick={() => flag(story, { inHome: !story.inHome })} />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <DragHandle index={i} count={list.length} onMove={move} disabled={busy} label={story.title} />
                    <Switch
                      checked={story.published}
                      onCheckedChange={(published) => flag(story, { published })}
                      disabled={busy}
                      aria-label={`Show ${story.title} on the website`}
                    />
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <StoryDialog editing={editing} onClose={() => setEditing(null)} websiteUrl={websiteUrl} uploads={uploads} />
    </div>
  )
}

/** A small pill that switches one placement on or off. */
function PlaceToggle({
  on,
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  on: boolean
  icon: typeof Clapperboard
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
      title={on ? `In the ${label.toLowerCase()} - click to take it out` : `Not in the ${label.toLowerCase()} - click to add it`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 transition-colors disabled:opacity-50",
        on ? "bg-brand-blue-soft text-primary ring-primary/20" : "text-muted-foreground ring-border line-through decoration-1 hover:bg-muted"
      )}
    >
      <Icon className="size-3" aria-hidden />
      {label}
    </button>
  )
}

// ── Experience steps ──────────────────────────────────────────────────────────────────────

function StepsPanel({ steps, websiteUrl, uploads }: { steps: QixStepItem[]; websiteUrl: string; uploads: UploadSetup }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="max-w-3xl">
        <h2 className="text-lg font-semibold tracking-tight">The experience</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Numbered clips beside “Complicated topics. Clear explanations.”, playing one after another. Choose one video
          for all frames (it&apos;s split at its scene changes), or replace frames one by one. Nothing changes on the
          website until you click Publish to website. Drag a frame to change the order. The design fits {MAX_STEPS} frames.
        </p>
      </div>
      <StepsEditor steps={steps} websiteUrl={websiteUrl} uploads={uploads} />
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────────────────

export function PanelIntro({ title, text, action }: { title: string; text: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ text, onAdd }: { text: string; onAdd: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
        {text}
        <Button variant="outline" onClick={onAdd}>
          <Plus data-icon="inline-start" />
          Add the first one
        </Button>
      </CardContent>
    </Card>
  )
}


