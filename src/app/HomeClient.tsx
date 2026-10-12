'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import LeadEstimator from '@/components/LeadEstimator';
import Services from '@/components/Services';
import About from '@/components/About';
import TechStack from '@/components/TechStack';
import TransformationComparison from '@/components/TransformationComparison';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import ScrollReveal from '@/components/ScrollReveal';
import { SiteData, ReviewItem } from '@/lib/db';

export default function HomeClient({ data, reviews }: { data: SiteData; reviews: ReviewItem[] }) {
  return (
    <div className="relative">
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[60px] pointer-events-none" />
      
      {/* 1. Revamped High-Converting Hero */}
      <Hero data={data.hero} />

      {/* Core services first, with industries and examples shown later as proof. */}
      <ScrollReveal><Services data={data.services} /></ScrollReveal>
      <ScrollReveal><Projects data={data.projects} /></ScrollReveal>
      <ScrollReveal><LeadEstimator /></ScrollReveal>
      <ScrollReveal><TransformationComparison /></ScrollReveal>
      <ScrollReveal><About data={data.about} /></ScrollReveal>
      <ScrollReveal><TechStack /></ScrollReveal>
      <ScrollReveal><Testimonials initialReviews={reviews} /></ScrollReveal>
      <ScrollReveal><FAQ data={data.faq} /></ScrollReveal>
      <ScrollReveal><ContactForm contactInfo={data.contactInfo} /></ScrollReveal>
    </div>
  );
}
