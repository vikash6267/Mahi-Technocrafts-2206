'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  Loader2,
  ShieldAlert,
  MapPin,
  ExternalLink,
  Flame,
  Activity,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState('30days');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async (selectedRange = range) => {
    try {
      const res = await fetch(`/api/admin/analytics?range=${selectedRange}`);
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
    // Auto-refresh every 30 seconds for live visitor updates
    const interval = setInterval(() => {
      fetchStats(range);
    }, 30000);
    return () => clearInterval(interval);
  }, [range]);

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    setIsLoading(true);
    fetchStats(newRange);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchStats(range);
  };

  // Format seconds to readable minutes & seconds
  const formatDuration = (seconds = 0) => {
    if (!seconds || seconds <= 0) return '0s';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Format relative time (e.g. 5m ago)
  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <AdminLayoutShell
      title="Live Traffic & Visitor Analytics"
      subtitle="Real-time visitor logs, dwell time, top pages, device distribution, and geographic intelligence"
    >
      <div className="space-y-6">
        {/* Top Control Bar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Visitor Intelligence
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Admin & Superadmin traffic is strictly excluded from all counts
              </p>
            </div>
          </div>

          {/* Date Range Selector & Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7days', label: 'Last 7 Days' },
              { id: '30days', label: 'Last 30 Days' },
              { id: 'alltime', label: 'All Time' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleRangeChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  range === tab.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center transition-colors cursor-pointer ml-1"
              title="Refresh Analytics"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-sky-500' : ''} />
            </button>
          </div>
        </div>

        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Live Active Visitors (Now) */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-[#070918] dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live On Site Now
                </span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Radio size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white">
                {stats?.liveVisitors ?? 0}
              </h2>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-3">
              Active users in the last 90 seconds
            </p>
          </div>

          {/* 2. Total Pageviews */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 dark:from-sky-950/30 dark:via-[#070918] dark:to-blue-950/20 border border-sky-200 dark:border-sky-800/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-800 dark:text-sky-400">
                  Total Page Views
                </span>
                <div className="w-9 h-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Eye size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white">
                {stats?.totalPageviews?.toLocaleString('en-IN') ?? 0}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
              Across all public pages & services
            </p>
          </div>

          {/* 3. Unique Visitors */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-[#070918] dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-800 dark:text-indigo-400">
                  Unique Visitors
                </span>
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white">
                {stats?.uniqueVisitors?.toLocaleString('en-IN') ?? 0}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
              Distinct devices & browsers tracked
            </p>
          </div>

          {/* 4. Avg Dwell Time */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 dark:from-amber-950/30 dark:via-[#070918] dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-400">
                  Avg Time on Page
                </span>
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white">
                {formatDuration(stats?.avgTimeOnSite)}
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3">
              Heartbeat active dwell duration
            </p>
          </div>
        </div>

        {/* Analytics Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols wide): Top Pages & Live Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Visited Pages */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Top Visited Pages
                  </h3>
                  <p className="text-xs text-slate-400">
                    Highest traffic landing URLs and average reading duration
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  Top 10 Routes
                </span>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 size={24} className="animate-spin mx-auto text-sky-500 mb-2" />
                  <p className="text-xs">Computing pageview metrics...</p>
                </div>
              ) : stats?.topPages?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No page views recorded in this date range.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Page Route</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3 text-right">Views</th>
                        <th className="py-2.5 px-3 text-right">Avg Dwell</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {stats?.topPages?.map((page: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="py-3 px-3">
                            <Link
                              href={page.path}
                              target="_blank"
                              className="font-mono text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                            >
                              <span>{page.path}</span>
                              <ExternalLink size={10} />
                            </Link>
                          </td>
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs truncate">
                            {page.title || 'Untitled'}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {page.views?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-500">
                            {formatDuration(page.avgDuration)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Live Visitors Stream */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                    Live Visitor Stream
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-xs font-bold text-slate-400">Recent 25 visits</span>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-slate-400">
                  <Loader2 size={24} className="animate-spin mx-auto text-sky-500 mb-2" />
                  <p className="text-xs">Loading live traffic feed...</p>
                </div>
              ) : stats?.recentLogs?.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No visitor logs available yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-3">Location</th>
                        <th className="py-2.5 px-3">Page Visited</th>
                        <th className="py-2.5 px-3">Device / Browser</th>
                        <th className="py-2.5 px-3">Referrer</th>
                        <th className="py-2.5 px-3 text-right">Time Ago</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      {stats?.recentLogs?.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-rose-500 shrink-0" />
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {log.city !== 'Other / Unspecified' ? log.city : log.state}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 pl-4">{log.country}</p>
                          </td>
                          <td className="py-3 px-3 font-mono text-sky-600 dark:text-sky-400 max-w-xs truncate">
                            {log.path}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400 capitalize">
                            <span>{log.deviceType}</span> • <span>{log.browser}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 max-w-[120px] truncate">
                            {log.referrer || 'Direct'}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                            {formatTimeAgo(log.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 Col): Geography & Devices */}
          <div className="space-y-6">
            {/* Top Indian States */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin size={16} className="text-sky-500" />
                  <span>Top Indian States</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Visits</span>
              </div>

              {stats?.topStates?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No state data yet.</p>
              ) : (
                <div className="space-y-3">
                  {stats?.topStates?.map((st: any, idx: number) => {
                    const totalVisits = stats?.totalPageviews || 1;
                    const pct = Math.round((st.count / totalVisits) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{st.state}</span>
                          <span className="text-slate-500">{st.count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Devices & Browsers */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Monitor size={16} className="text-indigo-500" />
                <span>Device Distribution</span>
              </h3>

              <div className="space-y-3">
                {stats?.devices?.map((dev: any, idx: number) => {
                  const total = stats?.totalPageviews || 1;
                  const pct = Math.round((dev.count / total) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold capitalize">
                        <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                          {dev.device === 'mobile' ? (
                            <Smartphone size={13} />
                          ) : dev.device === 'tablet' ? (
                            <Tablet size={13} />
                          ) : (
                            <Monitor size={13} />
                          )}
                          <span>{dev.device}</span>
                        </span>
                        <span className="text-slate-500">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Top Browsers */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Top Browsers
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {stats?.browsers?.map((b: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold"
                    >
                      {b.browser}: {b.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutShell>
  );
}
