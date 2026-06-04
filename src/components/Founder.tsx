'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Quote, Sparkles } from 'lucide-react';

const Instagram = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Linkedin = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Twitter = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import { SiteData } from '@/lib/db';

interface FounderProps {
  data: SiteData['founder'];
}

export default function Founder({ data }: FounderProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  // Mouse spotlight coordinates tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <section className="relative py-14 md:py-28 overflow-hidden bg-slate-50 dark:bg-[#02000a]/50" id="founder">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-brand-purple/5 dark:bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Quote / Message Column */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-slate-200/50 dark:border-slate-800 text-xs font-semibold uppercase text-[#c2410c] dark:text-brand-purple">
              <Sparkles size={10} className="text-[#c2410c] dark:text-brand-purple" />
              Founder Vision
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
              Message from our Founder
            </h2>

            <div className="relative">
              <Quote size={50} className="absolute -top-6 -left-4 text-brand-purple/10 pointer-events-none" />
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic relative z-10 pl-6 border-l-2 border-brand-purple/30">
                &ldquo;{data.message}&rdquo;
              </p>
            </div>

            <div className="pt-4 pl-6">
              <h3 className="font-display font-black text-slate-800 dark:text-white text-lg leading-tight">
                {data.name}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {data.designation}
              </p>
            </div>
          </div>

          {/* Portrait Column with Spotlight Trigger */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setOpacity(1)}
              onMouseLeave={() => setOpacity(0)}
              className="relative w-80 h-[400px] rounded-3xl overflow-hidden glass border border-slate-200 dark:border-slate-800/80 shadow-2xl group cursor-pointer beam-border"
            >
              {/* Card Spotlight Mask overlay */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  opacity,
                  background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(121, 40, 202, 0.15), transparent 80%)`
                }}
              />

              {/* Founder Image placeholder / avatar container */}
              <div className="w-full h-full bg-slate-900 flex flex-col justify-end p-8 relative">
                {/* Generative mesh glow in picture card */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-brand-purple/30 blur-[40px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                
                {data.image ? (
                  <Image
                    src={data.image}
                    alt={data.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-700/30 text-8xl font-display font-black select-none pointer-events-none">
                    VM
                  </div>
                )}

                {/* Details overlay */}
                <div className="relative z-20 space-y-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-base tracking-wide">
                      {data.name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
                      {data.designation}
                    </p>
                  </div>

                  {/* Social links — only render if real URL is set */}
                  <div className="flex gap-3 pt-2 border-t border-white/10">
                    {data.socials.instagram && data.socials.instagram !== '#' && (
                      <Link
                        href={data.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Founder Instagram"
                      >
                        <Instagram size={14} />
                      </Link>
                    )}
                    {data.socials.linkedin && data.socials.linkedin !== '#' && (
                      <Link
                        href={data.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Founder Linkedin"
                      >
                        <Linkedin size={14} />
                      </Link>
                    )}
                    {data.socials.twitter && data.socials.twitter !== '#' && (
                      <Link
                        href={data.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Founder Twitter"
                      >
                        <Twitter size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
