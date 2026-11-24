import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/lib/generated/prisma/client"

// DATABASE_URL: the CMS's Supabase database as the read-only `website_reader` role
// (cms/prisma/migrations/*_website_reader), through the transaction pooler. It can read
// the SEO tables and nothing else.
const url = process.env.DATABASE_URL!

// One client per server process. In dev, hot reloads re-run this file, so the client is
// kept on globalThis, and remade when DATABASE_URL changes (a new login applies at once).
const globalForPrisma = globalThis as unknown as {
  websitePrisma?: { url: string; client: PrismaClient }
}

function getClient() {
  const cached = globalForPrisma.websitePrisma
  if (cached?.url === url) return cached.client
  // A different login than last time: close the old pool before opening the new one.
  cached?.client?.$disconnect().catch(() => {})

  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: url, max: 3 }) })
  if (process.env.NODE_ENV !== "production") globalForPrisma.websitePrisma = { url, client }
  return client
}

export const prisma = getClient()
