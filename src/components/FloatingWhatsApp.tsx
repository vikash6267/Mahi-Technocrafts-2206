'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, X, Sparkles, Send } from 'lucide-react';
import { trackWhatsAppClick, trackPhoneCall } from '@/lib/analytics';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phoneNumber = '916267144122';

  useEffect(() => {
    // Show a small teaser popup after 6 seconds
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    trackWhatsAppClick('floating_widget');
    const text = customMsg.trim() 
      ? encodeURIComponent(customMsg) 
      : encodeURIComponent('Hi Mahi TechnoCrafts team, I would like to get a quote & discuss my project (Website/App/Custom Software).');
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
      {/* Floating Teaser Prompt */}
      {showNotification && !isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl max-w-xs flex items-center gap-3 animate-fadeIn relative">
          <button
            onClick={() => setShowNotification(false)}
            className="absolute -top-2 -right-2 w-5 h-5 bg-slate-200 dark:bg-slate-750 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs shadow"
            aria-label="Close notification"
          >
            <X size={12} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Sparkles size={18} className="animate-spin text-emerald-500" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              Need Instant Quote? <span className="text-emerald-500">Online</span>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Websites from ₹2,999*. Chat on WhatsApp!
            </p>
          </div>
        </div>
      )}

      {/* Interactive WhatsApp Quick Chat Box Modal */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl w-80 sm:w-88 flex flex-col gap-4 animate-fadeIn relative overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 -mx-5 -mt-5 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
                MT
              </div>
              <div>
                <h4 className="font-display font-bold text-sm leading-tight">Mahi TechnoCrafts</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Typically replies in 5 mins
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Pre-filled Questions */}
          <div className="space-y-2 text-xs">
            <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Quick Inquiries:
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                '🚀 Get Website Quote (From ₹2,999*)',
                '📱 Mobile App Development Estimate',
                '🏥 Industry Solution Consultation',
                '📈 SEO & Digital Marketing Audit'
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCustomMsg(item);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 text-xs transition-colors border border-slate-200/60 dark:border-slate-700/60"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message input form */}
          <form onSubmit={handleSendWhatsApp} className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type a message or requirement..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors"
              aria-label="Send via WhatsApp"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Direct call option */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Prefer a direct phone call?</span>
            <a
              href="tel:+916267144122"
              onClick={() => trackPhoneCall('floating_widget')}
              className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <Phone size={12} />
              +91 6267144122
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotification(false);
        }}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform duration-200" />
      </button>
    </div>
  );
}
