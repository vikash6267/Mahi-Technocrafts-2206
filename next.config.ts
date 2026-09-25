import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,

  allowedDevOrigins: [
    "192.168.29.126",
    "http://192.168.29.126:3111",
  ],

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "idcard-pro-images.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.pollinations.ai",
        pathname: "/**",
      },
    ],
  },

  poweredByHeader: false,
};

export default nextConfig;