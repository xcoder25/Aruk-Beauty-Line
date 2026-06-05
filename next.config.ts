import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint is run separately in dev/CI — don't block production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type errors are caught locally — don't block Vercel deploys
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
