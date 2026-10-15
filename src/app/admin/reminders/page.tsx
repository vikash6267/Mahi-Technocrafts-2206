'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Plus,
  Search,
  AlertTriangle,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Building2,
  User,
  CheckCircle2,
  Trash2,
  Edit,
  Send,
  Loader2,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ReminderModal } from '@/components/admin/ReminderModal';
import { SendEmailReminderModal } from '@/components/admin/SendEmailReminderModal';
import { ClientReminder, ReminderCategory } from '@/lib/db';

export default function AdminRemindersPage() {
  const [reminders, setReminders] = useState<ClientReminder[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    activePending: 0,
    overdue: 0,
    dueToday: 0,
    upcoming7Days: 0,
    completed: 0,
    urgentCount: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'overdue' | 'dueToday' | 'upcoming' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ClientReminder | null>(null);
  const [emailingReminder, setEmailingReminder] = useState<ClientReminder | null>(null);

  const fetchReminders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reminders');
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const sevenDaysLater = useMemo(() => new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), []);

  // Filtered Reminders
  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      // Tab filter
      if (activeFilter === 'overdue') {
        if (item.status === 'completed' || item.status === 'cancelled' || item.dueDate >= todayStr) {
          return false;
        }
      } else if (activeFilter === 'dueToday') {
        if (item.status === 'completed' || item.status === 'cancelled' || item.dueDate !== todayStr) {
          return false;
        }
      } else if (activeFilter === 'upcoming') {
        if (item.status === 'completed' || item.status === 'cancelled' || item.dueDate <= todayStr || item.dueDate > sevenDaysLater) {
          return false;
        }
      } else if (activeFilter === 'completed') {
        if (item.status !== 'completed') {
          return false;
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textToSearch = `${item.clientName} ${item.company || ''} ${item.clientEmail || ''} ${item.title} ${item.description || ''} ${item.amount || ''} ${item.notes || ''}`.toLowerCase();
        if (!textToSearch.includes(q)) return false;
      }

      return true;
    });
  }, [reminders, activeFilter, categoryFilter, searchQuery, todayStr, sevenDaysLater]);

  // Toggle Completed / Pending
  const toggleReminderStatus = async (reminder: ClientReminder) => {
    const nextStatus = reminder.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch('/api/admin/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reminder.id,
          action: 'toggle_status',
          status: nextStatus
        })
      });
      if (res.ok) {
        fetchReminders();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Delete Reminder
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete reminder: "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/reminders?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchReminders();
      }
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  const getCategoryInfo = (cat: string) => {
    const map: Record<string, { label: string; icon: string; badgeClass: string }> = {
      domain: { label: 'Domain Expiry', icon: '🌐', badgeClass: 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
      hosting: { label: 'Cloud Hosting', icon: '🖥️', badgeClass: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
      payment: { label: 'Payment Due', icon: '💰', badgeClass: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
      amc: { label: 'AMC Maintenance', icon: '🛠️', badgeClass: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      ssl: { label: 'SSL Security', icon: '🔒', badgeClass: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
      milestone: { label: 'Milestone Due', icon: '🎯', badgeClass: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
      general: { label: 'General Alert', icon: '📌', badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' }
    };
    return map[cat] || map.general;
  };

  const getDueDaysText = (dueDate: string, status: string) => {
    if (status === 'completed') {
      return { text: 'Completed', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' };
    }
    const diff = Math.ceil((new Date(dueDate).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) {
      return { text: `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''}!`, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 font-black animate-pulse' };
    }
    if (diff === 0) {
      return { text: 'Due Today!', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 font-black' };
    }
    if (diff === 1) {
      return { text: 'Due Tomorrow', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' };
    }
    return { text: `In ${diff} days`, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' };
  };

  return (
    <AdminLayoutShell
      title="Client Reminders & Expiry Tracking"
      subtitle="Track domain renewals, hosting expiries, payment milestones, and automated email alerts"
    >
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* Top Summary Metrics Cards */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Overdue Card */}
          <div
            onClick={() => setActiveFilter('overdue')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeFilter === 'overdue'
                ? 'ring-2 ring-rose-500 bg-rose-50/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                : 'bg-white dark:bg-[#070918] border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Overdue
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.overdue}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {stats.overdue > 0 ? 'Requires immediate client follow-up' : 'All accounts up to date'}
            </p>
          </div>

          {/* Due Today Card */}
          <div
            onClick={() => setActiveFilter('dueToday')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeFilter === 'dueToday'
                ? 'ring-2 ring-amber-500 bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-[#070918] border-slate-200 dark:border-slate-800 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Due Today
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Calendar size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.dueToday}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Scheduled for today&apos;s action
            </p>
          </div>

          {/* Upcoming Card */}
          <div
            onClick={() => setActiveFilter('upcoming')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeFilter === 'upcoming'
                ? 'ring-2 ring-sky-500 bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800'
                : 'bg-white dark:bg-[#070918] border-slate-200 dark:border-slate-800 hover:border-sky-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Next 7 Days
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.upcoming7Days}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              Coming up within a week
            </p>
          </div>

          {/* Total Active / Completed Card */}
          <div
            onClick={() => setActiveFilter('all')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'ring-2 ring-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800'
                : 'bg-white dark:bg-[#070918] border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Total Active
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.activePending}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {stats.completed} marked completed
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Controls, Filters & Search Bar */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client name, company, email, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            {/* Actions: Refresh & "+ New Reminder" */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchReminders}
                title="Refresh Reminders"
                className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 flex items-center justify-center transition-colors"
              >
                <RefreshCw size={15} className={isLoading ? 'animate-spin text-sky-500' : ''} />
              </button>

              <button
                onClick={() => {
                  setEditingReminder(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>+ New Client Reminder</span>
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Active', count: stats.activePending },
              { id: 'overdue', label: 'Overdue', count: stats.overdue, badgeColor: 'bg-rose-500 text-white' },
              { id: 'dueToday', label: 'Due Today', count: stats.dueToday, badgeColor: 'bg-amber-500 text-white' },
              { id: 'upcoming', label: 'Next 7 Days', count: stats.upcoming7Days },
              { id: 'completed', label: 'Completed', count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${tab.badgeColor || 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'domain', label: '🌐 Domain' },
              { id: 'hosting', label: '🖥️ Hosting' },
              { id: 'payment', label: '💰 Payment' },
              { id: 'amc', label: '🛠️ AMC' },
              { id: 'ssl', label: '🔒 SSL' },
              { id: 'milestone', label: '🎯 Milestone' },
              { id: 'general', label: '📌 Other' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  categoryFilter === c.id
                    ? 'bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 font-bold'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Reminders List & Cards */}
        {/* ========================================================================= */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Loader2 size={32} className="mx-auto text-sky-500 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading reminders from MongoDB Atlas...</p>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-850 mx-auto flex items-center justify-center text-slate-400">
              <Clock size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                {searchQuery ? 'No matching reminders found' : 'No reminders in this category'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery
                  ? 'Try adjusting your search query or clear the filters.'
                  : 'Add your first client reminder to track domain renewals, hosting expiries, or pending payments.'}
              </p>
            </div>
            <button
              onClick={() => {
                setEditingReminder(null);
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus size={15} />
              <span>Create New Reminder</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => {
              const cat = getCategoryInfo(reminder.category);
              const dueInfo = getDueDaysText(reminder.dueDate, reminder.status);
              const isCompleted = reminder.status === 'completed';

              return (
                <div
                  key={reminder.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#070918] border transition-all duration-200 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-slate-200 dark:border-slate-800 opacity-60'
                      : reminder.dueDate < todayStr
                      ? 'border-rose-300 dark:border-rose-900/60 shadow-sm shadow-rose-500/5'
                      : reminder.dueDate === todayStr
                      ? 'border-amber-300 dark:border-amber-900/60 shadow-sm shadow-amber-500/5'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Left Column: Info & Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Category Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${cat.badgeClass}`}>
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </span>

                      {/* Due Countdown Badge */}
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-lg font-bold ${dueInfo.color}`}>
                        {dueInfo.text}
                      </span>

                      {/* Priority Badge */}
                      {reminder.priority === 'urgent' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-black bg-rose-500 text-white uppercase">
                          Urgent
                        </span>
                      )}
                      {reminder.priority === 'high' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-lg font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          High
                        </span>
                      )}

                      {/* Amount Badge */}
                      {reminder.amount && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg font-black bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                          {reminder.amount}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-sm font-bold text-slate-900 dark:text-white ${isCompleted ? 'line-through' : ''}`}>
                      {reminder.title}
                    </h3>

                    {/* Description */}
                    {reminder.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {reminder.description}
                      </p>
                    )}

                    {/* Client & Contact Metadata */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <User size={13} className="text-slate-400" />
                        {reminder.clientName}
                        {reminder.company && <span className="font-normal text-slate-500">({reminder.company})</span>}
                      </span>

                      {reminder.clientEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" />
                          <a href={`mailto:${reminder.clientEmail}`} className="hover:text-sky-600 underline">
                            {reminder.clientEmail}
                          </a>
                        </span>
                      )}

                      {reminder.clientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-slate-400" />
                          <a href={`tel:${reminder.clientPhone}`} className="hover:text-sky-600">
                            {reminder.clientPhone}
                          </a>
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={12} />
                        Due: <strong className="text-slate-700 dark:text-slate-300">{reminder.dueDate}</strong>
                      </span>

                      {reminder.lastNotifiedAt && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                          Last email sent: {new Date(reminder.lastNotifiedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Internal Notes if present */}
                    {reminder.notes && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 inline-block">
                        <strong>Internal Note:</strong> {reminder.notes}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    {/* Send Email Now Button */}
                    <button
                      onClick={() => setEmailingReminder(reminder)}
                      title="Send Immediate Email Notice"
                      className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send size={13} />
                      <span className="hidden sm:inline">Send Mail</span>
                    </button>

                    {/* WhatsApp Action Button if phone available */}
                    {reminder.clientPhone && (
                      <a
                        href={`https://wa.me/${reminder.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hi ${reminder.clientName}, courtesy reminder from Mahi Technocrafts regarding: ${reminder.title} (Due: ${reminder.dueDate}). ${reminder.amount ? `Amount: ${reminder.amount}` : ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chat on WhatsApp"
                        className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <MessageCircle size={13} />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    {/* Mark Completed Toggle */}
                    <button
                      onClick={() => toggleReminderStatus(reminder)}
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isCompleted
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 text-slate-400'
                      }`}
                    >
                      <Check size={16} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        setEditingReminder(reminder);
                        setIsCreateModalOpen(true);
                      }}
                      title="Edit Reminder"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:text-sky-600 text-slate-400 transition-all cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(reminder.id, reminder.title)}
                      title="Delete Reminder"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 hover:text-rose-600 text-slate-400 transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Reminder Modal */}
      <ReminderModal
        isOpen={isCreateModalOpen}
        reminderToEdit={editingReminder}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingReminder(null);
        }}
        onSaved={() => {
          fetchReminders();
        }}
      />

      {/* Send Email Notice Modal */}
      <SendEmailReminderModal
        isOpen={Boolean(emailingReminder)}
        reminder={emailingReminder}
        onClose={() => setEmailingReminder(null)}
        onSuccess={() => {
          fetchReminders();
        }}
      />
    </AdminLayoutShell>
  );
}
