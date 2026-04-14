import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-0d12fc4043a5424095ae70c1f637df76.r2.dev",
      },
      {
        protocol: "https",
        hostname: "nexus-wear-dashboard.vercel.app",
      },
    ],
  },
};

export default nextConfig;
