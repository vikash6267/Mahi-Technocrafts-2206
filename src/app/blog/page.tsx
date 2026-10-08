import { getBlogs } from '@/lib/db';
import BlogList from './BlogList';

export const metadata = {
  title: 'Tech & Business Growth Blog | Mahi TechnoCrafts Bhopal',
  description: 'Actionable guides on web development, local Bhopal SEO, WhatsApp automation, and digital growth for modern businesses by Mahi TechnoCrafts.',
  alternates: {
    canonical: '/blog'
  },
  keywords: [
    'web development blog bhopal',
    'local SEO guides bhopal',
    'WhatsApp automation business',
    'small business website tips',
    'software engineering insights india'
  ],
  openGraph: {
    title: 'Tech & Business Growth Blog | Mahi TechnoCrafts Bhopal',
    description: 'Expert web development, local SEO, and digital transformation guides.',
    url: 'https://mahitechnocrafts.in/blog',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Mahi TechnoCrafts Blog' }]
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const blogs = await getBlogs();
  const publishedBlogs = blogs.filter(b => b.status !== 'draft');
  
  return (
    <div className="min-h-screen py-16 max-w-7xl mx-auto px-6">
      <div className="max-w-3xl mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          Digital Growth & Engineering Insights
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Technology & Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Growth Blog</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
          Actionable insights on high-speed web development, local Bhopal SEO, WhatsApp AI automation, and scaling modern Indian businesses online.
        </p>
      </div>

      <BlogList initialBlogs={publishedBlogs} />
    </div>
  );
}
