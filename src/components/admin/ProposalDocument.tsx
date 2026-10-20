'use client';

import React from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Layers,
  CreditCard,
  FileText
} from 'lucide-react';
import { ClientProposal } from '@/lib/db';
import { formatIndianCurrencyWords } from '@/lib/proposal-templates';

interface ProposalDocumentProps {
  proposal: ClientProposal;
  isPrintMode?: boolean;
}

export function ProposalDocument({ proposal, isPrintMode = false }: ProposalDocumentProps) {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  const currencySymbol = proposal.currency === 'USD' ? '$' : '₹';
  const currencyCode = proposal.currency || 'INR';

  // Section Display Options (Default to true if not set)
  const opts = proposal.displayOptions || {};
  const showLogo = opts.showLogo !== false;
  const showCompanyDetails = opts.showCompanyDetails !== false;
  const showGst = opts.showGst !== false;
  const showClientDetails = opts.showClientDetails !== false;
  const showOverview = opts.showOverview !== false;
  const showScopeOfWork = opts.showScopeOfWork !== false;
  const showTechStack = opts.showTechStack !== false;
  const showPricingTable = opts.showPricingTable !== false;
  const showMilestones = opts.showMilestones !== false;
  const showTermsAndConditions = opts.showTermsAndConditions !== false;
  const showSignatures = opts.showSignatures !== false;
  const showCompanySignatory = opts.showCompanySignatory !== false;
  const showClientSignatory = opts.showClientSignatory !== false;
  const showCopyrightFooter = opts.showCopyrightFooter !== false;

  return (
    <div
      id="proposal-document"
      className="w-full max-w-[850px] mx-auto bg-white text-slate-800 font-sans shadow-xl print:shadow-none print:w-full print:max-w-none print:m-0 rounded-2xl print:rounded-none overflow-hidden border border-slate-200 print:border-none"
    >
      {/* =========================================================================
          PRINT STYLES INJECTION
      ========================================================================== */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 12mm 12mm;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-page-break {
            page-break-before: always !important;
            break-before: page !important;
          }
        }
      `}</style>

      {/* =========================================================================
          1. HEADER SECTION (Official Branding, Company Info & Proposal Metadata)
      ========================================================================== */}
      <div className="p-8 sm:p-10 border-b-2 border-slate-900/10 bg-gradient-to-br from-slate-50 via-white to-sky-50/30 print:bg-none print:p-6 print:pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Company Brand & Logo */}
          <div className="flex items-start gap-4">
            {showLogo && (
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm flex items-center justify-center shrink-0">
                <Image
                  src={proposal.companyLogoUrl || '/logo.png'}
                  alt={proposal.companyName || 'Mahi TechnoCrafts'}
                  width={56}
                  height={56}
                  className="object-contain max-h-12 w-auto"
                  priority
                />
              </div>
            )}
            {showCompanyDetails && (
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-display">
                    {proposal.companyName || 'Mahi TechnoCrafts'}
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-800 uppercase tracking-wider">
                    Verified IT Agency
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {proposal.companyTagline || 'Engineering Digital Excellence & Scalable Software'}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Phone size={11} className="text-sky-600" />
                    {proposal.companyPhone || '+91 62671 44122'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={11} className="text-sky-600" />
                    {proposal.companyEmail || 'contact@mahitechnocrafts.in'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe size={11} className="text-sky-600" />
                    {proposal.companyWebsite || 'www.mahitechnocrafts.in'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Proposal Ref No & Dates Card */}
          <div className="w-full sm:w-auto bg-white/90 border border-slate-200/80 rounded-xl p-3.5 sm:text-right shadow-xs print:border print:border-slate-300">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Commercial Proposal Ref
            </div>
            <div className="text-sm font-black text-sky-700 font-mono tracking-tight mt-0.5">
              {proposal.proposalNumber || 'MTC-PROP-2026'}
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-slate-600">
              <div className="flex sm:justify-end gap-2">
                <span className="text-slate-400 font-medium">Date:</span>
                <span className="font-semibold text-slate-800">{formatDate(proposal.proposalDate)}</span>
              </div>
              <div className="flex sm:justify-end gap-2">
                <span className="text-slate-400 font-medium">Valid Until:</span>
                <span className="font-semibold text-amber-700">{formatDate(proposal.validUntil)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Address Banner */}
        <div className="mt-4 pt-3 border-t border-slate-200/70 text-[10px] text-slate-400 flex flex-wrap justify-between items-center gap-2">
          <span>
            <strong className="text-slate-600">Head Office:</strong>{' '}
            {proposal.companyAddress || 'Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, Madhya Pradesh, India - 462001'}
          </span>
          {showGst && proposal.companyGst && (
            <span>
              <strong className="text-slate-600">GSTIN:</strong> {proposal.companyGst}
            </span>
          )}
        </div>
      </div>

      <div className="p-8 sm:p-10 space-y-8 print:p-6 print:space-y-6">
        {/* =========================================================================
            2. CLIENT INFORMATION ("Prepared For")
        ========================================================================== */}
        {showClientDetails && (
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 print:p-4 print:bg-white print:border-slate-300">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 flex items-center gap-1.5 mb-2">
              <Building2 size={12} />
              <span>Prepared Exclusively For</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">
                  {proposal.clientName || 'Valued Client'}
                </h2>
                {proposal.clientCompany && (
                  <p className="text-xs font-semibold text-sky-800 mt-0.5">
                    {proposal.clientCompany}
                  </p>
                )}
                {proposal.clientAddress && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {proposal.clientAddress}
                  </p>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 sm:border-l sm:border-slate-200 sm:pl-4">
                {proposal.clientEmail && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] w-12">Email:</span>
                    <span className="font-semibold text-slate-800">{proposal.clientEmail}</span>
                  </div>
                )}
                {proposal.clientPhone && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] w-12">Phone:</span>
                    <span className="font-semibold text-slate-800">{proposal.clientPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px] w-12">Project:</span>
                  <span className="font-bold text-sky-700 capitalize">
                    {proposal.category ? proposal.category.replace(/_/g, ' ') : 'Digital Solution'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            3. PROJECT TITLE & EXECUTIVE SUMMARY
        ========================================================================== */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-sky-50 text-sky-800 text-xs font-bold border border-sky-100">
            <Sparkles size={13} className="text-sky-600" />
            <span>Project Proposal & Technical Blueprint</span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 font-display tracking-tight leading-snug">
            {proposal.title}
          </h2>
          {showOverview && proposal.overview && (
            <div className="text-xs text-slate-600 leading-relaxed text-justify space-y-2">
              <p>{proposal.overview}</p>
            </div>
          )}
        </div>

        {/* =========================================================================
            4. SCOPE OF WORK & CORE DELIVERABLES
        ========================================================================== */}
        {showScopeOfWork && proposal.scopeOfWork && proposal.scopeOfWork.length > 0 && (
          <div className="space-y-3 print-avoid-break">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers size={15} className="text-sky-600" />
              <span>Scope of Work & Architectural Deliverables</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {proposal.scopeOfWork.map((scope, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 text-xs text-slate-700 leading-snug print:bg-white print:border-slate-300"
                >
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{scope}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            5. TECHNOLOGY STACK & ARCHITECTURE
        ========================================================================== */}
        {showTechStack && proposal.techStack && (
          <div className="space-y-3 print-avoid-break">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck size={15} className="text-sky-600" />
              <span>Technology Stack & Infrastructure Specifications</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {proposal.techStack.frontend && proposal.techStack.frontend.length > 0 && (
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Frontend & UI
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proposal.techStack.frontend.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-semibold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {proposal.techStack.backend && proposal.techStack.backend.length > 0 && (
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Backend & APIs
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proposal.techStack.backend.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 font-semibold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {proposal.techStack.database && proposal.techStack.database.length > 0 && (
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Database & Cache
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proposal.techStack.database.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {proposal.techStack.cloudHosting && proposal.techStack.cloudHosting.length > 0 && (
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Cloud & Security
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {proposal.techStack.cloudHosting.map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. COMMERCIALS & PRICING BREAKDOWN (Formal Tabular Schedule)
        ========================================================================== */}
        {showPricingTable && (
          <div className="space-y-3 print-avoid-break">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <CreditCard size={15} className="text-sky-600" />
                <span>Investment & Commercials Schedule</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-400">All figures in {currencyCode}</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Item / Service Deliverable</th>
                    <th className="py-2.5 px-3 w-14 text-center">Qty</th>
                    <th className="py-2.5 px-3 w-28 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 w-32 text-right">Amount ({currencySymbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {proposal.items && proposal.items.length > 0 ? (
                    proposal.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          {item.description && (
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-semibold text-slate-700">{item.qty}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {currencySymbol}
                          {Number(item.rate).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {currencySymbol}
                          {Number(item.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">
                        No pricing items specified.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Calculations Footer */}
              <div className="bg-slate-50/80 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Words */}
                <div className="text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Investment in Words
                  </span>
                  <span className="font-bold text-slate-800 italic">
                    {formatIndianCurrencyWords(proposal.grandTotal)}
                  </span>
                </div>

                {/* Numerical breakdown */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">
                      {currencySymbol}
                      {Number(proposal.subtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {proposal.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Special Discount:</span>
                      <span className="font-mono">
                        -{currencySymbol}
                        {Number(proposal.discount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {proposal.taxRate > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>GST ({proposal.taxRate}%):</span>
                      <span className="font-mono">
                        +{currencySymbol}
                        {Number(proposal.taxAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-black text-slate-950">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-sky-800">
                      {currencySymbol}
                      {Number(proposal.grandTotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            7. PROJECT TIMELINE & MILESTONES
        ========================================================================== */}
        {showMilestones && proposal.milestones && proposal.milestones.length > 0 && (
          <div className="space-y-3 print-avoid-break">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar size={15} className="text-sky-600" />
                <span>Project Schedule & Milestones</span>
              </h3>
              <span className="text-[11px] font-bold text-sky-800">
                Duration: {proposal.projectDuration || '4-6 Weeks'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {proposal.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-sky-700">
                    <span>Phase 0{idx + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-bold">
                      {m.percentage}% Share
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{m.phase}</div>
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={11} className="text-slate-400" />
                    <span>{m.duration}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug pt-1 border-t border-slate-100">
                    {m.deliverables}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            8. PAYMENT TERMS & WARRANTIES
        ========================================================================== */}
        {showTermsAndConditions && proposal.terms && (
          <div className="space-y-4 print-avoid-break">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText size={15} className="text-sky-600" />
              <span>Terms of Engagement & Technical SLA</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Payment Milestones
                </span>
                <ul className="space-y-1.5 text-slate-700">
                  {proposal.terms.paymentTerms?.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  Warranty & Client SLA
                </span>
                <p className="text-slate-700 font-medium leading-relaxed">
                  {proposal.terms.warrantySupport ||
                    '90 Days complimentary technical support covering bug-fixes and stability optimization.'}
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  <strong>Proposal Validity:</strong> Valid for {proposal.terms.validityDays || 15} days from date
                  of issue.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            9. ACCEPTANCE & SIGNATURES (Dual Authorization Area)
        ========================================================================== */}
        {showSignatures && (
          <div className="pt-4 border-t border-slate-200 print-avoid-break space-y-4">
            <div className="text-xs text-slate-500 leading-relaxed text-center sm:text-left">
              By signing below or authorizing this proposal, both parties agree to the scope of work, timeline, and
              commercial terms stated herein.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              {/* Mahi TechnoCrafts Signature */}
              {showCompanySignatory && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-center sm:text-left space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    For & on behalf of {proposal.companyName || 'Mahi TechnoCrafts'}
                  </span>
                  <div className="h-16 flex items-center justify-center sm:justify-start">
                    <span className="font-serif italic text-lg text-slate-800 tracking-wide underline decoration-sky-400 decoration-wavy">
                      {proposal.signatoryName || 'Vikash Maheshwari'}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 text-xs">
                    <div className="font-bold text-slate-900">{proposal.signatoryName || 'Vikash Maheshwari'}</div>
                    <div className="text-[11px] text-slate-500">
                      {proposal.signatoryDesignation || 'Founder & Technical Director'}
                    </div>
                  </div>
                </div>
              )}

              {/* Client Signature */}
              {showClientSignatory && (
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-center sm:text-left space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Client Acceptance & Authorization
                  </span>
                  <div className="h-16 flex items-center justify-center sm:justify-start">
                    <span className="text-xs text-slate-300 italic font-mono">[ Signature & Date Stamp ]</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 text-xs">
                    <div className="font-bold text-slate-900">
                      {proposal.clientSignatoryName || proposal.clientName || 'Authorized Signatory'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {proposal.clientCompany || 'Client Organization'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            10. FORMAL FOOTER & COPYRIGHT
        ========================================================================== */}
        {showCopyrightFooter && (
          <div className="pt-6 border-t-2 border-slate-900/10 text-center text-slate-400 space-y-1 text-[11px] print-avoid-break">
            <p className="font-semibold text-slate-600">
              © {new Date().getFullYear()} {proposal.companyName || 'Mahi TechnoCrafts'}. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400">
              <strong>CONFIDENTIALITY NOTICE:</strong> This proposal is intended solely for {proposal.clientName}{' '}
              {proposal.clientCompany ? `(${proposal.clientCompany})` : ''} and contains proprietary trade information.
              Unauthorized copying, sharing, or modification is prohibited.
            </p>
            <p className="text-[10px] text-slate-400">
              Hamidia Rd, Shahjahanabad, Bhopal (MP) • {proposal.companyPhone || '+91 62671 44122'} •{' '}
              {proposal.companyWebsite || 'www.mahitechnocrafts.in'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
