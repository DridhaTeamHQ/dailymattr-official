import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let other devices on the local network (e.g. http://192.168.70.220:3000) load dev assets.
  allowedDevOrigins: ["192.168.*.*"],
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
