'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteData } from '@/lib/db';

interface ServicesProps {
  data: SiteData['services'];
}

// Helper component to resolve dynamic lucide icons
const ServiceIcon = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore
  const Icon = Icons[name];
  if (!Icon) return <Icons.HelpCircle className={className} />;
  return <Icon className={className} />;
};

export default function Services({ data }: ServicesProps) {
  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030014]/40 animate-section" id="services">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue flex items-center justify-center gap-2">
            <Sparkles size={12} className="animate-pulse text-sky-700 dark:text-brand-blue" />
            Capabilities
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Innovative Tech Built to Scale
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((service, index) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', damping: 20 }}
              className="group p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 hover:border-brand-blue/30 shadow-xl flex flex-col justify-between h-[250px] relative overflow-hidden interactive-hover cursor-pointer beam-border"
            >
              {/* Inner glowing hover element */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Dynamic Icon */}
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-800 dark:text-white flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-all duration-300">
                  <ServiceIcon name={service.icon} className="w-5 h-5" />
                </div>

                {/* Title and Copy */}
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-base tracking-wide">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>

              {/* Learn More link */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue opacity-85 group-hover:opacity-100 transition-opacity pt-4 relative z-10">
                <Link href="/services" className="flex items-center gap-1">
                  Learn More
                  <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
