'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Smartphone, 
  Globe, 
  Bot, 
  Database, 
  Palette 
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: 'web' | 'mobile' | 'ai' | 'software' | 'uiux';
  categoryLabel: string;
  clientIndustry: string;
  scopeLabel: string;
  description: string;
  image: string;
  techStack: string[];
  features: string[];
  liveUrl?: string;
}

const portfolioProjects: Project[] = [
  {
    id: 'p1',
    title: 'D2C Supermarket & E-Commerce Web App',
    category: 'web',
    categoryLabel: 'Web Platform',
    clientIndustry: 'Retail & D2C',
    scopeLabel: 'Example scope',
    description: 'High-speed Next.js 16 retail e-commerce platform with 1-click UPI (GPay/PhonePe) checkout, real-time inventory management, and automated WhatsApp order notifications.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
    techStack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Node.js', 'MongoDB', 'Razorpay/UPI'],
    features: ['Sub-second page loads (<600ms)', 'Instant WhatsApp receipt sync', 'Admin dashboard for rapid product editing'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20E-Commerce%20Web%20App'
  },
  {
    id: 'p2',
    title: 'Hospital & Healthcare OPD Appointment Portal',
    category: 'web',
    categoryLabel: 'Web Platform',
    clientIndustry: 'Healthcare & Clinics',
    scopeLabel: 'Example scope',
    description: 'Specialty medical appointment booking web portal with smart doctor time-slot scheduling, digital PDF prescriptions, and automated patient WhatsApp reminders.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    techStack: ['React 19', 'Next.js', 'Tailwind CSS', 'WhatsApp Cloud API', 'SSL 256-bit'],
    features: ['24/7 Self-service slot booking', 'Digital prescription archive', 'Doctor consultation calendar sync'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20Healthcare%20Appointment%20Portal'
  },
  {
    id: 'p3',
    title: 'Cross-Platform Real Estate Lead & 3D Tour App',
    category: 'mobile',
    categoryLabel: 'Mobile App',
    clientIndustry: 'Real Estate & Townships',
    scopeLabel: 'Example scope',
    description: 'Immersive Flutter mobile application for luxury township builders in Bhopal featuring interactive 3D virtual flat tours, RERA documents, and instant broker lead routing.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    techStack: ['Flutter', 'Dart', 'Three.js / WebGL', 'Firebase', 'Node.js Backend'],
    features: ['Interactive 3D unit walkthroughs', 'EMI & cost breakdown calculator', 'Instant sales agent callback trigger'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20Real%20Estate%20Mobile%20App'
  },
  {
    id: 'p4',
    title: 'Autonomous WhatsApp AI Customer CRM & Bot',
    category: 'ai',
    categoryLabel: 'AI & Automation',
    clientIndustry: 'Services & Coaching',
    scopeLabel: 'Example scope',
    description: 'Enterprise AI chatbot integrated directly into WhatsApp Business API that automatically qualifies prospect leads, sends customized quotation PDFs, and books calendar meetings 24/7.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
    techStack: ['Google Gemini API', 'Node.js', 'WhatsApp Cloud API', 'Webhooks', 'MongoDB'],
    features: ['2-second natural AI replies in Hindi & English', 'Automated PDF quotation generator', 'Lead status tracking in real-time CRM'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20WhatsApp%20AI%20Chatbot'
  },
  {
    id: 'p5',
    title: 'Manufacturing ERP & Multi-Warehouse Inventory System',
    category: 'software',
    categoryLabel: 'Custom Software',
    clientIndustry: 'Industrial & Manufacturing',
    scopeLabel: 'Example scope',
    description: 'Custom industrial ERP suite designed for manufacturing units in Govindpura & Mandideep. Features raw material batch tracking, barcode scanning, and 1-click GST e-invoicing.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    techStack: ['Next.js App Router', 'TypeScript', 'PostgreSQL / MongoDB', 'Chart.js', 'Docker'],
    features: ['Wireless barcode scanner integration', 'Automated GST e-way bill generation', 'Role-based supervisor permissions'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20Manufacturing%20ERP%20System'
  },
  {
    id: 'p6',
    title: 'Premier EdTech Student Portal & Mock CBT Exam Engine',
    category: 'software',
    categoryLabel: 'Custom Software',
    clientIndustry: 'EdTech & Coaching',
    scopeLabel: 'Example scope',
    description: 'Comprehensive student web application built for leading MP Nagar competitive exam coaching centers with timed CBT mock test series, video lecture protection, and fee automation.',
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80',
    techStack: ['Next.js 16', 'Node.js', 'Tailwind CSS', 'AWS S3', 'Stripe/UPI Gateway'],
    features: ['Negative marking CBT test engine', 'Piracy-protected study PDF vault', 'Automated parent fee due alerts on WhatsApp'],
    liveUrl: 'https://wa.me/916267144122?text=I%20want%20a%20demo%20of%20the%20EdTech%20Student%20Portal'
  }
];

const categories = [
  { id: 'all', label: 'All Projects', icon: <Layers size={14} /> },
  { id: 'web', label: 'Web Platforms', icon: <Globe size={14} /> },
  { id: 'mobile', label: 'Mobile Apps', icon: <Smartphone size={14} /> },
  { id: 'ai', label: 'AI & WhatsApp Bots', icon: <Bot size={14} /> },
  { id: 'software', label: 'Custom ERP & Software', icon: <Database size={14} /> }
];

export default function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredProjects = activeCategory === 'all'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <div className="space-y-10">
      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
              activeCategory === cat.id
                ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-500/20 scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col glow-card"
          >
            {/* Project Image Banner with Impact Badge */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5">
                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-sm">
                  {project.categoryLabel}
                </span>
              </div>

              <div className="absolute top-3.5 right-3.5">
                <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-md">
                  {project.scopeLabel}
                </span>
              </div>

              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <span className="text-[11px] font-semibold text-sky-300 block">
                  {project.clientIndustry}
                </span>
                <h3 className="text-base font-bold tracking-tight line-clamp-1 text-white">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.description}
              </p>

              {/* Key Features */}
              <div className="space-y-1.5 pt-1">
                {project.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Trigger */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                  Estimate based on project scope
                </span>

                <a
                  href={project.liveUrl || 'https://wa.me/916267144122'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Request Demo</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
