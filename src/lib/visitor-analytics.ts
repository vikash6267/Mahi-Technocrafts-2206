import { connectToDatabase } from '@/lib/db';
import { isValidAdminSession } from '@/lib/admin-auth';

export interface VisitLog {
  visitId: string;
  sessionId: string;
  visitorId: string;
  path: string;
  pageTitle: string;
  referrer: string;
  ip: string;
  country: string;
  state: string;
  city: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  durationSeconds: number;
  lastReportedActiveSeconds: number;
  isBot: boolean;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

// Indian 28 States & 8 UTs readable names map
const STATE_NAMES: Record<string, string> = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CT: 'Chhattisgarh',
  CG: 'Chhattisgarh',
  GA: 'Goa',
  GJ: 'Gujarat',
  HR: 'Haryana',
  HP: 'Himachal Pradesh',
  JH: 'Jharkhand',
  KA: 'Karnataka',
  KL: 'Kerala',
  MP: 'Madhya Pradesh',
  MH: 'Maharashtra',
  MN: 'Manipur',
  ML: 'Meghalaya',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OD: 'Odisha',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TN: 'Tamil Nadu',
  TG: 'Telangana',
  TS: 'Telangana',
  TR: 'Tripura',
  UP: 'Uttar Pradesh',
  UT: 'Uttarakhand',
  UK: 'Uttarakhand',
  WB: 'West Bengal',
  AN: 'Andaman & Nicobar',
  CH: 'Chandigarh',
  DH: 'Dadra & Nagar Haveli',
  DD: 'Daman & Diu',
  DL: 'Delhi',
  JK: 'Jammu & Kashmir',
  LA: 'Ladakh',
  LD: 'Lakshadweep',
  PY: 'Puducherry'
};

const geoCache = ((globalThis as any)._geoCache = (globalThis as any)._geoCache || new Map<string, { country: string; state: string; city: string }>());

export function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.replace(/^::ffff:/, '').trim();
  if (clean === '127.0.0.1' || clean === '::1' || clean === 'localhost') return true;
  if (/^10\./.test(clean) || /^192\.168\./.test(clean) || /^127\./.test(clean)) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)) return true;
  return false;
}

/**
 * Resolves Geolocation (Country, State, City) from IP
 * Uses global in-memory cache and 600ms fast timeout to eliminate latency.
 */
export async function resolveGeo(ip: string): Promise<{ country: string; state: string; city: string }> {
  const cleanIp = (ip || '').replace(/^::ffff:/, '').trim();

  if (!cleanIp || isPrivateIp(cleanIp)) {
    return { country: 'India', state: 'Madhya Pradesh', city: 'Bhopal (Local Test)' };
  }

  if (geoCache.has(cleanIp)) {
    return geoCache.get(cleanIp)!;
  }

  let country = 'India';
  let state = 'Madhya Pradesh';
  let city = 'Bhopal';

  try {
    const res = await fetch(`http://ip-api.com/json/${cleanIp}?fields=status,country,region,regionName,city`, {
      signal: AbortSignal.timeout(600)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        country = data.country || 'India';
        state = data.regionName || STATE_NAMES[data.region?.toUpperCase()] || data.region || 'Madhya Pradesh';
        city = data.city || 'Bhopal';
      }
    }
  } catch {
    // Return fast fallback without secondary blocking delay
  }

  const result = { country, state, city };
  if (geoCache.size > 10000) geoCache.clear();
  geoCache.set(cleanIp, result);
  return result;
}

/**
 * Lightweight User-Agent parser without external dependencies
 */
export function parseUserAgent(uaString: string): {
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  isBot: boolean;
} {
  const ua = (uaString || '').toLowerCase();

  // Bot detection
  const botRegex = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebookexternalhit|facebot|ia_archiver|twitterbot|linkedinbot|crawler|spider|robot/i;
  const isBot = botRegex.test(ua);

  // Device detection
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    deviceType = 'mobile';
  }

  // OS detection
  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser detection
  let browser = 'Other';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

  return { deviceType, browser, os, isBot };
}

