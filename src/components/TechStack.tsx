'use client';

import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Globe, 
  Database, 
  Lock, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  HeartHandshake
} from 'lucide-react';

const qualityGuarantees = [
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: 'Lightning Speed (<1s Load Time)',
    desc: 'Websites load instantly on 4G/5G mobile phones so your customers never leave due to slow loading pages.'
  },
  {
    icon: <Smartphone className="w-6 h-6 text-sky-500" />,
    title: '100% Mobile & Tablet Responsive',
    desc: 'Pixel-perfect display on Android phones, iPhones, iPads, laptops, and desktop screens.'
  },
  {
    icon: <Lock className="w-6 h-6 text-emerald-500" />,
    title: 'Bank-Grade SSL & Data Security',
    desc: 'Free SSL certificates, encrypted customer databases, and automatic daily backups so your business data stays 100% safe.'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
    title: 'Google #1 SEO Optimized',
    desc: 'Clean schema code, fast indexing, and local Bhopal SEO markup so customers searching on Google find your business first.'
  },
  {
    icon: <Database className="w-6 h-6 text-blue-500" />,
    title: '1-Click UPI & WhatsApp Sync',
    desc: 'Instant Google Pay, PhonePe, Paytm QR code payments and automatic order receipts sent directly to WhatsApp.'
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
    title: 'Full Source Code Ownership',
    desc: 'No lock-in or recurring platform hostage fees. You own 100% of your website code, database, and domain.'
  }
];

export default function TechStack() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white dark:bg-[#02000e]" id="standards">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>Built To The Highest Industry Standards</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Why Our Websites & Apps <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Outperform Competitors</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            We don&apos;t just build websites — we build secure, lightning-fast digital assets that bring daily business results.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 6 Guarantee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qualityGuarantees.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 space-y-3.5 glow-card"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                {item.icon}
              </div>

              <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-base">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
