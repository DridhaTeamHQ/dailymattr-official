"use client"

import { useRef, useState, useTransition } from "react"
import { Hand } from "lucide-react"

import { EditDialog, listWords } from "@/components/cms/media/edit-dialog"
import { DeleteButton, shortWhen, SwitchRow } from "@/components/cms/media/list-controls"
import { MediaField, type UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import type { TraxEpisodeItem } from "@/lib/formats/data"
import { mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { deleteTraxEpisode, saveTraxEpisode, type TraxEpisodeInput } from "./actions"

const blank: TraxEpisodeInput = {
  title: "",
  topic: "",
  description: "",
  artUrl: "",
  focusY: 50,
  audioUrl: "",
  bpm: 96,
  inHero: true,
  inFeaturedCards: false,
  heroStart: false,
  published: true,
}

const toForm = (e: TraxEpisodeItem): TraxEpisodeInput => ({
  id: e.id,
  title: e.title,
  topic: e.topic,
  description: e.description ?? "",
  artUrl: e.artUrl,
  focusY: e.focusY,
  audioUrl: e.audioUrl,
  bpm: e.bpm,
  inHero: e.inHero,
  inFeaturedCards: e.inFeaturedCards,
  heroStart: e.heroStart,
  published: e.published,
})

/** Add a Trax episode, or edit / replace / delete one. */
export function EpisodeDialog({
  editing,
  onClose,
  websiteUrl,
  uploads,
}: {
  editing: TraxEpisodeItem | "new" | null
  onClose: () => void
  websiteUrl: string
  uploads: UploadSetup
}) {
  const openKey = editing === null ? null : editing === "new" ? "new" : `${editing.id}:${editing.updatedAt}`
  const [state, setState] = useState<{ key: string | null; form: TraxEpisodeInput }>({ key: null, form: blank })
  if (openKey !== null && state.key !== openKey) {
    setState({ key: openKey, form: editing === "new" || editing === null ? blank : toForm(editing) })
  }
  const form = state.form
  const set = (patch: Partial<TraxEpisodeInput>) => setState((s) => ({ ...s, form: { ...s.form, ...patch } }))

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(0)
  const [saving, startSaving] = useTransition()
  const episode = editing !== "new" ? editing : null
  const missing = [
    !form.title.trim() && "a title",
    !form.topic.trim() && "a subtitle",
    !form.artUrl && "artwork",
    !form.audioUrl && "audio",
  ].filter((m): m is string => !!m)
  const art = mediaSrc(form.artUrl, websiteUrl)
  const crop = { objectPosition: `50% ${form.focusY}%` }

  function close() {
    setErrors({})
    onClose()
  }

  function save() {
    startSaving(async () => {
      const result = await saveTraxEpisode(form)
      showSaveToast(result, episode ? "Episode saved" : "Episode added")
      if (result.ok) close()
      else setErrors(result.fieldErrors ?? {})
    })
  }

  function remove() {
    if (!episode) return
    startSaving(async () => {
      const result = await deleteTraxEpisode(episode.id)
      showSaveToast(result, "Episode deleted")
      if (result.ok) close()
    })
  }

  return (
    <EditDialog
      wide
      open={editing !== null}
      onClose={close}
      title={episode ? "Edit episode" : "Add an episode"}
      description={
        episode
          ? `Last saved ${shortWhen(episode.updatedAt)}${episode.updatedBy ? ` by ${episode.updatedBy}` : ""}`
          : "Artwork, audio, and the words shown with them."
      }
      saving={saving}
      canSave={uploading === 0 && missing.length === 0}
      saveHint={uploading > 0 ? "Wait for the upload to finish." : missing.length ? `Add ${listWords(missing)} to save.` : undefined}
      onSave={save}
      deleteButton={episode && <DeleteButton what="this episode" onConfirm={remove} disabled={saving} />}
      preview={
        <div className={cn("flex flex-col gap-4", !form.published && "opacity-50 grayscale")}>
          {/* Cover-flow card */}
          <div className="rounded-[1.25rem] bg-linear-to-b from-neutral-700 to-neutral-900 p-1.5 pb-3 text-center shadow-sm">
            <div className="relative aspect-square overflow-hidden rounded-[0.9rem] bg-neutral-600">
              {/* eslint-disable-next-line @next/next/no-img-element -- media from any host */}
              {art && <img src={art} alt="" className="absolute inset-0 size-full object-cover" style={crop} />}
            </div>
            <p className="mt-2 truncate px-1 text-sm font-semibold text-white">{form.title || "Title"}</p>
            <p className="truncate px-1 text-xs text-white/60">{form.topic || "Subtitle"}</p>
          </div>
          {/* Featured card */}
          <div className="rounded-2xl bg-background p-3 shadow-sm ring-1 ring-border">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element -- media from any host */}
              {art && <img src={art} alt="" className="absolute inset-0 size-full object-cover" style={crop} />}
            </div>
            <span className="mt-2 inline-block rounded bg-brand-blue-soft px-1.5 py-0.5 text-[0.625rem] font-semibold text-primary">TRAX</span>
            <p className="mt-1 text-sm leading-snug font-bold">{form.title || "Title"}</p>
            <p className="line-clamp-3 text-xs text-muted-foreground">{form.description.trim() || form.topic || "Description"}</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="ep-title"
          label="Title"
          value={form.title}
          onChange={(title) => set({ title })}
          placeholder="e.g. Behind Cricket Balls"
          error={errors.title}
          max={80}
        />
        <TextField
          id="ep-topic"
          label="Subtitle"
          value={form.topic}
          onChange={(topic) => set({ topic })}
          placeholder="e.g. How Things are Made"
          error={errors.topic}
          hint="Under the title on the cover-flow card and the player bar."
          max={80}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ep-description" className="text-sm font-medium">
          Description <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          id="ep-description"
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="What listeners will learn, in a sentence or two."
          rows={3}
          maxLength={600}
          aria-invalid={!!errors.description}
        />
        <p className={cn("text-xs", errors.description ? "font-medium text-destructive" : "text-muted-foreground")}>
          {errors.description ?? `Shown in the big featured player and on the featured card. Empty = the subtitle is shown. ${form.description.length}/600`}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <MediaField
            label="Artwork"
            hint="Square, or a tall poster: it's cropped to a square."
            kind="image"
            folder="trax/art"
            value={form.artUrl}
            onChange={(artUrl) => set({ artUrl })}
            onUploadingChange={(on) => setUploading((n) => n + (on ? 1 : -1))}
            websiteUrl={websiteUrl}
            uploads={uploads}
            error={errors.artUrl}
            previewClassName="aspect-square w-24"
            imageStyle={crop}
          />
          {form.artUrl && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">Crop position</span>
                <span className="text-muted-foreground tabular-nums">
                  {form.focusY === 0 ? "Top" : form.focusY === 100 ? "Bottom" : `${form.focusY}% down`}
                </span>
              </div>
              <Slider
                value={[form.focusY]}
                onValueChange={(v) => set({ focusY: Array.isArray(v) ? v[0] : v })}
                min={0}
                max={100}
                step={1}
                aria-label="Crop position"
              />
              <p className="text-xs text-muted-foreground">Slide until the title on the artwork sits whole in the square.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <MediaField
            label="Audio"
            hint="MP3 or M4A."
            kind="audio"
            folder="trax/audio"
            value={form.audioUrl}
            onChange={(audioUrl) => set({ audioUrl })}
            onUploadingChange={(on) => setUploading((n) => n + (on ? 1 : -1))}
            websiteUrl={websiteUrl}
            uploads={uploads}
            error={errors.audioUrl}
          />
          <TempoField bpm={form.bpm} onChange={(bpm) => set({ bpm })} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <SwitchRow label="Show on website" checked={form.published} onCheckedChange={(published) => set({ published })} />
        <SwitchRow
          label="Cover-flow"
          description="Hero player and the big featured player"
          checked={form.inHero}
          onCheckedChange={(inHero) => set({ inHero, ...(inHero ? {} : { heroStart: false }) })}
          disabled={!form.published}
        />
        <SwitchRow
          label="Featured card"
          description="A card under the big player"
          checked={form.inFeaturedCards}
          onCheckedChange={(inFeaturedCards) => set({ inFeaturedCards })}
          disabled={!form.published}
        />
        <SwitchRow
          label="Opens on this episode"
          description="Centre of the cover-flow when the page loads"
          checked={form.heroStart}
          onCheckedChange={(heroStart) => set({ heroStart })}
          disabled={!form.published || !form.inHero}
        />
      </div>
    </EditDialog>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
  max,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
  hint?: string
  max: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} maxLength={max} />
      {(error || hint) && <p className={cn("text-xs", error ? "font-medium text-destructive" : "text-muted-foreground")}>{error ?? hint}</p>}
    </div>
  )
}

/**
 * The audio's tempo, which sets how fast the player's level meter bounces. Type it, or tap
 * the button along with the beat while the audio plays.
 */
function TempoField({ bpm, onChange }: { bpm: number; onChange: (bpm: number) => void }) {
  const taps = useRef<number[]>([])
  function tap() {
    const now = performance.now()
    const recent = [...taps.current.filter((t) => now - t < 3000), now]
    taps.current = recent
    if (recent.length < 3) return
    const gaps = recent.slice(1).map((t, i) => t - recent[i])
    const average = gaps.reduce((a, b) => a + b, 0) / gaps.length
    onChange(Math.min(220, Math.max(40, Math.round(60000 / average))))
  }
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="ep-bpm" className="text-sm font-medium">
        Tempo (BPM)
      </label>
      <div className="flex gap-2">
        <Input
          id="ep-bpm"
          type="number"
          min={40}
          max={220}
          value={bpm}
          onChange={(e) => onChange(Number(e.target.value) || 96)}
          className="w-24"
        />
        <Button type="button" variant="outline" onClick={tap}>
          <Hand data-icon="inline-start" />
          Tap to the beat
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Sets how fast the player&apos;s level meter moves. Play the audio and tap 4+ times.</p>
    </div>
  )
}
