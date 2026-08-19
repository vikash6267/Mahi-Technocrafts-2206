import { MetadataRoute } from 'next';
import { getBlogs, BlogItem } from '@/lib/db';

export const revalidate = 86400;

const baseUrl = 'https://mahitechnocrafts.in';
const defaultLastModified = '2026-06-10';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch dynamic blogs
  let blogs: BlogItem[] = [];
  try {
    blogs = await getBlogs();
  } catch (error) {
    console.error('Error fetching blogs for sitemap, mapping static paths only', error);
  }

  // Static paths configuration
  const staticPaths = [
    '',
    '/about',
    '/services',
    '/blog',
    '/contact',
    '/careers',
    '/reviews',
    '/privacy',
    '/terms'
  ];

  const servicePaths = [
    '/services/web-dev',
    '/services/mobile-dev',
    '/services/uiux-design',
    '/services/ai-solutions',
    '/services/erp-crm',
    '/services/cloud-services',
    '/services/seo-services',
    '/services/cyber-security',
    '/services/ecommerce-development'
  ];

  const staticRoutes = staticPaths.map((path) => {
    // Assign priorities based on page importance
    let priority = 0.8;
    let changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly';
    
    if (path === '') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (path === '/contact' || path === '/services') {
      priority = 0.9;
      changeFrequency = 'weekly';
    } else if (path === '/blog') {
      priority = 0.85;
      changeFrequency = 'daily';
    }
    
    return {
      url: `${baseUrl}${path}`,
      lastModified: defaultLastModified,
      changeFrequency,
      priority
    };
  });

  const serviceRoutes = servicePaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: defaultLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }));

  const dynamicBlogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.publishedAt || defaultLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }));

  return [...staticRoutes, ...serviceRoutes, ...dynamicBlogRoutes];
}
