import { NextResponse } from 'next/server';
import { generateAutonomousBlog } from '@/lib/gemini-blog';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const result = await generateAutonomousBlog();

    if (result.success && result.blog) {
      return NextResponse.json({
        success: true,
        message: 'Autonomous SEO blog post generated and published successfully via Gemini API!',
        blog: result.blog
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to generate blog via Gemini API' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Autonomous blog generator error', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
