'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Check,
  ShoppingBag,
  Stethoscope,
  Building2,
  Wheat,
  Utensils,
  GraduationCap,
  BadgeDollarSign,
  Factory,
  Hotel,
  Dumbbell,
  Car,
  Scale
} from 'lucide-react';

interface SolutionItem {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  image: string;
  tagline: string;
  description: string;
  departmentScope: string;
  features: string[];
  metric: string;
  priceHook: string;
  badge: string;
}

const solutionsData: SolutionItem[] = [
  {
    id: 'ecommerce',
    name: 'Retail Shops, Kirana & D2C Stores',
    slug: 'ecommerce',
    emoji: '🛒',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    tagline: 'Sell 24/7 on WhatsApp & Website',
    description: 'A complete online shop where customers buy on their phone with Google Pay / PhonePe. All order details come straight to your WhatsApp.',
    departmentScope: 'Billing, Inventory, WhatsApp Orders, 10-Min Local Delivery',
    features: ['1-Click UPI (GPay/PhonePe) Payments', 'Automatic WhatsApp Order Alerts', 'Product Upload from Mobile in 30s', '0% Platform Commission'],
    metric: '+320% Online Sales',
    priceHook: 'From ₹2,999*',
    badge: 'Top Choice'
  },
  {
    id: 'healthcare',
    name: 'Hospitals, Polyclinics & Pathology Labs',
    slug: 'healthcare',
    emoji: '🏥',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    tagline: 'Doctor Appointments & Digital Prescriptions',
    description: 'Let patients book appointment slots online 24/7 without standing in clinic queues. Send digital prescriptions and lab reports securely.',
    departmentScope: 'OPD Queue Tokens, Patient History, Doctor Slots, Lab PDF Reports',
    features: ['24/7 WhatsApp Appointment Booking', 'Zero Crowding at Reception Tokens', 'Digital Prescription (Rx) Records', 'Online Lab Test Report Downloads'],
    metric: '75% Less Queue Time',
    priceHook: 'From ₹2,999*',
    badge: 'Doctor Friendly'
  },
  {
    id: 'ai-solutions',
    name: 'AI Automations, WhatsApp Bots & CRM',
    slug: 'ai-solutions',
    emoji: '🤖',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    tagline: '24/7 AI Customer Reps & Auto Invoicing',
    description: 'Smart AI assistants that reply to WhatsApp inquiries in 2 seconds, qualify buyer leads, send catalog PDFs, and automate GST invoices without human delay.',
    departmentScope: 'WhatsApp AI Reps, Lead Scoring, Auto GST Billing, PDF Catalogs',
    features: ['Instant 24/7 AI WhatsApp Replies', 'Zero Missed Customer Leads', 'Auto-Generate GST Invoices & PDFs', 'Saves 25+ Hours Every Week'],
    metric: '85% Inquiries Automated',
    priceHook: 'From ₹3,999*',
    badge: 'Trending AI'
  },
  {
    id: 'real-estate',
    name: 'Real Estate Builders, Townships & Brokers',
    slug: 'real-estate',
    emoji: '🏢',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    tagline: 'Showcase Flats & Plots to Direct Buyers',
    description: 'Show luxury photos, floor plans, and 3D walkthroughs of your flats and plots. Buyers click to call or WhatsApp your sales team directly.',
    departmentScope: '3D Floorplans, Broker Leads, EMI Calculator, Site Visit Diary',
    features: ['Direct Buyer Phone Calls & WhatsApp', 'Interactive Map & Location Search', 'Built-in Loan EMI Estimator', 'Broker Commission & Inquiries Sync'],
    metric: '4.5x More Inquiries',
    priceHook: 'From ₹2,999*',
    badge: 'High Conversion'
  },
  {
    id: 'agriculture',
    name: 'AgriTech, Mandi Traders & Cold Storage',
    slug: 'agriculture',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    tagline: 'Daily Mandi Rates & Farmer Direct Portal',
    description: 'Send daily Mandi commodity rates to farmers on WhatsApp, manage cold storage warehouse lots, and sell farm produce directly to bulk buyers.',
    departmentScope: 'Daily Mandi Rates, Farmer CRM, Cold Storage Lot Inward, Hindi Voice',
    features: ['Daily Mandi Rate WhatsApp Alerts', 'Direct Farmer-to-Buyer Portal', 'Cold Storage Bag Inward & Lot Logs', 'Simple Hindi/Regional Language UI'],
    metric: 'Direct Trade',
    priceHook: 'From ₹2,999*',
    badge: 'Hindi Support'
  },
  {
    id: 'restaurants',
    name: 'Restaurants, Cafes & Cloud Kitchens',
    slug: 'restaurants',
    emoji: '🍽️',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    tagline: 'QR Table Menus & Direct Food Orders',
    description: 'Customers scan the QR code on their table to browse food photos and order. Stop paying 30% delivery commission on online orders.',
    departmentScope: 'Table QR Ordering, Kitchen Thermal KOT, Billing POS, Table Booking',
    features: ['0% Commission Direct Food Orders', 'Scan-to-Order QR Table Menus', 'Kitchen Token Thermal Printing POS', 'Customer Birthday WhatsApp Offers'],
    metric: 'Save 30% Commission',
    priceHook: 'From ₹2,999*',
    badge: 'Quick Setup'
  },
  {
    id: 'education',
    name: 'Schools, Colleges & Coaching Institutes',
    slug: 'education',
    emoji: '🎓',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    tagline: 'Student Fee Portal & Online Classes App',
    description: 'A simple portal to collect student fees online with automated SMS receipts, share recorded video lectures safely, and take online mock exams.',
    departmentScope: 'UPI Fee Collection, Video Lectures, Mock Tests, Parent Notice Board',
    features: ['Online UPI Student Fee Collection', 'Protected Video Lectures & Study Notes', 'Online Mock Test Series with Timer', 'Parent WhatsApp Notice Board'],
    metric: 'Double Enrolments',
    priceHook: 'From ₹2,999*',
    badge: 'Institute Ready'
  },
  {
    id: 'manufacturing',
    name: 'Factories, Industrial Units & Warehouses',
    slug: 'manufacturing',
    emoji: '🏭',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    tagline: 'Raw Material & Factory Floor ERP',
    description: 'Track factory production, check raw material stock on your phone, and manage vendor purchase orders with zero paperwork.',
    departmentScope: 'Raw Materials, Floor Production, Worker Shifts, Dispatch Tracking',
    features: ['Live Factory Floor Output Logs', 'Low-Stock Material Alert Warnings', 'Worker Shift & Task Tracker', 'Vendor Purchase Invoices & Chalan'],
    metric: '+35% Output',
    priceHook: 'From ₹2,999*',
    badge: 'Plant ERP'
  },
  {
    id: 'finance',
    name: 'Financial Advisors, CA & Insurance Firms',
    slug: 'finance',
    emoji: '💰',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    tagline: 'Loan Calculators, GST Billing & Client Vault',
    description: 'Safe, encrypted software to track loan EMIs, generate clean GST invoices, and calculate daily interest without Excel mistakes.',
    departmentScope: 'GST Invoicing, Loan EMI Math, Client Document Vault, Daily Cashbook',
    features: ['Automatic EMI & Interest Math', '1-Click GST Invoice Printing', '100% Safe Encrypted Client Vault', 'Customer KYC File Storage'],
    metric: '100% Safe Data',
    priceHook: 'From ₹2,999*',
    badge: '100% Secure'
  },
  {
    id: 'hospitality',
    name: 'Hotels, Resorts, Homestays & Travel',
    slug: 'hospitality',
    emoji: '🏨',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    tagline: 'Direct Room Booking & 0% OTA Commission',
    description: 'Let guests book hotel rooms directly on your website with instant advance payments, digital guest ID verification, and seasonal packages.',
    departmentScope: 'Room Availability, Advance UPI, Guest ID Verification, Tour Packages',
    features: ['0% Commission Room Booking', 'Live Room Calendar Availability', 'Guest ID Proof Upload on Mobile', 'Automated Check-in WhatsApp Alerts'],
    metric: '+40% Direct Bookings',
    priceHook: 'From ₹3,999*',
    badge: 'Save OTA Fees'
  },
  {
    id: 'fitness-salon',
    name: 'Salons, Spas, Gyms & Fitness Studios',
    slug: 'fitness-salon',
    emoji: '💇',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    tagline: 'Slot Booking & Member Attendance App',
    description: 'Clients book beauty or haircut slots without waiting in lines. Gym owners manage monthly membership renewals, diet plans, and attendance.',
    departmentScope: 'Appointment Slots, Member Renewals, QR Attendance, Workout Plans',
    features: ['Online Beauty / Haircut Slot Booking', 'Gym Monthly Membership Auto-Reminders', 'QR Code Member Attendance Log', 'Custom Diet & Workout Routine PDF'],
    metric: 'Zero Waiting Lines',
    priceHook: 'From ₹2,999*',
    badge: 'Easy Slot Booking'
  },
  {
    id: 'automobile',
    name: 'Automobile Garages, Detailing & EV Stations',
    slug: 'automobile',
    emoji: '🚗',
    image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=800&q=80',
    tagline: 'Vehicle Job Cards & WhatsApp Service Reminders',
    description: 'Digital job cards for car/bike repairs, automated WhatsApp vehicle service due alerts, spare parts billing, and live repair status tracking.',
    departmentScope: 'Digital Job Cards, Service Due Alerts, Spare Parts Stock, EV Slots',
    features: ['Digital Repair Job Card with Photos', 'Automated Service Due WhatsApp Alerts', 'Spare Parts Inventory & GST Bill', 'Live Vehicle Repair Status Tracker'],
    metric: '3x Repeat Clients',
    priceHook: 'From ₹2,999*',
    badge: 'Garage Ready'
  },
  {
    id: 'legal-consulting',
    name: 'Lawyers, NGOs & Professional Consultants',
    slug: 'legal-consulting',
    emoji: '⚖️',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    tagline: 'Client Case Diaries & Consultation Portals',
    description: 'Manage legal case hearing dates, store confidential court documents safely, collect consultation fees online, and issue 80G tax receipts.',
    departmentScope: 'Case Hearing Diary, Document Vault, Fee Invoicing, Donation Gateways',
    features: ['Next Hearing Date WhatsApp Alert', '100% Encrypted Case Document Vault', 'Online Client Consultation Booking', 'Instant 80G Tax Exemption Receipts'],
    metric: '100% Privacy',
    priceHook: 'From ₹2,999*',
    badge: 'Client Diary'
  }
];

