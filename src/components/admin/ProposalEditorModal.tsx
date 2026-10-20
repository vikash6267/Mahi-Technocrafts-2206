'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Save,
  Layers,
  CreditCard,
  Calendar,
  FileText,
  Building2,
  Check,
  ChevronRight
} from 'lucide-react';
import { ClientProposal, ProposalItem, ProposalMilestone } from '@/lib/db';
import {
  DEFAULT_COMPANY_DETAILS,
  PROPOSAL_TEMPLATES,
  generateProposalNumber
} from '@/lib/proposal-templates';

interface ProposalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal?: ClientProposal | null;
  onSaved: (savedProposal: ClientProposal) => void;
}

export function ProposalEditorModal({
  isOpen,
  onClose,
  proposal,
  onSaved
}: ProposalEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'client' | 'scope' | 'pricing' | 'timeline'>('client');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<ClientProposal>>({
    proposalNumber: '',
    title: '',
    category: 'web_development',
    status: 'draft',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    companyName: DEFAULT_COMPANY_DETAILS.companyName,
    companyTagline: DEFAULT_COMPANY_DETAILS.companyTagline,
    companyAddress: DEFAULT_COMPANY_DETAILS.companyAddress,
    companyEmail: DEFAULT_COMPANY_DETAILS.companyEmail,
    companyPhone: DEFAULT_COMPANY_DETAILS.companyPhone,
    companyWebsite: DEFAULT_COMPANY_DETAILS.companyWebsite,
    companyGst: DEFAULT_COMPANY_DETAILS.companyGst,
    proposalDate: new Date().toISOString().slice(0, 10),
    validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    overview: '',
    scopeOfWork: [],
    techStack: { frontend: [], backend: [], database: [], cloudHosting: [], tools: [] },
    currency: 'INR',
    items: [],
    subtotal: 0,
    discount: 0,
    taxRate: 18,
    taxAmount: 0,
    grandTotal: 0,
    projectDuration: '4 to 6 Weeks',
    milestones: [],
    terms: {
      paymentTerms: [
        '30% Advance deposit upon contract signing to initiate project.',
        '40% Milestone payment upon core development demonstration.',
        '30% Final balance payment before production deployment.'
      ],
      warrantySupport: '90 Days complimentary post-launch technical warranty and bug fixes.',
      validityDays: 15,
      clientObligations: ['Provide brand assets, images, and content in a timely manner.']
    },
    signatoryName: DEFAULT_COMPANY_DETAILS.signatoryName,
    signatoryDesignation: DEFAULT_COMPANY_DETAILS.signatoryDesignation,
    clientSignatoryName: '',
    notes: ''
  });

  // Scope of work string for multi-line editing
  const [scopeString, setScopeString] = useState('');

  useEffect(() => {
    if (proposal) {
      setFormData(proposal);
      setScopeString((proposal.scopeOfWork || []).join('\n'));
    } else {
      // Default to Web Development Template
      const defaultTemplate = PROPOSAL_TEMPLATES.web_development.data;
      setFormData({
        ...defaultTemplate,
        proposalNumber: generateProposalNumber(),
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientSignatoryName: ''
      });
      setScopeString((defaultTemplate.scopeOfWork || []).join('\n'));
    }
    setActiveTab('client');
    setErrorMsg('');
  }, [proposal, isOpen]);

  // Recalculate totals whenever items, discount, or taxRate change
  const calculateTotals = (items: ProposalItem[], discount: number, taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const disc = Math.max(0, Number(discount) || 0);
    const taxable = Math.max(0, subtotal - disc);
    const rate = Number(taxRate) >= 0 ? Number(taxRate) : 0;
    const taxAmount = Math.round((taxable * rate) / 100);
    const grandTotal = taxable + taxAmount;

    return { subtotal, discount: disc, taxRate: rate, taxAmount, grandTotal };
  };

  const handleApplyTemplate = (templateKey: string) => {
    const tpl = PROPOSAL_TEMPLATES[templateKey]?.data;
    if (!tpl) return;

    const currentClient = {
      clientName: formData.clientName,
      clientCompany: formData.clientCompany,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      proposalNumber: formData.proposalNumber || generateProposalNumber()
    };

    setFormData({
      ...formData,
      ...tpl,
      ...currentClient
    });
    setScopeString((tpl.scopeOfWork || []).join('\n'));
  };

  const handleAddItem = () => {
    const newItem: ProposalItem = {
      id: `item_${Date.now()}`,
      name: 'New Service Deliverable',
      description: '',
      qty: 1,
      rate: 10000,
      amount: 10000
    };
    const updatedItems = [...(formData.items || []), newItem];
    const totals = calculateTotals(updatedItems, formData.discount || 0, formData.taxRate ?? 18);
    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = (formData.items || []).filter((_, idx) => idx !== index);
    const totals = calculateTotals(updatedItems, formData.discount || 0, formData.taxRate ?? 18);
    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  const handleItemChange = (index: number, field: keyof ProposalItem, val: any) => {
    const updatedItems = [...(formData.items || [])];
    const target = { ...updatedItems[index] };

    if (field === 'qty' || field === 'rate') {
      const numVal = Number(val) || 0;
      target[field] = numVal as never;
      target.amount = (field === 'qty' ? numVal : target.qty) * (field === 'rate' ? numVal : target.rate);
    } else {
      target[field] = val as never;
    }

    updatedItems[index] = target;
    const totals = calculateTotals(updatedItems, formData.discount || 0, formData.taxRate ?? 18);
    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  const handleAddMilestone = () => {
    const newM: ProposalMilestone = {
      phase: `Phase ${(formData.milestones?.length || 0) + 1}: Implementation`,
      duration: '2 Weeks',
      deliverables: 'Deliverable description',
      percentage: 25
    };
    setFormData({ ...formData, milestones: [...(formData.milestones || []), newM] });
  };

  const handleRemoveMilestone = (index: number) => {
    setFormData({
      ...formData,
      milestones: (formData.milestones || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName?.trim()) {
      setErrorMsg('Please enter Client Name.');
      setActiveTab('client');
      return;
    }
    if (!formData.title?.trim()) {
      setErrorMsg('Please enter Proposal Title.');
      setActiveTab('client');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Split scope string
      const parsedScope = scopeString
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        ...formData,
        scopeOfWork: parsedScope
      };

      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save proposal');
      }

      onSaved(data.proposal);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while saving proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-display">
                {proposal ? 'Edit Client Proposal' : 'Create New Client Proposal'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sequence-wise official business proposal with company header, pricing schedule & PDF export
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Template Selector (If new proposal) */}
        {!proposal && (
          <div className="px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-sky-50/50 dark:bg-sky-950/20 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
              <Sparkles size={13} className="text-sky-600" />
              <span>Load Template:</span>
            </span>
            {Object.entries(PROPOSAL_TEMPLATES).map(([key, tpl]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleApplyTemplate(key)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  formData.category === key
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tpl.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 px-5 gap-1 overflow-x-auto">
          {[
            { id: 'client', label: '1. Client & Info', icon: Building2 },
            { id: 'scope', label: '2. Scope & Tech Stack', icon: Layers },
            { id: 'pricing', label: '3. Pricing Schedule', icon: CreditCard },
            { id: 'timeline', label: '4. Timeline & Terms', icon: Calendar }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-white dark:bg-[#070918]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: CLIENT & BASIC DETAILS */}
          {activeTab === 'client' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Proposal Number
                  </label>
                  <input
                    type="text"
                    value={formData.proposalNumber || ''}
                    onChange={(e) => setFormData({ ...formData, proposalNumber: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-sky-600 dark:text-sky-400 font-bold"
                    placeholder="MTC-PROP-2026-001"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Proposal Date
                  </label>
                  <input
                    type="date"
                    value={formData.proposalDate || ''}
                    onChange={(e) => setFormData({ ...formData, proposalDate: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil || ''}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next.js E-Commerce Platform & Mobile App Development"
                  className="w-full mt-1 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Project Category
                  </label>
                  <select
                    value={formData.category || 'web_development'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="web_development">Web Development & Portal</option>
                    <option value="mobile_app">Mobile App (iOS & Android)</option>
                    <option value="ecommerce">E-Commerce Store & Checkout</option>
                    <option value="custom_software">Custom ERP / CRM Software</option>
                    <option value="digital_marketing">SEO & Digital Marketing</option>
                    <option value="maintenance_amc">Maintenance & AMC</option>
                    <option value="other">Other Digital Service</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Proposal Status
                  </label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="draft">Draft (Internal)</option>
                    <option value="sent">Sent to Client</option>
                    <option value="accepted">Accepted / Approved</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              {/* Client Information */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 block">
                  Client / Recipient Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName || ''}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.clientCompany || ''}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      placeholder="e.g. Apex Global Solutions Pvt Ltd"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Client Email</label>
                    <input
                      type="email"
                      value={formData.clientEmail || ''}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      placeholder="client@company.com"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Client Phone</label>
                    <input
                      type="text"
                      value={formData.clientPhone || ''}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Client Address</label>
                  <input
                    type="text"
                    value={formData.clientAddress || ''}
                    onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                    placeholder="e.g. Sector 5, Bhopal, Madhya Pradesh - 462001"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCOPE & TECH STACK */}
          {activeTab === 'scope' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Executive Summary / Project Overview
                </label>
                <textarea
                  rows={4}
                  value={formData.overview || ''}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Detail project background, objectives, and value proposition..."
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Scope of Work & Deliverables (One bullet per line)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {scopeString.split('\n').filter((s) => s.trim().length > 0).length} Deliverables
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={scopeString}
                  onChange={(e) => setScopeString(e.target.value)}
                  placeholder="• Complete UI/UX Figma wireframes&#10;• Responsive Next.js web application&#10;• PostgreSQL database schema design&#10;• Automated Email & WhatsApp notifications"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400 block">
                  Technology Stack Tags (Comma separated)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Frontend</label>
                    <input
                      type="text"
                      value={(formData.techStack?.frontend || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          techStack: {
                            ...formData.techStack,
                            frontend: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          }
                        })
                      }
                      placeholder="Next.js 16, React 19, Tailwind CSS"
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Backend</label>
                    <input
                      type="text"
                      value={(formData.techStack?.backend || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          techStack: {
                            ...formData.techStack,
                            backend: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          }
                        })
                      }
                      placeholder="Node.js, Express, REST APIs"
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Database</label>
                    <input
                      type="text"
                      value={(formData.techStack?.database || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          techStack: {
                            ...formData.techStack,
                            database: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          }
                        })
                      }
                      placeholder="MongoDB Atlas, PostgreSQL, Redis"
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Cloud & Security</label>
                    <input
                      type="text"
                      value={(formData.techStack?.cloudHosting || []).join(', ')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          techStack: {
                            ...formData.techStack,
                            cloudHosting: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          }
                        })
                      }
                      placeholder="AWS EC2, Cloudflare CDN, SSL"
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & ITEMS */}
          {activeTab === 'pricing' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Commercial Deliverables Breakdown
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-sky-700 transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Line Item</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {(formData.items || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          placeholder="Deliverable Name (e.g. UI/UX Wireframing & Design)"
                          className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Brief technical description of this module..."
                          className="w-full px-3 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                          className="w-14 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[11px]">Unit Rate (₹):</span>
                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                          className="w-24 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-right"
                        />
                      </div>

                      <div className="ml-auto font-mono text-xs font-bold text-slate-900 dark:text-white">
                        Total: ₹{Number(item.amount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Controls */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Special Discount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount || 0}
                      onChange={(e) => {
                        const disc = Number(e.target.value) || 0;
                        const totals = calculateTotals(formData.items || [], disc, formData.taxRate ?? 18);
                        setFormData({ ...formData, ...totals });
                      }}
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      GST / Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.taxRate ?? 18}
                      onChange={(e) => {
                        const rate = Number(e.target.value) || 0;
                        const totals = calculateTotals(formData.items || [], formData.discount || 0, rate);
                        setFormData({ ...formData, ...totals });
                      }}
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Currency</label>
                    <select
                      value={formData.currency || 'INR'}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                      className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="INR">INR (₹ Indian Rupee)</option>
                      <option value="USD">USD ($ US Dollar)</option>
                    </select>
                  </div>
                </div>

                {/* Grand Total Summary */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div className="text-slate-500">
                    Subtotal: <span className="font-mono font-bold">₹{formData.subtotal?.toLocaleString('en-IN')}</span> • Tax: <span className="font-mono">₹{formData.taxAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-base font-black text-sky-600 dark:text-sky-400 font-mono">
                    Grand Total: ₹{formData.grandTotal?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE, TERMS & SIGNATURE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Estimated Total Project Duration
                </label>
                <input
                  type="text"
                  value={formData.projectDuration || ''}
                  onChange={(e) => setFormData({ ...formData, projectDuration: e.target.value })}
                  placeholder="e.g. 4 to 6 Weeks"
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>

              {/* Milestones */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Delivery Milestones
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Milestone
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.milestones || []).map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center gap-3 text-xs"
                    >
                      <input
                        type="text"
                        value={m.phase}
                        onChange={(e) => {
                          const ms = [...(formData.milestones || [])];
                          ms[idx] = { ...ms[idx], phase: e.target.value };
                          setFormData({ ...formData, milestones: ms });
                        }}
                        placeholder="Phase Name"
                        className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      />
                      <input
                        type="text"
                        value={m.duration}
                        onChange={(e) => {
                          const ms = [...(formData.milestones || [])];
                          ms[idx] = { ...ms[idx], duration: e.target.value };
                          setFormData({ ...formData, milestones: ms });
                        }}
                        placeholder="Duration (e.g. Week 1-2)"
                        className="w-32 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={m.percentage}
                          onChange={(e) => {
                            const ms = [...(formData.milestones || [])];
                            ms[idx] = { ...ms[idx], percentage: Number(e.target.value) || 0 };
                            setFormData({ ...formData, milestones: ms });
                          }}
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                        />
                        <span className="text-[11px] font-bold text-slate-400">%</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(idx)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty and Terms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Warranty & Maintenance SLA
                  </label>
                  <input
                    type="text"
                    value={formData.terms?.warrantySupport || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        terms: { ...(formData.terms as any), warrantySupport: e.target.value }
                      })
                    }
                    placeholder="e.g. 90 Days complimentary technical support..."
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Authorized Signatory Name
                  </label>
                  <input
                    type="text"
                    value={formData.signatoryName || ''}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    placeholder="Vikash Maheshwari"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Additional Notes / Client Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any custom payment notes or IP transfer clauses..."
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeTab !== 'client' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'scope') setActiveTab('client');
                    if (activeTab === 'pricing') setActiveTab('scope');
                    if (activeTab === 'timeline') setActiveTab('pricing');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}

              {activeTab !== 'timeline' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'client') setActiveTab('scope');
                    if (activeTab === 'scope') setActiveTab('pricing');
                    if (activeTab === 'pricing') setActiveTab('timeline');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                <span>{isSubmitting ? 'Saving...' : 'Save Proposal'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
