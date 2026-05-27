import { NextResponse } from 'next/server';
import { getContacts, saveContact, updateContactStatus, ContactSubmission } from '@/lib/db';
import { cookies } from 'next/headers';
import { sendContactNotification } from '@/lib/email';

// Helper to check admin authentication cookie
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'mahi_authenticated_session_token';
}

export async function GET() {
  try {
    const isAuth = await checkAuth();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contacts = await getContacts();
    // Sort contact submissions by submittedAt descending
    const sortedContacts = [...contacts].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    return NextResponse.json(sortedContacts);
  } catch (error) {
    console.error('Contact GET API error', error);
    return NextResponse.json({ error: 'Failed to retrieve inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { name, email, phone, subject, message } = payload;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const newSubmission: ContactSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Business Inquiry',
      message,
      submittedAt: new Date().toISOString(),
      status: 'unread'
    };

    const success = await saveContact(newSubmission);

    if (success) {
      // Send email notification to admin asynchronously
      sendContactNotification({
        name,
        email,
        phone: phone || '',
        company: '',
        service: subject || 'General Business Inquiry',
        budget: 'Not Specified',
        message
      }).catch(err => console.error('Failed to send contact notification email:', err));

      return NextResponse.json({ success: true, message: 'Your message has been received! We will contact you soon.' });
    } else {
      return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact POST API error', error);
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

    if (!['read', 'unread', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const success = await updateContactStatus(id, status);

    if (success) {
      return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    } else {
      return NextResponse.json({ error: 'Failed to update status or submission not found' }, { status: 500 });
    }
  } catch (error) {
    console.error('Contact PATCH API error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
