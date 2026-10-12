'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bot, Check, Code2, Globe2, MapPin,
  MessageCircle, MousePointer2, Search, ShieldCheck, Smartphone, Sparkles, TrendingUp, Zap,
} from 'lucide-react';
import type { SiteData } from '@/lib/db';
import { trackWhatsAppClick } from '@/lib/analytics';

interface HeroProps { data?: SiteData['hero']; }

const services = [
  { name: 'Web development', short: 'Websites', icon: Code2, title: 'A website built to get found.', detail: 'Fast, conversion-focused websites with technical SEO foundations that help the right customers discover your business.', metric: 'SEO-ready', metricLabel: 'made for discovery', color: '#6ee7d2' },
  { name: 'SEO & digital growth', short: 'SEO & growth', icon: Search, title: 'Turn search into steady enquiries.', detail: 'Local SEO, content and performance improvements that make it easier for nearby customers to find and choose you.', metric: 'Local reach', metricLabel: 'built for your market', color: '#a5b4fc' },
  { name: 'Mobile apps', short: 'Mobile apps', icon: Smartphone, title: 'Put your service in their pocket.', detail: 'Simple, reliable Android and iOS apps that keep your customers connected and your team moving.', metric: 'iOS + Android', metricLabel: 'one connected experience', color: '#f9a8d4' },
  { name: 'AI & automation', short: 'Automation', icon: Bot, title: 'Let routine work run itself.', detail: 'Helpful chat and workflow automation that responds sooner, captures leads and gives your team time back.', metric: 'Always on', metricLabel: 'helpful automation', color: '#fcd34d' },
];

