import { NextResponse } from 'next/server';
import { updateVisitDuration } from '@/lib/visitor-analytics';

export async function POST(request: Request) {
  try {
    let body: any;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text || '{}');
    }

    const { visitId, activeSeconds } = body;
    if (!visitId || typeof activeSeconds !== 'number') {
      return NextResponse.json({ error: 'visitId and numeric activeSeconds are required' }, { status: 400 });
    }

    const updated = await updateVisitDuration(visitId, activeSeconds);
    return NextResponse.json({ success: updated });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 200 }); // Graceful for beacon
  }
}
