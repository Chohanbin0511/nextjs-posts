import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // API routes는 static export에서 지원되지 않으므로 제거하거나 다른 방식으로 처리
  async generateStaticParams() {
    return []
  },
};

export default nextConfig;
