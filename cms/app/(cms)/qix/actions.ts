"use server"

import { refresh } from "next/cache"

import { requireApprovedUser } from "@/lib/dal"
import { prisma } from "@/lib/db"
import { bool, int, media, text, UUID, validIds, type FieldErrors } from "@/lib/formats/data"
import { MAX_QIX_STEPS } from "@/lib/formats/limits"
import { deleteUnusedMedia } from "@/lib/media/storage"
import type { SaveResult } from "@/lib/seo/forms"
import { notifyWebsite } from "@/lib/seo/website"

/**
 * Saves for the CMS Qix page. Every one re-checks the session (a server action is a public
 * endpoint), writes, then tells the website to refresh so the change shows straight away.
 */

async function done(): Promise<SaveResult> {
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}

const invalid = (fieldErrors: FieldErrors): SaveResult => ({
  ok: false,
  error: "Check the highlighted fields.",
  fieldErrors,
})

// ── Stories (top carousel + story row) ──────────────────────────────────────────────────

export type QixStoryInput = {
  id?: string
  title: string
  coverUrl: string
  videoUrl: string
  posterUrl: string
  videoWidth: number
  videoHeight: number
  inHero: boolean
  inGallery: boolean
  inHome: boolean
  published: boolean
}

export async function saveQixStory(input: QixStoryInput): Promise<SaveResult> {
  const user = await requireApprovedUser()
  const errors: FieldErrors = {}
  const data = {
    title: text(errors, "title", input?.title, { required: true, max: 120 })!,
    coverUrl: media(errors, "coverUrl", input?.coverUrl, { required: true })!,
    videoUrl: media(errors, "videoUrl", input?.videoUrl, { required: true })!,
    posterUrl: media(errors, "posterUrl", input?.posterUrl),
    videoWidth: int(input?.videoWidth, 720, 16, 7680),
    videoHeight: int(input?.videoHeight, 1280, 16, 7680),
    inHero: bool(input?.inHero, true),
    inGallery: bool(input?.inGallery, true),
    inHome: bool(input?.inHome, true),
    published: bool(input?.published, true),
    updatedBy: user.email,
  }
  if (Object.keys(errors).length) return invalid(errors)

  if (input.id) {
    if (!UUID.test(input.id)) return { ok: false, error: "Unknown story." }
    const current = await prisma.qixStory.findUnique({ where: { id: input.id } })
    if (!current) return { ok: false, error: "That story was deleted. Reload the page." }
    // A new video: drop the old WebM copy, or browsers that prefer WebM would keep playing it.
    const videoWebmUrl = current.videoUrl === data.videoUrl ? current.videoWebmUrl : null
    await prisma.qixStory.update({ where: { id: input.id }, data: { ...data, videoWebmUrl } })
    // Replaced files leave storage.
    await deleteUnusedMedia([current.coverUrl, current.videoUrl, current.videoWebmUrl, current.posterUrl])
  } else {
    const last = await prisma.qixStory.aggregate({ _max: { sortOrder: true } })
    await prisma.qixStory.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } })
  }
  return done()
}

export async function setQixStoryFlags(
  id: string,
  flags: Partial<Pick<QixStoryInput, "published" | "inHero" | "inGallery" | "inHome">>
): Promise<SaveResult> {
  const user = await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown story." }
  const data: Partial<Record<"published" | "inHero" | "inGallery" | "inHome", boolean>> = {}
  for (const key of ["published", "inHero", "inGallery", "inHome"] as const) {
    if (typeof flags?.[key] === "boolean") data[key] = flags[key]
  }
  await prisma.qixStory.update({ where: { id }, data: { ...data, updatedBy: user.email } })
  return done()
}

export async function deleteQixStory(id: string): Promise<SaveResult> {
  await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown story." }
  const story = await prisma.qixStory.findUnique({ where: { id } })
  await prisma.qixStory.deleteMany({ where: { id } })
  if (story) await deleteUnusedMedia([story.coverUrl, story.videoUrl, story.videoWebmUrl, story.posterUrl])
  return done()
}

export async function reorderQixStories(ids: string[]): Promise<SaveResult> {
  await requireApprovedUser()
  if (!validIds(ids)) return { ok: false, error: "Unknown stories." }
  await prisma.$transaction(ids.map((id, i) => prisma.qixStory.updateMany({ where: { id }, data: { sortOrder: i + 1 } })))
  return done()
}

// ── Experience steps ──────────────────────────────────────────────────────────────────────

export type PublishStep = {
  label: string
  videoUrl: string
  /** The part of the video this step plays (seconds); both null = the whole video. */
  startSeconds: number | null
  endSeconds: number | null
  posterUrl: string
  videoWidth: number
  videoHeight: number
  published: boolean
}

/**
 * "Publish to website" on the CMS Qix page: replaces the experience steps with the editor's
 * draft (1 to MAX_QIX_STEPS frames, in order), then deletes the files nothing uses any more.
 */
export async function publishQixSteps(steps: PublishStep[]): Promise<SaveResult> {
  const user = await requireApprovedUser()
  if (!Array.isArray(steps) || steps.length < 1) return { ok: false, error: "Add at least one frame." }
  if (steps.length > MAX_QIX_STEPS) return { ok: false, error: `${MAX_QIX_STEPS} frames filled. No more frames allowed.` }

  const errors: FieldErrors = {}
  const rows = steps.map((step, i) => {
    const start = step?.startSeconds == null ? null : Number(step.startSeconds)
    const end = step?.endSeconds == null ? null : Number(step.endSeconds)
    if ((start == null) !== (end == null) || (start != null && (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end! - start < 0.5))) {
      errors[`time${i}`] = `Frame ${i + 1}'s part of the video is too short or out of order.`
    }
    return {
      label: text(errors, `label${i}`, step?.label, { required: true, max: 40 })!,
      videoUrl: media(errors, `video${i}`, step?.videoUrl, { required: true })!,
      posterUrl: media(errors, `poster${i}`, step?.posterUrl),
      startSeconds: start,
      endSeconds: end,
      videoWidth: int(step?.videoWidth, 360, 16, 7680),
      videoHeight: int(step?.videoHeight, 640, 16, 7680),
      published: bool(step?.published, true),
      sortOrder: i + 1,
      updatedBy: user.email,
    }
  })
  if (Object.keys(errors).length) {
    return { ok: false, error: Object.values(errors)[0] ?? "Check the frames.", fieldErrors: errors }
  }

  const old = await prisma.qixExperienceStep.findMany()
  // A frame that keeps its video keeps that video's WebM copy too.
  const webm = new Map(old.map((s) => [s.videoUrl, s.videoWebmUrl]))
  await prisma.$transaction([
    prisma.qixExperienceStep.deleteMany({}),
    prisma.qixExperienceStep.createMany({ data: rows.map((row) => ({ ...row, videoWebmUrl: webm.get(row.videoUrl) ?? null })) }),
  ])
  // Replaced videos and thumbnails leave storage.
  await deleteUnusedMedia(old.flatMap((s) => [s.videoUrl, s.videoWebmUrl, s.posterUrl]))
  return done()
}
