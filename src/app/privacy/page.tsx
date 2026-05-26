import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Mahi Technocrafts',
  description: 'Privacy Policy details for client data handled by Mahi Technocrafts.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 max-w-3xl mx-auto px-6 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white pb-4 border-b border-slate-200 dark:border-slate-800">
        Privacy Policy
      </h1>
      <p className="font-semibold text-slate-500">Last updated: May 26, 2026</p>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">1. Information We Collect</h2>
        <p>
          We only collect personal information that you voluntarily provide to us when submitting inquiries through our contact forms or applying for jobs. This information may include your name, email address, phone number, and any project-specific details.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">2. How We Use Your Information</h2>
        <p>
          We use the collected information to respond directly to your queries, provide technical estimates, arrange consultations, and process employment applications. We do not sell or lease your personal information to third-party marketing services.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">3. Data Security</h2>
        <p>
          We implement standard security protocols to prevent unauthorized access, alteration, or disclosure of your data. However, please remember that no transmission method over the internet is 100% secure.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-display font-bold text-slate-800 dark:text-white mt-6">4. Contact Us</h2>
        <p>
          If you have questions regarding this Privacy Policy, feel free to contact us at{' '}
          <a href="mailto:support@mahitechnocrafts.in" className="text-brand-blue font-semibold hover:underline">
            support@mahitechnocrafts.in
          </a>
          .
        </p>
      </section>
    </div>
  );
}