export default function IndustrySolutions() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#fafaff] dark:bg-[#030014]/80" id="solutions">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 shadow-sm">
            <Sparkles size={13} className="text-purple-500 animate-pulse" />
            <span>Custom-Built For Every Indian Business Sector</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Software & Websites Tailored for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Your Exact Department</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            From healthcare OPDs, retail shops and AI bots to real estate builders, schools, and factories — we build full-featured software with zero unnecessary complexity.
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 13 Industry Cards Grid (3/4-Column Responsive Layout, Uncropped Images) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {solutionsData.map((solution) => (
            <Link
              key={solution.id}
              href={`/solutions/${solution.slug}`}
              className="group rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-400/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 relative overflow-hidden glow-card h-full"
            >
              <div className="space-y-3.5 flex-1 flex flex-col">
                
                {/* Visual Industry Photo Container - Full Width & Height */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800">
                  <img
                    src={solution.image}
                    alt={solution.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Subtle soft edge overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badge Overlay */}
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-slate-700/80 text-white text-[11px] font-extrabold flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                    <span>{solution.emoji}</span>
                    <span>{solution.badge}</span>
                  </div>

                  {/* Metric Pill Overlay */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold backdrop-blur-md shadow-sm">
                    {solution.metric}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5 pt-1 flex-1">
                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                    {solution.name}
                  </h3>

                  <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                    {solution.tagline}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {solution.description}
                  </p>

                  {/* Scope Department Pill - Equalized min-height */}
                  <div className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 p-2 rounded-xl border border-purple-200 dark:border-purple-800 min-h-[38px] flex items-center">
                    ⚡ Covers: {solution.departmentScope}
                  </div>
                </div>

                {/* Features Pill List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {solution.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <Check size={13} className="text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Action Footer - Fixed baseline */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Pricing</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{solution.priceHook}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* 4 Pillars Included In Every Package Guarantee */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-400/40 dark:border-emerald-800/40 shadow-sm flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">6 Months Free Maintenance</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Complete bug fixes and minor updates included at zero extra cost.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-400/40 dark:border-purple-800/40 shadow-sm flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Solutions & Automation</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Smart AI customer chat, automated GST billing & WhatsApp notifications.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-sky-400/40 dark:border-sky-800/40 shadow-sm flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">24/7 Technical Support</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Direct phone & WhatsApp technical support with rapid response times.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-400/40 dark:border-amber-800/40 shadow-sm flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Affordable & 100% Owned</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">Plans from ₹2,999* with full source code & database ownership.</p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-950 border border-sky-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-display font-extrabold">Have a Unique Custom Business Workflow?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We design custom portals, mobile apps, and booking workflows for any specific business department in Bhopal, Indore, and across India.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md text-center whitespace-nowrap"
            >
              Get Custom Quote
            </Link>
            <a
              href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts,%20I%20need%20a%20custom%20software%20for%20my%20business."
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
