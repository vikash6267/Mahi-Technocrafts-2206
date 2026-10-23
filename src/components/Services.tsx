'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    image: '/images/inext-web-reference.webp',
    title: 'Custom Websites & Web Portals',
    desc: 'Responsive business websites with clear navigation, useful calls to action, and technical SEO foundations.',
    icon: <Globe className="w-5 h-5 text-sky-500" />,
    badge: 'Most Popular',
    price: 'Starting from ₹2,999*',
    features: ['Mobile-first layouts', 'Clear page structure', 'Launch support scoped to your needs']
  },
  {
    id: 'mobile-dev',
    slug: 'mobile-dev',
    image: '/images/inext-app-reference.webp',
    title: 'Mobile Apps (iOS & Android)',
    desc: 'Plan an Android or iOS app around your users, workflows, and the features your business needs.',
    icon: <Smartphone className="w-5 h-5 text-purple-500" />,
    badge: 'PlayStore & AppStore',
    price: 'Starting from ₹2,999*',
    features: ['Android and iOS planning', 'Thoughtful user flows', 'Integrations scoped to your project']
  },
  {
    id: 'ecommerce-management',
    slug: 'ecommerce-management',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    title: 'Online Shopping & Quick-Commerce Stores',
    desc: 'Bring your catalogue, checkout options, order management, and customer updates into one mobile-friendly store.',
    icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
    badge: 'Online storefronts',
    price: 'Starting from ₹2,999*',
    features: ['Product catalogues', 'Checkout and order flows', 'Customer notifications']
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    image: '/images/inext-ai-reference.webp',
    title: 'WhatsApp Automation & 24/7 AI Chatbots',
    desc: 'Use chat and workflow automation to handle common questions, route enquiries, and support your team.',
    icon: <Bot className="w-5 h-5 text-amber-500" />,
    badge: 'Helpful automation',
    price: 'Starting from ₹2,999*',
    features: ['Frequently asked questions', 'Lead routing and hand-off', 'Workflow integrations']
  },
  {
    id: 'erp-crm',
    slug: 'erp-crm',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    title: 'Billing, GST & Custom ERP Software',
    desc: 'Bring billing, stock, team workflows, and business reporting into a system shaped around your operations.',
    icon: <Database className="w-5 h-5 text-indigo-500" />,
    badge: 'Plant & Shop ERP',
    price: 'Starting from ₹2,999*',
    features: ['Billing and inventory flows', 'Role-based dashboards', 'Reports for your team']
  },
  {
    id: 'seo-services',
    slug: 'seo-services',
    image: '/images/inext-marketing-reference.webp',
    title: 'Google Local SEO & Maps Ranking (GMB)',
    desc: 'Improve local search visibility with a considered plan for your Google Business Profile, website, and location-focused content.',
    icon: <Search className="w-5 h-5 text-blue-500" />,
    badge: 'Local SEO',
    price: 'Starting from ₹2,999*',
    features: ['Business Profile support', 'Technical SEO checks', 'Local content planning']
  },
  {
    id: 'digital-marketing',
    slug: 'digital-marketing',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80',
    title: 'Meta, Instagram & Google Lead Ads (PPC)',
    desc: 'Plan and manage paid campaigns with clear audiences, useful landing pages, and conversion tracking.',
    icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
    badge: 'Direct Phone Leads',
    price: 'Starting from ₹2,999*',
    features: ['Audience and campaign planning', 'Landing page alignment', 'Performance reporting']
  },
  {
    id: 'healthcare-software',
    slug: '/solutions/healthcare',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80',
    title: 'Hospital & Clinic Management (HMIS)',
    desc: 'Complete digital OPD token queue system, 24/7 patient appointment booking, digital prescriptions, and lab test report portals for doctors.',
    icon: <Stethoscope className="w-5 h-5 text-teal-500" />,
    badge: 'Doctor Friendly',
    price: 'Starting from ₹2,999*',
    features: ['Zero Reception Waiting', 'WhatsApp Reminders', 'Digital Rx History']
  },
  {
    id: 'real-estate-crm',
    slug: '/solutions/real-estate',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    title: 'Real Estate CRM & Builder Portals',
    desc: 'Showcase flats, plots, and commercial projects with 3D walkthroughs, price EMI calculators, and instant buyer inquiry routing to brokers.',
    icon: <Building2 className="w-5 h-5 text-amber-600" />,
    badge: 'Builder Ready',
    price: 'Starting from ₹2,999*',
    features: ['3D Photo Walkthroughs', 'Direct Buyer Calls', 'Broker Lead Tracking']
  },
  {
    id: 'restaurant-pos',
    slug: '/solutions/restaurants',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    title: 'Restaurant QR Table Ordering & POS Billing',
    desc: 'Contactless QR codes on every dining table. Guests browse dishes, customize orders, and pay with zero delivery commission fees.',
    icon: <Utensils className="w-5 h-5 text-rose-500" />,
    badge: '0% Commission',
    price: 'Starting from ₹2,999*',
    features: ['Table QR Menus', 'Kitchen Thermal KOT', 'Birthday SMS Offers']
  },
  {
    id: 'education-erp',
    slug: '/solutions/education',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    title: 'School, College & Coaching Student App',
    desc: 'Collect tuition fees online via UPI with automated SMS receipts, conduct online mock test series, and share video lectures securely.',
    icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
    badge: 'Institute App',
    price: 'Starting from ₹2,999*',
    features: ['Online UPI Fee Portal', 'Secure Video Classes', 'WhatsApp Notice Board']
  },
  {
    id: 'branding-identity',
    slug: 'branding-identity',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80',
    title: 'Logo, UI/UX & Complete Brand Identity',
    desc: 'High-end vector logo designs, visiting cards, company letterheads, brochures, and social media branding kits that command trust.',
    icon: <Palette className="w-5 h-5 text-pink-500" />,
    badge: 'Complete Brand Kit',
    price: 'Starting from ₹2,999*',
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
            <span>Web & Software Development Services in Bhopal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Practical Digital Solutions for Growing Businesses
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            From business websites and mobile apps to workflow automation, we plan and build digital tools around your goals. Based in Bhopal, we work with businesses across India.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Core capabilities; industry-specific examples live in the solutions directory. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {businessServices.slice(0, 7).map((service) => (
            <Link
              key={service.id}
              href={service.slug.startsWith('/') || service.slug.startsWith('http') ? service.slug : `/services/${service.slug}`}
              className="group p-5 sm:p-6 rounded-3xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 hover:border-sky-400/60 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden glow-card h-full"
            >
              <div className="relative -mx-5 -mt-5 mb-5 aspect-[16/8] overflow-hidden sm:-mx-6 sm:-mt-6">
                <Image src={service.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
              </div>
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

              {/* Service page link */}
              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end">
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