/**
 * Saves a new Visit Log to MongoDB.
 * Excludes admin & superadmin explicitly.
 */
export async function recordVisit(data: {
  visitId: string;
  sessionId: string;
  visitorId: string;
  path: string;
  pageTitle: string;
  referrer?: string;
  ip: string;
  ua: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  adminSessionToken?: string;
}): Promise<{ success: boolean; skipped?: boolean; reason?: string }> {
  try {
    // 1. Strict Exclude Check: If path is in /admin or user has valid admin session
    if (data.path.startsWith('/admin')) {
      return { success: true, skipped: true, reason: 'admin_path_excluded' };
    }

    if (data.adminSessionToken && isValidAdminSession(data.adminSessionToken)) {
      return { success: true, skipped: true, reason: 'admin_session_excluded' };
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<VisitLog>('visit_logs');

    const uaInfo = parseUserAgent(data.ua);
    const geo = await resolveGeo(data.ip);
    const now = new Date().toISOString();

    const visitDoc: VisitLog = {
      visitId: data.visitId,
      sessionId: data.sessionId,
      visitorId: data.visitorId,
      path: data.path,
      pageTitle: data.pageTitle || 'Mahi Technocrafts',
      referrer: data.referrer && data.referrer !== '' ? data.referrer : 'Direct',
      ip: isPrivateIp(data.ip) ? '127.0.0.1' : data.ip,
      country: geo.country,
      state: geo.state,
      city: geo.city,
      deviceType: uaInfo.deviceType,
      browser: uaInfo.browser,
      os: uaInfo.os,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      durationSeconds: 0,
      lastReportedActiveSeconds: 0,
      isBot: uaInfo.isBot,
      userRole: 'guest',
      createdAt: now,
      updatedAt: now
    };

    await collection.insertOne(visitDoc as any);
    return { success: true };
  } catch (error) {
    console.error('recordVisit failed:', error);
    return { success: false, reason: 'db_error' };
  }
}

/**
 * Updates active dwell time for a specific visit ID
 */
export async function updateVisitDuration(visitId: string, activeSeconds: number): Promise<boolean> {
  try {
    if (!visitId || typeof activeSeconds !== 'number') return false;

    const { db } = await connectToDatabase();
    const collection = db.collection<VisitLog>('visit_logs');

    const visit = await collection.findOne({ visitId });
    if (!visit) return false;

    // Skip admin
    if (visit.path.startsWith('/admin') || visit.userRole === 'admin') {
      return false;
    }

    const currentReported = Math.max(0, Math.floor(activeSeconds));
    const previousReported = visit.lastReportedActiveSeconds || 0;
    const delta = Math.max(0, currentReported - previousReported);

    if (delta > 0) {
      await collection.updateOne(
        { visitId },
        {
          $inc: { durationSeconds: delta },
          $set: {
            lastReportedActiveSeconds: currentReported,
            updatedAt: new Date().toISOString()
          }
        }
      );
    }

    return true;
  } catch (error) {
    console.error('updateVisitDuration failed:', error);
    return false;
  }
}

/**
 * Aggregates comprehensive visitor analytics for the Admin Panel
 */
export async function getAnalyticsStats(options: {
  range?: string;
  startDate?: string;
  endDate?: string;
}): Promise<any> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<VisitLog>('visit_logs');

    const range = options.range || '30days';
    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (range === 'today') {
      start.setHours(0, 0, 0, 0);
    } else if (range === 'yesterday') {
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
    } else if (range === '7days') {
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (range === 'alltime') {
      start = new Date('2024-01-01');
    } else if (range === 'custom' && options.startDate && options.endDate) {
      start = new Date(options.startDate);
      end = new Date(options.endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      // 30 days default
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }

    // Match criteria strictly excluding admins
    const matchFilter: any = {
      createdAt: { $gte: start.toISOString(), $lte: end.toISOString() },
      userRole: { $nin: ['admin', 'superadmin', 'subadmin'] },
      path: { $not: /^\/admin/i },
      isBot: false
    };

    // Live active visitors cutoff (last 90 seconds)
    const liveCutoff = new Date(Date.now() - 90 * 1000).toISOString();

    const [
      totalPageviews,
      uniqueVisitorsAgg,
      liveVisitorsCount,
      dailyTrendAgg,
      topPagesAgg,
      topStatesAgg,
      topCountriesAgg,
      deviceBreakdownAgg,
      browserBreakdownAgg,
      recentLogs
    ] = await Promise.all([
      // Total Pageviews
      collection.countDocuments(matchFilter),

      // Unique Visitors Count
      collection.aggregate([{ $match: matchFilter }, { $group: { _id: '$visitorId' } }, { $count: 'total' }]).toArray(),

      // Live Visitors Active in last 90 seconds
      collection.countDocuments({
        updatedAt: { $gte: liveCutoff },
        path: { $not: /^\/admin/i },
        userRole: { $nin: ['admin', 'superadmin', 'subadmin'] },
        isBot: false
      }),

      // Daily Trend (Visits & Uniques)
      collection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: { $substr: ['$createdAt', 0, 10] },
            visits: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$visitorId' },
            totalDuration: { $sum: '$durationSeconds' }
          }
        },
        {
          $project: {
            date: '$_id',
            visits: 1,
            uniques: { $size: '$uniqueVisitors' },
            avgDuration: {
              $cond: [{ $gt: ['$visits', 0] }, { $round: [{ $divide: ['$totalDuration', '$visits'] }, 0] }, 0]
            }
          }
        },
        { $sort: { date: 1 } }
      ]).toArray(),

      // Top Visited Pages
      collection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$path',
            views: { $sum: 1 },
            title: { $first: '$pageTitle' },
            totalDuration: { $sum: '$durationSeconds' }
          }
        },
        {
          $project: {
            path: '$_id',
            views: 1,
            title: 1,
            avgDuration: {
              $cond: [{ $gt: ['$views', 0] }, { $round: [{ $divide: ['$totalDuration', '$views'] }, 0] }, 0]
            }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]).toArray(),

      // Top Indian States
      collection.aggregate([
        { $match: { ...matchFilter, country: 'India' } },
        {
          $group: {
            _id: '$state',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),

      // Top Countries
      collection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$country',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 8 }
      ]).toArray(),

      // Device Breakdown
      collection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$deviceType',
            count: { $sum: 1 }
          }
        }
      ]).toArray(),

      // Browser Breakdown
      collection.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: '$browser',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]).toArray(),

      // Recent 25 Live Visitor Logs
      collection
        .find(matchFilter)
        .sort({ createdAt: -1 })
        .limit(25)
        .toArray()
    ]);

    const uniqueVisitors = uniqueVisitorsAgg[0]?.total || 0;

    // Calculate Average Dwell Time across all views
    let totalDwellSeconds = 0;
    dailyTrendAgg.forEach((d: any) => {
      totalDwellSeconds += (d.avgDuration || 0) * (d.visits || 0);
    });
    const avgTimeOnSite = totalPageviews > 0 ? Math.round(totalDwellSeconds / totalPageviews) : 0;

    return {
      range,
      totalPageviews,
      uniqueVisitors,
      liveVisitors: liveVisitorsCount,
      avgTimeOnSite,
      dailyTrend: dailyTrendAgg,
      topPages: topPagesAgg,
      topStates: topStatesAgg.map((s: any) => ({ state: s._id, count: s.count })),
      topCountries: topCountriesAgg.map((c: any) => ({ country: c._id, count: c.count })),
      devices: deviceBreakdownAgg.map((d: any) => ({ device: d._id || 'desktop', count: d.count })),
      browsers: browserBreakdownAgg.map((b: any) => ({ browser: b._id || 'Other', count: b.count })),
      recentLogs: recentLogs.map(({ _id, ...r }: any) => r)
    };
  } catch (error) {
    console.error('getAnalyticsStats failed:', error);
    return {
      totalPageviews: 0,
      uniqueVisitors: 0,
      liveVisitors: 0,
      avgTimeOnSite: 0,
      dailyTrend: [],
      topPages: [],
      topStates: [],
      topCountries: [],
      devices: [],
      browsers: [],
      recentLogs: []
    };
  }
}
