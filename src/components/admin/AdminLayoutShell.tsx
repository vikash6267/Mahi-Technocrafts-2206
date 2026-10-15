'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Clock,
  FileText,
  Inbox,
  ShieldCheck,
  Briefcase,
  Sparkles,
  Star,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
  Bell,
  Menu,
  X,
  AlertTriangle,
  ChevronRight,
  Send,
  CheckCircle2,
  Calendar,
  Wallet
} from 'lucide-react';
import { ReminderModal } from './ReminderModal';
import { ClientReminder } from '@/lib/db';

interface AdminLayoutShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AdminLayoutShell({ children, title, subtitle }: AdminLayoutShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);

  // Live stats for badges
  const [reminderStats, setReminderStats] = useState<{
    overdue: number;
    dueToday: number;
    upcoming7Days: number;
    overdueList?: ClientReminder[];
    dueTodayList?: ClientReminder[];
  }>({ overdue: 0, dueToday: 0, upcoming7Days: 0 });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/reminders');
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setReminderStats(data.stats);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // 1 min refresh
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch {
      // ignore
    }
    router.push('/admin');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
      badge: null
    },
    {
      label: 'Client Reminders',
      href: '/admin/reminders',
      icon: <Clock size={18} />,
      badge: reminderStats.overdue > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white animate-pulse">
          {reminderStats.overdue}
        </span>
      ) : reminderStats.dueToday > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
          {reminderStats.dueToday}
        </span>
      ) : null
    },
    {
      label: 'Finance & Accounts',
      href: '/admin/finance',
      icon: <Wallet size={18} />,
      badge: null
    },
    {
      label: 'Blogs & AI Writer',
      href: '/admin/blogs',
      icon: <FileText size={18} />,
      badge: null
    },
    {
      label: 'Contact Leads',
      href: '/admin/contacts',
      icon: <Inbox size={18} />,
      badge: null
    },
    {
      label: 'Portal & Tickets',
      href: '/admin/portal',
      icon: <ShieldCheck size={18} />,
      badge: null
    },
    {
      label: 'Portfolio Showcase',
      href: '/admin/projects',
      icon: <Briefcase size={18} />,
      badge: null
    },
    {
      label: 'Services & Pricing',
      href: '/admin/services',
      icon: <Sparkles size={18} />,
      badge: null
    },
    {
      label: 'Client Reviews',
      href: '/admin/reviews',
      icon: <Star size={18} />,
      badge: null
    },
    {
      label: 'Careers / Jobs',
      href: '/admin/careers',
      icon: <Users size={18} />,
      badge: null
    },
    {
      label: 'Site Content & SEO',
      href: '/admin/settings',
      icon: <Settings size={18} />,
      badge: null
    }
  ];

  const totalAlerts = (reminderStats.overdue || 0) + (reminderStats.dueToday || 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#040212] text-slate-800 dark:text-slate-200 flex">
      {/* ========================================================================= */}
      {/* Desktop Sidebar */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#070918] border-r border-slate-200 dark:border-slate-800/80 sticky top-0 h-screen z-30 shrink-0">
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <Image
              src="/images/logo.webp"
              alt="Mahi Technocrafts"
              width={140}
              height={50}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            Admin v2
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="p-3.5 space-y-1 overflow-y-auto flex-1 text-xs font-semibold">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Operations & Content
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold shadow-md shadow-sky-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </Link>
            );
          })}
        </nav>

        {/* Quick Add Reminder CTA in Sidebar */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => setIsReminderModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Plus size={14} className="text-sky-600 dark:text-sky-400" />
            <span>+ Add Client Reminder</span>
          </button>
        </div>

        {/* Bottom User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              M
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-800 dark:text-slate-200">Management</p>
              <p className="text-[10px] text-slate-400">admin@mahi</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* Mobile Drawer */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#070918] h-full flex flex-col z-10 shadow-2xl">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Image src="/images/logo.webp" alt="Mahi Technocrafts" width={130} height={45} className="h-8 w-auto object-contain" />
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <X size={18} />
              </button>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto flex-1 text-xs font-semibold">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    pathname === item.href ? 'bg-sky-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Main Content Area */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#070918]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-slate-700 dark:text-slate-300"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Link href="/admin/dashboard" className="hover:text-sky-600 transition-colors">Admin</Link>
                <ChevronRight size={12} />
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {title || pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white leading-tight">
                {title || 'Management Dashboard'}
              </h1>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick "+ Add Reminder" Button */}
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>New Reminder</span>
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  totalAlerts > 0
                    ? 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400'
                }`}
                title="Client Reminder Alerts"
              >
                <Bell size={16} />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Menu */}
              {bellDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs animate-fadeIn"
                  style={{ boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">Reminder Alerts</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold">
                      {totalAlerts} Active
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                    {totalAlerts === 0 ? (
                      <p className="text-center text-slate-400 py-4">No overdue or pending reminders today!</p>
                    ) : (
                      <>
                        {reminderStats.overdue > 0 && (
                          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5">
                            <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-rose-800 dark:text-rose-300">
                                {reminderStats.overdue} Overdue Reminder{reminderStats.overdue > 1 ? 's' : ''}!
                              </p>
                              <p className="text-[11px] text-rose-600 dark:text-rose-400">
                                Payments or renewals past due date require client follow-up.
                              </p>
                            </div>
                          </div>
                        )}

                        {reminderStats.dueToday > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
                            <Calendar size={15} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-amber-800 dark:text-amber-300">
                                {reminderStats.dueToday} Reminder{reminderStats.dueToday > 1 ? 's' : ''} Due Today!
                              </p>
                              <p className="text-[11px] text-amber-600 dark:text-amber-400">
                                Check and send notification emails to client.
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href="/admin/reminders"
                      onClick={() => setBellDropdownOpen(false)}
                      className="block text-center py-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      View All Reminders in Control Desk &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Visit Website Link */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 text-xs font-bold transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="p-4 sm:p-8 flex-1 max-w-[1500px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Add Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSaved={() => {
          fetchStats();
          // If on reminders page, trigger refresh
          if (pathname === '/admin/reminders' || pathname === '/admin/dashboard') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
