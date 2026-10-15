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
  AlertCircle
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
      subtitle="Track company income, server & operational expenses, client receivables, and cash flow"
    >
      <div className="space-y-6">
        {/* Top Control Bar with Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Financial Desk
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-semibold text-slate-300">
              {records.length} Total Transactions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
              title="Refresh Finance Data"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>

            <button
              onClick={() => handleOpenNew('expense')}
              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Minus size={14} />
              Record Expense
            </button>

            <button
              onClick={() => handleOpenNew('income')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus size={15} />
              Record Income
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Net Profit / Balance */}
            <div className={`p-5 rounded-2xl border transition-all ${
              stats.netProfit >= 0
                ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30'
                : 'bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Net Balance / Profit
                </span>
                <span className={`p-1.5 rounded-lg text-xs font-black ${
                  stats.netProfit >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {stats.netProfit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                </span>
              </div>
              <div className={`text-2xl lg:text-3xl font-black ${
                stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCurrency(stats.netProfit)}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Margin:</span>
                <span className="font-bold text-white">
                  {stats.totalIncome > 0
                    ? `${Math.round((stats.netProfit / stats.totalIncome) * 100)}%`
                    : '0%'}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">All-time Net Flow</span>
              </div>
            </div>

            {/* Total Income */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Income (Revenue)
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <TrendingUp size={16} />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-white">
                {formatCurrency(stats.totalIncome)}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">This Month:</span>
                <span className="text-white font-bold">{formatCurrency(stats.thisMonthIncome)}</span>
                <span className="text-slate-600">•</span>
                <span>{stats.incomeCount} receipts</span>
              </div>
            </div>

            {/* Total Expense */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Expenses (Outflow)
                </span>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                  <TrendingDown size={16} />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-white">
                {formatCurrency(stats.totalExpense)}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="text-rose-400 font-bold">This Month:</span>
                <span className="text-white font-bold">{formatCurrency(stats.thisMonthExpense)}</span>
                <span className="text-slate-600">•</span>
                <span>{stats.expenseCount} bills</span>
              </div>
            </div>

            {/* Pending Receivables */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pending Receivables
                </span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Clock size={16} />
                </div>
              </div>
              <div className="text-2xl lg:text-3xl font-black text-amber-400">
                {formatCurrency(stats.pendingIncome)}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="text-slate-300">Pending Payables:</span>
                <span className="text-white font-bold">{formatCurrency(stats.pendingExpense)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6-Month Trend & Category Breakdown Bar */}
        {stats && stats.monthlyTrend && stats.monthlyTrend.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 6 Month Cash Flow Trend */}
            <div className="lg:col-span-2 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent 6 Months Cash Flow Trend
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Income
                  </span>
                  <span className="flex items-center gap-1 text-rose-400">
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
                    <div key={m.month} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-slate-300">{m.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-400 font-semibold">{formatCurrency(m.income)}</span>
                          <span className="text-rose-400 font-semibold">{formatCurrency(m.expense)}</span>
                          <span className={`font-black ${m.net >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            Net: {formatCurrency(m.net)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(incWidth, 2)}%` }}
                          />
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(expWidth, 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Categories Distribution */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PieChart size={16} className="text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Income & Expense Breakdown
                  </h3>
                </div>

                {/* Top Income Sources */}
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    Top Income Sources
                  </span>
                  {Object.entries(stats.categoryBreakdown.income).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No income recorded yet.</p>
                  ) : (
                    Object.entries(stats.categoryBreakdown.income)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([cat, amt]) => (
                        <div key={cat} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                          <span className="text-slate-300">{getCategoryLabel(cat)}</span>
                          <span className="font-bold text-emerald-400">{formatCurrency(amt)}</span>
                        </div>
                      ))
                  )}
                </div>

                {/* Top Expense Sinks */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                    Top Expense Outflows
                  </span>
                  {Object.entries(stats.categoryBreakdown.expense).length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No expense recorded yet.</p>
                  ) : (
                    Object.entries(stats.categoryBreakdown.expense)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([cat, amt]) => (
                        <div key={cat} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                          <span className="text-slate-300">{getCategoryLabel(cat)}</span>
                          <span className="font-bold text-rose-400">{formatCurrency(amt)}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span>This Month Net: </span>
                <span className={`font-black ${stats.thisMonthNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(stats.thisMonthNet)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  typeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({records.length})
              </button>
              <button
                onClick={() => setTypeFilter('income')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  typeFilter === 'income'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                <TrendingUp size={13} />
                Income ({records.filter((r) => r.type === 'income').length})
              </button>
              <button
                onClick={() => setTypeFilter('expense')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  typeFilter === 'expense'
                    ? 'bg-rose-500 text-white font-black shadow-sm'
                    : 'text-slate-400 hover:text-rose-400'
                }`}
              >
                <TrendingDown size={13} />
                Expenses ({records.filter((r) => r.type === 'expense').length})
              </button>
              <button
                onClick={() => setTypeFilter('pending')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  typeFilter === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                <Clock size={13} />
                Pending ({records.filter((r) => r.status === 'pending').length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 lg:max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions, client, vendor, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80 text-xs">
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
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
              <span className="text-slate-400 font-semibold">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none"
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
                className="text-[11px] text-blue-400 hover:underline"
              >
                Clear Filters
              </button>
            )}

            <span className="ml-auto text-slate-400 text-[11px]">
              Showing <span className="font-bold text-white">{filteredRecords.length}</span> of {records.length} transactions
            </span>
          </div>
        </div>

        {/* Transactions Table / List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 size={32} className="animate-spin text-blue-500" />
              <p className="text-xs">Loading financial records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
                <DollarSign size={28} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Transactions Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                {searchQuery || selectedMonth !== 'all'
                  ? 'No transactions match your current search and filters.'
                  : 'Start tracking company income, client payments, and expenses.'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenNew('income')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black"
                >
                  + Add First Income
                </button>
                <button
                  onClick={() => handleOpenNew('expense')}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold"
                >
                  + Add First Expense
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Transaction / Category</th>
                    <th className="py-3 px-4">Client / Vendor</th>
                    <th className="py-3 px-4">Mode / Ref #</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredRecords.map((r) => {
                    const isInc = r.type === 'income';

                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        {/* Date */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                            <Calendar size={13} className="text-slate-500" />
                            <span>{r.date}</span>
                          </div>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              isInc
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isInc ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {isInc ? 'Income' : 'Expense'}
                          </span>
                        </td>

                        {/* Title & Category */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs mb-0.5 max-w-xs truncate" title={r.title}>
                            {r.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                              {getCategoryLabel(r.category)}
                            </span>
                            {r.description && (
                              <span className="truncate max-w-[150px] text-slate-500" title={r.description}>
                                • {r.description}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Client / Vendor */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isInc ? (
                            r.clientName ? (
                              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                                <User size={13} className="text-emerald-400 shrink-0" />
                                <span className="truncate max-w-[120px]">{r.clientName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )
                          ) : (
                            r.vendorName ? (
                              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                                <Building2 size={13} className="text-rose-400 shrink-0" />
                                <span className="truncate max-w-[120px]">{r.vendorName}</span>
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )
                          )}
                        </td>

                        {/* Payment Method / Ref # */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-slate-300 font-medium uppercase text-[11px]">
                            {r.paymentMethod || 'UPI'}
                          </div>
                          {r.referenceNumber ? (
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[110px]" title={r.referenceNumber}>
                              #{r.referenceNumber}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-[10px]">—</span>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-black ${
                            isInc ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {isInc ? '+' : '-'} {formatCurrency(r.amount)}
                          </div>
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(r)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                              r.status === 'completed'
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
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
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEdit(r)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
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
