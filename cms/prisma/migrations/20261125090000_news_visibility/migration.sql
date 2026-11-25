-- Website visibility for Pix news stories, set with the Customize button on the CMS News page.
-- The stories live in the Pix database; this table only records the CMS's show / hide choice.

-- CreateTable
CREATE TABLE "news_visibility" (
    "post_id" UUID NOT NULL,
    "published_id" TEXT,
    "show_on_website" BOOLEAN NOT NULL DEFAULT true,
    "updated_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_visibility_pkey" PRIMARY KEY ("post_id")
);

-- CreateIndex
CREATE INDEX "news_visibility_show_idx" ON "news_visibility"("show_on_website");

-- Keep it out of Supabase's public Data API (anon / authenticated keys), like every CMS table.
ALTER TABLE "news_visibility" ENABLE ROW LEVEL SECURITY;

-- The website (read-only role website_reader, see 20261124120000_website_reader) reads it to
-- leave hidden stories out of its news section.
GRANT SELECT ON TABLE "news_visibility" TO website_reader;
CREATE POLICY "website_reader can read" ON "news_visibility" FOR SELECT TO website_reader USING (true);
