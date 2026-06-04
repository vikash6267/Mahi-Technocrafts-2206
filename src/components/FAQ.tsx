'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SiteData } from '@/lib/db';

interface FAQProps {
  data: SiteData['faq'];
}

export default function FAQ({ data }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-14 md:py-28 overflow-hidden bg-slate-50 dark:bg-[#02000a]/50" id="faq">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            FAQ
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Accordions list */}
        <div className="space-y-4">
          {data.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 overflow-hidden transition-all duration-300"
              >
                {/* Trigger Button header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none text-slate-850 dark:text-white"
                >
                  <span className="font-display font-bold text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-blue' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Answer body */}
                {isOpen && (
                  <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-850 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
