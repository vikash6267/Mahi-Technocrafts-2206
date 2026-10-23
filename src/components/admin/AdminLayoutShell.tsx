'use client';

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
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
  Wallet,
  BarChart3,
  KeyRound,
  ShieldAlert,
  Lock,
  ArrowRight,
  History,
  FileSignature,
  Bot
} from 'lucide-react';
import { ReminderModal } from './ReminderModal';
import { ClientReminder } from '@/lib/db';
import { AdminRole, AdminSessionUser } from '@/lib/admin-auth';

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

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Live stats for badges
  const [reminderStats, setReminderStats] = useState<{
    overdue: number;
    dueToday: number;
    upcoming7Days: number;
    overdueList?: ClientReminder[];
    dueTodayList?: ClientReminder[];
  }>({ overdue: 0, dueToday: 0, upcoming7Days: 0 });

  // 1. Check Session & Load Current Admin Profile
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/login');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            if (isMounted) {
              setCurrentUser(data.user);
              setIsAuthLoading(false);
            }
            return;
          }
        }
        // Redirect to login if unauthenticated
        router.push('/admin');
      } catch {
        router.push('/admin');
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // 2. Fetch Reminder Stats
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

  // Full Master Navigation Items Definition
  const allNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
      badge: null
    },
    {
      id: 'analytics',
      label: 'Live Traffic & Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 size={18} />,
      badge: null
    },
    {
      id: 'reminders',
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
      id: 'finance',
      label: 'Finance & Accounts',
      href: '/admin/finance',
      icon: <Wallet size={18} />,
      badge: null
    },
    {
      id: 'proposals',
      label: 'Client Proposals',
      href: '/admin/proposals',
      icon: <FileSignature size={18} />,
      badge: (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
          PDF
        </span>
      )
    },
    {
      id: 'blogs',
      label: 'Blogs & AI Writer',
      href: '/admin/blogs',
      icon: <FileText size={18} />,
      badge: null
    },
    {
      id: 'contacts',
      label: 'Contact Leads',
      href: '/admin/contacts',
      icon: <Inbox size={18} />,
      badge: null
    },
    {
      id: 'chats',
      label: 'AI Chatbot Logs',
      href: '/admin/chats',
      icon: <Bot size={18} />,
      badge: (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
          Live AI
        </span>
      )
    },
    {
      id: 'portal',
      label: 'Portal & Tickets',
      href: '/admin/portal',
      icon: <ShieldCheck size={18} />,
      badge: null
    },
    {
      id: 'projects',
      label: 'Portfolio Showcase',
      href: '/admin/projects',
      icon: <Briefcase size={18} />,
      badge: null
    },
    {
      id: 'services',
      label: 'Services & Pricing',
      href: '/admin/services',
      icon: <Sparkles size={18} />,
      badge: null
    },
    {
      id: 'reviews',
      label: 'Client Reviews',
      href: '/admin/reviews',
      icon: <Star size={18} />,
      badge: null
    },
    {
      id: 'careers',
      label: 'Careers / Jobs',
      href: '/admin/careers',
      icon: <Users size={18} />,
      badge: null
    },
    {
      id: 'audit-logs',
      label: 'Audit & Activity Logs',
      href: '/admin/audit-logs',
      icon: <History size={18} />,
      badge: null
    },
    {
      id: 'settings',
      label: 'Site Content & Settings',
      href: '/admin/settings',
      icon: <Settings size={18} />,
      badge: null
    },
    {
      id: 'users',
      label: 'Admin & Subadmins',
      href: '/admin/users',
      icon: <KeyRound size={18} />,
      badge: (
        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          RBAC
        </span>
      )
    }
  ];

  // Dynamic Navigation Items Filtered by User Permissions & Role
  const navItems = useMemo(() => {
    if (!currentUser) return allNavItems;
    // Superadmin has access to everything
    if (currentUser.role === 'superadmin') return allNavItems;

    // Subadmins only see items they have permission for
    const allowed = new Set(currentUser.permissions || []);
    return allNavItems.filter((item) => allowed.has(item.id));
  }, [currentUser]);

  // Check whether current user is permitted to view the current pathname
  const currentRoutePermitted = useMemo(() => {
    if (!currentUser) return true; // Still loading
    if (currentUser.role === 'superadmin') return true;

    // Check which module corresponds to current pathname
    const activeItem = allNavItems.find(
      (item) => pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
    );

    if (!activeItem) return true; // Default allowed (e.g. general pages)

    return (currentUser.permissions || []).includes(activeItem.id);
  }, [currentUser, pathname]);

  const totalAlerts = (reminderStats.overdue || 0) + (reminderStats.dueToday || 0);

  // Role Badge Styling Helper
  const getRoleBadge = (role?: AdminRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
            Admin
          </span>
        );
      case 'subadmin':
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Sub Admin
          </span>
        );
    }
  };

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
          {getRoleBadge(currentUser?.role)}
        </div>

        {/* Navigation Links (Filtered by Permission) */}
        <nav className="p-3.5 space-y-1 overflow-y-auto flex-1 text-xs font-semibold">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Allowed Modules</span>
            <span className="text-[9px] text-slate-400">
              {currentUser?.role === 'superadmin' ? 'All (12)' : `${navItems.length} active`}
            </span>
          </div>

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
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
                  <span
                    className={`${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400'
                    } transition-colors`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </Link>
            );
          })}
        </nav>

        {/* Quick Add Reminder CTA in Sidebar (if user has reminders permission or superadmin) */}
        {(currentUser?.role === 'superadmin' || currentUser?.permissions.includes('reminders')) && (
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Plus size={14} className="text-sky-600 dark:text-sky-400" />
              <span>+ Add Client Reminder</span>
            </button>
          </div>
        )}

        {/* Bottom User Profile & Sign Out */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0 ${
                currentUser?.role === 'superadmin'
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-500/20'
                  : currentUser?.role === 'admin'
                  ? 'bg-gradient-to-tr from-sky-600 to-blue-600'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
              }`}
            >
              {(currentUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight truncate">
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                {currentUser?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                @{currentUser?.username || 'admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors shrink-0 cursor-pointer"
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
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#070918] h-full flex flex-col z-10 shadow-2xl">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Image
                src="/images/logo.webp"
                alt="Mahi Technocrafts"
                width={130}
                height={45}
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
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
                    pathname === item.href
                      ? 'bg-sky-600 text-white font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              <div className="flex items-center justify-between mb-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {currentUser?.name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-400">@{currentUser?.username || 'admin'}</p>
                </div>
                {getRoleBadge(currentUser?.role)}
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Main Content Area */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#070918]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-display font-black text-slate-900 dark:text-white leading-tight">
                {title || 'Mahi Control Center'}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Action: New Reminder (Only if permitted) */}
            {(currentUser?.role === 'superadmin' || currentUser?.permissions.includes('reminders')) && (
              <button
                onClick={() => setIsReminderModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>New Reminder</span>
              </button>
            )}

            {/* Reminder Alert Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                className="relative w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Expiry & Due Alerts"
              >
                <Bell size={16} />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                    {totalAlerts}
                  </span>
                )}
              </button>

              {bellDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-sky-600" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        Due Reminders & Expiry
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-900">
                      {totalAlerts} Action Required
                    </span>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto text-xs">
                    {totalAlerts === 0 ? (
                      <div className="py-6 text-center text-slate-400">
                        <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1" />
                        <p className="font-bold">All clear!</p>
                        <p className="text-[11px]">No client domains, hosting or payments due today.</p>
                      </div>
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
                                Immediate client follow-up needed for pending dues.
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

        {/* Child Page Content OR Access Denied Protection */}
        <main className="p-4 sm:p-8 flex-1 max-w-[1500px] w-full mx-auto">
          {currentRoutePermitted ? (
            children
          ) : (
            <div className="py-16 px-4 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-600/10">
                <Lock size={28} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                Access Restricted
              </span>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white mt-1">
                Subadmin Permission Required
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                You do not have authorization to access this administrative module. Please contact the
                Super-Admin to update your assigned sidebar permissions.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href={navItems[0]?.href || '/admin/dashboard'}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-sky-600/20"
                >
                  <span>Return to Allowed Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Add Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSaved={() => {
          fetchStats();
          if (pathname === '/admin/reminders' || pathname === '/admin/dashboard') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
