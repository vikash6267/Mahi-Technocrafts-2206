'use client';

import React from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Founder from '@/components/Founder';
import Services from '@/components/Services';
import Projects from '@/components/Projects';
import TechStack from '@/components/TechStack';
import Testimonials from '@/components/Testimonials';
import Timeline from '@/components/Timeline';
import FAQ from '@/components/FAQ';
import ContactForm from '@/components/ContactForm';
import { SiteData, ReviewItem } from '@/lib/db';

export default function HomeClient({ data, reviews }: { data: SiteData; reviews: ReviewItem[] }) {
  // Loader commented out per user request
  /*
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }
  */

  return (
    <div className="relative animate-fadeIn">
      {/* Background neon elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[130px] pointer-events-none" />
      
      <Hero data={data.hero} />
      <About data={data.about} />
      <Founder data={data.founder} />
      <Services data={data.services} />
      <Projects data={data.projects} />
      <TechStack />
      <Testimonials initialReviews={reviews} />
      <Timeline />
      <FAQ data={data.faq} />
      <ContactForm contactInfo={data.contactInfo} />
    </div>
  );
}
