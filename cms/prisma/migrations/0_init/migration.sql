-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "change_frequency" AS ENUM ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'member',
    "status" "user_status" NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_pages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "path" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "keywords" TEXT[],
    "canonical" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "image" TEXT,
    "noindex" BOOLEAN,
    "nofollow" BOOLEAN,
    "priority" REAL,
    "change_frequency" "change_frequency",
    "json_ld" JSONB,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_settings" (
    "id" SMALLINT NOT NULL DEFAULT 1,
    "site_name" TEXT,
    "title_template" TEXT,
    "default_description" TEXT,
    "default_keywords" TEXT[],
    "default_image" TEXT,
    "twitter_handle" TEXT,
    "google_verification" TEXT,
    "bing_verification" TEXT,
    "updated_by" TEXT,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seo_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seo_pages_path_unique" ON "seo_pages"("path");

-- Not expressible in schema.prisma, so added by hand:

-- Only one row of site-wide settings.
ALTER TABLE "seo_settings" ADD CONSTRAINT "seo_settings_single_row" CHECK ("id" = 1);

-- Row level security on, no policies: the CMS connects as the owner (bypasses RLS),
-- while Supabase's public Data API (anon / authenticated keys) can't read these tables.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seo_pages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seo_settings" ENABLE ROW LEVEL SECURITY;
