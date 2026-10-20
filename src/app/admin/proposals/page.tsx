'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  Edit,
  Trash2,
  Copy,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowUpRight,
  Loader2,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ProposalEditorModal } from '@/components/admin/ProposalEditorModal';
import { ClientProposal } from '@/lib/db';
import { PROPOSAL_TEMPLATES } from '@/lib/proposal-templates';

export default function AdminProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<ClientProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'declined'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ClientProposal | null>(null);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/proposals');
      if (res.ok) {
        const data = await res.json();
        setProposals(data.proposals || []);
      }
    } catch (err) {
      console.error('Failed to load proposals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Filtered List
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const str = `${p.proposalNumber} ${p.title} ${p.clientName} ${p.clientCompany || ''} ${p.clientEmail || ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [proposals, statusFilter, categoryFilter, searchQuery]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalCount = proposals.length;
    const totalPipeline = proposals.reduce((acc, p) => acc + (p.grandTotal || 0), 0);
    const acceptedCount = proposals.filter((p) => p.status === 'accepted').length;
    const acceptedValue = proposals
      .filter((p) => p.status === 'accepted')
      .reduce((acc, p) => acc + (p.grandTotal || 0), 0);
    const sentCount = proposals.filter((p) => p.status === 'sent').length;

    return { totalCount, totalPipeline, acceptedCount, acceptedValue, sentCount };
  }, [proposals]);

  const handleCreateNew = (templateKey?: string) => {
    setEditingProposal(null);
    setIsModalOpen(true);
  };

  const handleEdit = (p: ClientProposal) => {
    setEditingProposal(p);
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p: ClientProposal) => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const duplicated: Partial<ClientProposal> = {
      ...p,
      id: undefined,
      proposalNumber: `MTC-PROP-${year}-${random}`,
      title: `${p.title} (Copy)`,
      status: 'draft',
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      createdAt: undefined,
      updatedAt: undefined
    };

    try {
      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      });
      const data = await res.json();
      if (data.success) {
        setProposals([data.proposal, ...proposals]);
      }
    } catch (err) {
      console.error('Failed to duplicate proposal:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ClientProposal['status']) => {
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setProposals(
          proposals.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id: string, number: string) => {
    if (!window.confirm(`Are you sure you want to delete Proposal ${number}?`)) return;
    try {
      const res = await fetch(`/api/admin/proposals?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProposals(proposals.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete proposal:', err);
    }
  };

  const handleWhatsAppShare = (p: ClientProposal) => {
    const phone = (p.clientPhone || '').replace(/\D/g, '');
    const clientName = p.clientName || 'Client';
    const amount = `₹${(p.grandTotal || 0).toLocaleString('en-IN')}`;
    const text = encodeURIComponent(
      `Hello ${clientName},\n\nPlease review our formal project proposal for *${p.title}* from Mahi TechnoCrafts.\n\n*Ref:* ${p.proposalNumber}\n*Total Investment:* ${amount}\n*Valid Till:* ${p.validUntil}\n\nLooking forward to partnering with you!\n\nBest regards,\nMahi TechnoCrafts\nhttps://mahitechnocrafts.in`
    );
    const targetUrl = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(targetUrl, '_blank');
  };

  return (
    <AdminLayoutShell
      title="Client Proposals & Quotations"
      subtitle="Design, customize, and export sequence-wise branded project proposals with professional PDF generation"
    >
      <div className="space-y-6">
        {/* =========================================================================
            TOP METRICS CARDS
        ========================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Proposals</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.totalCount}</p>
              <p className="text-[10px] text-slate-400 mt-1">Generated pipeline documents</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pipeline Value</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{stats.totalPipeline.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Gross proposed quotations</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Closed / Accepted
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                ₹{stats.acceptedValue.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.acceptedCount} proposals approved
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Sent & In Review
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats.sentCount}</p>
              <p className="text-[10px] text-blue-500 mt-1">Client awaiting decision</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            TEMPLATE QUICK-STARTERS (Fast Creation)
        ========================================================================== */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-purple-500/10 border border-sky-500/20 dark:border-sky-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-500" />
                <span>Instant Proposal Templates</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-configured with industry scopes, line items, deliverables, and SLAs.
              </p>
            </div>
            <button
              onClick={() => handleCreateNew()}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Create Custom Proposal</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(PROPOSAL_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                onClick={() => {
                  setEditingProposal(null);
                  setIsModalOpen(true);
                }}
                className="p-3 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 dark:hover:border-sky-500/50 shadow-xs text-left transition-all group cursor-pointer"
              >
                <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
                  Template
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors line-clamp-1">
                  {tpl.name}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {tpl.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SEARCH & FILTER BAR
        ========================================================================== */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by proposal #, client, title, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tabs */}
            {[
              { id: 'all', label: 'All' },
              { id: 'draft', label: 'Drafts' },
              { id: 'sent', label: 'Sent' },
              { id: 'accepted', label: 'Accepted' },
              { id: 'declined', label: 'Declined' }
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

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_app">Mobile App</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="custom_software">Custom ERP</option>
              <option value="digital_marketing">Marketing / SEO</option>
            </select>

            <button
              onClick={fetchProposals}
              title="Refresh proposals list"
              className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-sky-600 flex items-center justify-center cursor-pointer"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* =========================================================================
            PROPOSALS LIST TABLE
        ========================================================================== */}
        {isLoading ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center">
            <Loader2 size={30} className="animate-spin mx-auto text-sky-500" />
            <p className="text-xs font-bold text-slate-400 mt-2">Loading proposal records...</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <FileText size={36} className="mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No proposals found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first sequence-wise proposal using our verified industry templates or customize from scratch.
            </p>
            <button
              onClick={() => handleCreateNew()}
              className="mt-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>Create Proposal</span>
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-2.5 px-3">Proposal Ref</th>
                    <th className="py-2.5 px-3">Client & Organization</th>
                    <th className="py-2.5 px-3">Project Title</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3 text-right">Investment</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredProposals.map((prop) => (
                    <tr
                      key={prop.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Ref No */}
                      <td className="py-3.5 px-3">
                        <Link
                          href={`/admin/proposals/${prop.id}/preview`}
                          className="font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <span>{prop.proposalNumber}</span>
                          <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-[10px] text-slate-400 capitalize block mt-0.5">
                          {prop.category ? prop.category.replace(/_/g, ' ') : 'General'}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">{prop.clientName}</div>
                        {prop.clientCompany && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{prop.clientCompany}</div>
                        )}
                      </td>

                      {/* Project Title */}
                      <td className="py-3.5 px-3 max-w-xs truncate text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{prop.title}</span>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-3 text-[11px] text-slate-500 space-y-0.5">
                        <div>
                          <span className="text-slate-400">Issue:</span> {prop.proposalDate || '—'}
                        </div>
                        <div>
                          <span className="text-slate-400">Valid:</span>{' '}
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">{prop.validUntil || '—'}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white text-sm">
                        ₹{Number(prop.grandTotal).toLocaleString('en-IN')}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-3 text-center">
                        <select
                          value={prop.status}
                          onChange={(e) => handleStatusChange(prop.id, e.target.value as any)}
                          className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${
                            prop.status === 'accepted'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                              : prop.status === 'sent'
                              ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                              : prop.status === 'declined'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="accepted">Accepted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview & Print */}
                          <Link
                            href={`/admin/proposals/${prop.id}/preview`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sky-600 dark:text-sky-400 transition-colors"
                            title="Preview & Download PDF"
                          >
                            <Printer size={13} />
                          </Link>

                          {/* WhatsApp */}
                          <button
                            onClick={() => handleWhatsAppShare(prop)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 transition-colors cursor-pointer"
                            title="Share on WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(prop)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                            title="Duplicate Proposal"
                          >
                            <Copy size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleEdit(prop)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors cursor-pointer"
                            title="Edit Proposal"
                          >
                            <Edit size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(prop.id, prop.proposalNumber)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors cursor-pointer"
                            title="Delete Proposal"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROPOSAL CREATION & EDITING MODAL
        ========================================================================== */}
        {isModalOpen && (
          <ProposalEditorModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            proposal={editingProposal}
            onSaved={(saved) => {
              const exists = proposals.some((p) => p.id === saved.id);
              if (exists) {
                setProposals(proposals.map((p) => (p.id === saved.id ? saved : p)));
              } else {
                setProposals([saved, ...proposals]);
              }
            }}
          />
        )}
      </div>
    </AdminLayoutShell>
  );
}
