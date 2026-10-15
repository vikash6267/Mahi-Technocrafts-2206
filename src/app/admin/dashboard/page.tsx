'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Plus,
  AlertTriangle,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Send,
  Loader2,
  Inbox,
  FileText,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  TrendingUp,
  Check,
  Wallet
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ReminderModal } from '@/components/admin/ReminderModal';
import { SendEmailReminderModal } from '@/components/admin/SendEmailReminderModal';
import { ClientReminder, ContactSubmission, FinanceStats } from '@/lib/db';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Legacy tab redirect support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') || params.get('section');
    if (tab) {
      const redirects: Record<string, string> = {
        portal: '/admin/portal',
        blogs: '/admin/blogs',
        contacts: '/admin/contacts',
        services: '/admin/services',
        projects: '/admin/projects',
        reviews: '/admin/reviews',
        careers: '/admin/careers',
        content: '/admin/settings',
        reminders: '/admin/reminders',
        finance: '/admin/finance'
      };
      if (redirects[tab]) {
        router.replace(redirects[tab]);
      }
    }
  }, [router]);

  const [isLoading, setIsLoading] = useState(true);
  const [reminders, setReminders] = useState<ClientReminder[]>([]);
  const [reminderStats, setReminderStats] = useState({
    total: 0,
    activePending: 0,
    overdue: 0,
    dueToday: 0,
    upcoming7Days: 0,
    completed: 0,
    urgentCount: 0
  });

  const [financeStats, setFinanceStats] = useState<FinanceStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [blogCount, setBlogCount] = useState(0);
  const [ticketStats, setTicketStats] = useState({ total: 0, open: 0 });

  // Modals
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [emailingReminder, setEmailingReminder] = useState<ClientReminder | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [remindersRes, contactsRes, blogsRes, portalRes, financeRes] = await Promise.all([
        fetch('/api/admin/reminders'),
        fetch('/api/contact'),
        fetch('/api/blog'),
        fetch('/api/admin/portal'),
        fetch('/api/admin/finance')
      ]);

      if (remindersRes.ok) {
        const data = await remindersRes.json();
        setReminders(data.reminders || []);
        if (data.stats) setReminderStats(data.stats);
      }

      if (financeRes.ok) {
        const fData = await financeRes.json();
        if (fData.stats) setFinanceStats(fData.stats);
      }

      if (contactsRes.ok) {
        const cData = await contactsRes.json();
        setRecentContacts((cData.contacts || []).slice(0, 5));
      }

      if (blogsRes.ok) {
        const bData = await blogsRes.json();
        if (Array.isArray(bData)) setBlogCount(bData.length);
      }

      if (portalRes.ok) {
        const pData = await portalRes.json();
        const issues = pData.issues || [];
        setTicketStats({
          total: issues.length,
          open: issues.filter((i: any) => i.status === 'open' || i.status === 'in-progress').length
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  // Overdue and Due Today Reminders
  const overdueReminders = reminders.filter(
    (r) => (r.status === 'pending' || r.status === 'notified') && r.dueDate < todayStr
  );
  const dueTodayReminders = reminders.filter(
    (r) => (r.status === 'pending' || r.status === 'notified') && r.dueDate === todayStr
  );
  const upcomingReminders = reminders.filter(
    (r) => (r.status === 'pending' || r.status === 'notified') && r.dueDate > todayStr && r.dueDate <= sevenDaysLater
  );

  const toggleReminderStatus = async (reminder: ClientReminder) => {
    const nextStatus = reminder.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch('/api/admin/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reminder.id, action: 'toggle_status', status: nextStatus })
      });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryInfo = (cat: string) => {
    const map: Record<string, { label: string; icon: string }> = {
      domain: { label: 'Domain Expiry', icon: '🌐' },
      hosting: { label: 'Cloud Hosting', icon: '🖥️' },
      payment: { label: 'Payment Due', icon: '💰' },
      amc: { label: 'AMC Maintenance', icon: '🛠️' },
      ssl: { label: 'SSL Certificate', icon: '🔒' },
      milestone: { label: 'Milestone Due', icon: '🎯' },
      general: { label: 'Reminder', icon: '📌' }
    };
    return map[cat] || map.general;
  };

  return (
    <AdminLayoutShell
      title="Management Command Center"
      subtitle="Overview of client reminders, project expiries, recent leads, and operational tickets"
    >
      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* KPI Summary Cards */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Client Reminders Card */}
          <Link
            href="/admin/reminders"
            className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">
                  Client Reminders
                </span>
                <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {reminderStats.activePending}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-3">
              {reminderStats.overdue > 0 ? (
                <span className="font-bold text-rose-600 flex items-center gap-1">
                  <AlertTriangle size={12} /> {reminderStats.overdue} Overdue
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold">All up to date</span>
              )}
              <span className="text-slate-400 group-hover:text-sky-600 font-bold">&rarr;</span>
            </div>
          </Link>

          {/* 2. Contact Leads Card */}
          <Link
            href="/admin/contacts"
            className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">
                  Contact Leads
                </span>
                <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                  <Inbox size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {recentContacts.length}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-3">
              <span className="text-slate-500">Website Inquiries</span>
              <span className="text-slate-400 group-hover:text-blue-600 font-bold">&rarr;</span>
            </div>
          </Link>

          {/* 3. Blogs Published Card */}
          <Link
            href="/admin/blogs"
            className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-purple-600 transition-colors">
                  SEO Articles
                </span>
                <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <FileText size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {blogCount}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-3">
              <span className="text-purple-600 font-semibold flex items-center gap-1">
                <Sparkles size={12} /> AI Engine Active
              </span>
              <span className="text-slate-400 group-hover:text-purple-600 font-bold">&rarr;</span>
            </div>
          </Link>

          {/* 4. Support Tickets Card */}
          <Link
            href="/admin/portal"
            className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                  Support Tickets
                </span>
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {ticketStats.open}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs mt-3">
              <span className="text-slate-500">{ticketStats.total} total tickets</span>
              <span className="text-slate-400 group-hover:text-emerald-600 font-bold">&rarr;</span>
            </div>
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* Company Financial & Cash Flow Snapshot */}
        {/* ========================================================================= */}
        {financeStats && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <Wallet size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                      Company Finance & Cash Flow
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold uppercase tracking-wider">
                      Live P&L
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time revenue, operational expenses, server bills & pending client dues
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 py-2 lg:py-0 border-y lg:border-y-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Net Balance / Profit
                  </span>
                  <span className={`text-lg font-black ${
                    financeStats.netProfit >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500'
                  }`}>
                    ₹{new Intl.NumberFormat('en-IN').format(financeStats.netProfit)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Total Income
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ₹{new Intl.NumberFormat('en-IN').format(financeStats.totalIncome)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Total Expenses
                  </span>
                  <span className="text-lg font-black text-rose-500">
                    ₹{new Intl.NumberFormat('en-IN').format(financeStats.totalExpense)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Pending Receivables
                  </span>
                  <span className="text-lg font-black text-amber-500">
                    ₹{new Intl.NumberFormat('en-IN').format(financeStats.pendingIncome)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/finance"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <Wallet size={14} />
                  <span>Open Full Finance</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Core Reminder Alert & Expiry Desk (User's Key Feature) */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600">
                  <Clock size={16} />
                </span>
                <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
                  Client Reminders & Expiry Alert Desk
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Domain expiries, hosting renewals, payment collections, and automated reminder emails
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm shadow-sky-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Add Reminder</span>
              </button>

              <Link
                href="/admin/reminders"
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <span>Full Desk</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Overdue Urgent Alert Card if any */}
          {overdueReminders.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                  <AlertTriangle size={16} className="text-rose-600 animate-bounce" />
                  <span>ACTION REQUIRED: {overdueReminders.length} Overdue Reminder{overdueReminders.length > 1 ? 's' : ''}!</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Past Due Date</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {overdueReminders.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-white dark:bg-[#070918] border border-rose-200 dark:border-rose-900/50 shadow-xs flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-xs truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.clientName} {item.company ? `(${item.company})` : ''} &bull; <strong className="text-rose-600">Due: {item.dueDate}</strong>
                      </p>
                      {item.amount && <p className="text-[11px] font-bold text-emerald-600">{item.amount}</p>}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setEmailingReminder(item)}
                        title="Send Reminder Email Now"
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center gap-1"
                      >
                        <Send size={12} />
                        <span>Mail</span>
                      </button>

                      {item.clientPhone && (
                        <a
                          href={`https://wa.me/${item.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${item.clientName}, courtesy reminder from Mahi Technocrafts regarding: ${item.title} (Due: ${item.dueDate}). ${item.amount ? `Amount: ${item.amount}` : ''}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          <MessageCircle size={14} />
                        </a>
                      )}

                      <button
                        onClick={() => toggleReminderStatus(item)}
                        title="Mark Complete"
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-500 text-slate-400 hover:text-emerald-600"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today & Upcoming List */}
          <div className="space-y-3">
            {dueTodayReminders.length === 0 && overdueReminders.length === 0 && upcomingReminders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No pending reminders due this week. Click &quot;+ Add Reminder&quot; to set one!
              </div>
            ) : (
              <div className="space-y-2.5">
                {[...dueTodayReminders, ...upcomingReminders.slice(0, 5)].map((item) => {
                  const cat = getCategoryInfo(item.category);
                  const isToday = item.dueDate === todayStr;

                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isToday
                          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{cat.icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                            {isToday ? (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-white">
                                Due Today
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">Due {item.dueDate}</span>
                            )}
                            {item.amount && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                                {item.amount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            Client: <strong>{item.clientName}</strong> {item.company ? `(${item.company})` : ''} &bull; {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEmailingReminder(item)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Send size={11} />
                          <span>Send Mail</span>
                        </button>

                        <button
                          onClick={() => toggleReminderStatus(item)}
                          title="Mark Complete"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          <Check size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Recent Inquiries & Fast Shortcuts */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries Widget */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox size={16} className="text-sky-600" />
                <span>Recent Website Inquiries</span>
              </h3>
              <Link href="/admin/contacts" className="text-xs font-bold text-sky-600 hover:underline">
                View All &rarr;
              </Link>
            </div>

            {recentContacts.length === 0 ? (
              <p className="text-center text-slate-400 text-xs py-6">No recent inquiries.</p>
            ) : (
              <div className="space-y-3">
                {recentContacts.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                        {c.status === 'unread' && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">{c.subject || c.message}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(c.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Operations Launchpad */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <span>Quick Operations Launchpad</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/reminders"
                className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-100 dark:border-sky-800 text-left transition-all group"
              >
                <Clock size={20} className="text-sky-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Client Reminders</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Expiries & payments</p>
              </Link>

              <Link
                href="/admin/blogs"
                className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-100 dark:border-purple-800 text-left transition-all group"
              >
                <Sparkles size={20} className="text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Gemini AI Writer</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">SEO articles & schemas</p>
              </Link>

              <Link
                href="/admin/portal"
                className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-100 dark:border-emerald-800 text-left transition-all group"
              >
                <ShieldCheck size={20} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Portal & Staff</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Support ticket desk</p>
              </Link>

              <Link
                href="/admin/settings"
                className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-all group"
              >
                <TrendingUp size={20} className="text-slate-600 dark:text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Site Settings</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Hero & Contact info</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Global Add Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSaved={() => fetchDashboardData()}
      />

      {/* Send Email Notice Modal */}
      <SendEmailReminderModal
        isOpen={Boolean(emailingReminder)}
        reminder={emailingReminder}
        onClose={() => setEmailingReminder(null)}
        onSuccess={() => fetchDashboardData()}
      />
    </AdminLayoutShell>
  );
}
