'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Send, Sparkles, ChevronDown, ChevronUp, MapPin, Building2, Globe2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Linkedin = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    setEmail('');
    
    // Trigger confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.9 }
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-[#02000a] text-slate-600 dark:text-slate-400 pt-20 pb-10 border-t border-slate-200 dark:border-slate-900/60 overflow-hidden">
      {/* Background radial glowing gradients */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-blue/10 dark:bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand Info */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logo.webp"
              alt="Mahi Technocrafts Logo"
              width={256}
              height={126}
              className="h-18 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>
          <p className="text-sm leading-relaxed">
            Your Imagination, Our Creation. Crafting pixel-perfect, premium digital experiences that elevate enterprise brands globally.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/mahi_technocrafts/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mahi Technocrafts on Instagram"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-brand-blue border border-slate-200 dark:border-slate-800 hover:border-brand-blue/30 transition-all duration-300"
            >
              <Instagram size={16} />
              <span className="sr-only">Instagram Profile</span>
            </Link>
            <Link
              href="https://www.linkedin.com/company/mahi-technocrafts/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with Mahi Technocrafts on LinkedIn"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-brand-blue border border-slate-200 dark:border-slate-800 hover:border-brand-blue/30 transition-all duration-300"
            >
              <Linkedin size={16} />
              <span className="sr-only">LinkedIn Company Profile</span>
            </Link>
            <Link
              href="https://x.com/mahi_technocrafts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Mahi Technocrafts on Twitter"
              className="w-9 h-9 rounded-xl glass flex items-center justify-center text-slate-800 dark:text-white hover:text-brand-blue dark:hover:text-brand-blue border border-slate-200 dark:border-slate-800 hover:border-brand-blue/30 transition-all duration-300"
            >
              <Twitter size={16} />
              <span className="sr-only">Twitter Profile</span>
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Explore
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/about" className="hover:text-brand-blue transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-brand-blue transition-colors">
                All Services
              </Link>
            </li>
            <li>
              <Link href="/solutions" className="hover:text-brand-blue transition-colors">
                Industry Solutions
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-brand-blue transition-colors">
                Portfolio Showcase
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-blue transition-colors">
                Tech Insights & Blog
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-brand-blue transition-colors">
                Careers & Openings
              </Link>
            </li>
          </ul>
        </div>

        {/* Core Services */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Core Expertise
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/services/web-dev" className="hover:text-brand-blue transition-colors">
                Web Development & SaaS
              </Link>
            </li>
            <li>
              <Link href="/services/mobile-dev" className="hover:text-brand-blue transition-colors">
                Mobile Apps (iOS & Android)
              </Link>
            </li>
            <li>
              <Link href="/services/ai-solutions" className="hover:text-brand-blue transition-colors">
                AI Solutions & Chatbots
              </Link>
            </li>
            <li>
              <Link href="/services/digital-marketing" className="hover:text-brand-blue transition-colors">
                Digital Marketing & PPC
              </Link>
            </li>
            <li>
              <Link href="/services/seo-services" className="hover:text-brand-blue transition-colors">
                Google SEO & Local Maps
              </Link>
            </li>
            <li>
              <Link href="/services/erp-crm" className="hover:text-brand-blue transition-colors">
                Custom ERP & Billing Software
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Contact */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Stay Updated
          </h3>
          <p className="text-sm">
            Subscribe to our tech newsletter for modern engineering tips and digital growth strategies.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-brand-blue hover:bg-brand-blue/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
            {submitted && (
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1 animate-in fade-in">
                <Sparkles size={12} />
                <span>Thank you for subscribing!</span>
              </p>
            )}
          </form>
          <div className="text-xs space-y-1 text-slate-500">
            <p><strong>Bhopal Office:</strong> Plot 12, Zone-II, MP Nagar, Bhopal (MP)</p>
            <p><strong>Direct Hotline:</strong> +91 62671 44122</p>
          </div>
        </div>
      </div>

      {/* Elegant & Modern Expandable Directory (Google Crawls Everything While Keeping Footer Sleek & Clean) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-200 dark:border-slate-900/60">
        <button
          onClick={() => setIsSeoOpen(!isSeoOpen)}
          type="button"
          aria-expanded={isSeoOpen}
          aria-controls="footer-seo-directory"
          className="w-full py-3.5 px-5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/50 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <MapPin size={15} className="text-sky-600 dark:text-sky-400" />
            <span>Explore Bhopal & Pan-India Service Locations (144+ Landing Pages)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:underline">
            <span>{isSeoOpen ? 'Hide Directory' : 'Browse All Locations & Services'}</span>
            {isSeoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* Directory Content (Always present in HTML for Googlebot SEO crawl, cleanly toggled for humans) */}
        <div
          id="footer-seo-directory"
          className={`${isSeoOpen ? 'block mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80' : 'hidden'} space-y-6 animate-in fade-in duration-200`}
        >
          {/* 1. Bhopal Core Services */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Building2 size={13} className="text-sky-500" />
              <span>Top Web & Software Services in Bhopal</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { name: 'Web Development in Bhopal', href: '/web-development-company-bhopal' },
                { name: 'Website Design in Bhopal', href: '/website-design-company-bhopal' },
                { name: 'Software Company in Bhopal', href: '/software-development-company-bhopal' },
                { name: 'IT Company in Bhopal', href: '/it-company-in-bhopal' },
                { name: 'Mobile App Development', href: '/mobile-app-development-company-bhopal' },
                { name: 'E-Commerce Development', href: '/ecommerce-development-company-bhopal' },
                { name: 'Digital Marketing Bhopal', href: '/digital-marketing-company-bhopal' },
                { name: 'SEO Company in Bhopal', href: '/seo-company-bhopal' },
                { name: 'Google Ads Agency', href: '/google-ads-agency-bhopal' },
                { name: 'AI Solutions Bhopal', href: '/ai-development-company-bhopal' },
                { name: 'WhatsApp Chatbot Automation', href: '/whatsapp-chatbot-development-company' },
                { name: 'ERP & CRM Software', href: '/erp-crm-software-development-bhopal' },
                { name: 'Website Cost & Pricing (Bhopal)', href: '/website-development-cost-in-bhopal' }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors shadow-xs"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Industry Specific Developers (Bhopal) */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Sparkles size={13} className="text-purple-500" />
              <span>Industry-Specific Website Developers in Bhopal</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { name: 'Doctors & Clinics', href: '/website-developers-for-doctors-bhopal' },
                { name: 'Schools & Coaching', href: '/website-developers-for-schools-bhopal' },
                { name: 'Real Estate & Builders', href: '/website-developers-for-real-estate-bhopal' },
                { name: 'Restaurants & Hotels', href: '/website-developers-for-restaurants-bhopal' },
                { name: 'Advocates & Legal Firms', href: '/website-developers-for-lawyers-bhopal' },
                { name: 'Chartered Accountants (CA)', href: '/website-developers-for-ca-bhopal' },
                { name: 'Gyms & Salons', href: '/website-developers-for-gym-fitness-bhopal' },
                { name: 'Travel & Tour Agencies', href: '/website-developers-for-travel-agency-bhopal' },
                { name: 'Industrial Manufacturers', href: '/website-developers-for-manufacturers-bhopal' },
                { name: 'Jewellers & Showrooms', href: '/website-developers-for-jewellers-bhopal' },
                { name: 'Logistics & Transport', href: '/website-developers-for-logistics' }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-xs"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. Major Indian Cities & National Presence */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              <Globe2 size={13} className="text-emerald-500" />
              <span>Pan-India Presence & Metro Hubs</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { name: 'Web Development India', href: '/web-development-company-in-india' },
                { name: 'Software Development India', href: '/software-development-company-in-india' },
                { name: 'E-Commerce India', href: '/ecommerce-development-company-in-india' },
                { name: 'App Development India', href: '/mobile-app-development-company-in-india' },
                { name: 'SEO Company India', href: '/seo-company-in-india' },
                { name: 'Indore', href: '/web-development-company-indore' },
                { name: 'Jabalpur', href: '/web-development-company-jabalpur' },
                { name: 'Gwalior', href: '/web-development-company-gwalior' },
                { name: 'Ujjain', href: '/web-development-company-ujjain' },
                { name: 'Raipur', href: '/web-development-company-raipur' },
                { name: 'Mumbai', href: '/web-development-company-mumbai' },
                { name: 'Delhi NCR', href: '/web-development-company-delhi-ncr' },
                { name: 'Bangalore', href: '/web-development-company-bangalore' },
                { name: 'Pune', href: '/web-development-company-pune' },
                { name: 'Hyderabad', href: '/web-development-company-hyderabad' },
                { name: 'Ahmedabad', href: '/web-development-company-ahmedabad' },
                { name: 'Jaipur', href: '/web-development-company-jaipur' },
                { name: 'Lucknow', href: '/web-development-company-lucknow' },
                { name: 'Kolkata', href: '/web-development-company-kolkata' },
                { name: 'Chandigarh', href: '/web-development-company-chandigarh' }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-xs"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div>
          © {new Date().getFullYear()} Mahi Technocrafts. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
