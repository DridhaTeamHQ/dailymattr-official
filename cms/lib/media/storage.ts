import "server-only"

import { randomUUID } from "node:crypto"

import { MAX_MB, type MediaKind } from "./url"

/**
 * Uploads for the Qix and Trax pages go to the public "cms-media" bucket in the CMS's own
 * Supabase project (created by migration 20261125120000_qix_trax). The browser sends the file
 * straight to Supabase Storage with a one-time signed upload URL made here, so large videos
 * never pass through the CMS server.
 *
 * - SUPABASE_SERVICE_ROLE_KEY: the project's service role key (Supabase → Project Settings →
 *   API keys). Server only; never sent to the browser.
 * - SUPABASE_URL (optional): https://<project-ref>.supabase.co. Worked out from DATABASE_URL
 *   when not set.
 */
export const MEDIA_BUCKET = "cms-media"

function projectUrl(): string | null {
  const explicit = process.env.SUPABASE_URL?.trim().replace(/\/+$/, "")
  if (explicit) return explicit
  // Pooler logins look like postgresql://postgres.<project-ref>:<password>@...
  const ref = process.env.DATABASE_URL?.match(/\/\/postgres\.([a-z0-9]{20})[:@]/)?.[1]
  return ref ? `https://${ref}.supabase.co` : null
}

/** Null when uploads work; otherwise what's missing, in plain words. */
export function uploadSetupProblem(): string | null {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    return "Uploading needs SUPABASE_SERVICE_ROLE_KEY in the CMS's environment (Supabase → Project Settings → API keys → service_role). Until then, paste a link to a file instead."
  }
  if (!projectUrl()) return "Uploading needs SUPABASE_URL (https://<project-ref>.supabase.co) in the CMS's environment."
  return null
}

const TYPES: Record<MediaKind, Record<string, string>> = {
  image: { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" },
  video: { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" },
  audio: {
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/aac": "aac",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "ogg",
    "audio/webm": "weba",
  },
}

const slug = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "file"

export type SignedUpload = { uploadUrl: string; publicUrl: string }

/**
 * A one-time URL the browser PUTs the file to, and the public URL it will have.
 * `folder` groups files by page section, e.g. "qix/stories".
 */
export async function signUpload(
  folder: string,
  kind: MediaKind,
  fileName: string,
  contentType: string,
  size: number
): Promise<SignedUpload> {
  const problem = uploadSetupProblem()
  if (problem) throw new UploadError(problem)

  const ext = TYPES[kind][contentType.toLowerCase()]
  if (!ext) throw new UploadError(`That file type (${contentType || "unknown"}) can't be used here.`)
  if (!Number.isFinite(size) || size <= 0) throw new UploadError("That file is empty.")
  if (size > MAX_MB[kind] * 1024 * 1024) throw new UploadError(`That file is over ${MAX_MB[kind]} MB.`)

  const now = new Date()
  const month = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`
  const path = `${folder}/${month}/${randomUUID().slice(0, 8)}-${slug(fileName)}.${ext}`
  const base = projectUrl()!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()

  const res = await fetch(`${base}/storage/v1/object/upload/sign/${MEDIA_BUCKET}/${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, apikey: key, "content-type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    console.error(`[media] Signing an upload failed (${res.status}):`, detail)
    throw new UploadError(
      res.status === 401 || res.status === 403
        ? "Supabase refused the upload key. Check SUPABASE_SERVICE_ROLE_KEY."
        : "Supabase Storage didn't accept the upload just now. Try again."
    )
  }
  const { url } = (await res.json()) as { url?: string }
  if (!url) throw new UploadError("Supabase Storage didn't return an upload link.")

  return {
    uploadUrl: `${base}/storage/v1${url}`,
    publicUrl: `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`,
  }
}

/** An upload problem that's safe to show the editor. */
export class UploadError extends Error {}

/**
 * Deletes uploaded files that a save has just replaced (or a delete removed), so storage
 * only holds what the website uses. Only files in the cms-media bucket are touched (never the
 * website's own files like "/stories/mrf.mp4"), and only once no Qix story, Qix step or Trax
 * episode uses them any more. Best effort: a failure is logged and the save still counts.
 */
export async function deleteUnusedMedia(urls: (string | null | undefined)[]) {
  const base = projectUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!base || !key) return
  const prefix = `${base}/storage/v1/object/public/${MEDIA_BUCKET}/`
  const candidates = [...new Set(urls.filter((u): u is string => !!u && u.startsWith(prefix)))]
  if (!candidates.length) return

  try {
    const { prisma } = await import("@/lib/db")
    const any = { in: candidates }
    const [stories, steps, episodes] = await Promise.all([
      prisma.qixStory.findMany({
        where: { OR: [{ coverUrl: any }, { videoUrl: any }, { videoWebmUrl: any }, { posterUrl: any }] },
        select: { coverUrl: true, videoUrl: true, videoWebmUrl: true, posterUrl: true },
      }),
      prisma.qixExperienceStep.findMany({
        where: { OR: [{ videoUrl: any }, { videoWebmUrl: any }, { posterUrl: any }] },
        select: { videoUrl: true, videoWebmUrl: true, posterUrl: true },
      }),
      prisma.traxEpisode.findMany({
        where: { OR: [{ artUrl: any }, { audioUrl: any }] },
        select: { artUrl: true, audioUrl: true },
      }),
    ])
    const inUse = new Set([...stories, ...steps, ...episodes].flatMap((row) => Object.values(row)))
    const paths = candidates.filter((u) => !inUse.has(u)).map((u) => decodeURIComponent(u.slice(prefix.length)))
    if (!paths.length) return

    const res = await fetch(`${base}/storage/v1/object/${MEDIA_BUCKET}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${key}`, apikey: key, "content-type": "application/json" },
      body: JSON.stringify({ prefixes: paths }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) console.warn(`[media] Couldn't delete ${paths.length} replaced file(s) (${res.status}):`, await res.text().catch(() => ""))
  } catch (error) {
    console.warn("[media] Couldn't delete replaced files:", error)
  }
}
