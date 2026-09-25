'use client';

import React from 'react';
import Hero from '@/components/Hero';
import IndustrySolutions from '@/components/IndustrySolutions';
import Projects from '@/components/Projects';
import LeadEstimator from '@/components/LeadEstimator';
import Services from '@/components/Services';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import TransformationComparison from '@/components/TransformationComparison';
import Testimonials from '@/components/Testimonials';
import Timeline from '@/components/Timeline';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import { SiteData, ReviewItem } from '@/lib/db';

export default function HomeClient({ data, reviews }: { data: SiteData; reviews: ReviewItem[] }) {
  return (
    <div className="relative">
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[60px] pointer-events-none" />
      
      {/* 1. Revamped High-Converting Hero */}
      <Hero data={data.hero} />

      {/* 2. Purpose-Built Industry Solutions (Healthcare, E-Commerce, Real Estate, etc.) */}
      <IndustrySolutions />

      {/* 3. Featured Case Studies & Proven Client Results */}
      <Projects data={data.projects} />

      {/* 4. Interactive 30-Second Cost & Timeline Estimator */}
      <LeadEstimator />

      {/* 5. Core Services & Technical Capabilities */}
      <Services data={data.services} />

      {/* 6. Why Choose Us vs Others Comparison */}
      <TransformationComparison />

      {/* 7. About Company & Vision */}
      <About data={data.about} />

      {/* 8. Enterprise Quality Standards */}
      <TechStack />

      {/* 8. Client Reviews & Social Proof */}
      <Testimonials initialReviews={reviews} />

      {/* 9. 4-Step Agile Delivery Process */}
      <Timeline />

      {/* 10. Frequently Asked Questions */}
      <FAQ data={data.faq} />

      {/* 11. Instant Contact & Consultation Form */}
      <ContactForm contactInfo={data.contactInfo} />
    </div>
  );
}
