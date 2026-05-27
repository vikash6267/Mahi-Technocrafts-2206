import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, HelpCircle, AlignLeft } from 'lucide-react';
import { getBlogBySlug } from '@/lib/db';
import ShareButton from '@/components/ShareButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO and Open Graph
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  let blog = null;
  try {
    blog = await getBlogBySlug(slug);
  } catch (error) {
    console.error('Error fetching blog for metadata', error);
  }

  if (!blog) {
    return {
      title: 'Post Not Found | Mahi Technocrafts',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    alternates: {
      canonical: blog.canonicalUrl || `https://mahitechnocrafts.in/blog/${blog.slug}`
    },
    openGraph: {
      title: blog.ogTitle || blog.metaTitle || blog.title,
      description: blog.ogDescription || blog.metaDescription || blog.excerpt,
      type: 'article',
      url: `https://mahitechnocrafts.in/blog/${blog.slug}`,
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      tags: blog.tags,
      images: [
        {
          url: blog.ogImage || blog.coverImage || '/og-image.jpg',
          alt: blog.imageAlt || blog.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.ogTitle || blog.metaTitle || blog.title,
      description: blog.ogDescription || blog.metaDescription || blog.excerpt,
      images: [blog.ogImage || blog.coverImage || '/og-image.jpg']
    }
  };
}

export const revalidate = 10;

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  let blog = null;
  try {
    blog = await getBlogBySlug(slug);
  } catch (error) {
    console.error('Error loading blog post page', error);
  }

  if (!blog) {
    notFound();
  }

  // Auto-generate Table of Contents from TipTap headings
  const headings: { level: number; text: string; id: string }[] = [];
  let cleanContent = blog.content || '';
  let headingIndex = 0;

  // Replace heading tags with IDs so navigation works
  cleanContent = cleanContent.replace(/<h([2-3])[^>]*>(.*?)<\/h\1>/g, (match, level, text) => {
    headingIndex++;
    const id = `heading-${headingIndex}`;
    const plainText = text.replace(/<[^>]*>/g, ''); // strip any nested tags
    headings.push({ level: parseInt(level), text: plainText, id });
    return `<h${level} id="${id}" class="scroll-mt-24 font-display font-bold text-slate-800 dark:text-white mt-8 mb-4">${text}</h${level}>`;
  });

  // Schema.org Structured JSON-LD Data
  const schemas: any[] = [];

  if (blog.enableBlogSchema) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt,
      image: blog.coverImage.startsWith('http') ? blog.coverImage : `https://mahitechnocrafts.in${blog.coverImage}`,
      datePublished: blog.publishedAt,
      author: {
        '@type': 'Person',
        name: blog.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mahi Technocrafts',
        logo: {
          '@type': 'ImageObject',
          url: 'https://mahitechnocrafts.in/logo.png'
        }
      }
    });
  }

  if (blog.enableFaqSchema && blog.faqs && blog.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: blog.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    });
  }

  return (
    <div className="min-h-screen py-16 max-w-7xl mx-auto px-6 relative">
      {/* Inject JSON-LD Schema Blocks */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c')
          }}
        />
      ))}

      {/* Floating mesh glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-blue transition-colors cursor-pointer"
        >
          <ArrowLeft size={12} />
          Back to Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Main Article Content */}
        <article className={headings.length > 0 ? "lg:col-span-9 space-y-8" : "lg:col-span-12 space-y-8"}>
          {/* Header */}
          <div className="space-y-4 pb-6 border-b border-slate-200/50 dark:border-slate-850">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {blog.publishedAt}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {blog.readTime}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <User size={12} />
                {blog.author}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              {blog.title}
            </h1>

            <div className="flex gap-2 pt-2 flex-wrap">
              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
                {blog.category}
              </span>
              {blog.tags?.map((t, idx) => (
                <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          {blog.coverImage && (
            <div className="relative w-full max-h-[480px] rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-lg bg-slate-100/50 dark:bg-slate-900/50 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.coverImage}
                alt={blog.imageAlt || blog.title}
                className="max-w-full max-h-[480px] w-auto h-auto object-contain"
              />
            </div>
          )}

          {/* Render Rich HTML Text Content */}
          <div
            className={
              cleanContent.includes('style=')
                ? "not-prose max-w-none pt-2 text-sm sm:text-base leading-relaxed"
                : "prose prose-slate dark:prose-invert max-w-none pt-2 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-350 space-y-4"
            }
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          {/* Dynamic FAQ Section */}
          {blog.faqs && blog.faqs.length > 0 && (
            <div className="pt-10 mt-10 border-t border-slate-200/50 dark:border-slate-850 space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-brand-blue" />
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {blog.faqs.map((faq, i) => (
                  <div key={i} className="p-5 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 space-y-2">
                    <h4 className="font-display font-bold text-sm md:text-base text-slate-800 dark:text-white">Q: {faq.q}</h4>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Share Article Footer */}
          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-850 flex items-center justify-between text-xs text-slate-400">
            <span>Written by Mahi Tech Editorial Team</span>
            <ShareButton />
          </div>
        </article>

        {/* Sidebar widgets (Table of Contents) */}
        {headings.length > 0 && (
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 hidden lg:block">
            <div className="p-6 rounded-2xl glass border border-slate-250 dark:border-slate-800/80 space-y-4">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-850 pb-2">
                <AlignLeft size={14} className="text-brand-purple" />
                Table of Contents
              </h3>
              <nav className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block hover:text-brand-blue transition-colors leading-relaxed ${
                      h.level === 3 ? 'pl-4 font-medium text-[11px] opacity-80' : ''
                    }`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

      </div>
    </div>
  );
}
