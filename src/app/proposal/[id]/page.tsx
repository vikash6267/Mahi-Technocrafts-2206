'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Printer,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Loader2,
  FileText,
  CheckCircle2,
  Download
} from 'lucide-react';
import { ClientProposal } from '@/lib/db';
import { ProposalDocument } from '@/components/admin/ProposalDocument';
import { downloadProposalPdf } from '@/lib/pdf-generator';

export default function ClientPublicProposalPage() {
  const params = useParams();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<ClientProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProposal = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/proposals/${id}`);
        if (!res.ok) throw new Error('Proposal not found or expired');
        const data = await res.json();
        setProposal(data.proposal);
      } catch (err: any) {
        setErrorMsg(err.message || 'Unable to load project proposal');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    if (!proposal || isDownloading) return;
    setIsDownloading(true);
    setDownloadStatus('Generating PDF...');
    try {
      const fileName = `${proposal.proposalNumber || 'Proposal'}_${(proposal.clientName || 'Client').replace(/\s+/g, '_')}.pdf`;
      await downloadProposalPdf('proposal-document', fileName, (status) => {
        setDownloadStatus(status);
      });
    } catch (err) {
      console.error('Download PDF failed:', err);
    } finally {
      setIsDownloading(false);
      setDownloadStatus('');
    }
  };

  const handleWhatsApp = () => {
    if (!proposal) return;
    const text = encodeURIComponent(
      `Hello Mahi TechnoCrafts,\n\nI have reviewed the proposal *${proposal.proposalNumber}* for ${proposal.title}. I would like to proceed with the next steps.\n\nClient: ${proposal.clientName}`
    );
    window.open(`https://wa.me/916267144122?text=${text}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-500">
        <Loader2 size={36} className="animate-spin text-sky-600 mb-3" />
        <p className="text-sm font-bold">Loading Official Proposal...</p>
      </div>
    );
  }

  if (errorMsg || !proposal) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <FileText size={48} className="text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-800">Proposal Not Available</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          {errorMsg || 'This proposal link may have expired or is no longer accessible.'}
        </p>
        <Link
          href="https://mahitechnocrafts.in"
          className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition-colors"
        >
          Visit Mahi TechnoCrafts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6 print:p-0 print:bg-white">
      {/* Top Client Action Banner (Hidden on Print) */}
      <div className="no-print max-w-[850px] mx-auto mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="Mahi TechnoCrafts" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Mahi TechnoCrafts Business Proposal</div>
            <div className="text-[11px] text-slate-500">
              Ref: <span className="font-mono font-bold text-sky-600">{proposal.proposalNumber}</span> • Valid till{' '}
              {proposal.validUntil}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsApp}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <MessageCircle size={14} />
            <span className="hidden sm:inline">Accept on WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </button>

          {/* Secondary Action: Print */}
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Print document"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Primary Action: Direct Download PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>{downloadStatus || 'Downloading...'}</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Render Official Proposal Document */}
      <ProposalDocument proposal={proposal} />
    </div>
  );
}
