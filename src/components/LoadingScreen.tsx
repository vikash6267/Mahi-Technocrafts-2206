'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const duration = 1200; // Smooth 1.2s loading to experience the cinematic transition
    const intervalTime = 12;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(Math.round((step / steps) * 100), 100);
      setCount(progress);

      if (step >= steps) {
        clearInterval(timer);
        // Trigger cinematic Netflix-style zoom out
        setTimeout(() => {
          setIsZooming(true);
          // Complete transition after zoom animation finishes
          setTimeout(() => {
            setShow(false);
            onComplete();
          }, 550);
        }, 150);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#fafaff] text-slate-900 overflow-hidden"
          animate={{ opacity: isZooming ? 0 : 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Subtle grid backdrop that fades with the screen */}
          <div className="absolute inset-0 grid-backdrop opacity-70 pointer-events-none" />

          {/* Glowing particle background elements in brand colors */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"
            animate={{ scale: isZooming ? 2 : 1, opacity: isZooming ? 0 : 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-brand-purple/5 rounded-full blur-[120px] pointer-events-none"
            animate={{ scale: isZooming ? 2 : 1, opacity: isZooming ? 0 : 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Container with spring entry and Netflix-style zoom out */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={
                isZooming
                  ? { scale: 16, opacity: 0, rotate: 0 }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={
                isZooming
                  ? { duration: 0.55, ease: [0.7, 0, 0.3, 1] }
                  : { type: 'spring', stiffness: 200, damping: 14 }
              }
              className="relative w-28 h-28 mb-8 flex items-center justify-center"
            >
              {/* Outer pulsing neon glow shadow */}
              <motion.div 
                className="absolute inset-2 rounded-3xl bg-gradient-to-tr from-brand-blue to-brand-purple blur-md opacity-25"
                animate={isZooming ? { opacity: 0, scale: 0.8 } : { opacity: [0.2, 0.35, 0.2] }}
                transition={isZooming ? { duration: 0.2 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              
              {/* Inner white glassmorphism card */}
              <div className="absolute inset-0 rounded-3xl border border-white/60 bg-white/90 flex items-center justify-center p-5 shadow-xl backdrop-blur-md">
                {/* Logo Image with persistent slow breathing effect */}
                <motion.img
                  src="/logo.png"
                  alt="Mahi Technocrafts Logo"
                  className="w-18 h-18 object-contain"
                  animate={isZooming ? {} : { scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

            {/* Title, percentage, and progress bar that fade out before the zoom */}
            <motion.div
              animate={{ opacity: isZooming ? 0 : 1, y: isZooming ? 20 : 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-wider text-gradient">
                  MAHI TECHNOCRAFTS
                </h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-2 font-semibold">
                  Your Imagination, Our Creation
                </p>
              </div>

              {/* Percentage count-up */}
              <div className="relative font-display text-6xl md:text-7xl font-black tracking-tighter opacity-90 select-none">
                <span className="bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent">
                  {count}%
                </span>
              </div>

              {/* Progress bar line indicator */}
              <div className="w-48 h-[2px] bg-slate-200/80 rounded-full mt-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-purple"
                  style={{ width: `${count}%` }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
