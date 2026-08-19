'use client';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

async function copyUrl(url: string) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(url);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = url;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);

  return copied;
}

export default function ShareButton() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const updateStatus = (nextStatus: 'copied' | 'failed') => {
    setStatus(nextStatus);
    window.setTimeout(() => setStatus('idle'), 2000);
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title || 'Mahi Technocrafts article',
          url,
        });
        return;
      }

      updateStatus((await copyUrl(url)) ? 'copied' : 'failed');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      try {
        updateStatus((await copyUrl(url)) ? 'copied' : 'failed');
      } catch {
        updateStatus('failed');
      }
    }
  };

  const label =
    status === 'copied' ? 'Copied' : status === 'failed' ? 'Try Again' : 'Share';

  return (
    <button
      type="button"
      className="flex items-center gap-2 hover:text-brand-blue cursor-pointer transition-colors"
      onClick={handleShare}
      aria-label="Share this article"
    >
      <Share2 size={12} />
      {label}
    </button>
  );
}
