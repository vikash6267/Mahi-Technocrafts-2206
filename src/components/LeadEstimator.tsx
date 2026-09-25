'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  ArrowRight, 
  PhoneCall, 
  Send, 
  Globe, 
  Smartphone, 
  ShoppingCart, 
  Database, 
  Bot, 
  Zap,
  Clock,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEstimatorRequest } from '@/lib/analytics';

export default function LeadEstimator() {
  const [projectType, setProjectType] = useState('website');
  const [industry, setIndustry] = useState('ecommerce');
  const [timeline, setTimeline] = useState('standard');
  const [needsSEO, setNeedsSEO] = useState(true);
  const [clientPhone, setClientPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const projectOptions = [
    { id: 'website', name: 'Business Website', icon: <Globe size={18} />, base: 'Starts ₹2,999*' },
    { id: 'app', name: 'Mobile App (iOS/Android)', icon: <Smartphone size={18} />, base: 'Starts ₹9,999*' },
    { id: 'ecommerce', name: 'Online Shopping Store', icon: <ShoppingCart size={18} />, base: 'Starts ₹4,999*' },
    { id: 'erp', name: 'Billing & Management Software', icon: <Database size={18} />, base: 'Starts ₹9,999*' },
    { id: 'ai', name: 'WhatsApp & Auto Chatbot', icon: <Bot size={18} />, base: 'Starts ₹3,999*' },
  ];

  const industryOptions = [
    'Retail Shop & E-Commerce',
    'Hospital & Medical Clinic',
    'Real Estate & Property Builder',
    'Restaurant, Cafe & Bakery',
    'School & Coaching Institute',
    'Finance & Consulting Firm',
    'Factory & Manufacturing Unit',
    'AgriTech & Cold Storage Mandi',
    'Other Business',
  ];

  const handleEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim()) return;

    setSubmitted(true);
    trackEstimatorRequest(projectType, industry);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 }
    });

    const selectedProj = projectOptions.find(p => p.id === projectType)?.name || projectType;
    const msg = `Hi Mahi TechnoCrafts Team, I used your Instant Project Estimator:
- Project: ${selectedProj}
- Industry: ${industry}
- Timeline: ${timeline === 'urgent' ? 'Urgent (1-2 Weeks)' : 'Standard (2-4 Weeks)'}
- Includes Free SEO & Schemas: ${needsSEO ? 'Yes' : 'No'}
- My Contact Number: ${clientPhone}
Please provide me with a custom discounted proposal & free prototype plan.`;

    setTimeout(() => {
      window.open(`https://wa.me/916267144122?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1200);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white dark:bg-[#02000a]" id="estimator">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            <Calculator size={13} className="text-sky-600" />
            Instant Project Scope & Quote
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Calculate Your <span className="text-gradient">Project Cost</span> in 30 Seconds
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select your requirements to receive a customized scope, timeline, and discounted launch proposal.
          </p>
        </div>

        {/* Interactive Estimator Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleEstimateSubmit} className="space-y-8">
            {/* Step 1: Project Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                1. Select What You Want to Build:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {projectOptions.map((opt) => {
                  const isSelected = projectType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setProjectType(opt.id)}
                      className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sky-400'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-sky-600'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{opt.name}</p>
                        <p className={`text-[10px] mt-1 ${isSelected ? 'text-sky-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {opt.base}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Industry & Timeline Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  2. Select Your Business Industry:
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                >
                  {industryOptions.map((ind, idx) => (
                    <option key={idx} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  3. Expected Delivery Speed:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTimeline('standard')}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      timeline === 'standard'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Clock size={14} />
                    Standard (2-4 Wks)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeline('urgent')}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                      timeline === 'urgent'
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Zap size={14} className="text-amber-300" />
                    Fast-Track (7-14 Days)
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3: Bonus Toggle & Phone CTA */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Includes 100% Free SEO & AEO Setup + Mobile Responsive Guarantee
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sitemap, Schema Markup, Speed Optimization & 30 Days Free Maintenance included.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  FREE BONUS
                </span>
              </div>
            </div>

            {/* Step 4: Submission */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                Enter Your WhatsApp / Phone Number to Receive Free Scope & Prototype:
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. 6267144122 or 9876543210"
                  className="flex-1 px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />

                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-sky-600/30 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles size={14} className="text-amber-300 animate-spin" />
                  <span>Get Free Plan & Discounted Quote</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {submitted && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <Check size={14} /> Opening WhatsApp consultation with your customized scope details...
                </p>
              )}
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
