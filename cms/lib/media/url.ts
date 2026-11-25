/**
 * Media URLs on the Qix and Trax pages are either a path on the website ("/stories/mrf.mp4",
 * a file in dailymattr/public) or a full https:// URL (uploads in the "cms-media" bucket).
 * Shared by the server actions (validation) and the browser (previews).
 */

export type MediaKind = "image" | "video" | "audio"

/** Where the browser can load a media URL from: website paths are resolved against the website. */
export function mediaSrc(url: string | null | undefined, websiteUrl: string): string {
  if (!url) return ""
  return url.startsWith("/") ? `${websiteUrl}${url}` : url
}

/** True for a website path ("/x/y.mp4") or an http(s) URL. */
export function isMediaUrl(value: string): boolean {
  if (value.startsWith("/")) return !value.startsWith("//") && !/\s/.test(value)
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

/** The file name at the end of a media URL, for showing which file is in use. */
export function mediaFileName(url: string | null | undefined): string {
  if (!url) return ""
  const path = url.split("?")[0]
  return decodeURIComponent(path.slice(path.lastIndexOf("/") + 1))
}

export const ACCEPT: Record<MediaKind, string> = {
  image: "image/png,image/jpeg,image/webp,image/avif,image/gif",
  video: "video/mp4,video/webm,video/quicktime",
  audio: "audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/x-wav,audio/ogg,audio/webm,.mp3,.m4a",
}

/** Upload size caps per kind, in MB (Supabase's own project-wide limit can be lower). */
export const MAX_MB: Record<MediaKind, number> = { image: 15, video: 500, audio: 100 }
