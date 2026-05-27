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
    { num: '01', title: 'Requirement Analysis', desc: 'Detailed consultations to map scope, user stories, and target architecture specifications.' },
    { num: '02', title: 'Agile Planning', desc: 'Sprint schedules, wireframe workflows, database mapping, and API contract designs.' },
    { num: '03', title: 'UI/UX Design', desc: 'Premium Figma design prototypes following sleek glassmorphism and modern guidelines.' },
    { num: '04', title: 'Development', desc: 'Clean, modular Next.js and React coding with fully scalable database integrations.' },
    { num: '05', title: 'Testing & QA', desc: 'Comprehensive endpoint testing, layout audits, responsiveness, and speed checks.' },
    { num: '06', title: 'Deployment', desc: 'Auto-scaling production hosting, CDN caches, domain configs, and dynamic sitemaps launch.' },
    { num: '07', title: '24/7 Support', desc: 'Security updates, backup logs, environment monitoring, and performance audits.' }
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
