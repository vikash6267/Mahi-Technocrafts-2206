import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { getBhopalServicePage } from '@/lib/bhopal-service-pages';

export default function LandingPage({ slug }: { slug: string }) {
  const page = getBhopalServicePage(slug);
  if (!page) return null;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.title,
    description: page.metaDescription,
    url: `https://mahitechnocrafts.in/${page.slug}`,
    serviceType: page.label,
    areaServed: { '@type': 'City', name: 'Bhopal' },
    provider: { '@id': 'https://mahitechnocrafts.in/#organization' },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mahitechnocrafts.in/' },
      { '@type': 'ListItem', position: 2, name: page.title, item: `https://mahitechnocrafts.in/${page.slug}` },
    ],
  };
  return (
    <main className="bg-[#f7f9fc] text-slate-950 dark:bg-[#080d1a] dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,211,238,.15),_transparent_40%),radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,.12),_transparent_42%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_.9fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200"><MapPin size={14} className="text-cyan-700 dark:text-cyan-300" /> Bhopal, Madhya Pradesh</Link>
            <p className="mt-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-cyan-800 dark:text-cyan-300"><Sparkles size={14} /> {page.label} · Mahi TechnoCrafts</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">{page.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">Discuss your project <ArrowRight size={16} /></Link>
              <a href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts%2C%20I%20would%20like%20to%20discuss%20a%20project." target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-5 text-sm font-bold text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-emerald-400/10"><MessageCircle size={16} className="text-emerald-600 dark:text-emerald-300" /> WhatsApp</a>
            </div>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Tell us about your goals and get a scope tailored to your business.</p>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-3 rounded-[30px] bg-gradient-to-br from-cyan-300/35 via-indigo-300/20 to-fuchsia-300/25 blur-2xl" />
            <div className="relative aspect-[5/4] overflow-hidden rounded-[26px] border border-white/80 bg-slate-200 shadow-2xl dark:border-white/10 dark:bg-slate-800">
              <Image src={page.image} alt={page.imageAlt} fill fetchPriority="high" unoptimized sizes="(max-width: 1024px) 100vw, 44vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/5" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-slate-950/60 p-4 text-white backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-200">Thoughtful, practical delivery</p>
                <p className="mt-1 text-lg font-bold sm:text-xl">{page.value}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-800 dark:text-cyan-300">A useful scope</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">What this service can cover</h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">Every business has a different starting point. We shape the work around your audience, existing tools, and the result you want the project to support.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.focus.map((item) => <div key={item} className="flex min-h-[86px] items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[.04]"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300"><Check size={15} /></span><span className="pt-0.5 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{item}</span></div>)}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-white/10 dark:bg-white/[.025]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-800 dark:text-cyan-300">How we work</p><h2 className="mt-3 font-display text-3xl font-black tracking-tight">Clear steps, from first call to launch</h2><p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">We keep decisions visible and make sure the plan fits your users and the way your business operates.</p></div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {[['01', 'Understand', 'We discuss your goals, audience, current tools, and constraints.'], ['02', 'Plan', 'We agree on scope, priorities, deliverables, and a realistic schedule.'], ['03', 'Build & improve', 'We share progress, review the work together, and prepare a clear handover.']].map(([number, title, detail]) => <li key={number} className="rounded-2xl border border-slate-200 p-5 dark:border-white/10"><span className="text-xs font-black tracking-widest text-cyan-700 dark:text-cyan-300">{number}</span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{detail}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-800 dark:text-cyan-300">Common questions</p><h2 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">A few things to know</h2></div>
        <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5 dark:divide-white/10 dark:border-white/10 dark:bg-white/[.035] sm:px-7">
          {page.faqs.map(({ question, answer }) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none pr-8 font-bold text-slate-900 marker:hidden dark:text-white"><span className="flex items-center justify-between gap-4">{question}<span className="text-cyan-700 transition group-open:rotate-45 dark:text-cyan-300">+</span></span></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{answer}</p></details>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[26px] bg-[#101b33] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10 md:flex-row md:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Mahi TechnoCrafts · Bhopal</p><h2 className="mt-2 max-w-2xl font-display text-2xl font-black sm:text-3xl">Have a project in mind?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Share what you want to improve. We’ll discuss the right next step for your business.</p></div>
          <Link href="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Talk to our team <ArrowRight size={16} /></Link>
        </div>
        <nav aria-label="Related services" className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Link className="hover:text-cyan-700 dark:hover:text-cyan-300" href="/services">All services</Link><Link className="hover:text-cyan-700 dark:hover:text-cyan-300" href="/portfolio">Portfolio</Link><Link className="hover:text-cyan-700 dark:hover:text-cyan-300" href="/about">About Mahi TechnoCrafts</Link>
        </nav>
      </section>
    </main>
  );
}
