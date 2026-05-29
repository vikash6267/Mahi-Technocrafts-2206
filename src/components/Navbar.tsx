'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = React.useRef(0);
  
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Navigation Links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/#projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
    { name: 'Careers', path: '/careers' },
  ];

  // Control navbar visibility on scroll (performance optimized with useRef & thresholds)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Toggle scrolled class
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check scroll difference to prevent micro-toggle jittering
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 50) {
        setIsVisible(true);
      } else if (diff > 15 && currentScrollY > 100) {
        // Scrolled down significantly
        setIsVisible(false);
      } else if (diff < -15) {
        // Scrolled up significantly
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fafaff]/90 dark:bg-[#02000d]/90 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900/50 py-3 shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo.webp"
            alt="Mahi Technocrafts Logo"
            width={256}
            height={126}
            priority
            className="h-18 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative text-xs font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-brand-blue ${
                  isActive
                    ? 'text-brand-blue'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-brand-blue"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions (Theme toggle + CTA) */}
        <div className="hidden lg:flex items-center gap-4">

          <Link
            href="/contact"
            className="px-5 py-2.5 bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors cursor-pointer"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Toggle & Theme button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-[#fafaff]/95 dark:bg-[#02000d]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 shadow-lg overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-semibold uppercase tracking-wider py-1 ${
                      isActive ? 'text-brand-blue' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                className="w-full text-center py-3 bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white font-semibold text-xs tracking-wider uppercase rounded-xl transition-colors mt-2"
              >
                Get In Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
