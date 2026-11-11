import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let other devices on the local network (e.g. http://192.168.70.220:3000) load dev assets.
  allowedDevOrigins: ["192.168.*.*"],
  // Dummy photos (lib/dummy-media.ts) — remove with them.
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }, { hostname: "fastly.picsum.photos" }],
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
