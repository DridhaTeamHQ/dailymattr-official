import "server-only"

import { prisma } from "@/lib/db"
import { isMediaUrl } from "@/lib/media/url"

/** Plain objects for the Qix and Trax pages (dates as ISO strings, so they pass to the browser). */

export type QixStoryItem = {
  id: string
  title: string
  coverUrl: string
  videoUrl: string | null
  posterUrl: string | null
  videoWidth: number
  videoHeight: number
  inHero: boolean
  inGallery: boolean
  inHome: boolean
  published: boolean
  updatedBy: string | null
  updatedAt: string
}

export type QixStepItem = {
  id: string
  label: string
  videoUrl: string
  posterUrl: string | null
  /** The part of a shared video this step plays (seconds); null = the whole video. */
  startSeconds: number | null
  endSeconds: number | null
  videoWidth: number
  videoHeight: number
  published: boolean
  updatedBy: string | null
  updatedAt: string
}

export type TraxEpisodeItem = {
  id: string
  title: string
  topic: string
  description: string | null
  artUrl: string
  focusY: number
  audioUrl: string
  bpm: number
  inHero: boolean
  inFeaturedCards: boolean
  heroStart: boolean
  published: boolean
  updatedBy: string | null
  updatedAt: string
}

const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]

export async function loadQix(): Promise<{ stories: QixStoryItem[]; steps: QixStepItem[] }> {
  const [stories, steps] = await Promise.all([
    prisma.qixStory.findMany({ orderBy: ORDER }),
    prisma.qixExperienceStep.findMany({ orderBy: ORDER }),
  ])
  return {
    stories: stories.map((s) => ({
      id: s.id,
      title: s.title,
      coverUrl: s.coverUrl,
      videoUrl: s.videoUrl,
      posterUrl: s.posterUrl,
      videoWidth: s.videoWidth,
      videoHeight: s.videoHeight,
      inHero: s.inHero,
      inGallery: s.inGallery,
      inHome: s.inHome,
      published: s.published,
      updatedBy: s.updatedBy,
      updatedAt: s.updatedAt.toISOString(),
    })),
    steps: steps.map((s) => ({
      id: s.id,
      label: s.label,
      videoUrl: s.videoUrl,
      posterUrl: s.posterUrl,
      startSeconds: s.startSeconds,
      endSeconds: s.endSeconds,
      videoWidth: s.videoWidth,
      videoHeight: s.videoHeight,
      published: s.published,
      updatedBy: s.updatedBy,
      updatedAt: s.updatedAt.toISOString(),
    })),
  }
}

export async function loadTrax(): Promise<TraxEpisodeItem[]> {
  const episodes = await prisma.traxEpisode.findMany({ orderBy: ORDER })
  return episodes.map((e) => ({
    id: e.id,
    title: e.title,
    topic: e.topic,
    description: e.description,
    artUrl: e.artUrl,
    focusY: e.focusY,
    audioUrl: e.audioUrl,
    bpm: e.bpm,
    inHero: e.inHero,
    inFeaturedCards: e.inFeaturedCards,
    heroStart: e.heroStart,
    published: e.published,
    updatedBy: e.updatedBy,
    updatedAt: e.updatedAt.toISOString(),
  }))
}

// ── Validation for the server actions ────────────────────────────────────────────────────

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type FieldErrors = Record<string, string>

/** Trimmed text; records an error when required and empty, or over `max` characters. */
export function text(errors: FieldErrors, field: string, value: unknown, { required = false, max = 200 } = {}) {
  const v = typeof value === "string" ? value.trim() : ""
  if (required && !v) errors[field] = "Required."
  else if (v.length > max) errors[field] = `Keep it under ${max} characters.`
  return v || null
}

/** A media URL (website path or http(s) link); records an error when invalid or missing. */
export function media(errors: FieldErrors, field: string, value: unknown, { required = false } = {}) {
  const v = typeof value === "string" ? value.trim() : ""
  if (!v) {
    if (required) errors[field] = "Add a file."
    return null
  }
  if (v.length > 1000 || !isMediaUrl(v)) errors[field] = "Use an uploaded file, a link starting with https://, or a website path starting with /."
  return v
}

export function int(value: unknown, fallback: number, min: number, max: number) {
  const n = Math.round(Number(value))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export const bool = (value: unknown, fallback: boolean) => (typeof value === "boolean" ? value : fallback)

export function validIds(ids: unknown): ids is string[] {
  return Array.isArray(ids) && ids.length > 0 && ids.length <= 500 && ids.every((id) => typeof id === "string" && UUID.test(id))
}
