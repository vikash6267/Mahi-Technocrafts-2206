'use client';

import React from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <button
      className="flex items-center gap-2 hover:text-brand-blue cursor-pointer transition-colors"
      onClick={handleShare}
    >
      <Share2 size={12} />
      Copy Link
    </button>
  );
}
