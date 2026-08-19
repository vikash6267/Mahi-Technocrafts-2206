import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mahitechnocrafts.in';
  
  return {
    rules: [
      // General crawlers - allow everything except admin
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/admin/',
          '/api/upload/'
        ],
        crawlDelay: 1
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
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/admin/']
      },
      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/']
      },
      // Amazon Alexa
      {
        userAgent: 'Amazonbot',
        allow: '/',
        disallow: ['/admin/']
      },
      // Microsoft (Bing, Copilot)
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: ['/admin/']
      },
      // Meta AI
      {
        userAgent: 'FacebookBot',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'meta-externalagent',
        allow: '/',
        disallow: ['/admin/']
      },
      // Cohere AI
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin/']
      },
      // YouBot (You.com)
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/admin/']
      },
      // Diffbot
      {
        userAgent: 'Diffbot',
        allow: '/',
        disallow: ['/admin/']
      },
      // Apple Intelligence
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: ['/admin/']
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: ['/admin/']
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
