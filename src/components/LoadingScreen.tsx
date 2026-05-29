'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const duration = 600;
    const intervalTime = 12;
    const steps = duration / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(Math.round((step / steps) * 100), 100);
      setCount(progress);

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsZooming(true);
          setTimeout(() => {
            setShow(false);
            onComplete();
          }, 300);
        }, 100);
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
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 grid-backdrop opacity-70 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={
                isZooming
                  ? { scale: 8, opacity: 0, rotate: 0 }
                  : { scale: 1, opacity: 1, rotate: 0 }
              }
              transition={
                isZooming
                  ? { duration: 0.3, ease: [0.7, 0, 0.3, 1] }
                  : { type: 'spring', stiffness: 200, damping: 14 }
              }
              className="relative w-28 h-28 mb-8 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-3xl border border-white/60 bg-white/90 flex items-center justify-center p-5 shadow-xl backdrop-blur-md">
                <Image
                  src="/images/logo.webp"
                  alt="Mahi Technocrafts Logo"
                  width={72}
                  height={72}
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: isZooming ? 0 : 1, y: isZooming ? 20 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-extrabold tracking-wider text-gradient">
                  MAHI TECHNOCRAFTS
                </h1>
              </div>

              <div className="w-48 h-[2px] bg-slate-200/80 rounded-full overflow-hidden">
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
