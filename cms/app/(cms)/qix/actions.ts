"use server"

import { refresh } from "next/cache"

import { requireApprovedUser } from "@/lib/dal"
import { prisma } from "@/lib/db"
import { bool, int, media, text, UUID, validIds, type FieldErrors } from "@/lib/formats/data"
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
  await prisma.qixStory.deleteMany({ where: { id } })
  return done()
}

export async function reorderQixStories(ids: string[]): Promise<SaveResult> {
  await requireApprovedUser()
  if (!validIds(ids)) return { ok: false, error: "Unknown stories." }
  await prisma.$transaction(ids.map((id, i) => prisma.qixStory.updateMany({ where: { id }, data: { sortOrder: i + 1 } })))
  return done()
}

// ── Experience steps ──────────────────────────────────────────────────────────────────────

export type QixStepInput = {
  id?: string
  label: string
  videoUrl: string
  posterUrl: string
  videoWidth: number
  videoHeight: number
  published: boolean
}

export async function saveQixStep(input: QixStepInput): Promise<SaveResult> {
  const user = await requireApprovedUser()
  const errors: FieldErrors = {}
  const data = {
    label: text(errors, "label", input?.label, { required: true, max: 40 })!,
    videoUrl: media(errors, "videoUrl", input?.videoUrl, { required: true })!,
    posterUrl: media(errors, "posterUrl", input?.posterUrl),
    videoWidth: int(input?.videoWidth, 360, 16, 7680),
    videoHeight: int(input?.videoHeight, 640, 16, 7680),
    published: bool(input?.published, true),
    updatedBy: user.email,
  }
  if (Object.keys(errors).length) return invalid(errors)

  if (input.id) {
    if (!UUID.test(input.id)) return { ok: false, error: "Unknown step." }
    const current = await prisma.qixExperienceStep.findUnique({ where: { id: input.id } })
    if (!current) return { ok: false, error: "That step was deleted. Reload the page." }
    const videoWebmUrl = current.videoUrl === data.videoUrl ? current.videoWebmUrl : null
    await prisma.qixExperienceStep.update({ where: { id: input.id }, data: { ...data, videoWebmUrl } })
  } else {
    const last = await prisma.qixExperienceStep.aggregate({ _max: { sortOrder: true } })
    await prisma.qixExperienceStep.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } })
  }
  return done()
}

export async function setQixStepPublished(id: string, published: boolean): Promise<SaveResult> {
  const user = await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown step." }
  await prisma.qixExperienceStep.update({ where: { id }, data: { published: published === true, updatedBy: user.email } })
  return done()
}

export async function deleteQixStep(id: string): Promise<SaveResult> {
  await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown step." }
  await prisma.qixExperienceStep.deleteMany({ where: { id } })
  return done()
}

export async function reorderQixSteps(ids: string[]): Promise<SaveResult> {
  await requireApprovedUser()
  if (!validIds(ids)) return { ok: false, error: "Unknown steps." }
  await prisma.$transaction(
    ids.map((id, i) => prisma.qixExperienceStep.updateMany({ where: { id }, data: { sortOrder: i + 1 } }))
  )
  return done()
}
