import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard web crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '*.json',
          '/temp/'
        ],
      },
      // Google AI (Gemini, Bard, SGE)
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'GoogleOther',
        allow: '/',
        disallow: ['/admin/']
      },
      // OpenAI (ChatGPT, GPT-4)
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin/']
      },
      // Anthropic (Claude)
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/']
      }
    ],
    sitemap: 'https://mahitechnocrafts.in/sitemap.xml',
    host: 'https://mahitechnocrafts.in'
  };
}