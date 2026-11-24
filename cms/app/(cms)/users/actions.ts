"use server"

import { refresh } from "next/cache"

import { requireAdmin } from "@/lib/dal"
import type { UserStatus } from "@/lib/generated/prisma/client"
import { setUserStatus } from "@/lib/users"

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Each action checks for an admin itself: a server action is a public endpoint,
// so hiding the buttons from non-admins isn't enough.
async function review(userId: string, status: UserStatus) {
  const admin = await requireAdmin()
  if (!UUID.test(userId)) throw new Error("Invalid user id")
  await setUserStatus(userId, status, admin.email)
  refresh()
}

/** Lets the user sign in (from pending or rejected). */
export async function approveUser(userId: string) {
  await review(userId, "approved")
}

/** Declines a pending request, or takes access away from an approved user. */
export async function rejectUser(userId: string) {
  await review(userId, "rejected")
}
