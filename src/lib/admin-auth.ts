import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';

export type AdminRole = 'superadmin' | 'admin' | 'subadmin';

export interface AdminPermissionDef {
  id: string;
  label: string;
  description: string;
  href: string;
}

export const ADMIN_PERMISSIONS: AdminPermissionDef[] = [
  {
    id: 'dashboard',
    label: 'Dashboard Overview',
    description: 'Access main control center, recent activity and live metrics',
    href: '/admin/dashboard'
  },
  {
    id: 'reminders',
    label: 'Client Reminders',
    description: 'Manage domain, hosting, payment and AMC expiry alerts',
    href: '/admin/reminders'
  },
  {
    id: 'finance',
    label: 'Finance & Accounts',
    description: 'Manage business revenue, operational expenses, invoices and cash flow',
    href: '/admin/finance'
  },
  {
    id: 'blogs',
    label: 'Blogs & AI Writer',
    description: 'Publish, edit blogs and use autonomous AI blog generator',
    href: '/admin/blogs'
  },
  {
    id: 'contacts',
    label: 'Contact Inquiries',
    description: 'View customer contact form inquiries and leads',
    href: '/admin/contacts'
  },
  {
    id: 'portal',
    label: 'Portal & Support',
    description: 'Manage staff/client accounts and client support issues',
    href: '/admin/portal'
  },
  {
    id: 'projects',
    label: 'Portfolio Showcase',
    description: 'Create and update portfolio case studies and project showcase',
    href: '/admin/projects'
  },
  {
    id: 'services',
    label: 'Services & Pricing',
    description: 'Manage offered services catalog and package pricing',
    href: '/admin/services'
  },
  {
    id: 'reviews',
    label: 'Client Testimonials',
    description: 'Review and approve customer ratings and testimonials',
    href: '/admin/reviews'
  },
  {
    id: 'careers',
    label: 'Careers & Hiring',
    description: 'Post job openings and review candidate applications',
    href: '/admin/careers'
  },
  {
    id: 'settings',
    label: 'Site Content & SEO',
    description: 'Manage site settings, company details and SEO metadata',
    href: '/admin/settings'
  },
  {
    id: 'users',
    label: 'Admin & Subadmins',
    description: 'Manage subadmin accounts, assign roles and control sidebar access',
    href: '/admin/users'
  }
];

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  passwordHash?: string;
  role: AdminRole;
  permissions: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminSessionUser {
  id: string;
  username: string;
  name: string;
  role: AdminRole;
  permissions: string[];
}

const adminSecret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASS || 'mahi123_admin_secret_key_2026';

// Password hashing & verification
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
};

export const verifyPassword = (password: string, stored?: string): boolean => {
  if (!stored) return false;
  try {
    const [salt, hash] = stored.split(':');
    if (!salt || !hash) return false;
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
};

/**
 * Ensures the default superadmin user exists in MongoDB.
 * Username: superadmin
 * Password: Mahi@2025
 */
export async function ensureSuperAdmin(): Promise<AdminUser | null> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<AdminUser>('admin_users');
    const existing = await collection.findOne({ username: 'superadmin' });
    const passwordHash = hashPassword('Mahi@2025');
    const allPermissions = ADMIN_PERMISSIONS.map(p => p.id);

    if (!existing) {
      const now = new Date().toISOString();
      const superadmin: AdminUser = {
        id: 'user_superadmin_master',
        username: 'superadmin',
        name: 'Super Admin',
        email: 'vikasmaheshwari6267@gmail.com',
        passwordHash,
        role: 'superadmin',
        permissions: allPermissions,
        active: true,
        createdAt: now,
        updatedAt: now
      };
      await collection.insertOne(superadmin as any);
      console.log('[Admin Auth] Default Super-Admin seeded successfully.');
      return superadmin;
    }

    // If existing password doesn't match Mahi@2025, sync it
    if (!verifyPassword('Mahi@2025', existing.passwordHash) || existing.active === false || existing.role !== 'superadmin') {
      await collection.updateOne(
        { username: 'superadmin' },
        {
          $set: {
            passwordHash,
            role: 'superadmin',
            active: true,
            permissions: allPermissions,
            updatedAt: new Date().toISOString()
          }
        }
      );
      existing.passwordHash = passwordHash;
      existing.role = 'superadmin';
      existing.active = true;
      existing.permissions = allPermissions;
      console.log('[Admin Auth] Super-Admin credentials synchronized to Mahi@2025.');
    }

    return existing;
  } catch (error) {
    console.error('[Admin Auth] ensureSuperAdmin error:', error);
    return null;
  }
}

/**
 * Creates a signed admin session token carrying user data.
 */
