import NextAuth from "next-auth"

import { authConfig } from "@/auth.config"
import { recordSignIn } from "@/lib/users"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // Every Google sign-in is saved: new people start as "pending" and wait on the
    // verification page until an admin approves them.
    async signIn({ profile }) {
      if (!profile?.email || profile.email_verified !== true) return false
      await recordSignIn({
        email: profile.email,
        name: profile.name ?? null,
        image: typeof profile.picture === "string" ? profile.picture : null,
      })
      return true
    },
  },
})
