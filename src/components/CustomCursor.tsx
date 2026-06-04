'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const outerCursorRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || 
                     'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0;
    setIsTouchDevice(isMobile);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      const x = e.clientX;
      const y = e.clientY;

      if (outerCursorRef.current) {
        outerCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (innerCursorRef.current) {
        innerCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
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
  }, [isVisible, isTouchDevice]);

  if (typeof window === 'undefined' || isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Outer ring cursor */}
      <div
        ref={outerCursorRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-brand-blue rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block transition-transform duration-75 ease-out"
        style={{
          backgroundColor: hovered ? 'rgba(0, 114, 245, 0.2)' : 'rgba(0, 0, 0, 0)',
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
      {/* Inner dot cursor */}
      <div
        ref={innerCursorRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 bg-brand-blue rounded-full pointer-events-none z-50 hidden md:block"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
        }}
      />
    </>
  );
}
