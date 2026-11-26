-- "The experience" steps can share one video: each step plays its own part of it, from
-- start_seconds to end_seconds (set by "Split one video into steps" on the CMS Qix page).
-- Both null = the step plays its whole video, as before.

ALTER TABLE "qix_experience_steps" ADD COLUMN "start_seconds" REAL;
ALTER TABLE "qix_experience_steps" ADD COLUMN "end_seconds" REAL;
ALTER TABLE "qix_experience_steps" ADD CONSTRAINT "qix_experience_steps_segment_valid" CHECK (
  ("start_seconds" IS NULL AND "end_seconds" IS NULL)
  OR ("start_seconds" >= 0 AND "end_seconds" > "start_seconds")
);
