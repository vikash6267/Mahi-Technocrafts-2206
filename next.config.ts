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

  async rewrites() {
    return [
      { source: '/web-development', destination: '/services/web-dev' },
      { source: '/mobile-app-development', destination: '/services/mobile-dev' },
      { source: '/ai-services', destination: '/services/ai-solutions' },
      { source: '/uiuxdesign', destination: '/services/uiux-design' },
      { source: '/digital-marketing', destination: '/services/digital-marketing' },
      { source: '/seomarket', destination: '/services/seo-optimization' },
      { source: '/custom-software', destination: '/services/erp-crm' },
      { source: '/cloud-services', destination: '/services/cloud-services' },
      { source: '/service', destination: '/services' },
      { source: '/news', destination: '/blog' },
      { source: '/news/:slug', destination: '/blog/:slug' },
      { source: '/career', destination: '/careers' },
      { source: '/apply', destination: '/careers' },
    ];
  },
};

export default nextConfig;