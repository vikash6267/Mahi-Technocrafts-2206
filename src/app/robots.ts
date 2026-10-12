import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // Keep one shared policy so AI crawlers and search crawlers receive the
    // same rules. Public service pages remain crawlable; account and API paths
    // are excluded from indexing discovery (access control is enforced by app).
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/portal', '/api/', '/private/', '/temp/'],
    },
    sitemap: 'https://mahitechnocrafts.in/sitemap.xml',
    host: 'https://mahitechnocrafts.in',
  };
}
