import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.rawg.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
