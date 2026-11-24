import "server-only"

import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/lib/generated/prisma/client"

// DATABASE_URL: the CMS's Supabase database as the read-only `website_reader` role
// (cms/prisma/migrations/*_website_reader), through the transaction pooler. It can read
// the SEO tables and nothing else.

// One client per server process. In dev, hot reloads re-run this file, so the client is
// kept on globalThis, and remade when DATABASE_URL changes (a new login applies at once).
const globalForPrisma = globalThis as unknown as {
  websitePrisma?: { url: string; client: PrismaClient }
}

/**
 * The database client, created on first use. Returns null when DATABASE_URL isn't set
 * (e.g. a build without env vars): callers then fall back to the defaults in code.
 */
export function getPrisma(): PrismaClient | null {
  const url = process.env.DATABASE_URL
  if (!url) return null

  const cached = globalForPrisma.websitePrisma
  if (cached && cached.url === url) return cached.client
  // A different login than last time: close the old pool before opening the new one.
  cached?.client?.$disconnect().catch(() => {})

  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: url, max: 3 }) })
  globalForPrisma.websitePrisma = { url, client }
  return client
}
