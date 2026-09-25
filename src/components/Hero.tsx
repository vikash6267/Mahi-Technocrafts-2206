'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Check, 
  TrendingUp, 
  Star, 
  ShoppingBag, 
  Stethoscope, 
  Building2, 
  Utensils, 
  GraduationCap,
  Bot
} from 'lucide-react';
import { SiteData } from '@/lib/db';
import { trackWhatsAppClick } from '@/lib/analytics';

interface HeroProps {
  data?: SiteData['hero'];
}

type IndustryKey = 'ecommerce' | 'healthcare' | 'ai' | 'realestate' | 'restaurants' | 'education';

const industryDemos: Record<IndustryKey, {
  name: string;
  shortName: string;
  badge: string;
  emoji: string;
  icon: React.ReactNode;
  heroImg: string;
  alt: string;
  url: string;
  hook: string;
  features: string[];
  liveNotif: { title: string; time: string; amount?: string; icon: string };
  growthMetric: string;
  startingPrice: string;
  slug: string;
}> = {
  ecommerce: {
    name: 'Retail & Stores',
    shortName: 'Retail',
    badge: '🛍️ Retail & Store',
    emoji: '🛒',
    icon: <ShoppingBag size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
    alt: 'Modern supermarket retail store products and billing shelves',
    url: 'https://mystore.mahitc.com',
    hook: 'Sell 24/7 with 1-Click UPI (GPay/PhonePe) & WhatsApp Order Sync',
    features: ['Instant PhonePe & GPay QR checkout', 'Order details go directly to WhatsApp', 'Manage stock easily from mobile phone'],
    liveNotif: { title: 'New Order Received', time: 'Just now', amount: '₹2,490', icon: '🛒' },
    growthMetric: '+320% Monthly Sales',
    startingPrice: '₹2,999*',
    slug: 'ecommerce'
  },
  healthcare: {
    name: 'Clinics & Doctors',
    shortName: 'Clinics',
    badge: '🏥 Healthcare',
    emoji: '🩺',
    icon: <Stethoscope size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
    alt: 'Modern hospital and doctor clinic reception and medical consultation',
    url: 'https://careclinic.mahitc.com',
    hook: '24/7 Online Patient Slot Booking & Zero Reception Queue',
    features: ['Patients pick time slots on phone', 'Automated WhatsApp reminder alerts', 'Digital prescriptions & test reports archive'],
    liveNotif: { title: 'Appointment Confirmed', time: '2m ago', amount: 'Dr. Sharma', icon: '🩺' },
    growthMetric: '75% Less Queue Time',
    startingPrice: '₹2,999*',
    slug: 'healthcare'
  },
  ai: {
    name: 'AI & WhatsApp Bots',
    shortName: 'AI Bots',
    badge: '🤖 AI & Automations',
    emoji: '🤖',
    icon: <Bot size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80',
    alt: 'AI chatbot customer service automation software',
    url: 'https://aibot.mahitc.com',
    hook: '24/7 AI WhatsApp Chatbots & Automated Client Invoicing',
    features: ['Instant 2-second AI replies to WhatsApp inquiries', 'Auto-qualify customer leads & send PDF quotes', 'Generate GST bills & payment follow-ups automatically'],
    liveNotif: { title: 'AI Qualified 14 Leads', time: 'Just now', amount: '₹84,000 Pipeline', icon: '🤖' },
    growthMetric: '85% Inquiries Automated',
    startingPrice: '₹3,999*',
    slug: 'ai-solutions'
  },
  realestate: {
    name: 'Real Estate & Plots',
    shortName: 'Property',
    badge: '🏢 Real Estate',
    emoji: '🏢',
    icon: <Building2 size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
    alt: 'Modern luxury residential apartment towers and township buildings',
    url: 'https://luxuryliving.mahitc.com',
    hook: 'Showcase Flats & 3D Walkthroughs to Direct Property Buyers',
    features: ['High-res photo galleries & floor plans', '1-Click call & WhatsApp connect button', 'Built-in EMI & Loan Calculator for buyers'],
    liveNotif: { title: 'Site Visit Requested', time: '1m ago', amount: '3 BHK Flat', icon: '📍' },
    growthMetric: '4.5x More Buyer Calls',
    startingPrice: '₹2,999*',
    slug: 'real-estate'
  },
  restaurants: {
    name: 'Restaurants & Cafes',
    shortName: 'Dining',
    badge: '🍽️ Food & Dining',
    emoji: '🍽️',
    icon: <Utensils size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
    alt: 'Modern restaurant dining atmosphere with contactless QR ordering',
    url: 'https://royalcafe.mahitc.com',
    hook: '0% Commission Direct Food Orders & Table QR Menus',
    features: ['Guests scan table QR code to order', 'Zero commission to 3rd party delivery apps', 'Kitchen ticket printing POS support'],
    liveNotif: { title: 'Table 4 QR Order', time: 'Just now', amount: '₹1,180', icon: '🍕' },
    growthMetric: 'Save 30% Commissions',
    startingPrice: '₹2,999*',
    slug: 'restaurants'
  },
  education: {
    name: 'Schools & Coaching',
    shortName: 'Coaching',
    badge: '🎓 Education',
    emoji: '🎓',
    icon: <GraduationCap size={14} />,
    heroImg: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    alt: 'College and coaching institute students studying in classroom',
    url: 'https://apexclasses.mahitc.com',
    hook: 'Online Fee Collection Portal & Student Study App',
    features: ['Collect admission fees via UPI with SMS receipt', 'Share video classes & test notes securely', 'Automated parent SMS & WhatsApp alerts'],
    liveNotif: { title: 'Fee Paid via UPI', time: '5m ago', amount: '₹4,500', icon: '📚' },
    growthMetric: '2x Student Admissions',
    startingPrice: '₹2,999*',
    slug: 'education'
  }
};

