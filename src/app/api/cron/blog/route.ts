import { NextResponse } from 'next/server';
import { generateAutonomousBlog } from '@/lib/gemini-blog';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient time for Gemini LLM generation

const CRON_SECRET = process.env.CRON_SECRET || 'mahi_auto_blog_cron_secret_2026';

function isAuthorized(request: Request): boolean {
  const { searchParams } = new URL(request.url);
  const secretQuery = searchParams.get('secret');
  const authHeader = request.headers.get('authorization');

  // Allow if secret query matches or Bearer token matches
  if (secretQuery === CRON_SECRET) return true;
  if (authHeader === `Bearer ${CRON_SECRET}`) return true;

  // Allow in development mode
  if (process.env.NODE_ENV === 'development') return true;

  return false;
}

export async function GET(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized. Please provide valid ?secret= token.' },
        { status: 401 }
      );
    }

    const result = await generateAutonomousBlog();

    if (result.success && result.blog) {
      return NextResponse.json({
        success: true,
        message: 'New autonomous SEO blog generated & published successfully via Gemini API!',
        timestamp: new Date().toISOString(),
        blog: {
          title: result.blog.title,
          slug: result.blog.slug,
          category: result.blog.category,
          url: `https://mahitechnocrafts.in/blog/${result.blog.slug}`
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Gemini generation failed'
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Cron blog generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
