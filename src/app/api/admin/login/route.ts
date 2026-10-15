import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ensureSuperAdmin,
  getAdminUserByUsername,
  verifyPassword,
  makeAdminSession,
  getAdminSessionUser,
  saveAdminUser,
  createPendingLogin,
  verifyPendingLogin,
  resendPendingOtp,
  ADMIN_PERMISSIONS
} from '@/lib/admin-auth';

function getIpAddress(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip = getIpAddress(request);

    // ==========================================
    // ACTION: Resend OTP Email
    // ==========================================
    if (body.action === 'resend_otp' || (body.resend && body.tempToken)) {
      const tempToken = String(body.tempToken || '').trim();
      if (!tempToken) {
        return NextResponse.json({ error: 'tempToken is required' }, { status: 400 });
      }
      const res = await resendPendingOtp({ tempToken, ip });
      if (res.success) {
        return NextResponse.json({ success: true, message: res.message });
      } else {
        return NextResponse.json({ error: res.error || 'Failed to resend code' }, { status: 400 });
      }
    }

    // ==========================================
    // ACTION: STEP 2 - Verify OTP / TOTP Code
    // ==========================================
    if (body.tempToken && body.code) {
      const tempToken = String(body.tempToken).trim();
      const code = String(body.code).trim();

      const verification = await verifyPendingLogin({ tempToken, code });
      if (!verification.success || !verification.user) {
        return NextResponse.json(
          { success: false, error: verification.error || 'Invalid or expired verification code' },
          { status: 401 }
        );
      }

      // Successful 2FA verification! Issue 30-Day (1 Month) Sliding Session Cookie
      const sessionUser = verification.user;
      const response = NextResponse.json({
        success: true,
        message: `Welcome back, ${sessionUser.name}!`,
        user: sessionUser
      });

      // 30 Days = 2,592,000 seconds
      const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60;

      response.cookies.set('admin_session', makeAdminSession(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_MONTH_SECONDS,
        path: '/'
      });

      return response;
    }

    // ==========================================
    // ACTION: STEP 1 - Username & Password Check
    // ==========================================
    const username = body.username ? String(body.username).trim().toLowerCase() : '';
    const password = body.password ? String(body.password).trim() : '';

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Ensure superadmin is seeded in MongoDB
    await ensureSuperAdmin();

    // 1. Lookup dynamic user in MongoDB
    let dbUser = await getAdminUserByUsername(username);

    // Fallback sync for master superadmin
    if (username === 'superadmin' && password === 'Mahi@2025') {
      dbUser = await ensureSuperAdmin();
    }

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (dbUser.active === false) {
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated. Please contact Super Admin.' },
        { status: 403 }
      );
    }

    const isPasswordValid = verifyPassword(password, dbUser.passwordHash);
    const isSuperMaster = username === 'superadmin' && password === 'Mahi@2025';

    if (!isPasswordValid && !isSuperMaster) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Credentials are correct! Now trigger STEP 2: 2-Factor Authentication (OTP / TOTP)
    const pendingData = await createPendingLogin({ user: dbUser, ip });

    return NextResponse.json({
      success: true,
      step: '2fa_required',
      tempToken: pendingData.tempToken,
      mfaEnabled: pendingData.mfaEnabled,
      emailMasked: pendingData.emailMasked,
      message: pendingData.mfaEnabled
        ? 'Enter your 6-digit Google Authenticator code or Email OTP'
        : `A 6-digit verification code has been sent to ${pendingData.emailMasked}`
    });
  } catch (error) {
    console.error('[Admin Login API] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// GET: Checks authentication and implements Sliding Window Refresh (extends session for 30 days)
export async function GET() {
  const sessionUser = await getAdminSessionUser();

  if (sessionUser) {
    const response = NextResponse.json({
      authenticated: true,
      user: sessionUser
    });

    // Sliding Window: Refresh cookie for another 30 days on activity
    const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60;
    response.cookies.set('admin_session', makeAdminSession(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ONE_MONTH_SECONDS,
      path: '/'
    });

    return response;
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/'
  });

  return response;
}
