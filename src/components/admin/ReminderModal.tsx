'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Mail, Phone, Building2, User, AlertCircle, Loader2, Send } from 'lucide-react';
import { ClientReminder, ReminderCategory } from '@/lib/db';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (reminder: ClientReminder) => void;
  reminderToEdit?: ClientReminder | null;
}

export function ReminderModal({ isOpen, onClose, onSaved, reminderToEdit }: ReminderModalProps) {
  const isEditing = Boolean(reminderToEdit);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('domain');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [notifyClientEmail, setNotifyClientEmail] = useState(true);
  const [notifyAdminEmail, setNotifyAdminEmail] = useState(true);
  const [sendImmediateEmail, setSendImmediateEmail] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Suggested quick titles based on category
  const quickPresets: Record<ReminderCategory, string[]> = {
    domain: ['Domain Renewal Notice', 'Annual Domain Expiry Check', 'Domain Auto-Renewal Review'],
    hosting: ['Cloud Server & Hosting Renewal', 'Annual VPS Hosting Invoice', 'Web Hosting Expiration'],
    payment: ['Pending Milestone Payment Due', 'Final Project Delivery Balance', 'Monthly Retainer Payment'],
    amc: ['Annual Maintenance Contract (AMC) Renewal', 'Quarterly Website Maintenance Fee'],
    ssl: ['SSL Certificate Expiration & Renewal', 'Security Certificate Check'],
    milestone: ['Sprint Review & Milestone Sign-off', 'Deliverables Review Meeting'],
    general: ['General Client Follow-up', 'Project Check-in Call', 'Important Deliverable Due']
  };

  useEffect(() => {
    if (reminderToEdit) {
      setClientName(reminderToEdit.clientName || '');
      setClientEmail(reminderToEdit.clientEmail || '');
      setClientPhone(reminderToEdit.clientPhone || '');
      setCompany(reminderToEdit.company || '');
      setTitle(reminderToEdit.title || '');
      setDescription(reminderToEdit.description || '');
      setCategory(reminderToEdit.category || 'domain');
      setDueDate(reminderToEdit.dueDate || '');
      setAmount(reminderToEdit.amount || '');
      setPriority(reminderToEdit.priority || 'normal');
      setNotifyClientEmail(reminderToEdit.notifyClientEmail ?? true);
      setNotifyAdminEmail(reminderToEdit.notifyAdminEmail ?? true);
      setNotes(reminderToEdit.notes || '');
      setSendImmediateEmail(false);
      setCustomNote('');
    } else {
      // Default to 7 days from now
      const defaultDate = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setCompany('');
      setTitle('');
      setDescription('');
      setCategory('domain');
      setDueDate(defaultDate);
      setAmount('');
      setPriority('normal');
      setNotifyClientEmail(true);
      setNotifyAdminEmail(true);
      setSendImmediateEmail(false);
      setCustomNote('');
      setNotes('');
    }
    setError('');
  }, [reminderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !title.trim() || !dueDate) {
      setError('Client Name, Title, and Due Date are required fields.');
      return;
    }

    if (notifyClientEmail && !clientEmail.trim()) {
      setError('Please provide Client Email to enable client email notifications.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload: any = {
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim(),
        company: company.trim(),
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate,
        amount: amount.trim(),
        priority,
        notifyClientEmail,
        notifyAdminEmail,
        notes: notes.trim(),
        sendImmediateEmail,
        customNote: customNote.trim()
      };

      if (isEditing && reminderToEdit) {
        payload.id = reminderToEdit.id;
      }

      const res = await fetch('/api/admin/reminders', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onSaved(data.reminder);
        onClose();
      } else {
        setError(data.error || 'Failed to save reminder');
      }
    } catch (err) {
      console.error('Error saving reminder:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.25), 0 0 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-sky-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-[#070918] dark:to-slate-900">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Client & Expiry Operations
            </span>
            <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
              {isEditing ? 'Edit Client Reminder' : 'Create Client Reminder'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Reminder Type / Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'domain', label: 'Domain Expiry', icon: '🌐' },
                { id: 'hosting', label: 'Cloud Hosting', icon: '🖥️' },
                { id: 'payment', label: 'Payment Due', icon: '💰' },
                { id: 'amc', label: 'AMC Maintenance', icon: '🛠️' },
                { id: 'ssl', label: 'SSL Certificate', icon: '🔒' },
                { id: 'milestone', label: 'Milestone Due', icon: '🎯' },
                { id: 'general', label: 'Other Reminder', icon: '📌' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id as ReminderCategory);
                    if (!title) {
                      setTitle(quickPresets[c.id as ReminderCategory][0] || '');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                    category === c.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="text-[11px] leading-tight">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Client Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Client / Person Name *
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Company / Organization
              </label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Sharma Jewellers Bhopal"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Client Email (For Automated Reminders) *
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Client Phone (WhatsApp / Calls)
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Title & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Reminder Title *
              </label>
              <span className="text-[10px] text-slate-400">Click preset:</span>
            </div>
            <input
              type="text"
              required
              placeholder="e.g. Domain Renewal for mybusiness.com"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
            {quickPresets[category] && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickPresets[category].map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setTitle(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Due Date & Amount & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Expiry / Due Date *
              </label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Amount Due / Fee (Optional)
              </label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. ₹15,000 or $250"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="normal">🔵 Normal Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="urgent">🔴 Urgent / Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Description & Specific Instructions
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Domain registered via Hostinger, renew before 25th to avoid DNS disruption. Renewal fee is ₹1,199. Client confirmed they want to keep the .in domain."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors resize-y"
            />
          </div>

          {/* Email Notification Toggles */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Automated Email Reminders
            </span>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyClientEmail}
                  onChange={(e) => setNotifyClientEmail(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Send email reminder to <strong>Client</strong> on due date
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyAdminEmail}
                  onChange={(e) => setNotifyAdminEmail(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Send email alert to <strong>Admin</strong> on due date
                </span>
              </label>
            </div>

            {/* Send immediate email checkbox */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer text-indigo-600 dark:text-indigo-400 font-semibold">
                <input
                  type="checkbox"
                  checked={sendImmediateEmail}
                  onChange={(e) => setSendImmediateEmail(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="flex items-center gap-1.5">
                  <Send size={13} />
                  Also send courtesy email notice immediately right now
                </span>
              </label>
              {sendImmediateEmail && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Optional short message note to include in email..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Internal Private Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Admin Private Notes (Internal Only)
            </label>
            <input
              type="text"
              placeholder="e.g. Client requested invoice in GST name, contacted on WhatsApp on Monday"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Saving Reminder...</span>
              </>
            ) : (
              <span>{isEditing ? 'Save Changes' : 'Create Reminder'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
