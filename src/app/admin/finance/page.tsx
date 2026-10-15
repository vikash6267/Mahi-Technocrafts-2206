'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  Building2,
  User,
  CreditCard,
  Hash,
  Loader2,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart,
  BarChart3,
  Check,
  AlertCircle,
  Wallet,
  Sparkles,
  Receipt
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { FinanceModal } from '@/components/admin/FinanceModal';
import { FinanceRecord, FinanceStats, FinanceType } from '@/lib/db';

export default function AdminFinancePage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<FinanceRecord | null>(null);
  const [defaultModalType, setDefaultModalType] = useState<FinanceType>('income');

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFinanceData = async () => {
    try {
      const res = await fetch('/api/admin/finance');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchFinanceData();
  };

  const handleOpenNew = (type: FinanceType) => {
    setRecordToEdit(null);
    setDefaultModalType(type);
    setIsModalOpen(true);
  };

  const handleEdit = (record: FinanceRecord) => {
    setRecordToEdit(record);
    setDefaultModalType(record.type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this financial record? This cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/finance?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
        fetchFinanceData();
      }
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (record: FinanceRecord) => {
    const newStatus = record.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch('/api/admin/finance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, status: newStatus })
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === record.id ? { ...r, status: newStatus } : r))
        );
        fetchFinanceData();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Format currency in Indian Rupees style
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  // Category label formatter
  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      client_payment: 'Client Payment',
      project_milestone: 'Project Milestone',
      retainer: 'Monthly Retainer',
      domain_hosting_charge: 'Domain & Hosting',
      amc_service: 'AMC Maintenance',
      consulting: 'Consulting',
      other_income: 'Other Income',
      server_hosting: 'Cloud VPS & Hosting',
      domain_purchase: 'Domain Purchase',
      software_tools: 'SaaS Tools & APIs',
      salaries_freelancers: 'Salaries & Payouts',
      marketing_ads: 'Ads & Marketing',
      office_supplies: 'Office & Infrastructure',
      legal_tax: 'Tax & Compliance',
      other_expense: 'Other Expense'
    };
    return map[cat] || cat.replace(/_/g, ' ');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (!filteredRecords.length) {
      alert('No records available to export.');
      return;
    }

    const headers = ['Date', 'Type', 'Title', 'Category', 'Client/Vendor', 'Amount (INR)', 'Payment Method', 'Ref / UTR', 'Status', 'Notes'];
    const rows = filteredRecords.map((r) => [
      r.date,
      r.type.toUpperCase(),
      `"${r.title.replace(/"/g, '""')}"`,
      `"${getCategoryLabel(r.category)}"`,
      `"${(r.clientName || r.vendorName || '').replace(/"/g, '""')}"`,
      r.amount,
      r.paymentMethod || '',
      `"${(r.referenceNumber || '').replace(/"/g, '""')}"`,
      r.status,
      `"${(r.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mahi_technocrafts_finance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Available months list from data
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.date) set.add(r.date.slice(0, 7));
    });
    return Array.from(set).sort().reverse();
  }, [records]);

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Tab type filter
        if (typeFilter === 'income' && r.type !== 'income') return false;
        if (typeFilter === 'expense' && r.type !== 'expense') return false;
        if (typeFilter === 'pending' && r.status !== 'pending') return false;

        // Month filter
        if (selectedMonth !== 'all' && !r.date.startsWith(selectedMonth)) return false;

        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchClient = (r.clientName || '').toLowerCase().includes(q);
          const matchVendor = (r.vendorName || '').toLowerCase().includes(q);
          const matchRef = (r.referenceNumber || '').toLowerCase().includes(q);
          const matchDesc = (r.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchClient && !matchVendor && !matchRef && !matchDesc) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
        if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
        if (sortBy === 'amount_desc') return b.amount - a.amount;
        if (sortBy === 'amount_asc') return a.amount - b.amount;
        return 0;
      });
  }, [records, typeFilter, selectedMonth, selectedCategory, searchQuery, sortBy]);

  return (
    <AdminLayoutShell
      title="Finance & Accounts"
      subtitle="Track company income, operational expenses, server bills, client receivables, and profit & loss"
    >
      <div className="space-y-6">
        {/* Top Control Header Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-black text-slate-900 dark:text-white">
                  Company Financial Operations
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold uppercase tracking-wider">
                  Live Cash Flow
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {records.length} transactions recorded • Real-time revenue & expense tracking
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center transition-colors cursor-pointer"
              title="Refresh Finance Data"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-sky-500' : ''} />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              Export CSV
            </button>

            <button
              onClick={() => handleOpenNew('expense')}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Minus size={14} />
              Record Expense
            </button>

            <button
              onClick={() => handleOpenNew('income')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <Plus size={15} />
              Record Income
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Net Profit / Balance */}
            <div className={`p-6 rounded-3xl border shadow-sm transition-all flex flex-col justify-between ${
              stats.netProfit >= 0
                ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-[#070918] dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40 dark:from-rose-950/30 dark:via-[#070918] dark:to-orange-950/20 border-rose-200 dark:border-rose-800/60'
            }`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
                    Net Balance / Profit
                  </span>
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    stats.netProfit >= 0
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                  }`}>
                    {stats.netProfit >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                </div>
                <div className={`text-3xl font-black ${
                  stats.netProfit >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatCurrency(stats.netProfit)}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Profit Margin:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {stats.totalIncome > 0
                    ? `${Math.round((stats.netProfit / stats.totalIncome) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>

            {/* 2. Total Income */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/40 dark:from-sky-950/30 dark:via-[#070918] dark:to-blue-950/20 border border-sky-200 dark:border-sky-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-800 dark:text-sky-400">
                    Total Income (Revenue)
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                    <ArrowDownLeft size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(stats.totalIncome)}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-sky-100 dark:border-sky-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>This Month:</span>
                <span className="font-extrabold text-sky-700 dark:text-sky-300">
                  {formatCurrency(stats.thisMonthIncome)} ({stats.incomeCount} receipts)
                </span>
              </div>
            </div>

            {/* 3. Total Expense */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-orange-50/40 dark:from-rose-950/30 dark:via-[#070918] dark:to-orange-950/20 border border-rose-200 dark:border-rose-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-800 dark:text-rose-400">
                    Total Expenses (Outflow)
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
                  {formatCurrency(stats.totalExpense)}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>This Month:</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  {formatCurrency(stats.thisMonthExpense)} ({stats.expenseCount} bills)
                </span>
              </div>
            </div>

            {/* 4. Pending Receivables */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/40 dark:from-amber-950/30 dark:via-[#070918] dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-400">
                    Pending Receivables
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {formatCurrency(stats.pendingIncome)}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-100 dark:border-amber-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Unpaid Payables:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(stats.pendingExpense)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Trend & Category Analytics OR Getting Started Welcome Banner */}
        {records.length === 0 ? (
          /* Getting Started Welcome Guide when 0 records exist */
          <div className="p-8 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Receipt size={32} />
              </div>
              <h2 className="text-xl font-display font-black text-slate-900 dark:text-white">
                Welcome to Mahi Technocrafts Financial Desk
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Start tracking your business revenue and costs. Record client payments, project advances, monthly retainers, server/VPS renewals, and domain charges.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                {/* Income Quick Card */}
                <div 
                  onClick={() => handleOpenNew('income')}
                  className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:border-emerald-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                    <TrendingUp size={16} />
                    <span>+ Record Client Income</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    50% Milestone Advance, Website Delivery, AMC Service, or Domain & Hosting charge.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 group-hover:underline">
                    Add Income Transaction &rarr;
                  </span>
                </div>

                {/* Expense Quick Card */}
                <div 
                  onClick={() => handleOpenNew('expense')}
                  className="p-5 rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30 hover:border-rose-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-400 font-black text-sm">
                    <TrendingDown size={16} />
                    <span>- Record Company Expense</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Hetzner VPS, AWS Cloud, Domain purchase, Freelancer payment, Google Ads, or SaaS tools.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-300 group-hover:underline">
                    Add Expense Transaction &rarr;
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Cash Flow Trend when records exist */
          stats && stats.monthlyTrend && stats.monthlyTrend.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 6 Month Cash Flow Trend */}
              <div className="lg:col-span-2 p-6 bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                      <BarChart3 size={16} />
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Recent 6 Months Cash Flow Trend
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Expense
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {stats.monthlyTrend.map((m) => {
                    const maxAmt = Math.max(
                      ...stats.monthlyTrend.map((x) => Math.max(x.income, x.expense)),
                      1
                    );
                    const incWidth = Math.round((m.income / maxAmt) * 100);
                    const expWidth = Math.round((m.expense / maxAmt) * 100);

                    return (
                      <div key={m.month} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-extrabold text-slate-800 dark:text-slate-200">{m.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{formatCurrency(m.income)}</span>
                            <span className="text-rose-600 dark:text-rose-400 font-bold">{formatCurrency(m.expense)}</span>
                            <span className={`font-black text-xs ${m.net >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                              Net: {formatCurrency(m.net)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(incWidth, m.income > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-rose-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(expWidth, m.expense > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Categories Distribution */}
              <div className="p-6 bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                      <PieChart size={16} />
                    </div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      Income & Expense Distribution
                    </h3>
                  </div>

                  {/* Top Income Sources */}
                  <div className="space-y-2 mb-5">
                    <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                      Top Income Sources
                    </span>
                    {Object.entries(stats.categoryBreakdown.income).length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No income recorded yet.</p>
                    ) : (
                      Object.entries(stats.categoryBreakdown.income)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([cat, amt]) => (
                          <div key={cat} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">{getCategoryLabel(cat)}</span>
                            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{formatCurrency(amt)}</span>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Top Expense Sinks */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-extrabold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                      Top Expense Sinks
                    </span>
                    {Object.entries(stats.categoryBreakdown.expense).length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No expense recorded yet.</p>
                    ) : (
                      Object.entries(stats.categoryBreakdown.expense)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([cat, amt]) => (
                          <div key={cat} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">{getCategoryLabel(cat)}</span>
                            <span className="font-extrabold text-rose-600 dark:text-rose-400">{formatCurrency(amt)}</span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between mt-4">
                  <span>This Month Net:</span>
                  <span className={`font-black ${stats.thisMonthNet >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
                    {formatCurrency(stats.thisMonthNet)}
                  </span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Filters & Search Bar */}
        <div className="bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  typeFilter === 'income'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                }`}
              >
                <TrendingUp size={13} />
                Income ({records.filter((r) => r.type === 'income').length})
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  typeFilter === 'expense'
                    ? 'bg-rose-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                }`}
              >
                <TrendingDown size={13} />
                Expenses ({records.filter((r) => r.type === 'expense').length})
              </button>
              <button
                onClick={() => setTypeFilter('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  typeFilter === 'pending'
                    ? 'bg-amber-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                }`}
              >
                <Clock size={13} />
                Pending ({records.filter((r) => r.status === 'pending').length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 lg:max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions, client, vendor, UTR #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-white text-xs focus:outline-none"
              >
                <option value="all">All Months</option>
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-800 dark:text-white text-xs focus:outline-none"
              >
                <option value="date_desc">Date (Newest First)</option>
                <option value="date_asc">Date (Oldest First)</option>
                <option value="amount_desc">Amount (High to Low)</option>
                <option value="amount_asc">Amount (Low to High)</option>
              </select>
            </div>

            {(selectedMonth !== 'all' || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedMonth('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-[11px] text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}

            <span className="ml-auto text-slate-400 text-[11px]">
              Showing <span className="font-bold text-slate-800 dark:text-white">{filteredRecords.length}</span> of {records.length} transactions
            </span>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 size={32} className="animate-spin text-sky-500" />
              <p className="text-xs">Loading financial records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <DollarSign size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Transactions Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                {searchQuery || selectedMonth !== 'all'
                  ? 'No transactions match your current search and filters.'
                  : 'Start tracking company income, client payments, and expenses.'}
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => handleOpenNew('income')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  + Add First Income
                </button>
                <button
                  onClick={() => handleOpenNew('expense')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer transition-colors"
                >
                  + Add First Expense
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5">Type</th>
                    <th className="py-3.5 px-5">Transaction / Category</th>
                    <th className="py-3.5 px-5">Client / Vendor</th>
                    <th className="py-3.5 px-5">Mode / Ref #</th>
                    <th className="py-3.5 px-5 text-right">Amount (₹)</th>
                    <th className="py-3.5 px-5 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                  {filteredRecords.map((r) => {
                    const isInc = r.type === 'income';

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Date */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                            <Calendar size={13} className="text-slate-400" />
                            <span>{r.date}</span>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isInc
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            {isInc ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {isInc ? 'Income' : 'Expense'}
                          </span>
                        </td>

                        {/* Title & Category */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 dark:text-white text-xs mb-0.5 max-w-xs truncate" title={r.title}>
                            {r.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                              {getCategoryLabel(r.category)}
                            </span>
                            {r.description && (
                              <span className="truncate max-w-[150px] text-slate-400" title={r.description}>
                                • {r.description}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Client / Vendor */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          {isInc ? (
                            r.clientName ? (
                              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                                <User size={13} className="text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[130px]">{r.clientName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )
                          ) : (
                            r.vendorName ? (
                              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                                <Building2 size={13} className="text-rose-600 shrink-0" />
                                <span className="truncate max-w-[130px]">{r.vendorName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )
                          )}
                        </td>

                        {/* Payment Method / Ref # */}
                        <td className="py-4 px-5 whitespace-nowrap">
                          <div className="text-slate-800 dark:text-slate-200 font-semibold uppercase text-[11px]">
                            {r.paymentMethod || 'UPI'}
                          </div>
                          {r.referenceNumber ? (
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]" title={r.referenceNumber}>
                              #{r.referenceNumber}
                            </div>
                          ) : (
                            <span className="text-slate-400 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-5 whitespace-nowrap text-right">
                          <div className={`text-base font-black ${
                            isInc ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {isInc ? '+' : '-'} {formatCurrency(r.amount)}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-5 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(r)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                              r.status === 'completed'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                            }`}
                          >
                            {r.status === 'completed' ? (
                              <>
                                <CheckCircle2 size={11} />
                                {isInc ? 'Received' : 'Paid'}
                              </>
                            ) : (
                              <>
                                <Clock size={11} />
                                {isInc ? 'Pending Due' : 'Unpaid'}
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(r)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              title="Edit Transaction"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                              title="Delete Transaction"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Finance Modal */}
      <FinanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={() => {
          fetchFinanceData();
        }}
        recordToEdit={recordToEdit}
        defaultType={defaultModalType}
      />
    </AdminLayoutShell>
  );
}
