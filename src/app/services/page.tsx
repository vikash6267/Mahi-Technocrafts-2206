import React from 'react';
import Services from '@/components/Services';
import { getSiteData } from '@/lib/db';
import Link from 'next/link';
import { bhopalServicePages } from '@/lib/bhopal-service-pages';

export const metadata = {
  title: 'Web & Software Development Services in Bhopal | Mahi TechnoCrafts',
  description: 'Explore website, ecommerce, mobile app, SEO, digital marketing, and software services from Mahi TechnoCrafts in Bhopal and across India.',
  alternates: {
    canonical: '/services'
  },
  keywords: [
    'web development services bhopal',
    'software development company bhopal',
    'mobile app developers bhopal',
    'e-commerce website development bhopal',
    'AI solutions bhopal',
    'IT services Bhopal MP'
  ],
  openGraph: {
    title: 'Web & Software Development Services in Bhopal | Mahi TechnoCrafts',
    description: 'Website, ecommerce, mobile app, and software services from Mahi TechnoCrafts in Bhopal.',
    url: 'https://mahitechnocrafts.in/services',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Mahi TechnoCrafts Services Bhopal' }]
  }
};

export const revalidate = 0;

export default async function ServicesPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-3xl mx-auto py-10 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          Digital services from Bhopal
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Web & Software <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Development Services</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          We plan and build websites, mobile apps, ecommerce experiences, and custom business software around your requirements.
        </p>
      </div>

      <Services data={data.services} />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="bhopal-service-pages-heading">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-800 dark:text-cyan-300">Services in Bhopal</p>
          <h2 id="bhopal-service-pages-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Explore a service by project type</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">See what each type of project can include, common planning questions, and how to discuss a scope with our team.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bhopalServicePages.map((page) => (
            <Link key={page.slug} href={`/${page.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/[.035]">
              <h3 className="font-semibold text-slate-900 group-hover:text-cyan-800 dark:text-white dark:group-hover:text-cyan-300">{page.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{page.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
