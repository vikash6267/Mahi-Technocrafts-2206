'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Globe, 
  Smartphone, 
  Bot,
  Search, 
  Palette, 
  ShoppingCart, 
  Database, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Zap,
  Building2,
  Stethoscope,
  Utensils,
  GraduationCap,
  Coins,
  Factory,
  Sprout,
  ShieldCheck,
  Layers,
  Cpu
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const solutionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Categorized Services for Mega Menu
  const serviceCategories = [
    {
      category: 'Web & Mobile Development',
      items: [
        {
          name: 'Business Websites & Portals',
          path: '/services/web-dev',
          icon: <Globe className="w-4 h-4 text-sky-500" />,
          desc: 'Fast, Mobile-Friendly & SEO Ranked',
          badge: 'Popular'
        },
        {
          name: 'Mobile Apps (iOS & Android)',
          path: '/services/mobile-dev',
          icon: <Smartphone className="w-4 h-4 text-purple-500" />,
          desc: 'Android & iPhone Customer Apps',
          badge: 'Fast'
        },
        {
          name: 'Custom Billing & Shop ERP',
          path: '/services/erp-crm',
          icon: <Database className="w-4 h-4 text-indigo-500" />,
          desc: 'GST Invoices, Inventory & Sales Logs',
          badge: 'Custom'
        },
      ]
    },
    {
      category: 'Automation & Growth Marketing',
      items: [
        {
          name: 'WhatsApp Auto-Reply Chatbots',
          path: '/services/ai-solutions',
          icon: <Bot className="w-4 h-4 text-amber-500" />,
          desc: '24/7 Automated Customer Support',
          badge: 'Auto'
        },
        {
          name: 'Google Local Search SEO (GMB)',
          path: '/services/seo-services',
          icon: <Search className="w-4 h-4 text-emerald-500" />,
          desc: 'Rank #1 on Google Search & Maps',
          badge: 'Rank #1'
        },
        {
          name: 'Online Shopping & D2C Stores',
          path: '/services/ecommerce-management',
          icon: <ShoppingCart className="w-4 h-4 text-pink-500" />,
          desc: '1-Click UPI & Direct WhatsApp Orders',
          badge: 'Sales'
        },
      ]
    }
  ];

  // Industry Solutions with Custom Visual Styles
  const solutionsList = [
    {
      name: 'Retail & E-Commerce',
      path: '/solutions/ecommerce',
      icon: '🛒',
      accent: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50',
      desc: 'D2C Stores, 1-Click UPI & Inventory Sync',
      roi: '+320% Sales'
    },
    {
      name: 'Healthcare & Clinics',
      path: '/solutions/healthcare',
      icon: '🏥',
      accent: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
      desc: 'Doctor Booking, EHR & Telemedicine',
      roi: '75% Wait Cut'
    },
    {
      name: 'AI & WhatsApp Automation',
      path: '/solutions/ai-solutions',
      icon: '🤖',
      accent: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50',
      desc: '24/7 AI Chatbots & Auto Invoicing',
      roi: '85% Auto'
    },
    {
      name: 'Real Estate & Builders',
      path: '/solutions/real-estate',
      icon: '🏢',
      accent: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50',
      desc: '3D Virtual Tours & Broker Lead CRM',
      roi: '4.5x Leads'
    },
    {
      name: 'Restaurants & Food Tech',
      path: '/solutions/restaurants',
      icon: '🍽️',
      accent: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
      desc: '0% Commission Table QR & POS Billing',
      roi: '0% Comm.'
    },
    {
      name: 'EdTech & Coaching',
      path: '/solutions/education',
      icon: '🎓',
      accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
      desc: 'Anti-Piracy LMS & Mock Test Series',
      roi: '2x Enrolment'
    },
    {
      name: 'FinTech & Finance',
      path: '/solutions/finance',
      icon: '💰',
      accent: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50',
      desc: 'Loan Trackers & Encrypted Invoicing',
      roi: 'Bank Grade'
    },
    {
      name: 'Manufacturing & Plants',
      path: '/solutions/manufacturing',
      icon: '🏭',
      accent: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800',
      desc: 'Production Floor ERP & Batch QC Logs',
      roi: '+35% Output'
    },
    {
      name: 'AgriTech & Mandi Supply',
      path: '/solutions/agriculture',
      icon: '🌾',
      accent: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50',
      desc: 'Daily Mandi Rates & Farmer Marketplace',
      roi: 'Direct Trade'
    },
    {
      name: 'Hotels & Resort Booking',
      path: '/solutions/hospitality',
      icon: '🏨',
      accent: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
      desc: 'Direct Booking Portals & 0% OTA Fees',
      roi: '0% Comm.'
    },
    {
      name: 'Salons, Spas & Gyms',
      path: '/solutions/fitness-salon',
      icon: '💇',
      accent: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/50',
      desc: 'Slot Booking & Membership Renewals',
      roi: 'Zero Wait'
    },
    {
      name: 'Automobile & Garages',
      path: '/solutions/automobile',
      icon: '🚗',
      accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50',
      desc: 'Digital Job Cards & WhatsApp Service Due',
      roi: '3x Repeat'
    },
    {
      name: 'Lawyers & Consultancies',
      path: '/solutions/legal-consulting',
      icon: '⚖️',
      accent: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
      desc: 'Encrypted Case Diaries & Client Vault',
      roi: '100% Safe'
    },
  ];

  // Control navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  const handleServicesEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
    setSolutionsOpen(false);
  };

  const handleServicesLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 180);
  };

  const handleSolutionsEnter = () => {
    if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
    setSolutionsOpen(true);
    setServicesOpen(false);
  };

  const handleSolutionsLeave = () => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 180);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#02000d]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 py-2.5 shadow-sm shadow-slate-900/5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo.webp"
            alt="Mahi Technocrafts Logo"
            width={240}
            height={110}
            priority
            className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          
          {/* Home Link */}
          <Link
            href="/"
            className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 ${
              pathname === '/' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Home
          </Link>

          {/* Services Dropdown (Mega Menu Layout) */}
          <div
            className="relative"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <button
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 cursor-pointer py-2 ${
                pathname.startsWith('/services') ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Services
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-sky-600' : ''}`}
              />
            </button>

            {/* Custom Theme-Matched Services Dropdown */}
            {servicesOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 w-[680px] bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-50 animate-fadeIn backdrop-blur-2xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.15), 0 0 30px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full" />

                <div className="grid grid-cols-12 gap-6 pt-1">
                  
                  {/* Left 2 Columns: Categorized Services */}
                  <div className="col-span-8 grid grid-cols-2 gap-5">
                    {serviceCategories.map((cat, idx) => (
                      <div key={idx} className="space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">
                          {cat.category}
                        </span>
                        <div className="space-y-1">
                          {cat.items.map((item) => (
                            <Link
                              key={item.path}
                              href={item.path}
                              className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors group"
                            >
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                                {item.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                    {item.name}
                                  </p>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Featured Callout Banner */}
                  <div className="col-span-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-slate-850 dark:to-slate-900 border border-sky-100 dark:border-slate-700/60 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500 text-white inline-block">
                        ⚡ Starting from ₹2,999*
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        High-Speed Business Websites
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        Sub-1s mobile speed, ranked #1 on Google Bhopal, and ready in 7–14 days.
                      </p>
                    </div>

                    <Link
                      href="/services"
                      className="mt-3 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 flex items-center gap-1 group/link"
                    >
                      <span>Explore All Services</span>
                      <ArrowRight size={11} className="transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>

                {/* Bottom Footer Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Need custom architecture advice?
                  </span>
                  <Link
                    href="/contact"
                    className="text-sky-600 dark:text-sky-400 font-bold text-[11px] hover:underline"
                  >
                    Schedule a Free 1-on-1 Consultation →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Dropdown (Distinct Industry Card Grid) */}
          <div
            className="relative"
            onMouseEnter={handleSolutionsEnter}
            onMouseLeave={handleSolutionsLeave}
          >
            <button
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 cursor-pointer py-2 ${
                pathname.startsWith('/solutions') ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Solutions
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180 text-sky-600' : ''}`}
              />
            </button>

            {/* Custom Theme-Matched Solutions Grid */}
            {solutionsOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 z-50 animate-fadeIn backdrop-blur-2xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.15), 0 0 30px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Top Accent Line */}
                <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 rounded-full" />

                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Purpose-Built Industry Architectures
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Packages from ₹2,999*
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {solutionsList.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-850/60 hover:bg-sky-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600/40 transition-all duration-200 flex flex-col justify-between group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xl group-hover:scale-110 transition-transform">
                            {item.icon}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                            {item.roi}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Bottom Footer Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Don&apos;t see your industry? We build custom workflows for any business.
                  </span>
                  <Link
                    href="/solutions"
                    className="text-sky-600 dark:text-sky-400 font-bold text-[11px] hover:underline"
                  >
                    View All 13 Solutions →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Case Studies Link */}
          <Link
            href="/#projects"
            className="text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 text-slate-700 dark:text-slate-300"
          >
            Case Studies
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 ${
              pathname === '/about' ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            About Us
          </Link>

          {/* Blog */}
          <Link
            href="/blog"
            className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 hover:text-sky-600 ${
              pathname.startsWith('/blog') ? 'text-sky-600 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Blog
          </Link>
        </div>

        {/* Header Right Action CTA Button (HIGH CONTRAST & FULLY VISIBLE) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-6 py-2.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:to-indigo-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={13} className="text-amber-300 animate-spin" />
            <span>Get Free Proposal</span>
          </Link>
        </div>

        {/* Mobile Hamburger Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/contact"
            className="p-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 sm:hidden shadow-md"
            aria-label="Get Quote"
          >
            <PhoneCall size={14} />
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden w-full bg-white/98 dark:bg-[#040212]/98 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col p-5 gap-3">
            <Link
              href="/"
              className={`text-sm font-bold uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-850 ${
                pathname === '/' ? 'text-sky-600' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              Home
            </Link>

            {/* Mobile Services Accordion */}
            <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider py-2 text-slate-800 dark:text-slate-200"
              >
                <span>Services</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-sky-600' : ''}`}
                />
              </button>

              {mobileServicesOpen && (
                <div className="pl-3 pr-1 py-2 space-y-2 bg-slate-50 dark:bg-slate-900/60 rounded-2xl mt-1">
                  {serviceCategories.flatMap(c => c.items).map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600"
                    >
                      <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <div className="pt-2">
                    <Link href="/services" className="text-xs font-bold text-sky-600 block">
                      Explore All Services (from ₹2,999*) →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Solutions Accordion */}
            <div className="border-b border-slate-100 dark:border-slate-850 pb-2">
              <button
                onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider py-2 text-slate-800 dark:text-slate-200"
              >
                <span>Solutions</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180 text-sky-600' : ''}`}
                />
              </button>

              {mobileSolutionsOpen && (
                <div className="pl-3 pr-1 py-2 space-y-2 bg-slate-50 dark:bg-slate-900/60 rounded-2xl mt-1">
                  {solutionsList.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-sky-600"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <div className="pt-2">
                    <Link href="/solutions" className="text-xs font-bold text-sky-600 block">
                      Explore All 13 Solutions →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#projects"
              className="text-sm font-bold uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-200"
            >
              Case Studies
            </Link>

            <Link
              href="/about"
              className={`text-sm font-bold uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-850 ${
                pathname === '/about' ? 'text-sky-600' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/blog"
              className={`text-sm font-bold uppercase tracking-wider py-2 border-b border-slate-100 dark:border-slate-850 ${
                pathname.startsWith('/blog') ? 'text-sky-600' : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="w-full text-center py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-colors mt-2 shadow-lg shadow-sky-600/20"
            >
              Get Free Custom Proposal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
