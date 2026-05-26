import { NextResponse } from 'next/server';
import { getBlogs, getBlogBySlug, saveBlog, deleteBlogBySlug, BlogItem } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin authentication cookie
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const blog = await getBlogBySlug(slug);
      if (!blog) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    const blogs = await getBlogs();
    // Return all blogs, sorted by date descending
    const sortedBlogs = [...blogs].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    return NextResponse.json(sortedBlogs);
  } catch (error) {
    console.error('Blog GET API error', error);
    return NextResponse.json({ error: 'Failed to retrieve blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: BlogItem = await request.json();
    
    // Validation
    if (!payload.slug || !payload.title || !payload.content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    // Auto-calculate reading time: ~200 words per minute (stripping HTML tags)
    const textOnly = payload.content.replace(/<[^>]*>/g, '');
    const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Construct the advanced SEO blog payload
    const newBlog: BlogItem = {
      slug: payload.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: payload.title,
      excerpt: payload.excerpt || '',
      content: payload.content,
      author: payload.author || 'Vikash Maheshwari',
      publishedAt: payload.publishedAt || new Date().toISOString().split('T')[0],
      readTime: readTime,
      coverImage: payload.coverImage || '/images/blog-default.jpg',
      imageAlt: payload.imageAlt || payload.title,
      category: payload.category || 'General',
      tags: payload.tags || ['General'],
      metaTitle: payload.metaTitle || payload.title,
      metaDescription: payload.metaDescription || payload.excerpt || '',
      focusKeyword: payload.focusKeyword || '',
      canonicalUrl: payload.canonicalUrl || `https://mahitechnocrafts.in/blog/${payload.slug}`,
      ogTitle: payload.ogTitle || payload.metaTitle || payload.title,
      ogDescription: payload.ogDescription || payload.metaDescription || payload.excerpt || '',
      ogImage: payload.ogImage || payload.coverImage || '/images/blog-default.jpg',
      enableBlogSchema: payload.enableBlogSchema !== undefined ? payload.enableBlogSchema : true,
      enableFaqSchema: payload.enableFaqSchema !== undefined ? payload.enableFaqSchema : false,
      faqs: payload.faqs || []
    };

    const success = await saveBlog(newBlog);
    if (success) {
      return NextResponse.json({ success: true, message: 'Blog post saved successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to save blog post' }, { status: 500 });
    }
  } catch (error) {
    console.error('Blog POST API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required for deletion' }, { status: 400 });
    }

    const success = await deleteBlogBySlug(slug);
    if (success) {
      return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Blog not found or failed to delete' }, { status: 404 });
    }
  } catch (error) {
    console.error('Blog DELETE API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
