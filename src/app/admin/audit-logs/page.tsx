'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Calendar,
  User,
  KeyRound,
  Lock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: string;
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

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayLogins: 0,
    todayFailedAttempts: 0,
    securityEventsCount: 0
  });

  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const fetchLogs = async (targetPage = page) => {
    setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      params.set('page', targetPage.toString());
      params.set('limit', '25');
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs(1);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone size={13} className="text-sky-500" />;
      case 'tablet':
        return <Tablet size={13} className="text-purple-500" />;
      default:
        return <Monitor size={13} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 size={11} />
            <span>Success</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle size={11} />
            <span>Failed</span>
          </span>
        );
      case 'WARNING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle size={11} />
            <span>Warning</span>
          </span>
        );
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN')) {
      const isFailed = action.includes('FAILED');
      return (
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
            isFailed
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
              : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900'
          }`}
        >
          {action.replace(/_/g, ' ')}
        </span>
      );
    }
    if (action.includes('MFA') || action.includes('PASSWORD')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900">
          {action.replace(/_/g, ' ')}
        </span>
      );
    }
    if (action.includes('USER')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
          {action.replace(/_/g, ' ')}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        {action.replace(/_/g, ' ')}
      </span>
    );
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return {
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      };
    } catch {
      return { date: ts, time: '' };
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Activities' },
    { id: 'AUTH', label: 'Logins & Auth' },
    { id: 'SECURITY', label: 'MFA & Passwords' },
    { id: 'USERS', label: 'Admin Accounts' },
    { id: 'REMINDERS', label: 'Reminders' },
    { id: 'FINANCE', label: 'Finance' },
    { id: 'SETTINGS', label: 'Settings' }
  ];

  return (
    <AdminLayoutShell
      title="Audit & Security Activity Logs"
      subtitle="Complete tamper-evident record of admin sign-ins, IP addresses, geolocations, and system actions"
    >
      <div className="space-y-6">
        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Recorded Events</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {stats.totalEvents.toLocaleString()}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <History size={20} />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Logins Today (IST)</p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.todayLogins}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Failed Login Attempts</p>
              <h3 className={`text-2xl font-black mt-1 ${stats.todayFailedAttempts > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {stats.todayFailedAttempts}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert size={20} />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Events</p>
              <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {stats.securityEventsCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <KeyRound size={20} />
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by actor, IP address, action, or city..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </form>

            {/* Actions: Refresh & Count Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                Showing {logs.length} of {totalCount} logs
              </span>
              <button
                onClick={() => fetchLogs(page)}
                disabled={isRefreshing}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-sky-500' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Administrator / Actor</th>
                  <th className="py-3.5 px-4">Action Event</th>
                  <th className="py-3.5 px-4">Details & Description</th>
                  <th className="py-3.5 px-4">Origin & Location</th>
                  <th className="py-3.5 px-4">Device & OS</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <RefreshCw size={24} className="animate-spin mx-auto text-sky-500 mb-2" />
                      <p className="font-bold">Loading audit logs from MongoDB Atlas...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <ShieldCheck size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="font-bold text-slate-600 dark:text-slate-300">No activity logs found</p>
                      <p className="text-[11px]">Audit events will appear here as administrators interact with the system.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const timeObj = formatTimestamp(log.timestamp);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                        {/* Timestamp */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{timeObj.date}</p>
                          <p className="text-[10px] text-slate-400">{timeObj.time}</p>
                        </td>

                        {/* Actor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-[11px] shrink-0">
                              {(log.actor.name || log.actor.username || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                {log.actor.name || log.actor.username}
                              </p>
                              <p className="text-[10px] text-slate-400">@{log.actor.username}</p>
                            </div>
                          </div>
                        </td>

                        {/* Action Event Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getActionBadge(log.action)}
                        </td>

                        {/* Details */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {log.details}
                          </p>
                        </td>

                        {/* Location & IP */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                            <MapPin size={12} className="text-rose-500 shrink-0" />
                            <span className="font-medium">{log.city || 'Bhopal'}, {log.state || 'MP'}</span>
                          </div>
                          <code className="text-[10px] text-slate-400 block mt-0.5">{log.ip}</code>
                        </td>

                        {/* Device & Browser */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {getDeviceIcon(log.deviceType)}
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                              {log.browser} on {log.os}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {getStatusBadge(log.status)}
                        </td>

                        {/* Inspect Modal Trigger */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-sky-600 transition-colors cursor-pointer"
                            title="Inspect metadata"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Inspection Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-sky-500" />
                  <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                    Audit Record Inspector
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Event ID</span>
                  <code className="text-sky-600 dark:text-sky-400 font-mono text-[11px]">{selectedLog.id}</code>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Timestamp</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedLog.timestamp}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Actor Identity</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLog.actor.name} (@{selectedLog.actor.username}, {selectedLog.actor.role})
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Origin Location</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedLog.city}, {selectedLog.state}, {selectedLog.country} ({selectedLog.ip})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Event Summary</span>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedLog.details}
                </p>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Metadata JSON Payload</span>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-40 border border-slate-800">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
