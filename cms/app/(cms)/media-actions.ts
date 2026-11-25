"use server"

import { requireApprovedUser } from "@/lib/dal"
import { signUpload, UploadError, type SignedUpload } from "@/lib/media/storage"
import type { MediaKind } from "@/lib/media/url"

const FOLDERS = ["qix/stories", "qix/experience", "trax/art", "trax/audio"] as const
export type MediaFolder = (typeof FOLDERS)[number]

/**
 * A one-time upload link for a file the editor picked (see lib/media/storage.ts). A server
 * action is a public endpoint, so it re-checks the session.
 */
export async function requestUpload(input: {
  folder: MediaFolder
  kind: MediaKind
  name: string
  type: string
  size: number
}): Promise<{ ok: true; upload: SignedUpload } | { ok: false; error: string }> {
  await requireApprovedUser()
  if (!FOLDERS.includes(input?.folder) || !["image", "video", "audio"].includes(input?.kind)) {
    return { ok: false, error: "Unknown upload." }
  }
  try {
    const upload = await signUpload(input.folder, input.kind, String(input.name ?? ""), String(input.type ?? ""), Number(input.size))
    return { ok: true, upload }
  } catch (error) {
    if (error instanceof UploadError) return { ok: false, error: error.message }
    console.error("[media] Upload link failed:", error)
    return { ok: false, error: "Couldn't start the upload. Try again." }
  }
}
