import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { findUserByEmail } from "@/lib/users"

/**
 * Who is looking at the page: their Google email (from the session cookie) and their
 * CMS account (from the database, so approvals and rejections apply straight away).
 * Cached per request, so the nav and the page share one lookup.
 */
export const getViewer = cache(async () => {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (!email) return null
  const user = await findUserByEmail(email)
  return { email, user: user ?? null }
})

/** For CMS pages: signed out → /login, not yet approved → /verification. */
export async function requireApprovedUser() {
  const viewer = await getViewer()
  if (!viewer) redirect("/login")
  if (viewer.user?.status !== "approved") redirect("/verification")
  return viewer.user
}

/** For admin pages and actions: non-admins are sent to the home page. */
export async function requireAdmin() {
  const user = await requireApprovedUser()
  if (user.role !== "admin") redirect("/")
  return user
}
