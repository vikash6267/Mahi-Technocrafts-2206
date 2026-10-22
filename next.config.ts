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

  async redirects() {
    return [
      // 1. Force Apex domain (301 redirect www.mahitechnocrafts.in -> mahitechnocrafts.in)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mahitechnocrafts.in',
          },
        ],
        destination: 'https://mahitechnocrafts.in/:path*',
        permanent: true,
      },

      // 2. Resolve Google Search Console 404s
      { source: '/services/real-estate', destination: '/solutions/real-estate', permanent: true },
      { source: '/services/education', destination: '/solutions/education', permanent: true },
      { source: '/services/restaurants', destination: '/solutions/restaurants', permanent: true },
      { source: '/services/healthcare', destination: '/solutions/healthcare', permanent: true },
      { source: '/services/ecommerce', destination: '/solutions/ecommerce', permanent: true },
      { source: '/projects', destination: '/portfolio', permanent: true },
      { source: '/cyber-security', destination: '/services', permanent: true },
      { source: '/blogs', destination: '/blog', permanent: true },
      { source: '/blogs/:slug*', destination: '/blog/:slug*', permanent: true },

      // 3. Resolve legacy URL variations to prevent duplicate indexing
      { source: '/service', destination: '/services', permanent: true },
      { source: '/career', destination: '/careers', permanent: true },
      { source: '/apply', destination: '/careers', permanent: true },
      { source: '/news', destination: '/blog', permanent: true },
      { source: '/news/:slug*', destination: '/blog/:slug*', permanent: true },
    ];
  },

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