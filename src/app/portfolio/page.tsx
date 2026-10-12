import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PortfolioClient from './PortfolioClient';
import { Sparkles, ArrowRight, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Project Examples | Mahi TechnoCrafts Bhopal',
  description: 'Explore website, ecommerce, mobile app, automation, and business software examples from Mahi TechnoCrafts in Bhopal.',
  keywords: [
    'portfolio mahi technocrafts',
    'web development portfolio bhopal',
    'flutter mobile apps showcase',
    'ai whatsapp automation projects',
    'custom software case studies bhopal',
    'nextjs website showcase'
  ],
  alternates: {
    canonical: 'https://mahitechnocrafts.in/portfolio'
  },
  openGraph: {
    title: 'Project Examples | Mahi TechnoCrafts Bhopal',
    description: 'Explore website, ecommerce, mobile app, automation, and business software examples from Mahi TechnoCrafts in Bhopal.',
    url: 'https://mahitechnocrafts.in/portfolio',
    type: 'website',
    images: [{ url: '/images/herosection.webp', width: 1200, height: 630, alt: 'Mahi TechnoCrafts project examples' }]
  }
};

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Mahi TechnoCrafts Project Examples',
  'description': 'Examples of website, mobile app, and business software project scopes offered by Mahi TechnoCrafts in Bhopal, MP.',
  'url': 'https://mahitechnocrafts.in/portfolio',
  'provider': {
    '@type': 'LocalBusiness',
    'name': 'Mahi TechnoCrafts',
    'telephone': '+916267144122',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Hamidia Rd, Badabagh, Shahjahanabad',
      'addressLocality': 'Bhopal',
      'addressRegion': 'Madhya Pradesh',
      'postalCode': '462001',
      'addressCountry': 'IN'
    }
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02000e] text-slate-900 dark:text-slate-100 pt-28 pb-20 selection:bg-sky-500 selection:text-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>Selected project examples</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Examples</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Browse examples of ecommerce, healthcare, real estate, automation, and business software workflows. Each card outlines a possible project scope; ask us about relevant live work and references for your requirements.
          </p>

          <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Sparkles size={16} className="text-sky-500" />
            Discuss scope and pricing for your project
          </div>
        </div>

        {/* Interactive Filterable Client Component */}
        <PortfolioClient />

        {/* Bottom CTA Card */}
        <div className="mt-20 rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-sky-600 via-indigo-600 to-purple-700 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
              Ready to Turn Your Business Vision Into High-Speed Reality?
            </h2>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed">
              We agree deliverables, handover, maintenance, and support in the project proposal so you know what is included before work begins.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/916267144122?text=Hello%20Vikash!%20I%20reviewed%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-white text-sky-700 hover:bg-slate-100 font-bold text-sm shadow-xl transition transform hover:scale-105 inline-flex items-center gap-2"
              >
                <PhoneCall size={16} />
                Discuss On WhatsApp (+91 6267144122)
              </a>

              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-sm backdrop-blur-md transition inline-flex items-center gap-2"
              >
                Get a Free Estimate
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
