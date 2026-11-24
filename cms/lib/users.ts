import "server-only"

import { prisma } from "@/lib/db"
import type { UserStatus } from "@/lib/generated/prisma/client"

/** Admins are set in AUTH_ADMIN_EMAILS (comma-separated). Only they can approve users. */
export const adminEmails = (process.env.AUTH_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

/**
 * Saves a Google sign-in. New people are added as pending members. Anyone on the
 * admin list is always an approved admin; anyone taken off it goes back to member.
 */
export async function recordSignIn(profile: { email: string; name: string | null; image: string | null }) {
  const email = profile.email.toLowerCase()
  const isAdmin = adminEmails.includes(email)
  const now = new Date()

  await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: profile.name,
      image: profile.image,
      role: isAdmin ? "admin" : "member",
      status: isAdmin ? "approved" : "pending",
      lastLoginAt: now,
    },
    update: {
      name: profile.name,
      image: profile.image,
      lastLoginAt: now,
      role: isAdmin ? "admin" : "member",
      ...(isAdmin && { status: "approved" as const }),
    },
  })
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email: email.toLowerCase() } })
}

// The functions below are for admins only. Callers check with requireAdmin() first.

export function listUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } })
}

export function countPendingUsers() {
  return prisma.user.count({ where: { status: "pending" } })
}

/** Approves or rejects a member. Admin accounts can't be changed here. */
export async function setUserStatus(userId: string, status: UserStatus, reviewerEmail: string) {
  await prisma.user.updateMany({
    where: { id: userId, role: "member" },
    data: { status, reviewedBy: reviewerEmail, reviewedAt: new Date() },
  })
}
