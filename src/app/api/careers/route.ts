import { NextResponse } from 'next/server';
import { getCareers, saveCareer, deleteCareerById, CareerItem } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin authentication cookie
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

export async function GET() {
  try {
    const careers = await getCareers();
    // Sort careers by postedAt descending
    const sortedCareers = [...careers].sort((a, b) => {
      const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
      const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
      return dateB - dateA;
    });
    return NextResponse.json(sortedCareers);
  } catch (error) {
    console.error('Careers GET API error', error);
    return NextResponse.json({ error: 'Failed to retrieve careers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    const { id, title, type, location, experience, description } = payload;

    // Validation
    if (!title || !type || !location || !experience || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newCareer: CareerItem = {
      id: id || `job-${Math.random().toString(36).substring(2, 9)}`,
      title,
      type,
      location,
      experience,
      description,
      postedAt: new Date().toISOString()
    };

    const success = await saveCareer(newCareer);

    if (success) {
      return NextResponse.json({ success: true, message: 'Career opportunity saved successfully!' });
    } else {
      return NextResponse.json({ error: 'Failed to save career opportunity' }, { status: 500 });
    }
  } catch (error) {
    console.error('Careers POST API error', error);
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to delete a career posting' }, { status: 400 });
    }

    const success = await deleteCareerById(id);

    if (success) {
      return NextResponse.json({ success: true, message: 'Career posting deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete career posting or career not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('Careers DELETE API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
