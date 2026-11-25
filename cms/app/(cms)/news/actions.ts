"use server"

import { refresh } from "next/cache"

import { requireApprovedUser } from "@/lib/dal"
import { saveNewsVisibility } from "@/lib/news/data"
import type { SaveResult } from "@/lib/seo/forms"
import { notifyWebsite } from "@/lib/seo/website"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Shows or hides stories in the website's news section (the Customize button), then tells
 * the website to refresh. A server action is a public endpoint, so it re-checks the session.
 */
export async function setNewsVisibility(
  stories: { id: string; pixId: string }[],
  show: boolean
): Promise<SaveResult> {
  const user = await requireApprovedUser()
  if (!Array.isArray(stories) || stories.length === 0 || stories.length > 100) {
    return { ok: false, error: "Pick between 1 and 100 stories." }
  }
  if (!stories.every((s) => typeof s?.id === "string" && UUID.test(s.id) && /^\d{1,12}$/.test(String(s.pixId)))) {
    return { ok: false, error: "Unknown story." }
  }

  await saveNewsVisibility(
    stories.map((s) => ({ id: s.id.toLowerCase(), pixId: String(s.pixId) })),
    show === true,
    user.email
  )
  const live = await notifyWebsite()
  refresh()
  return { ok: true, live }
}
