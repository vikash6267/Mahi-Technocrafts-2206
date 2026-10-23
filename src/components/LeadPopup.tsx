'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Send, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';

export default function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Website Development (Business / Company)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('lead_popup_dismissed');
      if (dismissed === 'true') {
        return;
      }
    } catch {
      // In case storage is blocked
    }

    // Show after 4.5 seconds of browsing
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('lead_popup_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: `${phone.replace(/\D/g, '')}@lead.mahitechnocrafts.in`,
          subject: `[Quick Popup Lead] ${service}`,
          message: `Lead from Website Popup Modal:\nName: ${name.trim()}\nPhone: ${phone.trim()}\nLooking to Build: ${service}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setIsSubmitted(true);
      try {
        sessionStorage.setItem('lead_popup_dismissed', 'true');
      } catch {
        // ignore
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please call or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1028] border border-sky-500/30 shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {isSubmitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white font-display">
              Request Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
              Thank you, <strong>{name}</strong>! Our founder & technical director will contact you via WhatsApp/call within <strong>15 minutes</strong> with a custom quote.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/916267144122?text=Hello%20Mahi%20TechnoCrafts%2C%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(service)}.%20My%20name%20is%20${encodeURIComponent(name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Follow Up on WhatsApp</span>
              </a>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-500/20 text-sky-600 dark:text-sky-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles size={13} className="text-sky-500" />
              <span>Get Free Project Scope & Cost Estimate</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white font-display tracking-tight">
              Start Your Project With Mahi TechnoCrafts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct technical consultation · Sub-second page speed · 100% source code ownership.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            {/* Lead Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma / Company Name"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  WhatsApp / Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  What do you want to build? <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-medium cursor-pointer"
                >
                  <option value="Website Development (Business / Company)">Website Development (Business / Company)</option>
                  <option value="E-Commerce Online Shopping Store">E-Commerce Online Shopping Store</option>
                  <option value="Mobile App Development (Android / iOS)">Mobile App Development (Android / iOS)</option>
                  <option value="Custom Software / Billing / ERP / CRM">Custom Software / Billing / ERP / CRM</option>
                  <option value="WhatsApp Chatbot / AI Automation">WhatsApp Chatbot / AI Automation</option>
                  <option value="Doctor / Hospital / Clinic Website">Doctor / Hospital / Clinic Website</option>
                  <option value="School / College / Education Portal">School / College / Education Portal</option>
                  <option value="Real Estate & Builder Website">Real Estate & Builder Website</option>
                  <option value="SEO & Google 1st-Page Ranking">SEO & Google 1st-Page Ranking</option>
                  <option value="Other Custom Project">Other Custom Project</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-0.5"
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Sending Request...' : 'Get Instant Quotation & Callback'}</span>
              </button>
            </form>

            {/* Direct Connect Row (Call Now + WhatsApp Us) */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-2">
                Or Connect Instantly With Founder
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="tel:+916267144122"
                  className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:text-sky-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Phone size={14} className="text-sky-600" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/916267144122?text=Hello%20Mahi%20TechnoCrafts%2C%20I%20want%20to%20discuss%20a%20project%20quotation."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>100% Confidential · No Spam · Callback within 15 Minutes</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
