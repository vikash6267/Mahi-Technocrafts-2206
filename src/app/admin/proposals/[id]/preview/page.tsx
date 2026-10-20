'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Share2,
  Copy,
  Check,
  Edit,
  Loader2,
  Send,
  MessageCircle,
  FileText
} from 'lucide-react';
import { ClientProposal } from '@/lib/db';
import { ProposalDocument } from '@/components/admin/ProposalDocument';
import { ProposalEditorModal } from '@/components/admin/ProposalEditorModal';

export default function ProposalPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<ClientProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchProposal = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/proposals/${id}`);
      if (!res.ok) throw new Error('Proposal not found');
      const data = await res.json();
      setProposal(data.proposal);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load proposal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    if (!proposal) return;
    const phone = (proposal.clientPhone || '').replace(/\D/g, '');
    const clientName = proposal.clientName || 'Client';
    const amount = `₹${(proposal.grandTotal || 0).toLocaleString('en-IN')}`;
    const text = encodeURIComponent(
      `Hello ${clientName},\n\nPlease find our formal project proposal for *${proposal.title}* from Mahi TechnoCrafts.\n\n*Proposal Ref:* ${proposal.proposalNumber}\n*Total Investment:* ${amount}\n*Valid Till:* ${proposal.validUntil}\n\nLooking forward to partnering with you!\n\nBest regards,\nMahi TechnoCrafts\nhttps://mahitechnocrafts.in`
    );
    const targetUrl = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(targetUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-500">
        <Loader2 size={36} className="animate-spin text-sky-600 mb-3" />
        <p className="text-sm font-bold">Rendering High-Fidelity Proposal...</p>
      </div>
    );
  }

  if (errorMsg || !proposal) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <FileText size={48} className="text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Proposal Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {errorMsg || 'The proposal requested could not be retrieved or has been removed.'}
        </p>
        <Link
          href="/admin/proposals"
          className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors"
        >
          Return to Proposals
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-6 px-3 sm:px-6 print:p-0 print:bg-white">
      {/* =========================================================================
          STICKY TOP TOOLBAR (Hidden in Print Mode)
      ========================================================================== */}
      <div className="no-print max-w-[850px] mx-auto mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-md flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back & Title info */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proposals"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Proposals"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-sky-600 dark:text-sky-400">
                {proposal.proposalNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  proposal.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : proposal.status === 'sent'
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400'
                    : proposal.status === 'declined'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {proposal.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">
              {proposal.clientName} {proposal.clientCompany ? `(${proposal.clientCompany})` : ''}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edit */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Edit size={13} />
            <span>Edit</span>
          </button>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Copy shareable link"
          >
            {isCopied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>

          {/* WhatsApp Share */}
          <button
            onClick={handleSendWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title="Send proposal details on WhatsApp"
          >
            <MessageCircle size={14} />
            <span>WhatsApp</span>
          </button>

          {/* Primary Action: Download PDF / Print */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          THE PROPOSAL DOCUMENT COMPONENT
      ========================================================================== */}
      <ProposalDocument proposal={proposal} />

      {/* Edit Modal */}
      {isEditorOpen && (
        <ProposalEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          proposal={proposal}
          onSaved={(updated) => {
            setProposal(updated);
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
}
