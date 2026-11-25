import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Pix story photos (the News page), in the Pix media bucket. Photos on other hosts are
      // shown unoptimized instead.
      {
        protocol: "https",
        hostname: "coggfnbqqyiqfsxvtaym.supabase.co",
        pathname: "/storage/v1/object/public/pix-media/**",
        search: "",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
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
