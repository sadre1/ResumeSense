import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions:{
      bodySizeLimit: "4mb"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vtqq1oe11wv7265c.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
