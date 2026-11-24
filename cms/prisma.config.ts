import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

// Read .env the same way Next.js does, so the CLI and the app share one set of URLs.
loadEnvConfig(process.cwd())

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // The CLI (migrations, introspection) uses Supabase's session pooler (port 5432).
  // The app itself connects through the transaction pooler, DATABASE_URL (lib/db.ts).
  // Only set when present: `prisma generate` (run on install and build, e.g. on Vercel)
  // needs no database, and Prisma's env() helper would fail the build without it.
  ...(process.env.DIRECT_URL && { datasource: { url: process.env.DIRECT_URL } }),
})
