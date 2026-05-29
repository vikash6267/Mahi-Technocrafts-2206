import React from 'react';
import Services from '@/components/Services';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'Our Services',
  description: 'Explore Mahi Technocrafts services: web development, mobile applications, custom business software, designs, and secure web hosting.',
  alternates: {
    canonical: '/services'
  }
};

export const revalidate = 0;

export default async function ServicesPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto py-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Our Expert <span className="text-gradient">Services</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">
          High Performance Websites & Software
        </p>
      </div>

      <Services data={data.services} />
    </div>
  );
}
