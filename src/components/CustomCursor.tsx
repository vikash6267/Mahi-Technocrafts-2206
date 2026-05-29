'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || 
                     'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0;
    setIsTouchDevice(isMobile);
  }, []);

  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], input, textarea, select, .interactive-hover');
      targets.forEach((elem) => {
        elem.addEventListener('mouseenter', () => setHovered(true));
        elem.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Initial binding
    addHoverListeners();

    // Re-bind when DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice]);

  if (typeof window === 'undefined' || isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer ring cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-brand-blue rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: hovered ? 1.5 : 1,
          backgroundColor: hovered ? 'rgba(0, 114, 245, 0.2)' : 'rgba(0, 0, 0, 0)',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      {/* Inner dot cursor */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-brand-blue rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: hovered ? 0.5 : 1,
        }}
      />
    </>
  );
}
