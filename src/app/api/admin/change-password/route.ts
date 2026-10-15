import { NextResponse } from 'next/server';
import {
  getAdminSessionUser,
  getAdminUserById,
  saveAdminUser,
  verifyPassword,
  hashPassword
} from '@/lib/admin-auth';
import { createAuditLog } from '@/lib/audit-logger';
import { sendSecurityAlertEmail } from '@/lib/email';
import { resolveGeo, parseUserAgent } from '@/lib/visitor-analytics';

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
    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const body = await request.json();
    const currentPassword = String(body.currentPassword || '').trim();
    const newPassword = String(body.newPassword || '').trim();
    const confirmPassword = String(body.confirmPassword || '').trim();

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required.' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
    }

    const user = await getAdminUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User record not found.' }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      // Record failed attempt in audit log
      await createAuditLog({
        action: 'PASSWORD_CHANGE',
        category: 'SECURITY',
        actor: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          email: user.email
        },
        status: 'FAILED',
        details: `Password change failed for ${user.username}: incorrect current password entered.`,
        ip,
        userAgent
      });

      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
    }

    // Hash new password and save
    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    await saveAdminUser(user);

    // Record successful password change in audit log
    await createAuditLog({
      action: 'PASSWORD_CHANGE',
      category: 'SECURITY',
      actor: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      status: 'SUCCESS',
      details: `Account password was successfully changed for administrator ${user.username}.`,
      ip,
      userAgent
    });

    // Send Security Alert Email
    const targetEmail = user.email || 'vikasmaheshwari6267@gmail.com';
    const geo = await resolveGeo(ip);
    const ua = parseUserAgent(userAgent);

    sendSecurityAlertEmail({
      to: targetEmail,
      name: user.name,
      actionTitle: 'Password Changed Successfully',
      details: `Your admin account password for ${user.username} was updated successfully.`,
      ip,
      location: `${geo.city}, ${geo.state}, ${geo.country}`,
      device: `${ua.browser} on ${ua.os} (${ua.deviceType})`
    }).catch((err) => console.error('[Security Alert Email Error]:', err));

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully! A security notice has been emailed.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
