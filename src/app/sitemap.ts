import { MetadataRoute } from 'next';
import { getBlogs, BlogItem } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mahitechnocrafts.in';
  
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
    '/privacy',
    '/terms'
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8
  }));

  const dynamicBlogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6
  }));

  return [...staticRoutes, ...dynamicBlogRoutes];
}
