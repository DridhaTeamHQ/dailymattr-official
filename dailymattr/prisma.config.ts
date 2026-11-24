import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

// Read .env the same way Next.js does.
loadEnvConfig(process.cwd())

// The website only reads the CMS database, so the CLI here is just for `prisma generate`
// (and `prisma db pull` to compare with the CMS). Migrations live in cms/prisma.
export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(process.env.DATABASE_URL && { datasource: { url: process.env.DATABASE_URL } }),
})
