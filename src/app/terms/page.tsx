import React from 'react';

export const metadata = {
  title: 'Terms of Service | Mahi Technocrafts',
  description: 'Terms of Service guidelines for Mahi Technocrafts projects and systems.',
  alternates: {
    canonical: '/terms'
  }
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 max-w-3xl mx-auto px-6 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
        Terms of Service
      </h1>
      <p className="font-semibold text-slate-500">Last updated: May 26, 2026</p>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">1. Agreement to Terms</h2>
        <p>
          By accessing or using our website, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">2. Intellectual Property</h2>
        <p>
          The content, layout, designs, code utilities, and graphics hosted on this website are the property of Mahi Technocrafts and are protected by copyright laws. You may not copy or redistribute any part of our site without express written consent.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">3. Project Consultations</h2>
        <p>
          Initial consultations and project estimates provided through our platform are informative and do not constitute a binding legal contract. Contractual terms are agreed upon separately in signed service agreements.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">4. Contact Information</h2>
        <p>
          Questions about these Terms should be sent to{' '}
          <a href="mailto:support@mahitechnocrafts.in" className="text-brand-blue font-semibold hover:underline">
            support@mahitechnocrafts.in
          </a>
          .
        </p>
      </section>
    </div>
  );
}
