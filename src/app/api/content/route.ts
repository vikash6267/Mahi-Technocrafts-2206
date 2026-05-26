import { NextResponse } from 'next/server';
import { getSiteData, updateSiteData } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin authentication cookie
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

export async function GET() {
  try {
    const data = await getSiteData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Content GET API error', error);
    return NextResponse.json({ error: 'Failed to retrieve site data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    
    // Simple verification of layout
    if (!payload.hero || !payload.about || !payload.founder || !payload.services) {
      return NextResponse.json({ error: 'Invalid content format' }, { status: 400 });
    }

    const success = await updateSiteData(payload);
    if (success) {
      return NextResponse.json({ success: true, message: 'Content updated successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to write site content' }, { status: 500 });
    }
  } catch (error) {
    console.error('Content POST API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