export default function Hero({ data }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<IndustryKey>('ecommerce');
  const [stats, setStats] = useState({ projects: 0, uptime: 0, rating: 0, support: 0 });

  // Count up ticker animation
  useEffect(() => {
    const duration = 1200;
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      setStats({
        projects: Math.round(progress * 150),
        uptime: parseFloat((progress * 99.8).toFixed(1)),
        rating: parseFloat((progress * 4.9).toFixed(1)),
        support: Math.round(progress * 24),
      });

      if (step >= steps) clearInterval(timer);
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Interactive Canvas Particle Grid (Desktop only for max mobile battery & speed)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const isTouchOrMobile = window.innerWidth < 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0 || /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
    if (isTouchOrMobile) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#0284c7' : '#7c3aed',
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${(1 - dist / 90) * 0.08})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const activeDemo = industryDemos[activeTab];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24 bg-[#fafcff] dark:bg-[#02000e]">
      {/* Background Interactive Ambient Canvas & Grid */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60 hidden lg:block" />

      {/* Modern Neon Glow Spheres (Optimized blur for iOS Safari & mobile 60fps) */}
      <div className="absolute -top-24 left-1/4 w-[450px] h-[450px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[380px] h-[380px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        
        {/* Top Floating Announcement Pill */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-sky-400/40 dark:border-sky-700/60 text-slate-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Central India&apos;s #1 Web & Custom Software Company</span>
            <span className="hidden sm:inline-block text-slate-400 dark:text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-amber-500 font-bold">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              4.9/5 (150+ Happy Businesses)
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT: High-Impact Business Headline & Conversion Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <h1 className="sr-only">Best Website & Software Development Company in Bhopal | Mahi TechnoCrafts</h1>

            {/* Giant Modern Headline */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl lg:text-[3.2rem] font-display font-black tracking-tight leading-[1.12] text-slate-950 dark:text-white">
                We Build High-Impact{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 inline-block">
                  Websites & Apps
                </span>{' '}
                That Grow Your Business.
              </h2>
              
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
                Turn your phone screen visitors into daily paying customers. Lightning-fast, mobile-friendly websites, online stores, and software custom-built for your exact business.
              </p>
            </div>

            {/* 4 Core Value Badges - Symmetrical Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-400/40 dark:border-emerald-700/50 shadow-sm text-center flex flex-col justify-center items-center min-h-[64px]">
                <div className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                  <span>🛡️ 6 Mo Free</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Free Maintenance</div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-purple-400/40 dark:border-purple-700/50 shadow-sm text-center flex flex-col justify-center items-center min-h-[64px]">
                <div className="text-xs sm:text-sm font-black text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1">
                  <span>🤖 AI Built-In</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Smart Solutions</div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-sky-400/40 dark:border-sky-700/50 shadow-sm text-center flex flex-col justify-center items-center min-h-[64px]">
                <div className="text-xs sm:text-sm font-black text-sky-600 dark:text-sky-400 flex items-center justify-center gap-1">
                  <span>⚡ 24/7 Support</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tech Assistance</div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/90 border border-amber-400/40 dark:border-amber-700/50 shadow-sm text-center flex flex-col justify-center items-center min-h-[64px]">
                <div className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <span>₹2,999* Onwards</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">7–14 Day Delivery</div>
              </div>
            </div>

            {/* Action Buttons - Fully Responsive Wrap & Zero Clipping */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
              <Link
                href="/contact"
                className="h-11 sm:h-12 px-4 sm:px-6 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:to-indigo-600 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-sky-600/30 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 text-center whitespace-nowrap"
              >
                <span>Get Free Prototype & Quote</span>
                <ArrowRight size={14} />
              </Link>

              <a
                href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts,%20I%20want%20to%20get%20a%20website/app%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('hero_banner')}
                className="h-11 sm:h-12 px-3.5 sm:px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/25 hover:-translate-y-0.5 whitespace-nowrap"
              >
                <MessageCircle size={15} />
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="/solutions"
                className="h-11 sm:h-12 px-3.5 sm:px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 text-center shadow-sm whitespace-nowrap"
              >
                <span>All Solutions</span>
              </Link>
            </div>

            {/* Trust Proof Avatar Bar */}
            <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-blue-400 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">V</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">M</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">A</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-400 text-white font-bold text-[11px] flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">R</div>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  ⭐⭐⭐⭐⭐ 4.9/5 Rating
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">150+ Websites & Apps Delivered in Bhopal, MP & India</div>
              </div>
            </div>

          </div>

          {/* RIGHT: High-Tech Interactive Live Device Frame with Authentic Indian Context Photo */}
          <div className="lg:col-span-6 relative">
            
            {/* Industry Selector Tabs Header - Perfectly Aligned Responsive Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-3 w-full">
              {(Object.keys(industryDemos) as IndustryKey[]).map((tabKey) => {
                const item = industryDemos[tabKey];
                const isActive = activeTab === tabKey;
                return (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer text-center w-full whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/30 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-sky-400'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Interactive Browser Device Frame */}
            <div className="w-full rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden relative glow-card select-none">
              
              {/* Browser Window Header */}
              <div className="px-4 py-3 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="text-emerald-400 text-xs">🔒</span>
                    <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-[240px]">{activeDemo.url}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PREVIEW
                  </span>
                </div>
              </div>

              {/* Main Photo Banner - Clear, Bright & Perfectly Fitted 100% Full Width */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-800">
                <img
                  src={activeDemo.heroImg}
                  alt={activeDemo.alt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                
                {/* Subtle soft edge gradient only */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 pointer-events-none" />

                {/* Floating Metric Badge (Top Right) */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-slate-950/90 border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md animate-fadeIn">
                  <TrendingUp size={13} />
                  <span>{activeDemo.growthMetric}</span>
                </div>
              </div>

              {/* Bottom Feature Breakdown & Action */}
              <div className="p-4 sm:p-5 space-y-3.5 bg-slate-950 text-white">
                
                {/* Live Trigger Alert Pill (Cleanly positioned above features) */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-sky-500/30 text-white text-xs font-medium flex items-center justify-between shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{activeDemo.liveNotif.icon}</span>
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{activeDemo.liveNotif.title}</span>
                        {activeDemo.liveNotif.amount && (
                          <span className="text-emerald-400 font-extrabold">{activeDemo.liveNotif.amount}</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{activeDemo.liveNotif.time}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Sync
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>{activeDemo.hook}</span>
                  </h3>
                </div>

                {/* 3 Value Points */}
                <div className="space-y-1.5">
                  {activeDemo.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check size={13} className="text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    ⚡ Starts at {activeDemo.startingPrice}
                  </span>

                  <Link
                    href={`/solutions/${activeDemo.slug}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 group/link"
                  >
                    <span>Explore This Solution</span>
                    <ArrowRight size={13} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM STATS & TRUST BAR */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 backdrop-blur-md shadow-sm">
            <div className="text-2xl sm:text-3xl font-display font-black text-slate-950 dark:text-white">
              {stats.projects}+
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Websites & Apps Delivered</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-emerald-400/30 dark:border-emerald-800/40 text-center space-y-1 backdrop-blur-md shadow-sm">
            <div className="text-2xl sm:text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">
              6 Months
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Free Maintenance Included</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-sky-400/30 dark:border-sky-800/40 text-center space-y-1 backdrop-blur-md shadow-sm">
            <div className="text-2xl sm:text-3xl font-display font-black text-sky-600 dark:text-sky-400">
              24/7
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Technical Support Team</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-amber-400/30 dark:border-amber-800/40 text-center space-y-1 backdrop-blur-md shadow-sm">
            <div className="text-2xl sm:text-3xl font-display font-black text-amber-500">
              {stats.rating}★
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Google Client Rating</div>
          </div>
        </div>

      </div>
    </section>
  );
}
