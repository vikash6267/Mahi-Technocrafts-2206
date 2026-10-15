'use client';

import React, { useState } from 'react';
import { X, Send, Mail, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { ClientReminder } from '@/lib/db';

interface SendEmailReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ClientReminder | null;
  onSuccess: (updatedReminder: ClientReminder) => void;
}

export function SendEmailReminderModal({
  isOpen,
  onClose,
  reminder,
  onSuccess
}: SendEmailReminderModalProps) {
  const [recipientType] = useState<'admin'>('admin');
  const [customNote, setCustomNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !reminder) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reminder.id,
          action: 'send_email',
          recipientType: 'admin',
          customNote: customNote.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(data.message || 'Reminder alert sent to Admin successfully!');
        if (data.reminder) {
          onSuccess(data.reminder);
        }
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
          setCustomNote('');
        }, 1200);
      } else {
        setError(data.error || 'Failed to send email to Admin');
      }
    } catch (err) {
      console.error('Error sending reminder email:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.25), 0 0 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-sky-50 dark:from-slate-900 dark:via-[#070918] dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Send size={18} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Admin Alert Dispatch
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Send Reminder Email to Admin
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSend} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Reminder Summary Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{reminder.title}</span>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Due: {reminder.dueDate}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
              <span className="flex items-center gap-1">
                <User size={12} /> {reminder.clientName} {reminder.company ? `(${reminder.company})` : ''}
              </span>
              {reminder.clientPhone && (
                <span>• Phone: {reminder.clientPhone}</span>
              )}
            </div>
            {reminder.amount && (
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                Amount: {reminder.amount}
              </div>
            )}
          </div>

          {/* Admin Recipient Notice */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-xs">
                Recipient: Admin Inbox
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                vikasmaheshwari6267@gmail.com (No email will be sent to the client)
              </p>
            </div>
          </div>

          {/* Custom Note input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Personalized Coordinator Note (Included in Email)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please note our team has already started the DNS backup. Kindly confirm if you'd like to proceed with the renewal invoice."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors resize-y"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Dispatch Email Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
