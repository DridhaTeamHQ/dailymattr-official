"use client"

import { useState, useTransition } from "react"

import { EditDialog, listWords } from "@/components/cms/media/edit-dialog"
import { DeleteButton, shortWhen, SwitchRow } from "@/components/cms/media/list-controls"
import { MediaField, type UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Input } from "@/components/ui/input"
import type { QixStoryItem } from "@/lib/formats/data"
import { mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { deleteQixStory, saveQixStory, type QixStoryInput } from "./actions"

const blank: QixStoryInput = {
  title: "",
  coverUrl: "",
  videoUrl: "",
  posterUrl: "",
  videoWidth: 720,
  videoHeight: 1280,
  inHero: true,
  inGallery: true,
  inHome: true,
  published: true,
}

function toForm(story: QixStoryItem): QixStoryInput {
  return {
    id: story.id,
    title: story.title,
    coverUrl: story.coverUrl,
    videoUrl: story.videoUrl ?? "",
    posterUrl: story.posterUrl ?? "",
    videoWidth: story.videoWidth,
    videoHeight: story.videoHeight,
    inHero: story.inHero,
    inGallery: story.inGallery,
    inHome: story.inHome,
    published: story.published,
  }
}

/** Add a Qix story, or edit / replace / delete one. */
export function StoryDialog({
  editing,
  onClose,
  websiteUrl,
  uploads,
}: {
  editing: QixStoryItem | "new" | null
  onClose: () => void
  websiteUrl: string
  uploads: UploadSetup
}) {
  // Reset the form whenever a different story (or "new") opens.
  const openKey = editing === null ? null : editing === "new" ? "new" : `${editing.id}:${editing.updatedAt}`
  const [state, setState] = useState<{ key: string | null; form: QixStoryInput }>({ key: null, form: blank })
  if (openKey !== null && state.key !== openKey) {
    setState({ key: openKey, form: editing === "new" || editing === null ? blank : toForm(editing) })
  }
  const form = state.form
  const set = (patch: Partial<QixStoryInput>) => setState((s) => ({ ...s, form: { ...s.form, ...patch } }))

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(0)
  const [saving, startSaving] = useTransition()
  const story = editing !== "new" ? editing : null
  const missing = [!form.title.trim() && "a title", !form.coverUrl && "a cover image", !form.videoUrl && "a video"].filter(
    (m): m is string => !!m
  )

  function close() {
    setErrors({})
    onClose()
  }

  function save() {
    startSaving(async () => {
      const result = await saveQixStory(form)
      showSaveToast(result, story ? "Story saved" : "Story added")
      if (result.ok) close()
      else setErrors(result.fieldErrors ?? {})
    })
  }

  function remove() {
    if (!story) return
    startSaving(async () => {
      const result = await deleteQixStory(story.id)
      showSaveToast(result, "Story deleted")
      if (result.ok) close()
    })
  }

  return (
    <EditDialog
      open={editing !== null}
      onClose={close}
      title={story ? "Edit story" : "Add a story"}
      description={story ? `Last saved ${shortWhen(story.updatedAt)}${story.updatedBy ? ` by ${story.updatedBy}` : ""}` : "A 9:16 cover, and the video that plays when visitors hover or tap it."}
      saving={saving}
      canSave={uploading === 0 && missing.length === 0}
      saveHint={uploading > 0 ? "Wait for the upload to finish." : missing.length ? `Add ${listWords(missing)} to save.` : undefined}
      onSave={save}
      deleteButton={story && <DeleteButton what="this story" onConfirm={remove} disabled={saving} />}
      preview={
        <div className="flex flex-col gap-2.5">
          <div className={cn("relative aspect-[9/16] overflow-hidden rounded-2xl bg-muted shadow-sm", !form.published && "opacity-50 grayscale")}>
            {form.videoUrl ? (
              <video
                key={form.videoUrl}
                src={mediaSrc(form.videoUrl, websiteUrl)}
                poster={mediaSrc(form.coverUrl, websiteUrl) || undefined}
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : form.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- media from any host
              <img src={mediaSrc(form.coverUrl, websiteUrl)} alt="" className="absolute inset-0 size-full object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-muted-foreground">
                Add a cover to see the card
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {form.published
              ? [form.inHero && "Top carousel", form.inGallery && "Qix story row", form.inHome && "Home page row"]
                  .filter(Boolean)
                  .join(" · ") || "Not placed anywhere yet"
              : "Hidden from the website"}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="story-title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="story-title"
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder="e.g. MRF — Made in India"
          aria-invalid={!!errors.title}
          maxLength={120}
        />
        <p className={cn("text-xs", errors.title ? "font-medium text-destructive" : "text-muted-foreground")}>
          {errors.title ?? "Read out by screen readers and shown in the CMS. Not printed on the card."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MediaField
          label="Cover image"
          hint="Required. 9:16, e.g. 1080 × 1920."
          kind="image"
          folder="qix/stories"
          value={form.coverUrl}
          onChange={(coverUrl) => set({ coverUrl })}
          onUploadingChange={(on) => setUploading((n) => n + (on ? 1 : -1))}
          websiteUrl={websiteUrl}
          uploads={uploads}
          error={errors.coverUrl}
          previewClassName="aspect-[9/16] w-24"
        />
        <MediaField
          label="Video"
          hint="Required. 9:16 MP4. Plays with sound on hover or tap."
          kind="video"
          folder="qix/stories"
          value={form.videoUrl}
          onChange={(videoUrl) => set({ videoUrl })}
          onVideoMeta={(meta) =>
            set({
              posterUrl: meta.posterUrl ?? "",
              ...(meta.width && meta.height ? { videoWidth: meta.width, videoHeight: meta.height } : {}),
            })
          }
          onUploadingChange={(on) => setUploading((n) => n + (on ? 1 : -1))}
          websiteUrl={websiteUrl}
          uploads={uploads}
          error={errors.videoUrl}
          previewClassName="aspect-[9/16] w-24"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <SwitchRow
          label="Show on website"
          description="Off hides it everywhere, whatever the switches say"
          checked={form.published}
          onCheckedChange={(published) => set({ published })}
        />
        <SwitchRow
          label="Top carousel"
          description="“See the bigger picture” at the top of the Qix page"
          checked={form.inHero}
          onCheckedChange={(inHero) => set({ inHero })}
          disabled={!form.published}
        />
        <SwitchRow
          label="Qix story row"
          description="“A world of stories” on the Qix page"
          checked={form.inGallery}
          onCheckedChange={(inGallery) => set({ inGallery })}
          disabled={!form.published}
        />
        <SwitchRow
          label="Home page row"
          description="“One place to catch up” on the home page"
          checked={form.inHome}
          onCheckedChange={(inHome) => set({ inHome })}
          disabled={!form.published}
        />
      </div>
    </EditDialog>
  )
}
