'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Code2, Globe, Heart } from 'lucide-react';
import { SiteData } from '@/lib/db';

interface HeroProps {
  data: SiteData['hero'];
}

export default function Hero({ data }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<'react' | 'config'>('react');
  
  // Count up stats
  const [statsValues, setStatsValues] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    // Staggered counting trigger
    const targets = [150, 80, 8, 25];
    const duration = 2000;
    const intervalTime = 30;
    const steps = duration / intervalTime;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStatsValues(
        targets.map((target) => {
          const val = Math.min(Math.round((step / steps) * target), target);
          return val;
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
    const particleCount = Math.min(Math.round((width * height) / 12000), 100);
    const connectionDistance = 125;
    const mouse = { x: -1000, y: -1000, radius: 200 };

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
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2.5 + 1.5;
        this.color = Math.random() > 0.5 ? '#0072f5' : '#7928ca';
        this.alpha = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Warp borders
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction (gravity pull)
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.8;
          this.y -= (dy / dist) * force * 1.8;
        }
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

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Click to create explosion
    const handleClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      for (let i = 0; i < 8; i++) {
        const p = new Particle();
        p.x = clickX;
        p.y = clickY;
        p.vx = (Math.random() - 0.5) * 5;
        p.vy = (Math.random() - 0.5) * 5;
        p.size = Math.random() * 3 + 2;
        particles.push(p);
        // Cap list size
        if (particles.length > 150) particles.shift();
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(121, 40, 202, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden py-24 grid-backdrop">
      {/* Background Interactive Nodes Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-55 dark:opacity-85" />

      {/* Floating Glowing Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 dark:bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-purple/10 dark:bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Texts and CTA Column */}
        <div className="lg:col-span-6 space-y-8 text-left">
          
          {/* Accent Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-slate-200/50 dark:border-slate-800 text-xs font-semibold tracking-wider uppercase text-brand-blue shadow-sm"
          >
            <Sparkles size={12} className="animate-spin text-purple-500" />
            Empowering Startups & Enterprises
          </motion.div>

          {/* Heading Text Reveal */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
              Your{' '}
              <span className="text-gradient drop-shadow-sm">
                Imagination
              </span>
              <br />
              Our Creation.
            </h1>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-600 dark:text-slate-350 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              {data.description}
            </motion.p>
          </div>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link
              href="/contact"
              className="px-8 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 dark:shadow-brand-blue/10 cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/services"
              className="px-8 py-4 glass hover:bg-slate-100 dark:hover:bg-slate-900/60 border border-slate-250 dark:border-slate-800 text-slate-800 dark:text-white font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 duration-200"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Code Editor Mockup with spinning border-beam */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', damping: 20 }}
            className="w-full max-w-lg rounded-2xl glass border border-slate-250 dark:border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-[360px] beam-border select-none"
          >
            {/* Header bar */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-850 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              {/* IDE tabs */}
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('react')}
                  className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    activeTab === 'react' ? 'text-brand-blue' : 'text-slate-400'
                  }`}
                >
                  App.tsx
                </button>
                <button
                  onClick={() => setActiveTab('config')}
                  className={`text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    activeTab === 'config' ? 'text-brand-blue' : 'text-slate-400'
                  }`}
                >
                  next.config.ts
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-6 font-mono text-xs flex-1 overflow-auto bg-slate-950/80 dark:bg-slate-950/95 leading-relaxed text-slate-300">
              <AnimatePresence mode="wait">
                {activeTab === 'react' ? (
                  <motion.div
                    key="react"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <div><span className="text-pink-500">import</span> React <span className="text-pink-500">from</span> <span className="text-green-400">&apos;react&apos;</span>;</div>
                    <div><span className="text-pink-500">import</span> {'{ getSiteData }'} <span className="text-pink-500">from</span> <span className="text-green-400">&apos;@/lib/db&apos;</span>;</div>
                    <br />
                    <div><span className="text-pink-500">export default async function</span> <span className="text-blue-400">Page</span>() {'{'}</div>
                    <div className="pl-4"><span className="text-pink-500">const</span> {'{ hero }'} = <span className="text-blue-400">getSiteData</span>();</div>
                    <br />
                    <div className="pl-4"><span className="text-pink-500">return</span> (</div>
                    <div className="pl-8 text-slate-500">&lt;<span className="text-blue-400">HeroSection</span>&gt;</div>
                    <div className="pl-12 text-slate-400">&lt;<span className="text-blue-400">h1</span> className=<span className="text-green-400">&quot;font-display font-black&quot;</span>&gt;</div>
                    <div className="pl-16 text-yellow-300">{'{'}hero.tagline{'}'}</div>
                    <div className="pl-12 text-slate-400">&lt;/<span className="text-blue-400">h1</span>&gt;</div>
                    <div className="pl-8 text-slate-500">&lt;/<span className="text-blue-400">HeroSection</span>&gt;</div>
                    <div className="pl-4">);</div>
                    <div>{'}'}</div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="config"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <div><span className="text-pink-500">import type</span> {'{ NextConfig }'} <span className="text-pink-500">from</span> <span className="text-green-400">&apos;next&apos;</span>;</div>
                    <br />
                    <div><span className="text-pink-500">const</span> config: NextConfig = {'{'}</div>
                    <div className="pl-4"><span className="text-blue-400">reactCompiler</span>: <span className="text-pink-500">true</span>,</div>
                    <div className="pl-4"><span className="text-blue-400">experimental</span>: {'{'}</div>
                    <div className="pl-8"><span className="text-blue-400">useCache</span>: <span className="text-pink-500">true</span>,</div>
                    <div className="pl-8"><span className="text-blue-400">instantNavigation</span>: <span className="text-pink-500">true</span></div>
                    <div className="pl-4">{'}'}</div>
                    <div>{'};'}</div>
                    <br />
                    <div><span className="text-pink-500">export default</span> config;</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Floating Neon Badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-6 p-4 rounded-xl glass border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-3 select-none"
          >
            <div className="w-7 h-7 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
              <Globe size={14} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Uptime Status</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">99.9% Operational</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section Overlay */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-16 mt-16 relative z-10 border-t border-slate-200/50 dark:border-slate-900/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="text-center md:text-left space-y-1 group"
            >
              <h3 className="text-3xl md:text-4xl font-display font-black text-slate-800 dark:text-white tracking-tight group-hover:text-brand-blue transition-colors">
                {/* Counted value */}
                {statsValues[i]}{stat.value.includes('+') ? '+' : ''}
              </h3>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
