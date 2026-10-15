import { NextResponse } from 'next/server';
import { isAdminAuthenticated, hasAdminPermission } from '@/lib/admin-auth';
import { getAnalyticsStats } from '@/lib/visitor-analytics';

export async function GET(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permitted = await hasAdminPermission('analytics');
    if (!permitted) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30days';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const stats = await getAnalyticsStats({ range, startDate, endDate });
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
