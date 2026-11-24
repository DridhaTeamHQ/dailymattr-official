import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/lib/generated/prisma/client"

// One client per server process. In dev, hot reloads re-run this file, so the client
// is kept on globalThis instead of opening a new connection pool each time.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  // Supabase's transaction pooler (port 6543): suits many short-lived server requests.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
