import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mahitechnocrafts.in';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/admin/'
        ]
      },
      {
        userAgent: 'Google-Extended',
        allow: '/'
      },
      {
        userAgent: 'GPTBot',
        allow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/'
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/'
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/'
      },
      {
        userAgent: 'Claude-Web',
        allow: '/'
      },
      {
        userAgent: 'Amazonbot',
        allow: '/'
      },
      {
        userAgent: 'Bingbot',
        allow: '/'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
