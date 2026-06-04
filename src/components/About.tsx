'use client';

import React from 'react';
import { ShieldCheck, Target, Eye, Users } from 'lucide-react';
import { SiteData } from '@/lib/db';

interface AboutProps {
  data: SiteData['about'];
}

export default function About({ data }: AboutProps) {
  return (
    <section className="relative py-14 md:py-28 overflow-hidden bg-white dark:bg-[#030014]/40" id="about">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            Who We Are
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Building Beautiful Websites & Custom Apps
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column - Story and Why Choose Us */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white">Our Story</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {data.story}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white">Why Choose Mahi Technocrafts?</h3>
              <div className="grid grid-cols-1 gap-3">
                {data.whyChooseUs.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-start"
                  >
                    <div className="w-5 h-5 rounded-md bg-brand-blue/10 text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ShieldCheck size={12} />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Vision, Mission & Achievements */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div
              className="p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800 hover:border-brand-blue/30 transition-all duration-300 flex flex-col gap-4 interactive-hover beam-border"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                <Target size={18} />
              </div>
              <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Our Mission</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {data.mission}
              </p>
            </div>

            {/* Vision Card */}
            <div
              className="p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800 hover:border-brand-purple/30 transition-all duration-300 flex flex-col gap-4 interactive-hover beam-border"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Eye size={18} />
              </div>
              <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Our Vision</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {data.vision}
              </p>
            </div>

            {/* Quality Commitment Card */}
            <div
              className="p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800 hover:border-brand-blue/30 transition-all duration-300 flex flex-col gap-4 sm:col-span-2 interactive-hover beam-border"
            >
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center flex-shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Client-First Approach</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">We design and code with transparency and rapid feedback loop iterations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
