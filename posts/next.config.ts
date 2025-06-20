import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }
};

export default nextConfig;
