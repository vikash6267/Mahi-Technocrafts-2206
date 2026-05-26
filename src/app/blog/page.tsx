import { getBlogs } from '@/lib/db';
import BlogList from './BlogList';

export const metadata = {
  title: 'Tech Blog | Mahi Technocrafts',
  description: 'Explore the latest articles, developer guides, design methodologies, and AI integration strategies written by Mahi Technocrafts crew.',
};

export const revalidate = 0;

export default async function BlogPage() {
  const blogs = await getBlogs();
  
  return (
    <div className="min-h-screen py-16 max-w-7xl mx-auto px-6">
      <div className="max-w-3xl mb-16 space-y-4">
        <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Our Tech <span className="text-gradient">Blog</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
          Deep-dives into modern web architectures, UI/UX aesthetics, search optimizations, and practical artificial intelligence integrations.
        </p>
      </div>

      <BlogList initialBlogs={blogs} />
    </div>
  );
}
