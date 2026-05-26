import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // In a real production app, use bcrypt and load credentials from process.env
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'mahi123';

    if (username === adminUser && password === adminPass) {
      // Create response and set cookie
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      );

      // Set session cookie (valid for 1 day)
      response.cookies.set('admin_session', 'mahi_authenticated_session_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/'
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Add a logout route or support GET for checking session status
export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const isAuthenticated = cookie.includes('admin_session=mahi_authenticated_session_token');

  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  
  // Clear session cookie
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
