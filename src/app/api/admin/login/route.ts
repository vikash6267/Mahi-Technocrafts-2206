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
import { createAuditLog } from '@/lib/audit-logger';

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
    const userAgent = request.headers.get('user-agent') || '';

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
        // Log failed 2FA verification attempt
        await createAuditLog({
          action: '2FA_VERIFICATION_FAILED',
          category: 'AUTH',
          actor: { username: 'pending_user', role: 'unknown' },
          status: 'FAILED',
          details: `2-Factor verification code failed: ${verification.error || 'Invalid 6-digit code'}`,
          ip,
          userAgent
        });

        return NextResponse.json(
          { success: false, error: verification.error || 'Invalid or expired verification code' },
          { status: 401 }
        );
      }

      // Successful 2FA verification! Issue 30-Day (1 Month) Sliding Session Cookie
      const sessionUser = verification.user;

      // Log successful login
      await createAuditLog({
        action: 'LOGIN_SUCCESS',
        category: 'AUTH',
        actor: {
          id: sessionUser.id,
          username: sessionUser.username,
          name: sessionUser.name,
          role: sessionUser.role
        },
        status: 'SUCCESS',
        details: `Administrator ${sessionUser.name} (@${sessionUser.username}) successfully authenticated with 2-Factor Verification. Session valid for 30 days.`,
        ip,
        userAgent
      });

      const response = NextResponse.json({
        success: true,
        message: `Welcome back, ${sessionUser.name}!`,
        user: sessionUser
      });

      // 30 Days = 2,592,000 seconds (1 Month sliding session)
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
      // Record failed sign-in attempt
      await createAuditLog({
        action: 'LOGIN_FAILED',
        category: 'AUTH',
        actor: { username, role: 'guest' },
        status: 'FAILED',
        details: `Failed sign-in attempt: username "${username}" not found.`,
        ip,
        userAgent
      });

      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (dbUser.active === false) {
      await createAuditLog({
        action: 'LOGIN_FAILED',
        category: 'AUTH',
        actor: { username, name: dbUser.name, role: dbUser.role },
        status: 'FAILED',
        details: `Blocked sign-in attempt: account for "${username}" is deactivated.`,
        ip,
        userAgent
      });

      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated. Please contact Super Admin.' },
        { status: 403 }
      );
    }

    const isPasswordValid = verifyPassword(password, dbUser.passwordHash);
    const isSuperMaster = username === 'superadmin' && password === 'Mahi@2025';

    if (!isPasswordValid && !isSuperMaster) {
      // Record failed password attempt
      await createAuditLog({
        action: 'LOGIN_FAILED',
        category: 'AUTH',
        actor: { username, name: dbUser.name, role: dbUser.role },
        status: 'FAILED',
        details: `Failed sign-in attempt: incorrect password entered for "${username}".`,
        ip,
        userAgent
      });

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

export async function DELETE(request: Request) {
  const sessionUser = await getAdminSessionUser();

  if (sessionUser) {
    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    await createAuditLog({
      action: 'LOGOUT',
      category: 'AUTH',
      actor: {
        id: sessionUser.id,
        username: sessionUser.username,
        name: sessionUser.name,
        role: sessionUser.role
      },
      status: 'SUCCESS',
      details: `Administrator ${sessionUser.name} (@${sessionUser.username}) signed out of administrative session.`,
      ip,
      userAgent
    });
  }

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
