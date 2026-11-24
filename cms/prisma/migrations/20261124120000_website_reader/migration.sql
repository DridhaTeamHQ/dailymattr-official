-- A read-only database role for the public dailymattr website.
--
-- The website only needs to read the SEO overrides, so it connects as `website_reader`
-- instead of the CMS's owner login. This role can read seo_pages and seo_settings and
-- nothing else: no writes, and no access to the users table.
--
-- The password is deliberately not set here (it would end up in git). The role is created
-- without login; after this migration runs on a database, enable it once with:
--
--   ALTER ROLE website_reader WITH LOGIN PASSWORD '<a long random password>';
--
-- and give the website DATABASE_URL =
--   postgresql://website_reader.<project-ref>:<password>@<pooler-host>:6543/postgres?pgbouncer=true

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'website_reader') THEN
    CREATE ROLE website_reader NOLOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO website_reader;
GRANT SELECT ON TABLE "seo_pages", "seo_settings" TO website_reader;

-- Row level security is on for both tables with no other policies, which hides every row.
-- These let website_reader (only) read them; anon and authenticated stay locked out.
CREATE POLICY "website_reader can read" ON "seo_pages" FOR SELECT TO website_reader USING (true);
CREATE POLICY "website_reader can read" ON "seo_settings" FOR SELECT TO website_reader USING (true);
