'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList, LayoutDashboard, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';

const projectSteps = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'A scope you can review',
    description: 'We clarify the audience, features, integrations, deliverables, and priorities before development starts.',
  },
  {
    icon: LayoutDashboard,
    number: '02',
    title: 'Designed for real users',
    description: 'We shape the interface for mobile and desktop, with clear navigation and useful next steps.',
  },
  {
    icon: MessageCircle,
    number: '03',
    title: 'Progress you can follow',
    description: 'You can review the work as it develops, share feedback, and make informed decisions along the way.',
  },
  {
    icon: ShieldCheck,
    number: '04',
    title: 'A practical handover',
    description: 'We prepare the agreed launch and handover details so your team knows how to use and maintain the result.',
  },
];

export default function TransformationComparison() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-16 dark:bg-[#02000e] md:py-24" id="comparison">
      <div className="pointer-events-none absolute -left-24 top-20 -z-10 size-80 rounded-full bg-cyan-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 size-80 rounded-full bg-indigo-400/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-cyan-900 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200">
            <Sparkles size={13} /> A thoughtful way to build
          </span>
          <h2 className="mt-5 font-display text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl md:text-5xl">
            A clear process, from first idea to launch
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            Good work starts with clear expectations. We plan the important decisions with you and keep the project focused on your business needs.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {projectSteps.map(({ icon: Icon, number, title, description }) => (
            <li key={number} className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-white hover:shadow-xl dark:border-white/10 dark:bg-white/[.035] dark:hover:border-cyan-800 dark:hover:bg-white/[.06] sm:p-6">
              <span className="absolute right-5 top-4 text-4xl font-black tracking-tight text-slate-200/80 dark:text-white/[.07]">{number}</span>
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-cyan-800 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-cyan-200 dark:ring-white/10"><Icon size={21} /></span>
              <h3 className="mt-7 max-w-[220px] font-display text-lg font-extrabold leading-snug text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[24px] bg-[#101b33] px-5 py-6 text-center text-white shadow-xl sm:px-8 md:flex-row md:text-left">
          <div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-300">Have a project in mind?</p><p className="mt-1 text-lg font-bold sm:text-xl">Let&apos;s work out the right scope together.</p></div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Talk about your project <ArrowRight size={15} /></Link>
            <Link href="/portfolio" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-bold text-white transition hover:bg-white/10">View portfolio</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
