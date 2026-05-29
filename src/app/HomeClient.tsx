'use client';

import React, { Suspense, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Founder from '@/components/Founder';
import Services from '@/components/Services';
import { SiteData, ReviewItem } from '@/lib/db';

const Projects = React.lazy(() => import('@/components/Projects'));
const TechStack = React.lazy(() => import('@/components/TechStack'));
const Testimonials = React.lazy(() => import('@/components/Testimonials'));
const Timeline = React.lazy(() => import('@/components/Timeline'));
const FAQ = React.lazy(() => import('@/components/FAQ'));
const ContactForm = React.lazy(() => import('@/components/ContactForm'));

export default function HomeClient({ data, reviews }: { data: SiteData; reviews: ReviewItem[] }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative animate-fadeIn">
      {/* Loading Screen Overlay - Renders on top of the layout without causing layout shifts */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[130px] pointer-events-none" />
      
      <Hero data={data.hero} />
      <About data={data.about} />
      <Founder data={data.founder} />
      <Services data={data.services} />
      <Suspense fallback={null}>
        <Projects data={data.projects} />
      </Suspense>
      <Suspense fallback={null}>
        <TechStack />
      </Suspense>
      <Suspense fallback={null}>
        <Testimonials initialReviews={reviews} />
      </Suspense>
      <Suspense fallback={null}>
        <Timeline />
      </Suspense>
      <Suspense fallback={null}>
        <FAQ data={data.faq} />
      </Suspense>
      <Suspense fallback={null}>
        <ContactForm contactInfo={data.contactInfo} />
      </Suspense>
    </div>
  );
}
