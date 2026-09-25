import { NextResponse } from 'next/server';
import { sendEmail, sendContactNotification, sendNewBlogNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    const results: Record<string, boolean> = {};

    if (type === 'contact' || type === 'all') {
      const contactSuccess = await sendContactNotification({
        name: 'Test Client (Vikash)',
        email: 'vikasmaheshwari6267@gmail.com',
        phone: '+91 6267144122',
        company: 'Mahi TechnoCrafts Bhopal',
        service: 'Next.js Website & Mobile App Development',
        budget: '₹15,000 – ₹25,000',
        message: 'This is a live test message to verify that contact inquiry emails are working 100% properly from mahitechnocrafts.in.'
      });
      results.contactNotification = contactSuccess;
    }

    if (type === 'blog' || type === 'all') {
      const blogSuccess = await sendNewBlogNotification({
        title: 'Next.js 15 & AI Automation for Local Bhopal Businesses',
        slug: 'nextjs-ai-automation-bhopal-businesses',
        category: 'Web Development',
        excerpt: 'Discover how modern fast websites and WhatsApp AI tools help Bhopal businesses get 3x more customer inquiries.',
        focusKeyword: 'web developer in bhopal',
        suggestedImagePrompt: 'High-end modern professional photograph of a software development team in Bhopal office, MacBook displaying clean code and analytics, cinematic lighting, 8k',
        status: 'draft'
      });
      results.blogNotification = blogSuccess;
    }

    const allSuccessful = Object.values(results).every(Boolean);

    return NextResponse.json({
      success: allSuccessful,
      message: allSuccessful 
        ? '✅ Email test successful! Check your inbox at vikasmaheshwari6267@gmail.com.'
        : '⚠️ Some emails failed to send. Check server logs.',
      details: results,
      recipient: 'vikasmaheshwari6267@gmail.com',
      sender: 'mahitechnocrats@gmail.com'
    });
  } catch (error: any) {
    console.error('Test Email API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Email delivery failed'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
