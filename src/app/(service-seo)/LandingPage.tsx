'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Star,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
  Building2,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Check,
  X,
  FileCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import { getBhopalServicePage, BHOPAL_LOCALITIES } from '@/lib/bhopal-service-pages';

interface LandingPageProps {
  slug: string;
}

export default function LandingPage({ slug }: LandingPageProps) {
  const page = getBhopalServicePage(slug);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '₹15,000 - ₹35,000',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!page) return null;

  const handlePackageSelect = (pkgName: string) => {
    setFormData((prev) => ({
      ...prev,
      message: `I am interested in the ${pkgName} package for ${page.title}. Please provide quotation.`
    }));
    const formElement = document.getElementById('quick-quote-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setSubmitError('Please enter your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || `${formData.phone.replace(/\D/g, '')}@lead.mahitechnocrafts.in`,
          phone: formData.phone,
          subject: `[Bhopal Local Lead] ${page.label} Inquiry`,
          message: `Service: ${page.title}\nBudget: ${formData.budget}\nMessage: ${formData.message || 'Customer requested quick consultation'}`
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please call or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Schema.org Structured Data
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://mahitechnocrafts.in/#organization',
    name: 'Mahi TechnoCrafts',
    legalName: 'Mahi TechnoCrafts IT Solutions',
    alternateName: 'Mahi TechnoCrafts Bhopal',
    url: `https://mahitechnocrafts.in/${page.slug}`,
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    description: page.metaDescription,
    telephone: '+916267144122',
    email: 'contact@mahitechnocrafts.in',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, UPI, Net Banking, Razorpay',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.259933,
      longitude: 77.412613
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '19:30'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: page.ratingValue.toString(),
      reviewCount: page.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1'
    },
    areaServed: BHOPAL_LOCALITIES.map((loc) => ({
      '@type': 'AdministrativeArea',
      name: `${loc}, Bhopal`
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: page.label,
      itemListElement: page.packages.map((pkg, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: pkg.name,
          description: pkg.bestFor
        },
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'INR',
          price: pkg.price
        }
      }))
    }
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mahitechnocrafts.in/' },
      { '@type': 'ListItem', position: 2, name: 'Bhopal IT Services', item: 'https://mahitechnocrafts.in/services' },
      { '@type': 'ListItem', position: 3, name: page.title, item: `https://mahitechnocrafts.in/${page.slug}` }
    ]
  };

  return (
    <main className="bg-[#f8fafc] text-slate-900 dark:bg-[#070918] dark:text-white min-h-screen selection:bg-sky-500 selection:text-white pb-20 sm:pb-0">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />

      {/* =========================================================================
          1. TOP VERIFIED TRUST STRIP & BREADCRUMBS (Justdial Trust Style)
      ========================================================================== */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Bhopal Services</Link>
            <span>/</span>
            <span className="text-sky-400 font-bold truncate max-w-[200px] sm:max-w-none">{page.label}</span>
          </nav>

          {/* Justdial Verified Badge & Google Stars */}
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-amber-400 font-black">
              <Star size={13} className="fill-amber-400" />
              <span>4.9 / 5</span>
              <span className="text-slate-400 font-normal">({page.reviewCount} Verified Reviews)</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck size={13} />
              <span>Govt. MSME & GST Verified Agency</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. HERO SECTION WITH LEAD CAPTURE & QUICK OVERVIEW
      ========================================================================== */}
      <section className="relative overflow-hidden pt-8 pb-14 sm:py-16 lg:py-20 bg-gradient-to-b from-sky-500/10 via-white to-slate-50 dark:from-sky-950/20 dark:via-[#070918] dark:to-[#090d20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 7 Columns: Pitch, Highlights & Quick Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs">
                <MapPin size={14} className="text-rose-500" />
                <span>Bhopal, Madhya Pradesh • M.P. Nagar & Citywide</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Exact-Match Main H1 */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-[1.12]">
                  {page.h1}
                </h1>
                <p className="mt-3 text-sm sm:text-base font-semibold text-sky-700 dark:text-sky-400">
                  {page.tagline}
                </p>
              </div>

              {/* Narrative Summary */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {page.summary}
              </p>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  'Sub-Second Page Load Speed (Core Web Vitals 95+)',
                  'Full Source Code & Database Ownership',
                  'Google Maps 3-Pack & Local SEO Architecture',
                  '90 Days Free Post-Launch Technical Support'
                ].map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Call-to-Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <a
                  href="#quick-quote-form"
                  className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-sky-600/25 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <Sparkles size={16} />
                  <span>Get Free Instant Quote</span>
                </a>

                <a
                  href="https://wa.me/916267144122?text=Hello%20Mahi%20TechnoCrafts%2C%20I%20need%20details%20for%20web%20development%20in%20Bhopal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle size={16} className="text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="tel:+916267144122"
                  className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Phone size={15} className="text-sky-600" />
                  <span>+91 62671 44122</span>
                </a>
              </div>

              {/* Justdial-Style Business Quick Highlights Card */}
              <div className="mt-6 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f24] shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-3">
                  Agency Profile & Verified Quick Details
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block">Experience</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">8+ Years (Est. 2018)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block">Delivered Projects</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">250+ Websites & Apps</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block">Starting Fee</span>
                    <span className="font-extrabold text-sky-600 dark:text-sky-400">{page.startingPrice} onwards</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block">Turnaround</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{page.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Quick Lead / Quote Box */}
            <div id="quick-quote-form" className="lg:col-span-5 scroll-mt-24">
              <div className="relative rounded-3xl border border-sky-500/30 bg-white dark:bg-[#0c1028] shadow-2xl p-6 sm:p-7">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Get Direct Consultation
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 dark:text-white font-display">
                      Request Free Project Scope & Cost
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                </div>

                {submitSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Inquiry Received!</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                      Thank you! Our technical director, Vikash Maheshwari, will review your requirements and connect with you within 15 minutes.
                    </p>
                    <a
                      href={`https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts%2C%20I%20just%20submitted%20an%20inquiry%20for%20${encodeURIComponent(formData.name)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                    >
                      <MessageCircle size={15} />
                      <span>Follow Up Instantly on WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="mt-4 space-y-3.5">
                    {submitError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600">
                        {submitError}
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Kumar / Company Name"
                        className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full mt-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 font-mono font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                          Estimated Budget
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="Under ₹15,000">Under ₹15,000</option>
                          <option value="₹15,000 - ₹35,000">₹15,000 - ₹35,000</option>
                          <option value="₹35,000 - ₹75,000">₹35,000 - ₹75,000</option>
                          <option value="₹75,000+">₹75,000+</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                          Bhopal Location
                        </label>
                        <input
                          type="text"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. MP Nagar / Kolar"
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Project Brief / Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about the website, features, or deadlines you have in mind..."
                        className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Send size={14} />
                      <span>{isSubmitting ? 'Submitting Your Request...' : 'Get Quotation & Scope'}</span>
                    </button>

                    <p className="text-[10px] text-center text-slate-400">
                      🔒 100% Confidential • No spam • Direct callback from technical founder
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PACKAGES & PRICING BREAKDOWN (Justdial Commercial Comparison)
      ========================================================================== */}
      <section className="py-14 sm:py-20 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070918]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Clear & Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 dark:text-white font-display mt-1">
              Estimated Packages for {page.label} in Bhopal
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              All plans include 100% source code ownership, mobile-first responsiveness, and Google SEO foundations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.packages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'border-2 border-sky-500 bg-gradient-to-b from-sky-50/50 to-white dark:from-sky-950/20 dark:to-[#0b0f24] shadow-xl shadow-sky-500/10'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0d20] shadow-sm hover:border-slate-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{pkg.name}</div>
                  <div className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-2">
                    {pkg.price}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Clock size={13} className="text-slate-400" />
                    <span>Turnaround: {pkg.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <strong>Best For:</strong> {pkg.bestFor}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Deliverables Included:
                    </span>
                    {pkg.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handlePackageSelect(pkg.name)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      pkg.popular
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white'
                    }`}
                  >
                    Select {pkg.name.split(' ')[0]} Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SCOPE OF WORK & ARCHITECTURAL CAPABILITIES
      ========================================================================== */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-[#070918]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                End-to-End Capabilities
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 dark:text-white font-display">
                What Mahi TechnoCrafts Delivers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We do not use rigid, bloated third-party templates. Every web portal, software, and application is custom-coded on Next.js, React, and Node.js with maximum security, sub-second speeds, and zero monthly lock-in fees.
              </p>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award size={16} className="text-amber-500" />
                  <span>The Mahi TechnoCrafts Guarantee</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {page.value}
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {page.focus.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-[#0b0f24] border border-slate-200 dark:border-slate-800 shadow-xs flex items-start gap-3 hover:border-sky-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHY CHOOSE MAHI TECHNOCRAFTS VS OTHERS (Comparison Matrix)
      ========================================================================== */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#080c1d] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
              The Clear Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display mt-1">
              Why Choose Mahi TechnoCrafts in Bhopal?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              See how our engineering approach protects your investment compared to local freelancers or outdated template shops.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-[#070918] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3.5 px-4 font-bold text-slate-900 dark:text-white w-1/3">Feature / Standard</th>
                    <th className="py-3.5 px-4 font-black text-sky-600 dark:text-sky-400 w-1/4 bg-sky-50/60 dark:bg-sky-950/30">
                      Mahi TechnoCrafts
                    </th>
                    <th className="py-3.5 px-4 font-semibold text-slate-500 w-1/5">Local Freelancers</th>
                    <th className="py-3.5 px-4 font-semibold text-slate-500 w-1/5">Traditional Template Shops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    {
                      feat: '100% Full Source Code & Database Ownership',
                      mtc: 'Included at zero extra fee',
                      free: 'Often refused or delayed',
                      agency: 'Held captive with monthly rental'
                    },
                    {
                      feat: 'Google PageSpeed Score Guarantee',
                      mtc: '90+ Score on Mobile & Desktop',
                      free: 'Not checked or guaranteed',
                      agency: 'Slow (30-50 score due to heavy themes)'
                    },
                    {
                      feat: 'Modern Tech Stack (Next.js 16, React, Node)',
                      mtc: 'Cutting-edge modern architecture',
                      free: 'Random outdated tools',
                      agency: 'Old WordPress / Pirated plugins'
                    },
                    {
                      feat: 'Post-Launch Technical Warranty',
                      mtc: '90 Days Free Bug Fixes Included',
                      free: 'Ghosting / Unreachable after payment',
                      agency: 'Requires expensive mandatory AMC'
                    },
                    {
                      feat: 'Formal Commercial Proposal & Legal GST Invoice',
                      mtc: '100% Tax Compliant & Documented',
                      free: 'Unofficial / Cash transactions',
                      agency: 'Hidden renewal and maintenance fees'
                    },
                    {
                      feat: 'Bhopal Local Face-to-Face Consultations',
                      mtc: 'Available across all Bhopal areas',
                      free: 'Only calls or remote',
                      agency: 'Rigid office hours only'
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{row.feat}</td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400 bg-sky-50/30 dark:bg-sky-950/10 flex items-center gap-1.5">
                        <Check size={14} className="shrink-0" />
                        <span>{row.mtc}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{row.free}</td>
                      <td className="py-3.5 px-4 text-slate-500">{row.agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. LOCALITIES WE SERVE ACROSS BHOPAL (Local SEO Powerhouse)
      ========================================================================== */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-[#070918]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Citywide Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display mt-1">
              Areas We Serve in Bhopal & Madhya Pradesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Whether your office or showroom is in commercial M.P. Nagar, residential Arera Colony, or the industrial zones, we provide direct on-site consultations and rapid technical execution.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
            {BHOPAL_LOCALITIES.map((loc, idx) => (
              <div
                key={idx}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-300 shadow-xs flex items-center gap-1.5 hover:border-sky-500 transition-colors"
              >
                <MapPin size={13} className="text-rose-500" />
                <span>{loc}</span>
              </div>
            ))}
          </div>

          {/* Quick Search Intent Tags Cloud */}
          <div className="mt-12 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f24] max-w-4xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3 text-center">
              Popular Searches Related to {page.label} in Bhopal
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {page.targetKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. FREQUENTLY ASKED QUESTIONS (FAQPage Schema Accordion)
      ========================================================================== */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#080c1d] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Common questions answered openly before you begin your project with us.
            </p>
          </div>

          <div className="space-y-3">
            {page.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-sky-600 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. BOTTOM CTA BANNER (Conversion Finisher)
      ========================================================================== */}
      <section className="py-12 px-4 sm:px-6 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-8 sm:p-12 border border-sky-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold mb-3">
              <Sparkles size={13} />
              <span>Ready to Scale Your Business in Bhopal?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight">
              Let&apos;s Build Something Extraordinary Together
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Call us directly or send a WhatsApp message to schedule a project scoping discussion at our Bhopal office or at your premises.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="tel:+916267144122"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-950 text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer shadow-lg"
            >
              <Phone size={16} className="text-sky-600" />
              <span>Call +91 62671 44122</span>
            </a>
            <a
              href="https://wa.me/916267144122?text=Hello%20Mahi%20TechnoCrafts%2C%20I%20want%20to%20discuss%20a%20project%20in%20Bhopal."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <MessageCircle size={16} />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. MOBILE STICKY FLOATING BOTTOM BAR (Zero Lead Loss on Phones)
      ========================================================================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#070918]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href="tel:+916267144122"
          className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-extrabold flex items-center justify-center gap-1.5"
        >
          <Phone size={14} className="text-sky-600" />
          <span>Call Now</span>
        </a>
        <a
          href={`https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts%2C%20I%20am%20interested%20in%20${encodeURIComponent(page.label)}%20in%20Bhopal.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle size={14} />
          <span>WhatsApp</span>
        </a>
        <a
          href="#quick-quote-form"
          className="flex-1 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-extrabold flex items-center justify-center gap-1 shadow-sm"
        >
          <span>Get Quote</span>
        </a>
      </div>
    </main>
  );
}