export function makeAdminSession(user?: Partial<AdminSessionUser>): string {
  const key = adminSecret();
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const data = {
    id: user?.id || 'user_superadmin_master',
    username: user?.username || 'superadmin',
    name: user?.name || 'Super Admin',
    role: user?.role || 'superadmin',
    permissions: user?.role === 'superadmin' ? ADMIN_PERMISSIONS.map(p => p.id) : (user?.permissions || ['dashboard']),
    exp
  };

  const body = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = createHmac('sha256', key).update(body).digest('base64url');
  return `admin_v2.${body}.${signature}`;
}

/**
 * Reads and verifies an admin session token.
 * Compatible with both admin_v2.* (JWT style) and legacy admin.<exp>.<sig> tokens.
 */
export function readAdminSession(token?: string): AdminSessionUser | null {
  if (!token) return null;
  const key = adminSecret();

  // Check admin_v2 format
  if (token.startsWith('admin_v2.')) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [, body, signature] = parts;
    const expectedSig = createHmac('sha256', key).update(body).digest('base64url');
    if (signature !== expectedSig) return null;

    try {
      const data = JSON.parse(Buffer.from(body, 'base64url').toString());
      if (!data || !data.exp || data.exp <= Date.now()) return null;
      return {
        id: data.id,
        username: data.username,
        name: data.name,
        role: data.role || 'subadmin',
        permissions: data.role === 'superadmin' ? ADMIN_PERMISSIONS.map(p => p.id) : (data.permissions || [])
      };
    } catch {
      return null;
    }
  }

  // Legacy format support: admin.<exp>.<sig>
  const [prefix, expires, signature] = token.split('.');
  const value = `${prefix}.${expires}`;
  if (prefix !== 'admin' || !expires || !signature || Number(expires) <= Date.now()) return null;
  const expected = createHmac('sha256', key).update(value).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signature, 'base64url');
  } catch {
    return false as any;
  }
  if (expected.length === provided.length && timingSafeEqual(expected, provided)) {
    return {
      id: 'superadmin',
      username: 'superadmin',
      name: 'Super Admin',
      role: 'superadmin',
      permissions: ADMIN_PERMISSIONS.map(p => p.id)
    };
  }

  return null;
}

export function isValidAdminSession(token?: string): boolean {
  return readAdminSession(token) !== null;
}

export async function getAdminSessionUser(): Promise<AdminSessionUser | null> {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value;
  return readAdminSession(token);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const user = await getAdminSessionUser();
  return user !== null;
}

/**
 * Checks if current logged in admin user has a specific permission.
 * Superadmin always returns true.
 */
export async function hasAdminPermission(permissionId: string): Promise<boolean> {
  const user = await getAdminSessionUser();
  if (!user) return false;
  if (user.role === 'superadmin') return true;
  return user.permissions.includes(permissionId);
}

// ==========================================
// Database Operations for Admin & Subadmins
// ==========================================

export async function getAdminUsers(): Promise<Omit<AdminUser, 'passwordHash'>[]> {
  try {
    await ensureSuperAdmin();
    const { db } = await connectToDatabase();
    const users = await db.collection<AdminUser>('admin_users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return users.map(({ _id, passwordHash, ...rest }: any) => rest);
  } catch (error) {
    console.error('getAdminUsers failed:', error);
    return [];
  }
}

export async function getAdminUserById(id: string): Promise<AdminUser | null> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection<AdminUser>('admin_users').findOne({ id });
    if (!user) return null;
    const { _id, ...clean } = user as any;
    return clean as AdminUser;
  } catch (error) {
    console.error('getAdminUserById failed:', error);
    return null;
  }
}

export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
  try {
    const { db } = await connectToDatabase();
    const cleanUsername = username.trim().toLowerCase();
    const user = await db.collection<AdminUser>('admin_users').findOne({ username: cleanUsername });
    if (!user) return null;
    const { _id, ...clean } = user as any;
    return clean as AdminUser;
  } catch (error) {
    console.error('getAdminUserByUsername failed:', error);
    return null;
  }
}

export async function saveAdminUser(user: AdminUser): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('admin_users');
    const now = new Date().toISOString();

    const { _id, createdAt, ...updateFields } = user as any;
    const doc: any = {
      ...updateFields,
      username: user.username.trim().toLowerCase(),
      updatedAt: now
    };

    await collection.updateOne(
      { id: user.id },
      {
        $set: doc,
        $setOnInsert: { createdAt: createdAt || user.createdAt || now }
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('saveAdminUser failed:', error);
    return false;
  }
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const user = await getAdminUserById(id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.role === 'superadmin' || user.username === 'superadmin') {
      return { success: false, message: 'Super-Admin account cannot be deleted.' };
    }

    const { db } = await connectToDatabase();
    const res = await db.collection('admin_users').deleteOne({ id });
    return { success: res.deletedCount > 0 };
  } catch (error) {
    console.error('deleteAdminUser failed:', error);
    return { success: false, message: 'Database error deleting user' };
  }
}
