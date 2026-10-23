'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Send, Sparkles } from 'lucide-react';
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
              <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-brand-blue transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/solutions" className="hover:text-brand-blue transition-colors">Industry Solutions</Link>
            </li>
            <li>
              <Link href="/#projects" className="hover:text-brand-blue transition-colors">Case Studies</Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-brand-blue transition-colors">Our Blog</Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-brand-blue transition-colors">Careers</Link>
            </li>
          </ul>
        </div>

        {/* Services Links */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Services
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/services/web-dev" className="hover:text-brand-blue transition-colors">Web Development</Link>
            </li>
            <li>
              <Link href="/services/mobile-dev" className="hover:text-brand-blue transition-colors">Mobile App Development</Link>
            </li>
            <li>
              <Link href="/services/uiux-design" className="hover:text-brand-blue transition-colors">App & Website Design</Link>
            </li>
            <li>
              <Link href="/services/ai-solutions" className="hover:text-brand-blue transition-colors">AI & Automations</Link>
            </li>
            <li>
              <Link href="/services/erp-crm" className="hover:text-brand-blue transition-colors">Business Software</Link>
            </li>
            <li>
              <Link href="/services/cloud-services" className="hover:text-brand-blue transition-colors">Secure Cloud Hosting</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
            Subscribe
          </h3>
          <p className="text-sm">
            Stay updated with our latest business tips, articles, and company news.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Subscribe to newsletter"
              >
                <Send size={14} />
              </button>
            </div>
            {submitted && (
              <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                <Sparkles size={10} /> Thanks for subscribing!
              </span>
            )}
          </form>
        </div>
      </div>

            {/* Bhopal & Pan-India SEO Strips (Internal Link Equity) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-900/60 space-y-6">
        {/* 1. Core IT Services */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Top IT & Web Development Services in Bhopal
            </span>
            <span className="text-[11px] text-slate-400">
              Serving MP Nagar, Arera Colony, Kolar, BHEL & All Bhopal Localities
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/web-development-company-bhopal" className="hover:text-brand-blue transition-colors">
              Web Development Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-design-company-bhopal" className="hover:text-brand-blue transition-colors">
              Website Design Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/software-development-company-bhopal" className="hover:text-brand-blue transition-colors">
              Software Development Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/it-company-in-bhopal" className="hover:text-brand-blue transition-colors">
              IT Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/mobile-app-development-company-bhopal" className="hover:text-brand-blue transition-colors">
              Mobile App Development in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/ecommerce-development-company-bhopal" className="hover:text-brand-blue transition-colors">
              E-Commerce Development in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/digital-marketing-company-bhopal" className="hover:text-brand-blue transition-colors">
              Digital Marketing Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/seo-company-bhopal" className="hover:text-brand-blue transition-colors">
              SEO Company in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/google-ads-agency-bhopal" className="hover:text-brand-blue transition-colors">
              Google Ads Agency in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/ai-development-company-bhopal" className="hover:text-brand-blue transition-colors">
              AI Development in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/whatsapp-chatbot-development-company" className="hover:text-brand-blue transition-colors">
              WhatsApp Chatbot Development
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/erp-crm-software-development-bhopal" className="hover:text-brand-blue transition-colors">
              ERP & CRM Software in Bhopal
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-development-cost-in-bhopal" className="hover:text-brand-blue transition-colors font-semibold text-sky-600 dark:text-sky-400">
              Website Cost & Pricing (Bhopal)
            </Link>
          </div>
        </div>

        {/* 2. Industry-Specific Justdial-Style Categories */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Industry-Specific Website Developers in Bhopal (Justdial Categories)
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/website-developers-for-doctors-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Doctors & Clinics
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-schools-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Schools & Coaching
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-real-estate-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Real Estate & Builders
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-restaurants-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Restaurants & Hotels
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-lawyers-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Advocates & Legal Firms
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-ca-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Chartered Accountants (CA)
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-gym-fitness-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Gyms & Salons
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-travel-agency-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Travel Agencies & Tours
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-manufacturers-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Manufacturers (Govindpura & Mandideep)
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-jewellers-bhopal" className="hover:text-brand-blue transition-colors">
              Website Developers For Jewellers & Showrooms
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-logistics" className="hover:text-brand-blue transition-colors">
              Website Developers For Logistics & Transport
            </Link>
          </div>
        </div>

        {/* 3. Pan-India & Major Indian Cities */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Web & Software Development Across India (Pan-India Presence)
            </span>
            <span className="text-[11px] text-slate-400">
              Nationwide Delivery Across All 28 States & Metro Hubs
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/web-development-company-in-india" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Web Development Company in India
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/software-development-company-in-india" className="hover:text-brand-blue transition-colors">
              Custom Software Development India
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/ecommerce-development-company-in-india" className="hover:text-brand-blue transition-colors">
              E-Commerce Development India
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/mobile-app-development-company-in-india" className="hover:text-brand-blue transition-colors">
              Mobile App Development India
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/seo-company-in-india" className="hover:text-brand-blue transition-colors">
              SEO Company in India
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-indore" className="hover:text-brand-blue transition-colors">
              Indore
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-jabalpur" className="hover:text-brand-blue transition-colors">
              Jabalpur
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-gwalior" className="hover:text-brand-blue transition-colors">
              Gwalior
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-ujjain" className="hover:text-brand-blue transition-colors">
              Ujjain
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-raipur" className="hover:text-brand-blue transition-colors">
              Raipur
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-mumbai" className="hover:text-brand-blue transition-colors">
              Mumbai
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-delhi-ncr" className="hover:text-brand-blue transition-colors">
              Delhi NCR
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-bangalore" className="hover:text-brand-blue transition-colors">
              Bangalore
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-pune" className="hover:text-brand-blue transition-colors">
              Pune
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-hyderabad" className="hover:text-brand-blue transition-colors">
              Hyderabad
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-ahmedabad" className="hover:text-brand-blue transition-colors">
              Ahmedabad
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-jaipur" className="hover:text-brand-blue transition-colors">
              Jaipur
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-lucknow" className="hover:text-brand-blue transition-colors">
              Lucknow
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-kolkata" className="hover:text-brand-blue transition-colors">
              Kolkata
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/web-development-company-chandigarh" className="hover:text-brand-blue transition-colors">
              Chandigarh
            </Link>
          </div>
        </div>

        {/* 4. Single-Industry National & Metro Web Portals */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Industry Specific Website Developers (India & Bhopal)
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/website-developers-for-schools" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Website Developers For Schools
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-coaching-institutes" className="hover:text-brand-blue transition-colors">
              Website Developers For Coaching Institutes
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-colleges" className="hover:text-brand-blue transition-colors">
              College & University Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-doctors" className="hover:text-brand-blue transition-colors">
              Website Developers For Doctors
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-clinics" className="hover:text-brand-blue transition-colors">
              Clinic & Diagnostic Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-hospitals" className="hover:text-brand-blue transition-colors">
              Hospital Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-real-estate" className="hover:text-brand-blue transition-colors">
              Real Estate & Builder Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-restaurants" className="hover:text-brand-blue transition-colors">
              Restaurant & Cafe Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-ecommerce" className="hover:text-brand-blue transition-colors">
              E-Commerce Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-travel-agency" className="hover:text-brand-blue transition-colors">
              Travel Agency Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-lawyers" className="hover:text-brand-blue transition-colors">
              Lawyer & Law Firm Website Developers
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/website-developers-for-ca" className="hover:text-brand-blue transition-colors">
              Chartered Accountant (CA) Website Developers
            </Link>
          </div>
        </div>

        {/* 4. Bhopal Full Localities Text Cloud */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-700 dark:text-slate-300">All Bhopal Localities Served: </span>
          M.P. Nagar (Zone 1 & 2), Arera Colony (E1-E8), New Market, 10 Number Market, 11 Number Stop, Bittan Market, Kolar Road, Hoshangabad Road, Shahpura, Bawadia Kalan, Ayodhya Bypass, Ashoka Garden, Govindpura Industrial Area, Mandideep Industrial Area, Lalghati, Bairagarh (Sant Hirdaram Nagar), Saket Nagar, Misrod, Indrapuri, BHEL Township, Piplani, Shahjahanabad, Hamidia Road, T.T. Nagar, Chuna Bhatti, Shivaji Nagar, Raisen Road, Karond, Jahangirabad, Koh-e-Fiza, Idgah Hills, Shyamla Hills, Malviya Nagar, Anand Nagar, Gandhi Nagar, Katara Hills, Bagsewaniya, Gulmohar, Rohit Nagar, Trilanga, Nehru Nagar, Kotra Sultanabad, Jawahar Chowk, Subhash Nagar, Gautam Nagar, Habibganj, Salaiya, Danish Kunj, Bairagarh Chichali, Ratanpur, Sukhi Sewaniya, Khajuri Kalan, Suraj Nagar, Barkheda Pathani, Peer Gate, Ibrahimpura, Nadra, Sindhi Colony, MANIT, AIIMS Bhopal.
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