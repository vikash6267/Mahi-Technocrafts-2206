import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, Users, TrendingUp, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Industry Software Solutions | Mahi TechnoCrafts',
  description: 'Specialized software solutions for Healthcare, E-commerce, Real Estate, Manufacturing, Restaurants, Education, Finance, and Agriculture. Custom development starting from ₹2,999*.',
  alternates: {
    canonical: '/solutions'
  }
};

const industries = [
  {
    id: 'healthcare',
    name: 'Healthcare & Clinics',
    icon: '🏥',
    description: 'Digital health solutions, doctor appointment booking, patient EHR, and telemedicine apps',
    features: ['Patient Management', 'Appointment Booking', 'Telemedicine Portal', 'Medical Records Vault'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '15+ Healthcare Clients',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'ecommerce',
    name: 'Retail & E-commerce',
    icon: '🛒',
    description: 'High-converting online stores, multi-vendor marketplaces, and 1-click UPI checkout systems',
    features: ['Instant UPI Checkout', 'Inventory Management', 'WhatsApp Notifications', 'Analytics Dashboard'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '50+ E-commerce Sites',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Builders',
    icon: '🏢',
    description: 'Property listing portals, 3D virtual tour embeds, broker lead assignment CRM, and maps',
    features: ['Interactive Map Search', 'Broker CRM System', '360° Virtual Tours', 'WhatsApp Lead Routing'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '20+ Property Firms',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Cafes',
    icon: '🍽️',
    description: '0% commission online food ordering, contactless table QR menus, and kitchen billing POS',
    features: ['Zero-Commission Orders', 'QR Table Menu Cards', 'Kitchen Display System', 'Loyalty Engine'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '30+ Restaurants',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 'education',
    name: 'Education & Coaching',
    icon: '🎓',
    description: 'Anti-piracy LMS platforms, student portals, online mock test series, and fee collection',
    features: ['Anti-Piracy Video Player', 'Live Online Classes', 'Mock Test Engine', 'Student Fee Portal'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '25+ Institutes',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'finance',
    name: 'FinTech & Finance',
    icon: '💰',
    description: 'Bank-grade encrypted finance software, loan EMI tracking, GST billing, and ledger apps',
    features: ['Loan Management CRM', 'GST Invoice Generator', '256-Bit Encrypted DB', 'Payout API Sync'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '10+ Financial Clients',
    gradient: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Plants',
    icon: '🏭',
    description: 'Custom industrial ERP, factory production floor tracking, raw material stock, and dispatch',
    features: ['Raw Material Stock', 'Batch QC Tracking', 'Machine Downtime Logs', 'Purchase Orders (PO)'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '12+ Plants',
    gradient: 'from-slate-600 to-zinc-700'
  },
  {
    id: 'agriculture',
    name: 'Agriculture & AgriTech',
    icon: '🌾',
    description: 'Daily Mandi price broadcasts, direct farmer-to-buyer marketplaces, and cold storage ERP',
    features: ['Live Mandi Rates', 'Farmer Direct Market', 'Hindi Vernacular UI', 'Cold Storage Logs'],
    startingPrice: 'Starting from ₹2,999*',
    clients: '8+ Agri-businesses',
    gradient: 'from-green-600 to-emerald-600'
  }
];

export default function SolutionsPage() {
  const solutionsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Industry-Specific Software Solutions',
    provider: {
      '@type': 'Organization',
      name: 'Mahi TechnoCrafts'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Industry Solutions',
      itemListElement: industries.map(industry => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: `${industry.name} Solutions`,
          description: industry.description
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(solutionsSchema).replace(/</g, '\\u003c')
        }}
      />
      
      <div className="min-h-screen py-16 max-w-7xl mx-auto px-5 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 shadow-sm">
            <Sparkles size={12} className="text-brand-purple animate-pulse" />
            Purpose-Built Business Architectures
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Industry-Specific <span className="text-gradient">Solutions</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Tailored software solutions engineered for your business model. From healthcare to e-commerce, we build high-converting applications that solve operational pain points.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-semibold pt-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle size={16} />
              <span>150+ Successful Deployments</span>
            </div>
            <div className="flex items-center gap-2 text-sky-600">
              <Zap size={16} />
              <span>Starting from ₹2,999*</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Shield size={16} />
              <span>100% SEO & Cloud Ready</span>
            </div>
          </div>
        </div>

        {/* Industries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {industries.map((industry) => (
            <Link
              key={industry.id}
              href={`/solutions/${industry.id}`}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {industry.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-sky-600 transition-colors">
                  {industry.name}
                </h3>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-normal">
                  {industry.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-1.5 mb-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing</span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{industry.startingPrice}</span>
                </div>
                
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-sky-600 flex items-center gap-1">
                  View Demo
                  <ArrowRight 
                    size={14} 
                    className="transform group-hover:translate-x-1 transition-transform" 
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white text-center border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-purple-500/10 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl md:text-4xl font-display font-bold">
              Don&apos;t See Your Exact Industry?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We create custom software and websites for any business model. Tell us your requirements and we will build exactly what you need.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link 
                href="/contact" 
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20"
              >
                <Users size={16} />
                Get Custom Quote & Prototype
              </Link>
              <Link 
                href="/#projects" 
                className="border border-slate-700 hover:bg-white/10 px-8 py-4 rounded-xl text-xs uppercase tracking-wider font-bold text-white transition-all inline-flex items-center justify-center gap-2"
              >
                <TrendingUp size={16} />
                View Case Studies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}