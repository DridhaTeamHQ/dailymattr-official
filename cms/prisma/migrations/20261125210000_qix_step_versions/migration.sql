-- Earlier sets of "The experience" steps, so a replaced video can be brought back. A copy of
-- the current steps is saved here before they are replaced (Split one video, Add thumbnail,
-- Restore). The first entry is the original MRF steps the website shipped with.

CREATE TABLE "qix_step_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    -- The steps as they were: [{label, videoUrl, videoWebmUrl, posterUrl, startSeconds, endSeconds, videoWidth, videoHeight, published}]
    "steps" JSONB NOT NULL,
    -- What replaced them, e.g. "Before splitting a new video".
    "note" TEXT,
    "created_by" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qix_step_versions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "qix_step_versions_created_idx" ON "qix_step_versions"("created_at" DESC);

-- CMS only: kept out of Supabase's public Data API, and the website doesn't need it.
ALTER TABLE "qix_step_versions" ENABLE ROW LEVEL SECURITY;

INSERT INTO "qix_step_versions" ("steps", "note", "created_by", "created_at") VALUES (
  '[
    {"label": "The question", "videoUrl": "/qix/experience/step-1.mp4", "videoWebmUrl": "/qix/experience/step-1.webm", "posterUrl": "/qix/experience/step-1-poster.webp", "startSeconds": null, "endSeconds": null, "videoWidth": 360, "videoHeight": 640, "published": true},
    {"label": "The detail", "videoUrl": "/qix/experience/step-2.mp4", "videoWebmUrl": "/qix/experience/step-2.webm", "posterUrl": "/qix/experience/step-2-poster.webp", "startSeconds": null, "endSeconds": null, "videoWidth": 360, "videoHeight": 640, "published": true},
    {"label": "The big picture", "videoUrl": "/qix/experience/step-3.mp4", "videoWebmUrl": "/qix/experience/step-3.webm", "posterUrl": "/qix/experience/step-3-poster.webp", "startSeconds": null, "endSeconds": null, "videoWidth": 360, "videoHeight": 640, "published": true},
    {"label": "The explanation", "videoUrl": "/qix/experience/step-4.mp4", "videoWebmUrl": "/qix/experience/step-4.webm", "posterUrl": "/qix/experience/step-4-poster.webp", "startSeconds": null, "endSeconds": null, "videoWidth": 360, "videoHeight": 640, "published": true}
  ]'::jsonb,
  'Original MRF story steps',
  NULL,
  '2026-11-25 09:00:00+00'
);
