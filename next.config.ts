import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project; an unrelated lockfile sits in a
  // parent iCloud folder and would otherwise be picked as the root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
