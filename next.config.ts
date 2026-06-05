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
  // Prevent webpack from trying to bundle server-only packages (genkit, opentelemetry)
  // These are used only in API routes and must stay as native Node.js requires
  serverExternalPackages: [
    "genkit",
    "@genkit-ai/core",
    "@genkit-ai/google-genai",
    "@genkit-ai/googleai",
    "@opentelemetry/sdk-node",
    "@opentelemetry/instrumentation",
    "@opentelemetry/exporter-jaeger",
  ],
  webpack: (config) => {
    // Silence the missing optional jaeger exporter — it's unused
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@opentelemetry/exporter-jaeger": false,
    };
    return config;
  },
};

export default nextConfig;
