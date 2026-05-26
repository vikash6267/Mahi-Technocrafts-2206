import React from 'react';
import ContactForm from '@/components/ContactForm';
import { getSiteData } from '@/lib/db';

export const metadata = {
  title: 'Contact Us',
  description: 'Submit your project details and get a quick technical consultation with Mahi Technocrafts engineering crew.',
};

export const revalidate = 0;

export default async function ContactPage() {
  const data = await getSiteData();

  return (
    <div className="py-8">
      <div className="text-center max-w-2xl mx-auto py-10 space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Contact Our <span className="text-gradient">Team</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">
          Get a Free Initial consultation
        </p>
      </div>

      <ContactForm contactInfo={data.contactInfo} />
    </div>
  );
}
