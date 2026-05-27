'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, PenTool } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ReviewItem } from '@/lib/db';

interface TestimonialsProps {
  initialReviews?: ReviewItem[];
}

export default function Testimonials({ initialReviews = [] }: TestimonialsProps) {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<ReviewItem[]>(initialReviews);

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setTestimonials(initialReviews);
    }
  }, [initialReviews]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) {
    return null; // Don't show the testimonials section if empty
  }

  // Ensure index is within range in case testimonials list updates
  const activeIndex = index >= testimonials.length ? 0 : index;
  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative py-28 overflow-hidden bg-slate-50 dark:bg-[#02000a]/50" id="testimonials">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            Testimonials
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Loved by Fast Growing Brands
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Carousel Container */}
        <div className="max-w-3xl mx-auto relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 shadow-2xl flex flex-col gap-6 text-center select-none"
            >
              <div className="flex justify-center gap-1">
                {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <div className="relative">
                <MessageSquare size={40} className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-brand-blue/10 pointer-events-none" />
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed italic relative z-10">
                  &ldquo;{activeTestimonial.text}&rdquo;
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                {activeTestimonial.avatarUrl ? (
                  <Image
                    src={activeTestimonial.avatarUrl}
                    alt={activeTestimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-black text-lg border border-brand-blue/20">
                    {activeTestimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-slate-800 dark:text-white text-base">
                    {activeTestimonial.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                    {activeTestimonial.role} at <span className="text-sky-700 dark:text-brand-blue font-bold">{activeTestimonial.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel dots indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                  activeIndex === idx ? 'w-6 bg-brand-blue' : 'bg-slate-300 dark:bg-slate-800'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Write a Review CTA */}
        <div className="flex justify-center mt-12">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <PenTool size={14} />
            Share Your Feedback
          </Link>
        </div>

      </div>
    </section>
  );
}