export default function Hero({ data }: HeroProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const current = services[active];
  const ActiveIcon = current.icon;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % services.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const move = (direction: number) => setActive(index => (index + direction + services.length) % services.length);

  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-stage relative isolate overflow-hidden bg-[#f7f9fc] text-slate-950 dark:bg-[#080d1a] dark:text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
    >
      <div className="hero-grain absolute inset-0 -z-10" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-36 top-8 -z-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-[100px] dark:bg-cyan-500/10" />
      <div className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-300/20 blur-[110px] dark:bg-indigo-500/10" />

      <div className="mx-auto w-full max-w-[1380px] px-4 pb-14 pt-10 sm:px-7 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[.96fr_1.04fr] lg:gap-10 xl:gap-16">
          <div className="hero-copy-block relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3.5 py-2 text-[11px] font-bold tracking-wide text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:text-xs">
              <span className="grid size-6 place-items-center rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-300/15 dark:text-cyan-200"><MapPin size={13} /></span>
              Bhopal-based · Working across India
              <span className="ml-1 hidden items-center gap-1 border-l border-slate-200 pl-2.5 text-amber-500 dark:border-white/15 sm:inline-flex"><Sparkles size={12} /> Built around your goals</span>
            </div>

            <p className="mb-3 text-xs font-extrabold uppercase tracking-[.19em] text-cyan-800 dark:text-cyan-300 sm:text-sm">Digital experiences that move business forward</p>
            <h1 id="home-hero-title" className="max-w-[700px] font-display text-[2.6rem] font-black leading-[1.06] tracking-[-.045em] text-slate-950 dark:text-white sm:text-6xl lg:text-[4rem] xl:text-[4.35rem]">
              Web development in Bhopal, <span className="hero-headline-accent">made to grow.</span>
            </h1>
            <p className="mt-6 max-w-[590px] text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              {data?.description || 'We build fast, search-ready websites, mobile apps and practical automation that help your business reach more customers.'}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/contact" className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl bg-[#101b33] px-6 text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(16,27,51,.65)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/60 dark:bg-cyan-300 dark:text-[#08111f] dark:hover:bg-cyan-200">
                Get a free consultation <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts%2C%20I%20want%20to%20grow%20my%20business%20online." target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick('hero_banner')} className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/70 px-5 text-sm font-bold text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-emerald-400/10">
                <MessageCircle size={17} className="text-emerald-600 dark:text-emerald-400" /> Chat on WhatsApp
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600 dark:text-emerald-400" /> Mobile-first by default</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600 dark:text-emerald-400" /> SEO-ready foundations</span>
              <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-600 dark:text-emerald-400" /> Support from real people</span>
            </div>

            <div className="mt-10 border-t border-slate-200/80 pt-5 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">Explore what we do</p>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => move(-1)} aria-label="Previous service" className="grid size-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-400 hover:text-cyan-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ArrowLeft size={14} /></button>
                  <button type="button" onClick={() => move(1)} aria-label="Next service" className="grid size-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-400 hover:text-cyan-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"><ArrowRight size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return <button key={service.name} type="button" onClick={() => setActive(index)} aria-pressed={active === index} className={`group flex min-h-[45px] items-center justify-center gap-2 rounded-xl border px-2.5 text-[11px] font-bold transition sm:text-xs ${active === index ? 'border-cyan-700 bg-cyan-800 text-white shadow-md shadow-cyan-900/15 dark:border-cyan-200/40 dark:bg-cyan-300 dark:text-slate-950' : 'border-slate-200 bg-white/70 text-slate-600 hover:border-cyan-500/50 hover:text-cyan-900 dark:border-white/10 dark:bg-white/[.035] dark:text-slate-300 dark:hover:text-cyan-200'}`}>
                    <Icon size={14} className={active === index ? '' : 'text-cyan-700 dark:text-cyan-300'} />{service.short}
                  </button>;
                })}
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10" aria-hidden="true"><div key={active} className={`hero-progress h-full rounded-full ${paused ? 'hero-progress-paused' : ''}`} style={{ backgroundColor: current.color }} /></div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
            <div className="pointer-events-none absolute -inset-5 rounded-[38px] bg-gradient-to-br from-cyan-300/25 via-indigo-300/20 to-fuchsia-300/20 blur-2xl dark:from-cyan-400/10 dark:via-indigo-500/10 dark:to-fuchsia-500/10" />
            <div className="hero-float-wrap relative">
            <div className="hero-dashboard relative overflow-hidden rounded-[26px] border border-white/10 bg-[#0c1425] p-3 text-white shadow-[0_35px_90px_-35px_rgba(15,23,42,.6)] sm:rounded-[32px] sm:p-4">
              <div className="flex items-center justify-between gap-3 border-b border-white/[.08] px-2 pb-3 sm:px-3 sm:pb-4">
                <div className="flex min-w-0 items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/[.08] text-cyan-200"><Globe2 size={16} /></span><div className="min-w-0"><p className="truncate text-xs font-bold">Growth workspace</p><p className="text-[10px] text-slate-400">A clearer view of what matters</p></div></div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[.08] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200 sm:text-[10px]"><span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_9px_#6ee7b7]" /> Growth snapshot</span>
              </div>

              <div className="grid gap-3 p-1 pt-3 sm:grid-cols-[1.2fr_.8fr] sm:gap-3 sm:p-2 sm:pt-4">
                <div className="rounded-2xl border border-white/[.08] bg-[#111c30] p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold text-slate-400">{current.name}</p><h2 key={current.title} className="hero-copy-enter mt-1.5 max-w-[300px] text-lg font-bold leading-snug tracking-tight sm:text-xl">{current.title}</h2></div><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[.06]" style={{ color: current.color }}><ActiveIcon size={17} /></span></div>
                  <p key={current.detail} className="hero-copy-enter mt-2.5 max-w-[420px] text-[11px] leading-5 text-slate-400 sm:text-xs">{current.detail}</p>

                  <div className="mt-5 rounded-xl border border-white/[.07] bg-[#0b1424] p-3.5 sm:mt-6 sm:p-4">
                    <div className="flex items-end justify-between gap-2"><div><p className="text-[9px] font-bold uppercase tracking-[.15em] text-slate-500">A useful signal</p><p className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{current.metric}</p></div><span className="mb-1 inline-flex gap-1 text-[10px] font-bold text-emerald-300"><TrendingUp size={13} /> {current.metricLabel}</span></div>
                    <div className="mt-3 h-[88px] overflow-hidden sm:h-[104px]">
                      <svg viewBox="0 0 520 110" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Illustrative rising performance chart">
                        <defs><linearGradient id="heroChartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={current.color} stopOpacity=".28"/><stop offset="100%" stopColor={current.color} stopOpacity="0"/></linearGradient></defs>
                        {[20,48,76,104].map(y=><line key={y} x1="0" x2="520" y1={y} y2={y} stroke="white" strokeOpacity=".07" strokeDasharray="3 6" />)}
                        <path d="M0 88 C36 83 42 75 72 79 S114 84 145 65 S188 70 218 57 S264 63 293 44 S335 51 367 39 S411 48 441 23 S484 32 520 10 L520 110 L0 110Z" fill="url(#heroChartFill)" />
                        <path className="hero-chart-line" d="M0 88 C36 83 42 75 72 79 S114 84 145 65 S188 70 218 57 S264 63 293 44 S335 51 367 39 S411 48 441 23 S484 32 520 10" fill="none" stroke={current.color} strokeWidth="3" strokeLinecap="round" />
                        <circle cx="520" cy="10" r="5" fill={current.color} /><circle cx="520" cy="10" r="10" fill={current.color} fillOpacity=".18" />
                      </svg>
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-slate-600"><span>Build a strong foundation</span><span>Keep improving</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
                  <div className="col-span-2 rounded-2xl border border-white/[.08] bg-[#111c30] p-4 sm:col-span-1 sm:p-5">
                    <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">The right foundations</p><ShieldCheck size={16} className="text-cyan-200" /></div>
                    <div className="mt-4 space-y-3">
                      {[['Performance', 'Quick on every screen'], ['Search readiness', 'Structured for discovery'], ['User experience', 'Simple next steps']].map(([name, detail], index)=><div key={name} className="flex items-center gap-2.5"><span className="grid size-6 shrink-0 place-items-center rounded-lg bg-emerald-300/[.1] text-emerald-200"><Check size={12} /></span><div className="min-w-0"><p className="text-[10px] font-bold sm:text-[11px]">{name}</p><p className="truncate text-[9px] text-slate-500 sm:text-[10px]">{detail}</p></div><span className="ml-auto h-1 w-8 overflow-hidden rounded-full bg-white/10 sm:w-10"><span className="block h-full rounded-full bg-emerald-300/80" style={{ width: `${88 - index * 12}%` }} /></span></div>)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[.08] bg-[#111c30] p-3.5 sm:p-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-500">Built around</p><p className="mt-2 text-sm font-extrabold tracking-tight sm:text-base">Your next goal</p><p className="mt-1 text-[9px] leading-4 text-slate-400 sm:text-[10px]">Clear plan. Practical delivery.</p></div>
                  <div className="rounded-2xl border border-white/[.08] bg-[#111c30] p-3.5 sm:p-4"><p className="text-[9px] font-bold uppercase tracking-[.12em] text-slate-500">From Bhopal</p><p className="mt-2 flex items-center gap-1.5 text-sm font-extrabold tracking-tight sm:text-base"><Zap size={14} className="text-amber-300" /> Ready to build</p><p className="mt-1 text-[9px] leading-4 text-slate-400 sm:text-[10px]">Web · apps · automation</p></div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/[.07] bg-white/[.035] px-3.5 py-3 sm:mt-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-xl bg-cyan-300/[.1] text-cyan-200"><MousePointer2 size={15} /></span><div className="min-w-0"><p className="truncate text-[10px] font-bold">A good next step starts with a conversation.</p><p className="text-[9px] text-slate-500">Tell us what you want to improve.</p></div></div>
                <Link href="/contact" aria-label="Talk about your project" className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-slate-950 transition hover:scale-105 hover:bg-cyan-200"><ArrowUpRight size={16} /></Link>
              </div>
            </div>
            </div>
          </div>
        </div>

        <a href="#services" className="mx-auto mt-12 hidden w-fit items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400 transition hover:text-cyan-800 dark:hover:text-cyan-200 sm:flex">Explore the work <ArrowRight size={13} className="rotate-90" /><span className="sr-only">Scroll to services</span></a>
      </div>
    </section>
  );
}
