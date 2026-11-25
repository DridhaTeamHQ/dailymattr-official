-- Every Qix story needs a video: the CMS no longer saves one without it, and the database
-- now refuses an empty one too. (All stories had a video when this ran.)

ALTER TABLE "qix_stories" ALTER COLUMN "video_url" SET NOT NULL;
ALTER TABLE "qix_stories" ADD CONSTRAINT "qix_stories_video_url_not_blank" CHECK (btrim("video_url") <> '');
