-- Qix and Trax content for the website, edited on the CMS's Qix and Trax pages.
--
-- Media URLs are either a path on the website ("/stories/mrf.mp4", a file in dailymattr/public)
-- or a full URL (files uploaded in the CMS go to the public "cms-media" storage bucket below).
-- The rows inserted at the end are what the website showed before the CMS took over, so
-- editors start by replacing them rather than from an empty page.

-- CreateTable
CREATE TABLE "qix_stories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "video_url" TEXT,
    "video_webm_url" TEXT,
    "poster_url" TEXT,
    "video_width" INTEGER NOT NULL DEFAULT 720,
    "video_height" INTEGER NOT NULL DEFAULT 1280,
    "in_hero" BOOLEAN NOT NULL DEFAULT true,
    "in_gallery" BOOLEAN NOT NULL DEFAULT true,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qix_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qix_experience_steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "video_webm_url" TEXT,
    "poster_url" TEXT,
    "video_width" INTEGER NOT NULL DEFAULT 360,
    "video_height" INTEGER NOT NULL DEFAULT 640,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qix_experience_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trax_episodes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "art_url" TEXT NOT NULL,
    "focus_y" SMALLINT NOT NULL DEFAULT 50,
    "audio_url" TEXT NOT NULL,
    "bpm" SMALLINT NOT NULL DEFAULT 96,
    "in_hero" BOOLEAN NOT NULL DEFAULT true,
    "in_featured_cards" BOOLEAN NOT NULL DEFAULT false,
    "hero_start" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trax_episodes_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "trax_episodes_focus_y_range" CHECK ("focus_y" BETWEEN 0 AND 100),
    CONSTRAINT "trax_episodes_bpm_range" CHECK ("bpm" BETWEEN 40 AND 220)
);

-- CreateIndex
CREATE INDEX "qix_stories_order_idx" ON "qix_stories"("sort_order");
CREATE INDEX "qix_experience_steps_order_idx" ON "qix_experience_steps"("sort_order");
CREATE INDEX "trax_episodes_order_idx" ON "trax_episodes"("sort_order");

-- Keep them out of Supabase's public Data API (anon / authenticated keys), like every CMS table,
-- and let the website's read-only role (20261124120000_website_reader) read them.
ALTER TABLE "qix_stories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "qix_experience_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "trax_episodes" ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON TABLE "qix_stories", "qix_experience_steps", "trax_episodes" TO website_reader;
CREATE POLICY "website_reader can read" ON "qix_stories" FOR SELECT TO website_reader USING (true);
CREATE POLICY "website_reader can read" ON "qix_experience_steps" FOR SELECT TO website_reader USING (true);
CREATE POLICY "website_reader can read" ON "trax_episodes" FOR SELECT TO website_reader USING (true);

-- Public bucket for files uploaded in the CMS (covers, videos, artwork, audio). Anyone can read a
-- file by its URL; only the CMS server (service role key) can write. Skipped on a plain Postgres
-- without Supabase Storage (e.g. a shadow database).
DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, allowed_mime_types)
    VALUES (
      'cms-media',
      'cms-media',
      true,
      ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif',
            'video/mp4', 'video/webm', 'video/quicktime',
            'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm']
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

-- What the website showed before (dailymattr/components/stories/covers.ts,
-- components/qix/content.ts, components/trax/content.ts).
INSERT INTO "qix_stories" ("title", "cover_url", "video_url", "video_webm_url", "poster_url", "sort_order") VALUES
  ('Investing Decoded — Finance Xplaind', '/cover-images/investing-decoded.jpg', '/stories/asian-paints.mp4', '/stories/asian-paints.webm', '/stories/asian-paints-poster.webp', 1),
  ('New Age Investing — Finance Xplaind', '/cover-images/new-age-investing.jpg', '/stories/havells.mp4', '/stories/havells.webm', '/stories/havells-poster.webp', 2),
  ('Amaron — Made in India', '/cover-images/amaron.png', '/stories/amaron.mp4', '/stories/amaron.webm', '/stories/amaron-poster.webp', 3),
  ('Jet Airways — Made in India', '/cover-images/jet-airways.png', '/stories/videocon.mp4', '/stories/videocon.webm', '/stories/videocon-poster.webp', 4),
  ('Jockey — Made in India', '/cover-images/jockey.png', '/stories/jockey.mp4', NULL, '/stories/jockey-poster.webp', 5),
  ('MRF — Made in India', '/cover-images/mrf.png', '/stories/mrf.mp4', '/stories/mrf.webm', '/stories/mrf-poster.webp', 6),
  ('Nilkamal — Made in India', '/cover-images/nilkamal.jpg', '/stories/nilkamal.mp4', '/stories/nilkamal.webm', '/stories/nilkamal-poster.webp', 7),
  ('Fevicol — Made in India', '/cover-images/fevicol.jpg', '/stories/fevicol.mp4', '/stories/fevicol.webm', '/stories/fevicol-poster.webp', 8);

INSERT INTO "qix_experience_steps" ("label", "video_url", "video_webm_url", "poster_url", "sort_order") VALUES
  ('The question', '/qix/experience/step-1.mp4', '/qix/experience/step-1.webm', '/qix/experience/step-1-poster.webp', 1),
  ('The detail', '/qix/experience/step-2.mp4', '/qix/experience/step-2.webm', '/qix/experience/step-2-poster.webp', 2),
  ('The big picture', '/qix/experience/step-3.mp4', '/qix/experience/step-3.webm', '/qix/experience/step-3-poster.webp', 3),
  ('The explanation', '/qix/experience/step-4.mp4', '/qix/experience/step-4.webm', '/qix/experience/step-4-poster.webp', 4);

INSERT INTO "trax_episodes" ("title", "topic", "art_url", "focus_y", "audio_url", "bpm", "in_featured_cards", "hero_start", "sort_order") VALUES
  ('Cricket', 'The Origin of Sports', '/trax/hero/art-cricket.png', 9, '/trax/hero/audio/cricket.mp3', 100, false, false, 1),
  ('Insurance 101 : Basics', 'Finance Explained', '/trax/hero/art-insurance.png', 73, '/trax/hero/audio/insurance.mp3', 78, true, false, 2),
  ('Fevicol', 'Made In India', '/trax/hero/art-fevicol.jpg', 3, '/trax/hero/audio/fevicol.mp3', 92, true, false, 3),
  ('Behind Cricket Balls', 'How Things are Made', '/trax/hero/art-cricket-balls.png', 18, '/trax/hero/audio/cricket-balls.mp3', 112, false, true, 4),
  ('Self Driving Cars', 'Before It''s Big', '/trax/hero/art-self-driving-cars.png', 16, '/trax/hero/audio/self-driving-cars.mp3', 96, true, false, 5);
