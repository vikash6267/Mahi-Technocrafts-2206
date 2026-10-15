import { NextResponse } from 'next/server';
import {
  getAdminSessionUser,
  getAdminUserById,
  saveAdminUser
} from '@/lib/admin-auth';
import { generateTotpSecret, generateTotpUri, verifyTotp } from '@/lib/totp';

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

    return NextResponse.json({
      success: true,
      message: 'Google Authenticator 2FA enabled successfully!'
    });
  } catch (error) {
    console.error('Error enabling MFA:', error);
    return NextResponse.json({ error: 'Failed to enable MFA' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const sessionUser = await getAdminSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getAdminUserById(sessionUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.mfaEnabled = false;
    delete user.mfaSecret;
    user.updatedAt = new Date().toISOString();
    await saveAdminUser(user);

    return NextResponse.json({
      success: true,
      message: 'Google Authenticator MFA has been disabled.'
    });
  } catch (error) {
    console.error('Error disabling MFA:', error);
    return NextResponse.json({ error: 'Failed to disable MFA' }, { status: 500 });
  }
}
