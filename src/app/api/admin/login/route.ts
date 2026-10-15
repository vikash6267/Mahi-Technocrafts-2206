import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ensureSuperAdmin,
  getAdminUserByUsername,
  verifyPassword,
  makeAdminSession,
  getAdminSessionUser,
  saveAdminUser,
  ADMIN_PERMISSIONS
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Ensure superadmin is seeded in MongoDB
    await ensureSuperAdmin();

    // 1. Check dynamic database users in MongoDB
    const dbUser = await getAdminUserByUsername(cleanUsername);

    if (dbUser) {
      if (dbUser.active === false) {
        return NextResponse.json(
          { success: false, error: 'Your account has been deactivated. Please contact Super Admin.' },
          { status: 403 }
        );
      }

      const isPasswordValid = verifyPassword(cleanPassword, dbUser.passwordHash);

      // Special check for superadmin if password is Mahi@2025
      const isSuperMaster = cleanUsername === 'superadmin' && cleanPassword === 'Mahi@2025';

      if (isPasswordValid || isSuperMaster) {
        // Update lastLoginAt in DB
        dbUser.lastLoginAt = new Date().toISOString();
        await saveAdminUser(dbUser);

        const sessionUser = {
          id: dbUser.id,
          username: dbUser.username,
          name: dbUser.name,
          role: dbUser.role,
          permissions: dbUser.role === 'superadmin' ? ADMIN_PERMISSIONS.map(p => p.id) : (dbUser.permissions || [])
        };

        const response = NextResponse.json({
          success: true,
          message: `Welcome back, ${dbUser.name}!`,
          user: sessionUser
        });

        // Set secure session cookie (valid for 7 days)
        response.cookies.set('admin_session', makeAdminSession(sessionUser), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        });

        return response;
      }
    }

    // 2. Direct Super-Admin credential fallback (username: superadmin, password: Mahi@2025)
    if (cleanUsername === 'superadmin' && cleanPassword === 'Mahi@2025') {
      const seeded = await ensureSuperAdmin();
      const sessionUser = {
        id: seeded?.id || 'user_superadmin_master',
        username: 'superadmin',
        name: seeded?.name || 'Super Admin',
        role: 'superadmin' as const,
        permissions: ADMIN_PERMISSIONS.map(p => p.id)
      };

      const response = NextResponse.json({
        success: true,
        message: 'Welcome back, Super Admin!',
        user: sessionUser
      });

      response.cookies.set('admin_session', makeAdminSession(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });

      return response;
    }

    // 3. Fallback for legacy environment credentials
    const envAdminUser = (process.env.ADMIN_USER || 'admin').toLowerCase();
    const envAdminPass = process.env.ADMIN_PASS || 'mahi123';

    if (cleanUsername === envAdminUser && cleanPassword === envAdminPass) {
      const sessionUser = {
        id: 'user_env_admin',
        username: envAdminUser,
        name: 'System Admin',
        role: 'superadmin' as const,
        permissions: ADMIN_PERMISSIONS.map(p => p.id)
      };

      const response = NextResponse.json({
        success: true,
        message: 'Login successful via administrative fallback',
        user: sessionUser
      });

      response.cookies.set('admin_session', makeAdminSession(sessionUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[Admin Login API] error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const sessionUser = await getAdminSessionUser();

  if (sessionUser) {
    return NextResponse.json({
      authenticated: true,
      user: sessionUser
    });
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
