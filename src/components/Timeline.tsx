'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  num: string;
  title: string;
  desc: string;
}

export default function Timeline() {
  const steps: TimelineStep[] = [
    { num: '01', title: 'First Discussion', desc: 'We meet with you to understand your business goals, ideas, and what you want to build.' },
    { num: '02', title: 'Smart Planning', desc: 'We create a clear roadmap, plan the screens, and design the basic structure of your project.' },
    { num: '03', title: 'Beautiful Design', desc: 'We craft gorgeous, custom visual layouts for your website or app so it looks clean and premium.' },
    { num: '04', title: 'Building & Coding', desc: 'Our team builds your website or software using reliable, fast, and modern tools.' },
    { num: '05', title: 'Thorough Testing', desc: 'We double-check every button, form, and page to ensure it is super fast and works perfectly on all screens.' },
    { num: '06', title: 'Launch & Delivery', desc: 'We set up your custom domain and host your new website securely online, ready for your customers.' },
    { num: '07', title: 'Friendly Support', desc: 'We stay by your side to help with updates, keep everything safe, and make sure your site runs smoothly.' }
  ];

  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030014]/40" id="timeline">
      {/* Background neon glows */}
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            Our Process
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            From Blueprint to Launch
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Timeline Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={step.num}
              className="p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 hover:border-brand-purple/20 transition-all duration-300 relative group flex flex-col gap-4 interactive-hover cursor-pointer"
            >
              {/* Step number badge */}
              <div className="text-3xl font-display font-black tracking-tighter text-brand-blue/30 group-hover:text-brand-blue group-hover:scale-105 transition-all duration-300">
                {step.num}
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-base">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
