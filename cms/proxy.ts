import NextAuth from "next-auth"

import { authConfig } from "@/auth.config"

// Runs before every page: the `authorized` callback in auth.config.ts sends signed-out
// visitors to /login and signed-in visitors from /login to the home page. Approval
// checks need the database, so they happen in the pages (lib/dal.ts), not here.
//
// Keep it a plain `export const proxy = …`: `next build` finds the proxy by reading this
// file's exports, and doesn't recognise a destructured `export const { auth: proxy }`
// (dev mode only warns, so that form passes locally and fails on Vercel).
export const proxy = NextAuth(authConfig).auth

export const config = {
  // Everything except the Auth.js endpoints, Next.js internals and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
}
