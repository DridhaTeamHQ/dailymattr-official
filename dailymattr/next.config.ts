import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let other devices on the local network (e.g. http://192.168.70.220:3000) load dev assets.
  allowedDevOrigins: ["192.168.*.*"],
  // Dummy photos (lib/dummy-media.ts) — remove with them.
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
  // Old-site slugs (see PAGE-SLUGS.md): send the earlier new-site path to the old URL.
  redirects() {
    return [{ source: "/privacy", destination: "/privacypolicy", permanent: true }];
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
