'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Users, Award } from 'lucide-react';
import { SiteData } from '@/lib/db';
import Image from 'next/image';

interface HeroProps {
  data: SiteData['hero'];
}

export default function Hero({ data }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Count up stats
  const [statsValues, setStatsValues] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const targets = [150, 80, 8, 25];
    const duration = 1200;
    const intervalTime = 30;
    const steps = duration / intervalTime;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStatsValues(
        targets.map((target) => {
          return Math.min(Math.round((step / steps) * target), target);
        })
      );

      if (step >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Responsive interactive constellation particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Zero-overhead mobile Safari bypass
    if (window.innerWidth < 768) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface ParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      update: () => void;
      draw: () => void;
    }

    const particles: ParticleType[] = [];
    const particleCount = Math.min(Math.round((width * height) / 25000), 40);
    const connectionDistance = 80;

    class Particle implements ParticleType {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.5 ? '#0ea5e9' : '#f97316';
        this.alpha = Math.random() * 0.3 + 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-24 bg-[#fafaff] grid-backdrop">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" />

      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/8 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        <div className="lg:col-span-6 space-y-8 text-left">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-200/60 text-xs font-semibold tracking-wider uppercase text-sky-700 dark:text-brand-blue shadow-sm"
          >
            <Sparkles size={12} className="animate-spin text-brand-purple" />
            Empowering Startups & Enterprises
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.08] text-slate-900 relative"
            >
              Your{' '}
              <span className="text-gradient drop-shadow-sm relative inline-block">
                Imagination
              </span>
              <br />
              Our Creation.
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              {data.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link
              href="/contact"
              className="px-8 py-4 bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/services"
              className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-800 font-bold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-6 relative flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', damping: 22 }}
            className="w-full max-w-lg rounded-3xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden flex flex-col h-[340px] relative select-none"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="flex gap-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                  App.tsx
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  next.config.ts
                </span>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-slate-950">
              <Image
                src="/images/herosection.webp"
                alt="Mahi Technocrafts Developer workspace"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-2xl flex items-center gap-3 select-none z-20"
          >
            <div className="w-8 h-8 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Uptime Status</span>
              <span className="text-xs font-bold text-slate-800">99.9% Operational</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full pt-16 mt-16 relative z-10 border-t border-slate-200/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map((stat, i) => {
            const config = [
              {
                icon: <Code2 size={20} className="text-blue-500" />,
                iconBg: "bg-blue-500/10",
                cardBg: "bg-blue-50/20 border-blue-100/50 hover:bg-blue-50/30",
                shadow: "hover:shadow-blue-500/5",
              },
              {
                icon: <Users size={20} className="text-emerald-500" />,
                iconBg: "bg-emerald-500/10",
                cardBg: "bg-emerald-50/20 border-emerald-100/50 hover:bg-emerald-50/30",
                shadow: "hover:shadow-emerald-500/5",
              },
              {
                icon: <Award size={20} className="text-purple-500" />,
                iconBg: "bg-purple-500/10",
                cardBg: "bg-purple-50/20 border-purple-100/50 hover:bg-purple-50/30",
                shadow: "hover:shadow-purple-500/5",
              },
              {
                icon: <Users size={20} className="text-orange-500" />,
                iconBg: "bg-orange-500/10",
                cardBg: "bg-orange-50/20 border-orange-100/50 hover:bg-orange-50/30",
                shadow: "hover:shadow-orange-500/5",
              },
            ][i] || {
              icon: <Code2 size={20} className="text-brand-blue" />,
              iconBg: "bg-brand-blue/10",
              cardBg: "bg-white/50 border-slate-200/50",
              shadow: "hover:shadow-slate-500/5",
            };

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`flex items-center gap-4 p-5 rounded-2xl border ${config.cardBg} transition-all duration-300 shadow-sm ${config.shadow} group`}
              >
                <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  {config.icon}
                </div>
                
                <div className="space-y-0.5 text-left">
                  <h3 className="text-2xl md:text-3xl font-display font-black text-slate-800 tracking-tight leading-none">
                    {statsValues[i]}{stat.value.includes('+') ? '+' : ''}
                  </h3>
                  <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold leading-tight">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
