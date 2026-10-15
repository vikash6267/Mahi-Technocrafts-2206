import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { recordVisit } from '@/lib/visitor-analytics';

function getIpAddress(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    const ip = getIpAddress(request);
    const ua = request.headers.get('user-agent') || '';

    const path = String(body.path || '/');

    // Reject admin URLs directly
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, skipped: true, reason: 'admin_path_excluded' });
    }

    const visitId = body.visitId || `vst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = body.sessionId || `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const visitorId = body.visitorId || `vtr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const result = await recordVisit({
      visitId,
      sessionId,
      visitorId,
      path,
      pageTitle: String(body.pageTitle || 'Mahi Technocrafts'),
      referrer: body.referrer ? String(body.referrer) : undefined,
      ip,
      ua,
      utmSource: body.utmSource ? String(body.utmSource) : undefined,
      utmMedium: body.utmMedium ? String(body.utmMedium) : undefined,
      utmCampaign: body.utmCampaign ? String(body.utmCampaign) : undefined,
      adminSessionToken
    });

    return NextResponse.json({
      success: true,
      visitId,
      sessionId,
      skipped: result.skipped
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
  }
}
