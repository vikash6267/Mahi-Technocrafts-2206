import { NextResponse } from 'next/server';
import { getPortalDb, makeSession, verifyPassword, type PortalUser } from '@/lib/portal';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string') return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    const db = await getPortalDb();
    const user = await db.collection<PortalUser>('portal_users').findOne({ email: email.trim().toLowerCase(), active: true });
    if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    const response = NextResponse.json({ success: true, role: user.role });
    response.cookies.set('portal_session', makeSession(user), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
    return response;
  } catch { return NextResponse.json({ error: 'Login is temporarily unavailable.' }, { status: 503 }); }
}

export async function DELETE() { const response = NextResponse.json({ success: true }); response.cookies.set('portal_session', '', { httpOnly: true, expires: new Date(0), path: '/' }); return response; }
