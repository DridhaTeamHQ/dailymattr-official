import { handlers } from "@/auth"

// Google sends users back to /api/auth/callback/google, which lands here.
export const { GET, POST } = handlers
