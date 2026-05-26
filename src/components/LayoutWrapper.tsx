'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import CustomCursor from './CustomCursor';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Custom Cursor tracks hover triggers */}
      <CustomCursor />
      
      {/* Common Layout Frame */}
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      
      {/* Interactive Assistant */}
      <Chatbot />
    </>
  );
}
