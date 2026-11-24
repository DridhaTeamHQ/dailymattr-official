import { loadEnvConfig } from "@next/env"
import { defineConfig, env } from "prisma/config"

// Read .env the same way Next.js does, so the CLI and the app share one set of URLs.
loadEnvConfig(process.cwd())

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // The CLI (migrations, introspection) uses Supabase's session pooler (port 5432).
  // The app itself connects through the transaction pooler, DATABASE_URL (lib/db.ts).
  datasource: { url: env("DIRECT_URL") },
})
