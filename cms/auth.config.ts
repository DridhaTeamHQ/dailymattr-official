import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

/**
 * The part of the Auth.js setup that needs no database, so proxy.ts can use it on
 * every request. auth.ts adds the database work on top of it.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Sessions live in an encrypted cookie (JWT). Approval status is read from the
  // database on each request instead (lib/dal.ts), so admin decisions apply at once.
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    // Failed or refused sign-ins come back to /login?error=... instead of Auth.js's own page.
    error: "/login",
  },
  callbacks: {
    // Used by proxy.ts: signed-out visitors go to /login, signed-in ones skip it.
    authorized({ auth, request: { nextUrl } }) {
      const signedIn = !!auth?.user
      if (nextUrl.pathname === "/login") {
        return signedIn ? Response.redirect(new URL("/", nextUrl)) : true
      }
      return signedIn
    },
  },
} satisfies NextAuthConfig
