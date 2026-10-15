import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import {
  getAdminSessionUser,
  getAdminUsers,
  getAdminUserById,
  getAdminUserByUsername,
  saveAdminUser,
  deleteAdminUser,
  hashPassword,
  ADMIN_PERMISSIONS,
  type AdminUser,
  type AdminRole
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

// Helper to check if caller has permission to manage users
async function canManageUsers() {
  const current = await getAdminSessionUser();
  if (!current) return false;
  if (current.role === 'superadmin') return true;
  return current.permissions.includes('users');
}

export async function GET() {
  try {
    const authorized = await canManageUsers();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Access restricted to Super Admin.' }, { status: 403 });
    }

    const users = await getAdminUsers();
    return NextResponse.json({
      success: true,
      users,
      availablePermissions: ADMIN_PERMISSIONS
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authorized = await canManageUsers();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const currentActor = await getAdminSessionUser();
    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const body = await request.json();
    const username = String(body.username || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();
    const role: AdminRole = ['superadmin', 'admin', 'subadmin'].includes(body.role)
      ? body.role
      : 'subadmin';
    const permissions: string[] = Array.isArray(body.permissions) ? body.permissions : ['dashboard'];

    if (!username || username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters long.' }, { status: 400 });
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, dots, and hyphens.' }, { status: 400 });
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // Check if username already exists
    const existing = await getAdminUserByUsername(username);
    if (existing) {
      return NextResponse.json({ error: `Username "${username}" is already taken.` }, { status: 409 });
    }

    const now = new Date().toISOString();
    const newUser: AdminUser = {
      id: `admin_${Date.now()}_${randomUUID().slice(0, 8)}`,
      username,
      name,
      email: email || undefined,
      passwordHash: hashPassword(password),
      role,
      permissions: role === 'superadmin' ? ADMIN_PERMISSIONS.map(p => p.id) : permissions,
      active: true,
      createdAt: now,
      updatedAt: now
    };

    const saved = await saveAdminUser(newUser);
    if (!saved) {
      return NextResponse.json({ error: 'Database save failed.' }, { status: 500 });
    }

    // Audit log
    if (currentActor) {
      await createAuditLog({
        action: 'USER_CREATED',
        category: 'USERS',
        actor: {
          id: currentActor.id,
          username: currentActor.username,
          name: currentActor.name,
          role: currentActor.role
        },
        status: 'SUCCESS',
        details: `Created new admin account "${name}" (@${username}) with role ${role.toUpperCase()} and ${newUser.permissions.length} permissions.`,
        metadata: { targetUserId: newUser.id, role, permissions: newUser.permissions },
        ip,
        userAgent
      });
    }

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({
      success: true,
      message: `${role === 'subadmin' ? 'Sub-Admin' : 'Admin'} "${name}" created successfully.`,
      user: safeUser
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authorized = await canManageUsers();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const currentActor = await getAdminSessionUser();
    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const body = await request.json();
    const id = String(body.id || '').trim();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const existing = await getAdminUserById(id);
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Protection: Prevent demoting or deactivating main superadmin
    if (existing.username === 'superadmin') {
      if (body.active === false) {
        return NextResponse.json({ error: 'The Master Super-Admin account cannot be deactivated.' }, { status: 400 });
      }
      if (body.role && body.role !== 'superadmin') {
        return NextResponse.json({ error: 'The Master Super-Admin account role cannot be changed.' }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    const updated: AdminUser = {
      ...existing,
      name: body.name !== undefined ? String(body.name).trim() : existing.name,
      email: body.email !== undefined ? String(body.email).trim().toLowerCase() : existing.email,
      role: body.role && ['superadmin', 'admin', 'subadmin'].includes(body.role) ? body.role : existing.role,
      active: body.active !== undefined ? Boolean(body.active) : existing.active,
      permissions: existing.role === 'superadmin' || body.role === 'superadmin'
        ? ADMIN_PERMISSIONS.map(p => p.id)
        : (Array.isArray(body.permissions) ? body.permissions : existing.permissions),
      updatedAt: now
    };

    // If new password is provided, re-hash it
    if (body.password && String(body.password).trim().length >= 6) {
      updated.passwordHash = hashPassword(String(body.password).trim());
    }

    const saved = await saveAdminUser(updated);
    if (!saved) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    // Audit log
    if (currentActor) {
      await createAuditLog({
        action: 'USER_UPDATED',
        category: 'USERS',
        actor: {
          id: currentActor.id,
          username: currentActor.username,
          name: currentActor.name,
          role: currentActor.role
        },
        status: 'SUCCESS',
        details: `Updated administrative user account "${updated.name}" (@${updated.username}). Status: ${updated.active ? 'ACTIVE' : 'DEACTIVATED'}, Role: ${updated.role}.`,
        metadata: { targetUserId: updated.id, role: updated.role, active: updated.active },
        ip,
        userAgent
      });
    }

    const { passwordHash: _, ...safeUser } = updated;
    return NextResponse.json({
      success: true,
      message: `User "${updated.name}" updated successfully.`,
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authorized = await canManageUsers();
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    const currentActor = await getAdminSessionUser();
    const ip = getIpAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const existingUser = await getAdminUserById(id);

    const result = await deleteAdminUser(id);
    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Failed to delete user' }, { status: 400 });
    }

    // Audit log
    if (currentActor && existingUser) {
      await createAuditLog({
        action: 'USER_DELETED',
        category: 'USERS',
        actor: {
          id: currentActor.id,
          username: currentActor.username,
          name: currentActor.name,
          role: currentActor.role
        },
        status: 'WARNING',
        details: `Deleted user account "${existingUser.name}" (@${existingUser.username}, ${existingUser.role}).`,
        metadata: { targetUserId: id, username: existingUser.username },
        ip,
        userAgent
      });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
