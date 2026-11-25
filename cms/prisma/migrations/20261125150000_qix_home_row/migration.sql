-- The home page's story row gets its own switch, separate from the Qix page's story row
-- (in_gallery). Every story starts where it is now: on the home page if it's in the Qix row.
-- website_reader's SELECT on qix_stories covers the new column.

ALTER TABLE "qix_stories" ADD COLUMN "in_home" BOOLEAN NOT NULL DEFAULT true;

UPDATE "qix_stories" SET "in_home" = "in_gallery";
