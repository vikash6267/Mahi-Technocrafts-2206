import React from 'react';
import About from '@/components/About';
import Founder from '@/components/Founder';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'About Us',
  description: 'Learn about our company story, values, mission, vision, and founder Vikash Maheshwari.',
};

export const revalidate = 0;

export default async function AboutPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto py-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          About Our <span className="text-gradient">Company</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">
          Your Imagination, Our Creation
        </p>
      </div>

      <About data={data.about} />
      <Founder data={data.founder} />
    </div>
  );
}
