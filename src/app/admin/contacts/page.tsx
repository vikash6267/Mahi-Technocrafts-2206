'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  Loader2,
  Clock,
  RefreshCw,
  MessageCircle,
  Plus,
  Building2,
  Send
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ReminderModal } from '@/components/admin/ReminderModal';
import { ContactSubmission, ClientReminder } from '@/lib/db';

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Reminder modal state to create a follow-up reminder from inquiry
  const [prefilledReminder, setPrefilledReminder] = useState<Partial<ClientReminder> | null>(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.contacts || []);
        setContacts(list);
      }
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        setContacts(contacts.map((c) => (c.id === id ? { ...c, status: nextStatus as any } : c)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from ${name}?`)) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setContacts(contacts.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateReminderForContact = (contact: ContactSubmission) => {
    const defaultDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
    setPrefilledReminder({
      id: '',
      clientName: contact.name,
      clientEmail: contact.email,
      clientPhone: contact.phone || '',
      company: '',
      title: `Follow up with ${contact.name} (${contact.subject || 'Website Inquiry'})`,
      description: `Inquiry Message: ${contact.message}`,
      category: 'general',
      dueDate: defaultDate,
      priority: 'high',
      status: 'pending',
      notifyClientEmail: false,
      notifyAdminEmail: true,
      createdAt: '',
      updatedAt: ''
    });
    setIsReminderModalOpen(true);
  };

  const unreadCount = useMemo(() => contacts.filter((c) => c.status === 'unread').length, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.name} ${item.email} ${item.phone || ''} ${item.subject || ''} ${item.message || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [contacts, statusFilter, searchQuery]);

  return (
    <AdminLayoutShell
      title="Contact Leads & Inquiries"
      subtitle="View customer messages, respond on WhatsApp/Email, and set client follow-up reminders"
    >
      <div className="space-y-6">
        {/* Top Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Leads</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{contacts.length}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <Inbox size={18} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Unread Messages</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{unreadCount}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Mail size={18} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Processed / Read</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{contacts.length - unreadCount}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'read', label: 'Read' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={fetchContacts}
              title="Refresh"
              className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-sky-600 flex items-center justify-center"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center">
            <Loader2 size={30} className="animate-spin mx-auto text-sky-500" />
            <p className="text-xs font-bold text-slate-400 mt-2">Loading contact inquiries...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Inbox size={32} className="mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No inquiries found</p>
            <p className="text-xs text-slate-400">All client leads and contact form submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredContacts.map((msg) => {
              const isUnread = msg.status === 'unread';
              return (
                <div
                  key={msg.id}
                  className={`p-5 rounded-3xl border transition-all duration-200 ${
                    isUnread
                      ? 'bg-blue-50/20 dark:bg-blue-950/20 border-sky-300 dark:border-sky-800 shadow-sm'
                      : 'bg-white dark:bg-[#070918] border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black text-sm flex items-center justify-center">
                        {msg.name[0] || 'U'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          {msg.name}
                          {isUnread && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-blue-500 text-white">
                              New
                            </span>
                          )}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{msg.email}</span>
                          {msg.phone && <span>&bull; {msg.phone}</span>}
                          <span className="text-slate-400">&bull; {new Date(msg.submittedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {/* Add Reminder CTA */}
                      <button
                        onClick={() => handleCreateReminderForContact(msg)}
                        title="Set Reminder for this lead"
                        className="px-2.5 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1.5 hover:bg-sky-100 transition-colors"
                      >
                        <Plus size={13} />
                        <span>Add Reminder</span>
                      </button>

                      {/* WhatsApp CTA if phone present */}
                      {msg.phone && (
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${msg.name}, thank you for contacting Mahi Technocrafts regarding: ${msg.subject || 'your project'}. How can we assist you?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5"
                        >
                          <MessageCircle size={13} />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      )}

                      {/* Toggle Read */}
                      <button
                        onClick={() => toggleStatus(msg.id, msg.status)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {isUnread ? 'Mark Read' : 'Mark Unread'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(msg.id, msg.name)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="pt-3 text-xs leading-relaxed space-y-1">
                    {msg.subject && (
                      <p className="font-bold text-slate-800 dark:text-slate-200">
                        Subject: {msg.subject}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setPrefilledReminder(null);
        }}
        reminderToEdit={prefilledReminder as any}
        onSaved={() => {
          setIsReminderModalOpen(false);
          setPrefilledReminder(null);
        }}
      />
    </AdminLayoutShell>
  );
}
