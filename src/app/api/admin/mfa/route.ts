import { NextResponse } from 'next/server';
import {
  getAdminSessionUser,
  getAdminUserById,
  saveAdminUser
} from '@/lib/admin-auth';
import { generateTotpSecret, generateTotpUri, verifyTotp } from '@/lib/totp';
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

export async function GET() {
  try {
    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAdminUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.mfaEnabled && user.mfaSecret) {
      return NextResponse.json({
        enabled: true,
        message: 'Google Authenticator MFA is currently enabled.'
      });
    }

    // Generate new secret for setup
    const secret = generateTotpSecret();
    const uri = generateTotpUri({
      accountName: `${user.username} (${user.email || 'Mahi Admin'})`,
      issuer: 'Mahi Technocrafts',
      secret
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`;

    return NextResponse.json({
      enabled: false,
      secret,
      uri,
      qrUrl
    });
  } catch (error) {
    console.error('Error generating MFA:', error);
    return NextResponse.json({ error: 'Failed to generate MFA setup' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const { secret, code } = await request.json();
    if (!secret || !code) {
      return NextResponse.json({ error: 'Secret and 6-digit code are required' }, { status: 400 });
    }

    const isValid = verifyTotp({ token: String(code).trim(), secret: String(secret).trim() });
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid 6-digit code. Please try again.' }, { status: 400 });
    }

    const user = await getAdminUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.mfaSecret = secret.trim();
    user.mfaEnabled = true;
    user.updatedAt = new Date().toISOString();
    await saveAdminUser(user);

    // Audit log
    await createAuditLog({
      action: 'MFA_ENABLED',
      category: 'SECURITY',
      actor: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      status: 'SUCCESS',
      details: `Google Authenticator (RFC 6238 TOTP) was activated for account @${user.username}.`,
      ip,
      userAgent
    });

    // Email alert
    const targetEmail = user.email || 'vikasmaheshwari6267@gmail.com';
    const geo = await resolveGeo(ip);
    const ua = parseUserAgent(userAgent);

    sendSecurityAlertEmail({
      to: targetEmail,
      name: user.name,
      actionTitle: 'Google Authenticator 2FA Activated',
      details: `Two-Factor Authentication via Google Authenticator has been successfully turned ON for your account @${user.username}. Future logins will require this TOTP code.`,
      ip,
      location: `${geo.city}, ${geo.state}, ${geo.country}`,
      device: `${ua.browser} on ${ua.os} (${ua.deviceType})`
    }).catch((err) => console.error('[MFA Alert Email Error]:', err));

    return NextResponse.json({
      success: true,
      message: 'Google Authenticator 2FA enabled successfully!'
    });
  } catch (error) {
    console.error('Error enabling MFA:', error);
    return NextResponse.json({ error: 'Failed to enable MFA' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const user = await getAdminUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.mfaEnabled = false;
    delete user.mfaSecret;
    user.updatedAt = new Date().toISOString();
    await saveAdminUser(user);

    // Audit log
    await createAuditLog({
      action: 'MFA_DISABLED',
      category: 'SECURITY',
      actor: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      },
      status: 'WARNING',
      details: `Google Authenticator MFA was disabled for account @${user.username}. Logins will now revert to Email OTP.`,
      ip,
      userAgent
    });

    // Email alert
    const targetEmail = user.email || 'vikasmaheshwari6267@gmail.com';
    const geo = await resolveGeo(ip);
    const ua = parseUserAgent(userAgent);

    sendSecurityAlertEmail({
      to: targetEmail,
      name: user.name,
      actionTitle: 'Google Authenticator 2FA Disabled',
      details: `Two-Factor Authentication via Google Authenticator has been turned OFF for account @${user.username}. Login verifications will fall back to Email OTP.`,
      ip,
      location: `${geo.city}, ${geo.state}, ${geo.country}`,
      device: `${ua.browser} on ${ua.os} (${ua.deviceType})`
    }).catch((err) => console.error('[MFA Alert Email Error]:', err));

    return NextResponse.json({
      success: true,
      message: 'Google Authenticator MFA has been disabled. Login will use Email OTP.'
    });
  } catch (error) {
    console.error('Error disabling MFA:', error);
    return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 });
  }
}
