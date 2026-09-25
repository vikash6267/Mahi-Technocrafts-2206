'use client';

import React from 'react';
import { 
  Sparkles, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Clock, 
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

export default function TransformationComparison() {
  const comparisonPoints = [
    {
      factor: '6 Months Free Maintenance Included',
      others: 'Charge ₹5,000–₹15,000 extra per month as hidden AMC fees for even small changes',
      mahi: '100% Free 6 Months Maintenance & Bug Fixes included directly in the development cost',
      highlight: '6 Months FREE'
    },
    {
      factor: 'Dedicated Technical Support',
      others: 'Unresponsive support tickets, taking days to reply or abandoning project after launch',
      mahi: '24/7 Priority WhatsApp & Phone Technical Support with a dedicated technical manager',
      highlight: '24/7 Priority Help'
    },
    {
      factor: 'AI Solutions & Smart Automations',
      others: 'Basic static templates with no smart bots, manual invoicing & zero automations',
      mahi: 'Integrated AI Customer Chatbots, automated WhatsApp order alerts & smart invoicing',
      highlight: 'Built-in AI'
    },
    {
      factor: 'Delivery Speed & Turnaround',
      others: 'Takes 2–3 months with delays and poor communication',
      mahi: 'Ready in 7–14 Days with live preview updates every 48 hours',
      highlight: '3x Faster'
    },
    {
      factor: 'Mobile & WhatsApp Checkout',
      others: 'Generic slow templates with complex payment gateways and drop-offs',
      mahi: '1-Click Google Pay / PhonePe UPI & direct WhatsApp order sync',
      highlight: 'Zero Friction'
    },
    {
      factor: 'Platform Commissions',
      others: 'Third-party portals take 20%–30% cuts on every order or booking',
      mahi: '0% Commission. 100% of your customer money goes directly to your bank account',
      highlight: 'Keep 100% Profit'
    },
    {
      factor: 'Ease of Use for Non-Tech Owners',
      others: 'Hard-to-use complex computer software requiring training',
      mahi: 'Change prices, add products & view sales directly from your mobile phone in 30 seconds',
      highlight: 'Simple as WhatsApp'
    },
    {
      factor: 'Google Local Ranking (SEO)',
      others: 'Extra high fees for basic Google Maps & SEO setup',
      mahi: 'Built-in Local SEO schema to rank top on Google Search in Bhopal & India',
      highlight: 'Included Free'
    },
    {
      factor: 'Code Ownership & Transparency',
      others: 'Hostage recurring monthly rental fees and lock-in contracts',
      mahi: '100% Full Source Code & Database Ownership with zero lock-in contracts',
      highlight: '100% Ownership'
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-slate-50 dark:bg-[#02000e]" id="comparison">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>The Mahi TechnoCrafts Advantage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Why Local Businesses Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Us Over Others</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            See the direct difference between traditional freelancers/platforms and our high-converting modern engineering.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Side-By-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          
          {/* Left Column: Traditional Freelancers & Portals */}
          <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 opacity-90 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle size={15} />
                Traditional Freelancers / Generic Portals
              </span>
              <h3 className="text-xl font-display font-black text-slate-900 dark:text-white">
                Outdated & Slow
              </h3>
            </div>

            <div className="space-y-5">
              {comparisonPoints.map((pt, idx) => (
                <div key={idx} className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {pt.factor}
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-400">
                    <XCircle size={14} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{pt.others}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Mahi TechnoCrafts (Highlighted) */}
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-b from-sky-950/80 via-slate-950 to-slate-950 border-2 border-sky-500/50 p-6 sm:p-8 space-y-6 shadow-2xl relative glow-card text-white">
            
            {/* Top Recommended Pill */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  Mahi TechnoCrafts
                </span>
                <h3 className="text-xl font-display font-black text-white">
                  High-Growth Modern Tech Partner
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold shadow-sm">
                Top Rated ★
              </span>
            </div>

            <div className="space-y-5">
              {comparisonPoints.map((pt, idx) => (
                <div key={idx} className="space-y-1 pb-4 border-b border-slate-800/80 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400">{pt.factor}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {pt.highlight}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{pt.mahi}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Row */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block">Custom Packages</span>
                <span className="text-base font-black text-white">Starting from ₹2,999*</span>
              </div>

              <div className="flex gap-2.5 w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center"
                >
                  Get Started Today
                </Link>
                <a
                  href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts,%20I%20want%20to%20know%20more%20about%20your%20packages."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all flex items-center justify-center shadow-md"
                >
                  <MessageCircle size={16} />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
