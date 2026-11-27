import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let other devices on the local network (e.g. http://192.168.70.220:3000) load dev assets.
  allowedDevOrigins: ["192.168.*.*"],
  // Dummy photos (lib/dummy-media.ts) - remove with them.
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "fastly.picsum.photos" },
      // Story photos in the dailymattr media bucket (News IQ, components/quizz/content.ts).
      {
        protocol: "https",
        hostname: "coggfnbqqyiqfsxvtaym.supabase.co",
        pathname: "/storage/v1/object/public/pix-media/**",
        search: "",
      },
      // Qix covers and Trax artwork uploaded in the CMS (its "cms-media" bucket, lib/formats.ts).
      {
        protocol: "https",
        hostname: "simstmysvbvdfqyouamm.supabase.co",
        pathname: "/storage/v1/object/public/cms-media/**",
        search: "",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  // The old site's URLs end in a slash (/about/, /news/india/) but its story pages don't
  // (/news/<headline>-<Pix ID>), which no trailingSlash setting can express. Next's own
  // slash redirects are off; proxy.ts redirects to each page's old form (lib/urls.ts), and
  // links are written in that form, which Link keeps as written.
  skipTrailingSlashRedirect: true,
  // The old site's redirects (its vercel.json), plus old new-site paths (PAGE-SLUGS.md).
  redirects() {
    return [
      // The bare domain goes to www, the canonical host, keeping the path. App-link files under
      // .well-known are served on both hosts.
      {
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: "dailymattr.com" }],
        destination: "https://www.dailymattr.com/:path",
        permanent: true,
      },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/privacy", destination: "/privacypolicy/", permanent: true },
      // A LinkedIn campaign link (temporary on the old site too).
      {
        source: "/tamada-media",
        destination:
          "https://play.google.com/store/apps/details?id=com.dailymattr&utm_source=linkedin&utm_medium=social&utm_campaign=tamada_media",
        permanent: false,
      },
    ];
  },
  rewrites() {
    return {
      beforeFiles: [
        // Monthly news archive sitemaps at the old site's URLs (/news/sitemap-2026-11.xml).
        { source: "/news/sitemap-:month(\\d{4}-\\d{2}).xml", destination: "/api/news-sitemap/:month" },
        // Shared story links from the app, served by the app backend (as on the old site).
        { source: "/s/dev/:shareId", destination: "https://api.dailymattr.com/s/:shareId" },
        { source: "/s/:shareId", destination: "https://public.dailymattr.com/s/:shareId" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  headers() {
    return [
      // iOS universal links and Android app links read these as JSON.
      ...["/.well-known/apple-app-site-association", "/.well-known/assetlinks.json"].map((source) => ({
        source,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=300" },
        ],
      })),
      // API responses are never search results.
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
