import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal', '/api/', '/private/', '/temp/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'DuckDuckBot',
          'Yandex',
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai'
        ],
        allow: '/',
        disallow: ['/admin', '/portal', '/api/'],
      }
    ],
    sitemap: 'https://mahitechnocrafts.in/sitemap.xml',
    host: 'https://mahitechnocrafts.in',
  };
}