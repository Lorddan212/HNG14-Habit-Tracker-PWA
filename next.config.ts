import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost", "192.168.137.1"],
  reactStrictMode: true,
};

export default nextConfig;
