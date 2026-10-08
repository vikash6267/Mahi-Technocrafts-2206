import React from 'react';
import About from '@/components/About';
import Founder from '@/components/Founder';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'About Mahi TechnoCrafts | Top Web & Software Agency in Bhopal',
  description: 'Learn about Mahi TechnoCrafts, Bhopal\'s leading website and custom software development agency founded by Vikash Maheshwari. Serving Bhopal, MP, and global businesses.',
  alternates: {
    canonical: '/about'
  },
  keywords: [
    'About Mahi TechnoCrafts',
    'web development company bhopal',
    'software agency bhopal',
    'Vikash Maheshwari',
    'IT company Bhopal',
    'best web agency madhya pradesh'
  ],
  openGraph: {
    title: 'About Mahi TechnoCrafts | Top Web & Software Agency in Bhopal',
    description: 'Bhopal\'s premier web development and software engineering partner. Learn our story, mission, and team.',
    url: 'https://mahitechnocrafts.in/about',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'About Mahi TechnoCrafts Bhopal' }]
  }
};

export const revalidate = 0;

export default async function AboutPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-3xl mx-auto py-10 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
          Bhopal-Based IT & Web Agency
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600">Mahi TechnoCrafts</span>
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Founded in Bhopal by Vikash Maheshwari, we engineer high-performance websites, custom apps, and AI automations that help Indian businesses thrive online.
        </p>
      </div>

      <About data={data.about} />
      <Founder data={data.founder} />
    </div>
  );
}
