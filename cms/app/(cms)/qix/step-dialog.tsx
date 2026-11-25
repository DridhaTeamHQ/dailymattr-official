"use client"

import { useState, useTransition } from "react"

import { EditDialog, listWords } from "@/components/cms/media/edit-dialog"
import { DeleteButton, shortWhen, SwitchRow } from "@/components/cms/media/list-controls"
import { MediaField, type UploadSetup } from "@/components/cms/media/media-field"
import { showSaveToast } from "@/components/cms/seo/form-parts"
import { Input } from "@/components/ui/input"
import type { QixStepItem } from "@/lib/formats/data"
import { mediaSrc } from "@/lib/media/url"
import { cn } from "@/lib/utils"

import { deleteQixStep, saveQixStep, type QixStepInput } from "./actions"

const blank: QixStepInput = { label: "", videoUrl: "", posterUrl: "", videoWidth: 360, videoHeight: 640, published: true }

const toForm = (step: QixStepItem): QixStepInput => ({
  id: step.id,
  label: step.label,
  videoUrl: step.videoUrl,
  posterUrl: step.posterUrl ?? "",
  videoWidth: step.videoWidth,
  videoHeight: step.videoHeight,
  published: step.published,
})

/** Add a step to "The experience", or edit / replace / delete one. */
export function StepDialog({
  editing,
  onClose,
  websiteUrl,
  uploads,
}: {
  editing: QixStepItem | "new" | null
  onClose: () => void
  websiteUrl: string
  uploads: UploadSetup
}) {
  const openKey = editing === null ? null : editing === "new" ? "new" : `${editing.id}:${editing.updatedAt}`
  const [state, setState] = useState<{ key: string | null; form: QixStepInput }>({ key: null, form: blank })
  if (openKey !== null && state.key !== openKey) {
    setState({ key: openKey, form: editing === "new" || editing === null ? blank : toForm(editing) })
  }
  const form = state.form
  const set = (patch: Partial<QixStepInput>) => setState((s) => ({ ...s, form: { ...s.form, ...patch } }))

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(0)
  const [saving, startSaving] = useTransition()
  const step = editing !== "new" ? editing : null
  const missing = [!form.label.trim() && "a caption", !form.videoUrl && "a video"].filter((m): m is string => !!m)

  function close() {
    setErrors({})
    onClose()
  }

  function save() {
    startSaving(async () => {
      const result = await saveQixStep(form)
      showSaveToast(result, step ? "Step saved" : "Step added")
      if (result.ok) close()
      else setErrors(result.fieldErrors ?? {})
    })
  }

  function remove() {
    if (!step) return
    startSaving(async () => {
      const result = await deleteQixStep(step.id)
      showSaveToast(result, "Step deleted")
      if (result.ok) close()
    })
  }

  return (
    <EditDialog
      open={editing !== null}
      onClose={close}
      title={step ? "Edit step" : "Add a step"}
      description={step ? `Last saved ${shortWhen(step.updatedAt)}${step.updatedBy ? ` by ${step.updatedBy}` : ""}` : "One clip in “The experience”, with the caption under its number."}
      saving={saving}
      canSave={uploading === 0 && missing.length === 0}
      saveHint={uploading > 0 ? "Wait for the upload to finish." : missing.length ? `Add ${listWords(missing)} to save.` : undefined}
      onSave={save}
      deleteButton={step && <DeleteButton what="this step" onConfirm={remove} disabled={saving} />}
      preview={
        <div className="flex flex-col items-center gap-3">
          <div className={cn("relative aspect-[9/16] w-36 overflow-hidden rounded-2xl bg-muted shadow-sm", !form.published && "opacity-50 grayscale")}>
            {form.videoUrl ? (
              <video
                key={form.videoUrl}
                src={mediaSrc(form.videoUrl, websiteUrl)}
                poster={form.posterUrl ? mediaSrc(form.posterUrl, websiteUrl) : undefined}
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-muted-foreground">
                Add a video to see the step
              </span>
            )}
          </div>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">#</span>
          <span className="text-center text-sm font-medium text-muted-foreground">{form.label || "Caption"}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="step-label" className="text-sm font-medium">
          Caption
        </label>
        <Input
          id="step-label"
          value={form.label}
          onChange={(e) => set({ label: e.target.value })}
          placeholder="e.g. The question"
          aria-invalid={!!errors.label}
          maxLength={40}
        />
        <p className={cn("text-xs", errors.label ? "font-medium text-destructive" : "text-muted-foreground")}>
          {errors.label ?? "Two or three words fit best under the number."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <MediaField
          label="Video"
          hint="9:16 MP4, a few seconds long. Its first frame becomes the thumbnail."
          kind="video"
          folder="qix/experience"
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
        <MediaField
          label="Thumbnail"
          hint="Shown before the clip plays. Filled in from the video; replace it to pick another picture."
          kind="image"
          folder="qix/experience"
          value={form.posterUrl}
          onChange={(posterUrl) => set({ posterUrl })}
          onUploadingChange={(on) => setUploading((n) => n + (on ? 1 : -1))}
          websiteUrl={websiteUrl}
          uploads={uploads}
          error={errors.posterUrl}
          previewClassName="aspect-[9/16] w-24"
          optional
        />
      </div>

      <SwitchRow label="Show on website" checked={form.published} onCheckedChange={(published) => set({ published })} />
    </EditDialog>
  )
}
