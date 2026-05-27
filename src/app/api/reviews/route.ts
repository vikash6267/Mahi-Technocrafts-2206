import { NextResponse } from 'next/server';
import { getReviews, getApprovedReviews, saveReview, updateReviewStatus, deleteReviewById, ReviewItem } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to check admin authentication cookie
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdminQuery = searchParams.get('admin') === 'true';

    if (isAdminQuery) {
      const isAuth = await checkAuth();
      if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const reviews = await getReviews();
      // Sort reviews by submittedAt descending
      const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      return NextResponse.json(sortedReviews);
    } else {
      const reviews = await getApprovedReviews();
      const sortedApprovedReviews = [...reviews].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      return NextResponse.json(sortedApprovedReviews);
    }
  } catch (error) {
    console.error('Reviews GET API error', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, role, company, text, rating, email, avatarUrl } = payload;

    // Validation
    if (!name || !role || !company || !text || !rating) {
      return NextResponse.json({ error: 'Name, role, company, text, and rating are required' }, { status: 400 });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }

    const isAuth = await checkAuth();

    const newReview: ReviewItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      role,
      company,
      text,
      rating: numRating,
      email: email || '',
      avatarUrl: avatarUrl || '',
      status: isAuth ? 'approved' : 'pending', // Admins auto-approve, public submissions are pending
      submittedAt: new Date().toISOString()
    };

    const success = await saveReview(newReview);

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: isAuth 
          ? 'Review added successfully!' 
          : 'Thank you! Your review has been submitted for admin approval.' 
      });
    } else {
      return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
  } catch (error) {
    console.error('Reviews POST API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and Status are required' }, { status: 400 });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const success = await updateReviewStatus(id, status);

    if (success) {
      return NextResponse.json({ success: true, message: `Review status updated to ${status}` });
    } else {
      return NextResponse.json({ error: 'Failed to update review status' }, { status: 500 });
    }
  } catch (error) {
    console.error('Reviews PATCH API error', error);
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
      return NextResponse.json({ error: 'ID is required to delete a review' }, { status: 400 });
    }

    const success = await deleteReviewById(id);

    if (success) {
      return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to delete review or review not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('Reviews DELETE API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
