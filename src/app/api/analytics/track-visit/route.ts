import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { recordVisit, isPrivateIp } from '@/lib/visitor-analytics';

function getIpAddress(request: Request, clientIpBody?: string): string {
  // 1. Cloudflare header
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && !isPrivateIp(cfIp)) return cfIp.trim();

  // 2. True-Client-IP (Cloudflare Enterprise / Akamai)
  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp && !isPrivateIp(trueClientIp)) return trueClientIp.trim();

  // 3. X-Real-IP (Nginx standard)
  const realIp = request.headers.get('x-real-ip');
  if (realIp && !isPrivateIp(realIp)) return realIp.trim();

  // 4. X-Forwarded-For (scan comma-separated list for first non-private public IP)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((s) => s.trim());
    for (const cand of ips) {
      if (cand && !isPrivateIp(cand)) return cand;
    }
  }

  // 5. Additional proxy headers
  const xClientIp = request.headers.get('x-client-ip');
  if (xClientIp && !isPrivateIp(xClientIp)) return xClientIp.trim();

  const fastlyIp = request.headers.get('fastly-client-ip');
  if (fastlyIp && !isPrivateIp(fastlyIp)) return fastlyIp.trim();

  const clusterIp = request.headers.get('x-cluster-client-ip');
  if (clusterIp && !isPrivateIp(clusterIp)) return clusterIp.trim();

  // 6. Client browser-detected public IP fallback (sent in POST body from AnalyticsTracker)
  if (clientIpBody && typeof clientIpBody === 'string' && !isPrivateIp(clientIpBody)) {
    return clientIpBody.trim();
  }

  // 7. If everything above is private or empty, return first forwarded header if exists, else '127.0.0.1'
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  if (realIp) return realIp.trim();
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const adminSessionToken = cookieStore.get('admin_session')?.value;

    const ip = getIpAddress(request, body.clientIp);
    const ua = request.headers.get('user-agent') || '';

    const path = String(body.path || '/');

    // Reject admin URLs directly
    if (path.startsWith('/admin')) {
      return NextResponse.json({ success: true, skipped: true, reason: 'admin_path_excluded' });
    }

    const visitId = body.visitId || `vst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionId = body.sessionId || `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const visitorId = body.visitorId || `vtr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Dispatch visit recording asynchronously in background without blocking the client response
    recordVisit({
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
    }).catch((err) => console.error('[Visit Log Async Error]:', err));

    return NextResponse.json({
      success: true,
      visitId,
      sessionId
    });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false, error: 'Tracking failed' }, { status: 500 });
  }
}
