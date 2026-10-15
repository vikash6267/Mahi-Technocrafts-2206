import { connectToDatabase } from '@/lib/db';
import { resolveGeo, parseUserAgent, isPrivateIp } from '@/lib/visitor-analytics';
import { randomUUID } from 'node:crypto';

export type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | '2FA_VERIFICATION_FAILED'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED'
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'REMINDER_CREATED'
  | 'REMINDER_UPDATED'
  | 'REMINDER_DELETED'
  | 'FINANCE_ENTRY_CREATED'
  | 'FINANCE_ENTRY_DELETED'
  | 'BLOG_CREATED'
  | 'BLOG_UPDATED'
  | 'BLOG_DELETED'
  | 'SETTINGS_UPDATED'
  | 'SECURITY_ALERT';

export type AuditCategory =
  | 'AUTH'
  | 'SECURITY'
  | 'USERS'
  | 'REMINDERS'
  | 'FINANCE'
  | 'BLOGS'
  | 'SETTINGS'
  | 'SYSTEM';

export interface AdminAuditLog {
  id: string;
  timestamp: string; // ISO 8601
  action: AuditAction | string;
  category: AuditCategory;
  actor: {
    id?: string;
    username: string;
    name: string;
    role: string;
    email?: string;
  };
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
  metadata?: Record<string, any>;
  ip: string;
  country: string;
  state: string;
  city: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
}

export interface CreateAuditLogParams {
  action: AuditAction | string;
  category: AuditCategory;
  actor: {
    id?: string;
    username: string;
    name?: string;
    role?: string;
    email?: string;
  };
  status?: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
  metadata?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

/**
 * Creates and persists a structured administrative audit log into MongoDB.
 */
export async function createAuditLog(params: CreateAuditLogParams): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<AdminAuditLog>('admin_audit_logs');

    const rawIp = params.ip || '127.0.0.1';
    const cleanIp = isPrivateIp(rawIp) ? '127.0.0.1' : rawIp;

    const geo = await resolveGeo(cleanIp);
    const ua = parseUserAgent(params.userAgent || '');
    const now = new Date().toISOString();

    const auditEntry: AdminAuditLog = {
      id: `audit_${Date.now()}_${randomUUID().slice(0, 8)}`,
      timestamp: now,
      action: params.action,
      category: params.category,
      actor: {
        id: params.actor.id,
        username: params.actor.username || 'unknown',
        name: params.actor.name || params.actor.username || 'System Actor',
        role: params.actor.role || 'subadmin',
        email: params.actor.email
      },
      status: params.status || 'SUCCESS',
      details: params.details,
      metadata: params.metadata,
      ip: cleanIp,
      country: geo.country,
      state: geo.state,
      city: geo.city,
      deviceType: ua.deviceType,
      browser: ua.browser,
      os: ua.os
    };

    await collection.insertOne(auditEntry as any);
    return true;
  } catch (error) {
    console.error('[Audit Logger] Failed to record audit log:', error);
    return false;
  }
}

/**
 * Retrieves paginated audit logs with search, category filtering, and statistics.
 */
export async function getAuditLogs(options: {
  limit?: number;
  page?: number;
  category?: string;
  action?: string;
  username?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<AdminAuditLog>('admin_audit_logs');

    const limit = Math.min(100, Math.max(1, options.limit || 25));
    const page = Math.max(1, options.page || 1);
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (options.category && options.category !== 'ALL') {
      filter.category = options.category;
    }

    if (options.action) {
      filter.action = options.action;
    }

    if (options.username) {
      filter['actor.username'] = options.username.toLowerCase();
    }

    if (options.startDate || options.endDate) {
      filter.timestamp = {};
      if (options.startDate) {
        filter.timestamp.$gte = new Date(options.startDate).toISOString();
      }
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        filter.timestamp.$lte = end.toISOString();
      }
    }

    if (options.search) {
      const regex = new RegExp(options.search, 'i');
      filter.$or = [
        { details: regex },
        { 'actor.username': regex },
        { 'actor.name': regex },
        { 'actor.email': regex },
        { ip: regex },
        { city: regex },
        { action: regex }
      ];
    }

    // Get today cutoff in IST
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [logs, totalCount, todayLogins, failedAttempts, securityCount] = await Promise.all([
      collection
        .find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filter),
      collection.countDocuments({
        action: 'LOGIN_SUCCESS',
        timestamp: { $gte: todayStart.toISOString() }
      }),
      collection.countDocuments({
        action: { $in: ['LOGIN_FAILED', '2FA_VERIFICATION_FAILED'] },
        timestamp: { $gte: todayStart.toISOString() }
      }),
      collection.countDocuments({
        category: 'SECURITY'
      })
    ]);

    return {
      success: true,
      logs: logs.map(({ _id, ...l }: any) => l),
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
      stats: {
        totalEvents: totalCount,
        todayLogins,
        todayFailedAttempts: failedAttempts,
        securityEventsCount: securityCount
      }
    };
  } catch (error) {
    console.error('[Audit Logger] getAuditLogs error:', error);
    return {
      success: false,
      logs: [],
      totalCount: 0,
      page: 1,
      limit: 25,
      totalPages: 1,
      stats: {
        totalEvents: 0,
        todayLogins: 0,
        todayFailedAttempts: 0,
        securityEventsCount: 0
      }
    };
  }
}
