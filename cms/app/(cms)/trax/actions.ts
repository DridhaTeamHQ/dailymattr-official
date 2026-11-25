"use server"

import { refresh } from "next/cache"

import { requireApprovedUser } from "@/lib/dal"
import { prisma } from "@/lib/db"
import { bool, int, media, text, UUID, validIds, type FieldErrors } from "@/lib/formats/data"
import type { SaveResult } from "@/lib/seo/forms"
import { notifyWebsite } from "@/lib/seo/website"

/**
 * Saves for the CMS Trax page. Every one re-checks the session (a server action is a public
 * endpoint), writes, then tells the website to refresh so the change shows straight away.
 */

async function done(): Promise<SaveResult> {
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}

export type TraxEpisodeInput = {
  id?: string
  title: string
  topic: string
  description: string
  artUrl: string
  focusY: number
  audioUrl: string
  bpm: number
  inHero: boolean
  inFeaturedCards: boolean
  heroStart: boolean
  published: boolean
}

export async function saveTraxEpisode(input: TraxEpisodeInput): Promise<SaveResult> {
  const user = await requireApprovedUser()
  const errors: FieldErrors = {}
  const data = {
    title: text(errors, "title", input?.title, { required: true, max: 80 })!,
    topic: text(errors, "topic", input?.topic, { required: true, max: 80 })!,
    description: text(errors, "description", input?.description, { max: 600 }),
    artUrl: media(errors, "artUrl", input?.artUrl, { required: true })!,
    focusY: int(input?.focusY, 50, 0, 100),
    audioUrl: media(errors, "audioUrl", input?.audioUrl, { required: true })!,
    bpm: int(input?.bpm, 96, 40, 220),
    inHero: bool(input?.inHero, true),
    inFeaturedCards: bool(input?.inFeaturedCards, false),
    heroStart: bool(input?.heroStart, false),
    published: bool(input?.published, true),
    updatedBy: user.email,
  }
  if (Object.keys(errors).length) return { ok: false, error: "Check the highlighted fields.", fieldErrors: errors }
  if (input.id && !UUID.test(input.id)) return { ok: false, error: "Unknown episode." }

  const saved = await prisma.$transaction(async (tx) => {
    let id = input.id
    if (id) {
      const found = await tx.traxEpisode.updateMany({ where: { id }, data })
      if (!found.count) return false
    } else {
      const last = await tx.traxEpisode.aggregate({ _max: { sortOrder: true } })
      id = (await tx.traxEpisode.create({ data: { ...data, sortOrder: (last._max.sortOrder ?? 0) + 1 } })).id
    }
    // Only one episode opens in the centre of the cover-flow.
    if (data.heroStart) {
      await tx.traxEpisode.updateMany({ where: { id: { not: id }, heroStart: true }, data: { heroStart: false } })
    }
    return true
  })
  if (!saved) return { ok: false, error: "That episode was deleted. Reload the page." }
  return done()
}

export async function setTraxFlags(
  id: string,
  flags: Partial<Pick<TraxEpisodeInput, "published" | "inHero" | "inFeaturedCards" | "heroStart">>
): Promise<SaveResult> {
  const user = await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown episode." }
  const data: Partial<Record<"published" | "inHero" | "inFeaturedCards" | "heroStart", boolean>> = {}
  for (const key of ["published", "inHero", "inFeaturedCards", "heroStart"] as const) {
    if (typeof flags?.[key] === "boolean") data[key] = flags[key]
  }
  await prisma.$transaction([
    ...(data.heroStart ? [prisma.traxEpisode.updateMany({ where: { heroStart: true }, data: { heroStart: false } })] : []),
    prisma.traxEpisode.update({ where: { id }, data: { ...data, updatedBy: user.email } }),
  ])
  return done()
}

export async function deleteTraxEpisode(id: string): Promise<SaveResult> {
  await requireApprovedUser()
  if (typeof id !== "string" || !UUID.test(id)) return { ok: false, error: "Unknown episode." }
  await prisma.traxEpisode.deleteMany({ where: { id } })
  return done()
}

export async function reorderTraxEpisodes(ids: string[]): Promise<SaveResult> {
  await requireApprovedUser()
  if (!validIds(ids)) return { ok: false, error: "Unknown episodes." }
  await prisma.$transaction(ids.map((id, i) => prisma.traxEpisode.updateMany({ where: { id }, data: { sortOrder: i + 1 } })))
  return done()
}
