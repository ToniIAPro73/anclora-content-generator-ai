import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@base-ui/react"],
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
