import { NextResponse } from 'next/server';
import { getAdminSessionUser, isAdminAuthenticated } from '@/lib/admin-auth';
import { getAuditLogs } from '@/lib/audit-logger';

export async function GET(request: Request) {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const action = searchParams.get('action') || undefined;
    const username = searchParams.get('username') || undefined;
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const result = await getAuditLogs({
      category,
      action,
      username,
      search,
      startDate,
      endDate,
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
