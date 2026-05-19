import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // During development use Next internal API routes which proxy to backend with better error handling.
    if (process.env.NODE_ENV !== 'production') return [];

    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;