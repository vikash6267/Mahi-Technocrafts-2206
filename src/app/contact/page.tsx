import React from 'react';
import ContactForm from '@/components/ContactForm';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'Contact Mahi TechnoCrafts | Web Development Agency in Bhopal',
  description: 'Contact Bhopal\'s top web development & software agency. Call +91 6267144122 or visit Hamidia Rd, Badabagh, Shahjahanabad, Bhopal for a free consultation.',
  alternates: {
    canonical: '/contact'
  },
  keywords: [
    'contact web developer bhopal',
    'hire software agency bhopal',
    'Mahi TechnoCrafts Bhopal address',
    'web developers near me bhopal',
    'IT company contact bhopal'
  ],
  openGraph: {
    title: 'Contact Mahi TechnoCrafts | Web Development Agency in Bhopal',
    description: 'Get in touch for custom websites, apps, and software development. Free project quote within 24 hours.',
    url: 'https://mahitechnocrafts.in/contact',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Contact Mahi TechnoCrafts Bhopal' }]
  }
};

export const revalidate = 0;

export default async function ContactPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-3xl mx-auto py-10 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          Hamidia Rd, Shahjahanabad, Bhopal
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Mahi TechnoCrafts</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Ready to scale your business? Speak directly with Bhopal&apos;s leading tech team for a free project consultation, live prototype, and transparent cost estimate.
        </p>
      </div>

      <ContactForm contactInfo={data.contactInfo} />
    </div>
  );
}
