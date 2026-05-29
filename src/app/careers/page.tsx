import React from 'react';
import { Briefcase, MapPin, Clock, Sparkles } from 'lucide-react';
import { getCareers, CareerItem } from '@/lib/db';

export const metadata = {
  title: 'Careers | Mahi Technocrafts',
  description: 'Join the team at Mahi Technocrafts. Explore our open positions and build beautiful websites and apps.',
  alternates: {
    canonical: '/careers'
  }
};

export const revalidate = 0; // Disable dynamic caching so careers updates appear instantly

export default async function CareersPage() {
  let jobs: CareerItem[] = [];
  try {
    jobs = await getCareers();
  } catch (error) {
    console.error('Failed to load careers from database:', error);
  }

  return (
    <div className="min-h-screen py-16 max-w-5xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-slate-200/50 dark:border-slate-800 text-xs font-semibold uppercase text-brand-purple">
          <Sparkles size={10} />
          Join the Team
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
          Build the Future <span className="text-gradient">With Us</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
          We believe in creating beautiful websites and custom apps. Join our friendly team in Bhopal to design and build simple, fast, and high-quality digital tools.
        </p>
      </div>

      {/* Jobs list */}
      <div className="space-y-6 max-w-4xl mx-auto pt-6">
        {jobs.length === 0 ? (
          <div className="p-12 text-center border border-slate-250 dark:border-slate-800/80 rounded-2xl glass text-slate-500 flex flex-col items-center justify-center gap-2">
            <Briefcase size={32} className="text-slate-400" />
            <p className="text-sm font-bold">No open positions at the moment.</p>
            <p className="text-xs">Feel free to email your resume to support@mahitechnocrafts.in anyway!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/85 hover:border-brand-purple/20 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer interactive-hover"
            >
              <div className="space-y-3 max-w-xl">
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-lg">
                  {job.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {job.description}
                </p>
                <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Briefcase size={10} />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {job.experience}
                  </span>
                </div>
              </div>

              <a
                href={`mailto:support@mahitechnocrafts.in?subject=Job Application: ${encodeURIComponent(job.title)}`}
                className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs tracking-wider uppercase rounded-xl flex-shrink-0 cursor-pointer transition-colors"
              >
                Apply Now
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
