import React from 'react';
import Services from '@/components/Services';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'Web & Software Development Services in Bhopal | Mahi TechnoCrafts',
  description: 'Explore full-stack IT services by Mahi TechnoCrafts Bhopal: custom websites, mobile apps, WhatsApp CRM automation, e-commerce portals, and cloud hosting.',
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
    description: 'High-performance websites, mobile apps, and custom software engineered by Bhopal\'s leading tech agency.',
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
          Bhopal&apos;s Full-Service Tech Agency
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Web & Software <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Development Services</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          High-performance websites, Android/iOS mobile apps, and custom business automations engineered by Bhopal&apos;s leading tech team.
        </p>
      </div>

      <Services data={data.services} />
    </div>
  );
}
