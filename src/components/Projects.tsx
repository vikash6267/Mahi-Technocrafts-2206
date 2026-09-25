'use client';

import React from 'react';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ProjectItem } from '@/lib/db';

interface ProjectsProps {
  data?: ProjectItem[];
}

const featuredCaseStudies = [
  {
    id: 'case-1',
    title: 'Direct UPI Online Shopping Store & WhatsApp Order Sync',
    category: 'Retail & E-Commerce',
    clientType: 'Fashion & Retail Store (Bhopal)',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern retail store and online shopping system',
    description: 'We created an ultra-fast online shopping website where customers can buy clothes and accessories in 1-click using Google Pay, PhonePe, and Paytm. All orders and shipping details sync automatically to WhatsApp.',
    tags: ['1-Click UPI Payment', 'WhatsApp Orders', 'Superfast on Mobile', 'Automated Invoices'],
    metric: '+310% Online Orders',
    link: '/solutions/ecommerce'
  },
  {
    id: 'case-2',
    title: 'Hospital & Clinic 24/7 Patient Booking Portal',
    category: 'Healthcare & Clinics',
    clientType: 'Multi-Doctor Polyclinic (Bhopal)',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern hospital and clinic reception and doctor consultation system',
    description: 'We built a 24/7 doctor appointment booking portal that eliminated crowded reception lines. Patients get automatic WhatsApp reminder messages and can view their digital prescriptions and lab test reports online.',
    tags: ['Zero Waiting Lines', 'WhatsApp Appointment Alerts', 'Digital Prescriptions', '100% Secure'],
    metric: '75% Less Reception Crowding',
    link: '/solutions/healthcare'
  },
  {
    id: 'case-3',
    title: 'Real Estate Property Showcase & Buyer Lead Portal',
    category: 'Real Estate & Builders',
    clientType: 'Luxury Builder & Agency (MP)',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Modern real estate residential towers and luxury apartment listings website',
    description: 'We designed a modern property listing portal with 3D photos, price calculators, and map locations. Buyers can tap one button to connect with sales agents via phone call or WhatsApp.',
    tags: ['Direct Buyer Inquiries', '3D Photo Walkthroughs', 'Loan EMI Calculator', 'Google #1 Ranked'],
    metric: '4.5x More Property Calls',
    link: '/solutions/real-estate'
  },
  {
    id: 'case-4',
    title: 'Automatic 24/7 WhatsApp Customer Assistant & Support Bot',
    category: 'AI & Business Automation',
    clientType: 'Customer Service Business',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Automated digital reporting and customer invoicing desk',
    description: 'We set up an intelligent 24/7 automated assistant that instantly replies to customer questions, sends product catalogs, and books sales calls without requiring staff to stay awake at night.',
    tags: ['24/7 Instant Auto Replies', 'Zero Missed Inquiries', 'Saves 20+ Hours Weekly', 'Easy WhatsApp Setup'],
    metric: '85% Inquiries Automated',
    link: '/services/ai-solutions'
  }
];

export default function Projects({ data }: ProjectsProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-slate-50 dark:bg-[#02000a]" id="projects">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (Non-Technical & Trust-Building) */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>Proven Real-World Case Studies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            See How We Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Businesses Grow</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Real websites and apps we built that doubled customer sales, eliminated manual work, and brought daily phone inquiries in Bhopal & India.
          </p>

          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-sky-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Projects Grid with Real Authentic Indian Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {featuredCaseStudies.map((project, index) => (
            <div
              key={project.id || index}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400/50 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 relative glow-card"
            >
              
              {/* Photo Banner Container - 100% Full Width */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Subtle bottom gradient only behind metric badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Metric Badge Overlay */}
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                  <TrendingUp size={14} />
                  <span>{project.metric}</span>
                </div>
              </div>

              {/* Details (Non-Technical & Result-Focused) */}
              <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                      {project.category}
                    </span>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {project.clientType}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {project.description}
                  </p>
                </div>

                {/* Key Tags & Action Link */}
                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-1.5 flex-wrap">
                    {project.tags.map((t: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Tested & Delivered
                    </span>

                    <Link
                      href={project.link}
                      className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group/btn"
                    >
                      <span>See Similar Solution</span>
                      <ArrowRight size={13} className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
