-- "Previous videos" is gone: a new video simply replaces the old one (and the CMS deletes the
-- replaced files from storage), so the saved copies of earlier steps aren't needed.

DROP TABLE IF EXISTS "qix_step_versions";
