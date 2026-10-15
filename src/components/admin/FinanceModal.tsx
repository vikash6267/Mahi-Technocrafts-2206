'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  IndianRupee,
  Building2,
  User,
  AlertCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Hash,
  FileText,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { FinanceRecord, FinanceType } from '@/lib/db';

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (record: FinanceRecord) => void;
  recordToEdit?: FinanceRecord | null;
  defaultType?: FinanceType;
}

export function FinanceModal({
  isOpen,
  onClose,
  onSaved,
  recordToEdit,
  defaultType = 'income'
}: FinanceModalProps) {
  const isEditing = Boolean(recordToEdit);

  const [type, setType] = useState<FinanceType>(defaultType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'completed' | 'pending'>('completed');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [clientName, setClientName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const incomeCategories = [
    { id: 'client_payment', label: 'Project Milestone / Advance' },
    { id: 'retainer', label: 'Monthly Retainer' },
    { id: 'domain_hosting_charge', label: 'Domain & Hosting Charge' },
    { id: 'amc_service', label: 'AMC Maintenance Fee' },
    { id: 'consulting', label: 'Consulting & Advisory' },
    { id: 'other_income', label: 'Other Income / Receipt' }
  ];

  const expenseCategories = [
    { id: 'server_hosting', label: 'Cloud Servers & VPS' },
    { id: 'domain_purchase', label: 'Domain Registration / Renewal' },
    { id: 'software_tools', label: 'SaaS Tools & APIs' },
    { id: 'salaries_freelancers', label: 'Team Salaries & Freelancers' },
    { id: 'marketing_ads', label: 'Google & Meta Ads' },
    { id: 'office_supplies', label: 'Office & Infrastructure' },
    { id: 'legal_tax', label: 'Tax, GST & Legal' },
    { id: 'other_expense', label: 'Other Expense' }
  ];

  const paymentMethods = [
    { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)' },
    { id: 'bank_transfer', label: 'Net Banking (NEFT / RTGS / IMPS)' },
    { id: 'credit_card', label: 'Credit / Debit Card' },
    { id: 'cash', label: 'Cash' },
    { id: 'cheque', label: 'Cheque' },
    { id: 'stripe', label: 'Stripe / International Wire' },
    { id: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (recordToEdit) {
      setType(recordToEdit.type || 'income');
      setTitle(recordToEdit.title || '');
      setAmount(recordToEdit.amount ? String(recordToEdit.amount) : '');
      setCategory(recordToEdit.category || (recordToEdit.type === 'expense' ? 'server_hosting' : 'client_payment'));
      setDate(recordToEdit.date || new Date().toISOString().slice(0, 10));
      setStatus(recordToEdit.status || 'completed');
      setPaymentMethod(recordToEdit.paymentMethod || 'upi');
      setClientName(recordToEdit.clientName || '');
      setVendorName(recordToEdit.vendorName || '');
      setReferenceNumber(recordToEdit.referenceNumber || '');
      setDescription(recordToEdit.description || '');
      setError('');
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setType(defaultType);
      setTitle('');
      setAmount('');
      setCategory(defaultType === 'expense' ? 'server_hosting' : 'client_payment');
      setDate(today);
      setStatus('completed');
      setPaymentMethod('upi');
      setClientName('');
      setVendorName('');
      setReferenceNumber('');
      setDescription('');
      setError('');
    }
  }, [recordToEdit, defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!title.trim()) {
      setError('Please provide a title for this transaction.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount in ₹.');
      return;
    }
    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<FinanceRecord> = {
        id: recordToEdit?.id,
        type,
        title: title.trim(),
        amount: numAmount,
        category: category || (type === 'income' ? 'other_income' : 'other_expense'),
        date,
        status,
        paymentMethod,
        clientName: type === 'income' ? clientName.trim() : undefined,
        vendorName: type === 'expense' ? vendorName.trim() : undefined,
        referenceNumber: referenceNumber.trim() || undefined,
        description: description.trim() || undefined
      };

      const res = await fetch('/api/admin/finance', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save transaction');
      }

      onSaved(data.record);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isIncome = type === 'income';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{
          boxShadow: isIncome
            ? '0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 30px rgba(0, 0, 0, 0.2)'
            : '0 25px 50px -12px rgba(244, 63, 94, 0.25), 0 0 30px rgba(0, 0, 0, 0.2)'
        }}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between transition-colors ${
          isIncome 
            ? 'border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-[#070918] dark:to-teal-950/20' 
            : 'border-rose-100 dark:border-rose-900/40 bg-gradient-to-r from-rose-50 via-white to-orange-50 dark:from-rose-950/40 dark:via-[#070918] dark:to-orange-950/20'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
              isIncome 
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' 
                : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
            }`}>
              {isIncome ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  {isEditing ? 'Edit Transaction' : isIncome ? 'Record Income' : 'Record Expense'}
                </h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase font-black tracking-wider ${
                  isIncome 
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300'
                }`}>
                  {isIncome ? '+ Income' : '- Expense'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isIncome
                  ? 'Client receipts, milestone advances, retainers & incoming payments'
                  : 'Cloud VPS, software subscriptions, team payouts & vendor bills'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Type Selector (if creating new) */}
          {!isEditing && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setType('income');
                  setCategory('client_payment');
                }}
                className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp size={14} />
                Income (Received / Dues)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('expense');
                  setCategory('server_hosting');
                }}
                className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingDown size={14} />
                Expense (Outflow / Bills)
              </button>
            </div>
          )}

          {/* Amount & Date in Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Amount (₹ INR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-sm ${
                  isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  placeholder="e.g. 25000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border rounded-xl text-slate-900 dark:text-white font-extrabold text-base focus:outline-none transition-all ${
                    isIncome
                      ? 'border-emerald-300 dark:border-emerald-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                      : 'border-rose-300 dark:border-rose-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Transaction Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={isIncome ? 'e.g. 50% Milestone Advance - Travel Agency Portal' : 'e.g. Hetzner Dedicated VPS Monthly Server'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
            >
              {(isIncome ? incomeCategories : expenseCategories).map((c) => (
                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c.label}
                </option>
              ))}
            </select>
            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(isIncome ? incomeCategories : expenseCategories).slice(0, 4).map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    category === c.id
                      ? isIncome
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-extrabold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client Name (Income) or Vendor Name (Expense) & Ref Number */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {isIncome ? 'Client / Customer Name' : 'Vendor / Service Provider'}
              </label>
              <div className="relative">
                {isIncome ? (
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                ) : (
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                )}
                <input
                  type="text"
                  placeholder={isIncome ? 'e.g. Ramesh Verma / TechCorp' : 'e.g. Hetzner / Hostinger / Google Cloud'}
                  value={isIncome ? clientName : vendorName}
                  onChange={(e) => (isIncome ? setClientName(e.target.value) : setVendorName(e.target.value))}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Reference / UTR / Invoice #
              </label>
              <div className="relative">
                <Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. UTR-98234823 or INV-2026-042"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
                >
                  {paymentMethods.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <CheckCircle2 size={14} className={status === 'completed' ? 'text-emerald-600' : 'text-slate-400'} />
                  {isIncome ? 'Received' : 'Paid'}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    status === 'pending'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Clock size={14} className={status === 'pending' ? 'text-amber-600' : 'text-slate-400'} />
                  {isIncome ? 'Pending Due' : 'Unpaid / Due'}
                </button>
              </div>
            </div>
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Notes / Remarks (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any additional details, invoice link, or terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              isIncome
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
            } disabled:opacity-50`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {isEditing ? 'Save Changes' : isIncome ? 'Save Income Record' : 'Save Expense Record'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
