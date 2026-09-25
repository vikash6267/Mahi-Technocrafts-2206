'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Bot, 
  Search, 
  Palette, 
  ShoppingCart, 
  Database, 
  TrendingUp,
  Zap,
  Building2,
  Stethoscope,
  Utensils,
  GraduationCap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { SiteData } from '@/lib/db';

interface ServicesProps {
  data?: SiteData['services'];
}

const businessServices = [
  {
    id: 'web-dev',
    slug: 'web-dev',
    title: 'Custom Websites & Web Portals',
    desc: 'Ultra-fast business websites that look stunning on mobile phones, load in <1 second, and generate daily customer phone inquiries.',
    icon: <Globe className="w-5 h-5 text-sky-500" />,
    badge: 'Most Popular',
    price: 'From ₹2,999*',
    features: ['100% Mobile Responsive', 'Fast 7–14 Day Delivery', 'Free SSL & Hosting']
  },
  {
    id: 'mobile-dev',
    slug: 'mobile-dev',
    title: 'Mobile Apps (iOS & Android)',
    desc: 'High-performance mobile apps for Android & iPhone with instant push notifications, UPI payment gateway, and smooth user flow.',
    icon: <Smartphone className="w-5 h-5 text-purple-500" />,
    badge: 'PlayStore & AppStore',
    price: 'From ₹9,999*',
    features: ['Live Push Alerts', 'Android + iOS App', 'Offline Support']
  },
  {
    id: 'ecommerce-management',
    slug: 'ecommerce-management',
    title: 'Online Shopping & Quick-Commerce Stores',
    desc: 'Sell your products online 24/7 with 1-click Google Pay & PhonePe payments, automated WhatsApp order alerts, and 0% platform commission.',
    icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
    badge: 'Zero Commission',
    price: 'From ₹4,999*',
    features: ['1-Click UPI Payments', 'WhatsApp Order Sync', 'Easy Mobile Admin']
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    title: 'WhatsApp Automation & 24/7 AI Chatbots',
    desc: 'Smart automated assistants that reply to customer inquiries on WhatsApp within 2 seconds, send PDF catalogs, and book appointments.',
    icon: <Bot className="w-5 h-5 text-amber-500" />,
    badge: '24/7 Auto Replies',
    price: 'From ₹3,999*',
    features: ['Instant Auto Replies', 'Catalog Sharing', 'Saves 20+ Hours Weekly']
  },
  {
    id: 'erp-crm',
    slug: 'erp-crm',
    title: 'Billing, GST & Custom ERP Software',
    desc: 'Simple mobile & computer dashboards to print GST invoices, track warehouse stock, manage worker attendance, and view profit reports.',
    icon: <Database className="w-5 h-5 text-indigo-500" />,
    badge: 'Plant & Shop ERP',
    price: 'From ₹9,999*',
    features: ['1-Click GST Invoices', 'Low-Stock Alerts', 'Multi-Branch Sync']
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    title: 'Google Local SEO & Maps Ranking (GMB)',
    desc: 'Get your business ranked on the first page of Google Search and Google Maps when local customers search for your services in Bhopal & India.',
    icon: <Search className="w-5 h-5 text-blue-500" />,
    badge: '#1 Rank on Google',
    price: 'From ₹2,999*',
    features: ['Google Maps Ranking', 'Local Keyword Schema', '5-Star Review Growth']
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    title: 'Meta, Instagram & Google Lead Ads (PPC)',
    desc: 'High-converting Google Search, Facebook, and Instagram ad campaigns that deliver verified buyer phone calls and WhatsApp leads directly to you.',
    icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
    badge: 'Direct Phone Leads',
    price: 'From ₹4,999*',
    features: ['Targeted Local Audiences', 'WhatsApp Lead Routing', 'Daily Lead Analytics']
  },
  {
    id: 'healthcare-software',
    slug: 'healthcare',
    title: 'Hospital & Clinic Management (HMIS)',
    desc: 'Complete digital OPD token queue system, 24/7 patient appointment booking, digital prescriptions, and lab test report portals for doctors.',
    icon: <Stethoscope className="w-5 h-5 text-teal-500" />,
    badge: 'Doctor Friendly',
    price: 'From ₹4,999*',
    features: ['Zero Reception Waiting', 'WhatsApp Reminders', 'Digital Rx History']
  },
  {
    id: 'real-estate-crm',
    slug: 'real-estate',
    title: 'Real Estate CRM & Builder Portals',
    desc: 'Showcase flats, plots, and commercial projects with 3D walkthroughs, price EMI calculators, and instant buyer inquiry routing to brokers.',
    icon: <Building2 className="w-5 h-5 text-amber-600" />,
    badge: 'Builder Ready',
    price: 'From ₹4,999*',
    features: ['3D Photo Walkthroughs', 'Direct Buyer Calls', 'Broker Lead Tracking']
  },
  {
    id: 'restaurant-pos',
    slug: 'restaurants',
    title: 'Restaurant QR Table Ordering & POS Billing',
    desc: 'Contactless QR codes on every dining table. Guests browse dishes, customize orders, and pay with zero delivery commission fees.',
    icon: <Utensils className="w-5 h-5 text-rose-500" />,
    badge: '0% Commission',
    price: 'From ₹3,999*',
    features: ['Table QR Menus', 'Kitchen Thermal KOT', 'Birthday SMS Offers']
  },
  {
    id: 'education-erp',
    slug: 'education',
    title: 'School, College & Coaching Student App',
    desc: 'Collect tuition fees online via UPI with automated SMS receipts, conduct online mock test series, and share video lectures securely.',
    icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
    badge: 'Institute App',
    price: 'From ₹4,999*',
    features: ['Online UPI Fee Portal', 'Secure Video Classes', 'WhatsApp Notice Board']
  },
  {
    id: 'branding-identity',
    slug: 'branding-identity',
    title: 'Logo, UI/UX & Complete Brand Identity',
    desc: 'High-end vector logo designs, visiting cards, company letterheads, brochures, and social media branding kits that command trust.',
    icon: <Palette className="w-5 h-5 text-pink-500" />,
    badge: 'Complete Brand Kit',
    price: 'From ₹2,999*',
    features: ['Vector Master Files', 'Social Media Templates', 'Visiting Cards Design']
  }
];

export default function Services({ data }: ServicesProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white dark:bg-[#02000a]" id="services">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>Complete End-to-End IT & Digital Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Everything Your Business Needs to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Scale & Dominate</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            From basic business websites to high-traffic mobile apps and automated WhatsApp CRM software — we build everything with 100% custom code and zero hidden fees.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 12 Services Responsive 3/4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {businessServices.map((service) => (
            <Link
              key={service.id}
              href={service.slug.startsWith('http') ? service.slug : `/services/${service.slug}`}
              className="group p-5 sm:p-6 rounded-3xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden glow-card h-full"
            >
              <div className="space-y-4 flex-1 flex flex-col">
                
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                    {service.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <Check size={13} className="text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Price & Link Footer - Fixed baseline */}
              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Starts At</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{service.price}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>Details</span>
                  <ArrowRight size={13} />
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-display font-extrabold flex items-center justify-center md:justify-start gap-2">
              <Zap size={20} className="text-amber-400" />
              Need a Custom IT Solution or Fast Prototype?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Tell us your idea. We build custom clickable prototypes in 24 hours with zero advance commitment.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center whitespace-nowrap"
            >
              Request Free Prototype
            </Link>
            <a
              href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts,%20I%20need%20a%20free%20prototype%20for%20my%20business."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center whitespace-nowrap"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
