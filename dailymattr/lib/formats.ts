import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { experience } from "@/components/qix/content"
import { storyCovers, type StoryCover } from "@/components/stories/covers"
import { featured, heroPlayer, toEpisode, type TraxEpisode, type TraxHeroEpisode } from "@/components/trax/content"

import { getPrisma } from "./db"
import type { VideoAsset } from "./videos"

/**
 * Qix and Trax content edited on the CMS's Qix and Trax pages, read from its database
 * (tables qix_stories, qix_experience_steps, trax_episodes; see prisma/schema.prisma).
 * Only published rows show, in their CMS order.
 *
 * Falls back to the built-in content in components/ (the same items the CMS started with)
 * when DATABASE_URL isn't set or the database can't be reached, and per list while the CMS
 * table has no rows at all. A list the CMS has emptied on purpose (everything hidden) stays
 * empty, and its section leaves the cards out.
 */

/** Cache tag the CMS revalidates after each Qix / Trax save (app/api/revalidate). */
export const CMS_FORMATS_TAG = "cms-formats"

export type QixContent = {
  /** The arc at the top of the Qix page. */
  heroCovers: StoryCover[]
  /** The story row on the Qix page ("A world of stories"). */
  galleryCovers: StoryCover[]
  /** The story row on the home page ("One place to catch up"). */
  homeCovers: StoryCover[]
  /** "The experience" steps (start / end: the part of a shared video a step plays). */
  frames: { label: string; video: VideoAsset; start?: number; end?: number }[]
}

export type TraxContent = {
  /** The hero's cover-flow, in ring order. */
  heroEpisodes: TraxHeroEpisode[]
  /** Index in heroEpisodes of the card in the centre on load. */
  initial: number
  /** The big featured player: every cover-flow episode. */
  playlist: TraxEpisode[]
  /** The cards under it. */
  cards: TraxEpisode[]
}

const defaultQix: QixContent = {
  heroCovers: storyCovers,
  galleryCovers: storyCovers,
  homeCovers: storyCovers,
  frames: experience.frames,
}

const defaultTrax: TraxContent = {
  heroEpisodes: heroPlayer.episodes,
  initial: heroPlayer.initial,
  playlist: featured.playlist,
  cards: featured.episodes,
}

// The last good reads, so a short database outage keeps the CMS content (per server instance).
let lastQix: QixContent | null = null
let lastTrax: TraxContent | null = null

const ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }]

export async function getQixContent(): Promise<QixContent> {
  "use cache"
  cacheTag(CMS_FORMATS_TAG)
  cacheLife("minutes")

  const prisma = getPrisma()
  if (!prisma) return defaultQix
  try {
    const [stories, steps] = await Promise.all([
      prisma.qixStory.findMany({ orderBy: ORDER }),
      prisma.qixExperienceStep.findMany({ orderBy: ORDER }),
    ])
    const live = stories.filter((s) => s.published)
    const covers = (list: typeof live): StoryCover[] =>
      list.map((s) => ({
        id: s.id,
        src: s.coverUrl,
        alt: s.title,
        video: s.videoUrl ? videoAsset(s.videoUrl, s.videoWebmUrl, s.posterUrl, s.videoWidth, s.videoHeight) : null,
      }))
    lastQix = {
      heroCovers: stories.length ? covers(live.filter((s) => s.inHero)) : defaultQix.heroCovers,
      galleryCovers: stories.length ? covers(live.filter((s) => s.inGallery)) : defaultQix.galleryCovers,
      homeCovers: stories.length ? covers(live.filter((s) => s.inHome)) : defaultQix.homeCovers,
      frames: steps.length
        ? steps
            .filter((s) => s.published)
            .map((s) => ({
              label: s.label,
              video: videoAsset(s.videoUrl, s.videoWebmUrl, s.posterUrl, s.videoWidth, s.videoHeight),
              ...(s.startSeconds != null && s.endSeconds != null ? { start: s.startSeconds, end: s.endSeconds } : {}),
            }))
        : defaultQix.frames,
    }
    return lastQix
  } catch (error) {
    console.warn(`[cms] Couldn't read Qix from the database, using ${lastQix ? "the last copy" : "the built-in content"}:`, error)
    return lastQix ?? defaultQix
  }
}

export async function getTraxContent(): Promise<TraxContent> {
  "use cache"
  cacheTag(CMS_FORMATS_TAG)
  cacheLife("minutes")

  const prisma = getPrisma()
  if (!prisma) return defaultTrax
  try {
    const rows = await prisma.traxEpisode.findMany({ orderBy: ORDER })
    if (!rows.length) return (lastTrax = defaultTrax)

    const live = rows.filter((e) => e.published)
    const episode = (e: (typeof rows)[number]): TraxHeroEpisode => ({
      id: e.id,
      title: e.title,
      topic: e.topic,
      description: e.description ?? undefined,
      art: e.artUrl,
      focusY: e.focusY,
      audio: e.audioUrl,
      bpm: e.bpm,
    })
    const hero = live.filter((e) => e.inHero)
    const heroEpisodes = hero.map(episode)
    lastTrax = {
      heroEpisodes,
      initial: Math.max(0, hero.findIndex((e) => e.heroStart)),
      playlist: heroEpisodes.map(toEpisode),
      cards: live.filter((e) => e.inFeaturedCards).map((e) => toEpisode(episode(e))),
    }
    return lastTrax
  } catch (error) {
    console.warn(`[cms] Couldn't read Trax from the database, using ${lastTrax ? "the last copy" : "the built-in content"}:`, error)
    return lastTrax ?? defaultTrax
  }
}

function videoType(url: string) {
  const path = url.split("?")[0].toLowerCase()
  if (path.endsWith(".webm")) return "video/webm"
  if (path.endsWith(".mov")) return "video/quicktime"
  return "video/mp4"
}

/** A CMS video as the VideoAsset <SiteVideo> plays: its WebM copy first when there is one. */
function videoAsset(url: string, webm: string | null, poster: string | null, width: number, height: number): VideoAsset {
  return {
    sources: [...(webm ? [{ src: webm, type: "video/webm" }] : []), { src: url, type: videoType(url) }],
    poster: poster ?? undefined,
    width,
    height,
  }
}
