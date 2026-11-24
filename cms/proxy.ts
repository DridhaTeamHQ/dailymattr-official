import NextAuth from "next-auth"

import { authConfig } from "@/auth.config"

// Runs before every page: the `authorized` callback in auth.config.ts sends signed-out
// visitors to /login and signed-in visitors from /login to the home page. Approval
// checks need the database, so they happen in the pages (lib/dal.ts), not here.
export const { auth: proxy } = NextAuth(authConfig)

export const config = {
  // Everything except the Auth.js endpoints, Next.js internals and static files.
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
}
