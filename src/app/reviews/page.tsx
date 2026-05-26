'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ReviewsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    company: '',
    text: '',
    rating: 5,
    avatarUrl: ''
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    // Simple validations
    if (!formData.name.trim() || !formData.role.trim() || !formData.company.trim() || !formData.text.trim()) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({
          name: '',
          email: '',
          role: '',
          company: '',
          text: '',
          rating: 5,
          avatarUrl: ''
        });
        
        // Trigger celebration confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit review. Please try again.' });
      }
    } catch (error) {
      console.error('Review submit error', error);
      setStatus({ type: 'error', message: 'An unexpected network error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      setStatus({ type: 'error', message: 'Logo/photo file size exceeds 500KB. Please choose a smaller image file.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen py-24 px-6 relative bg-[#fafaff] dark:bg-[#02000d] text-slate-800 dark:text-white flex flex-col justify-center items-center overflow-hidden transition-colors duration-500 grid-backdrop">
      {/* Background Mesh Gradients using glow-bubble classes */}
      <div className="glow-bubble top-[-100px] left-[20%] w-[500px] h-[500px] bg-brand-blue" />
      <div className="glow-bubble bottom-[-100px] right-[20%] w-[500px] h-[500px] bg-brand-purple" />

      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10 space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-blue transition-colors group cursor-pointer"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Link>
        </div>

        {/* Title & Introduction */}
        <div className="space-y-3 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Share Your <span className="text-gradient">Feedback</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Your reviews help us grow and inspire trust in fast-growing brands worldwide. Submissions are reviewed by our team and published on the homepage.
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`p-5 rounded-2xl border flex gap-3.5 items-start transition-all duration-300 ${
              status.type === 'success'
                ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-250 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50/80 dark:bg-rose-500/10 border-rose-250 dark:border-rose-500/25 text-rose-800 dark:text-rose-300'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" size={20} />
            ) : (
              <AlertCircle className="flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" size={20} />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-bold">{status.type === 'success' ? 'Thank You!' : 'Action Required'}</h4>
              <p className="text-xs leading-relaxed opacity-90">{status.message}</p>
            </div>
          </div>
        )}

        {/* Review Form Card */}
        <div className="p-8 rounded-3xl glass border border-slate-200/60 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Split Grid for Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all duration-200 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address <span className="text-slate-400 dark:text-slate-500">(Private)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all duration-200 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Split Grid for Role and Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Designation / Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="role"
                  required
                  placeholder="e.g. Founder & CEO"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all duration-200 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  required
                  placeholder="e.g. Holo Inc"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all duration-200 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Interactive Rating Component */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Overall Experience <span className="text-rose-500">*</span>
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const ratingValue = idx + 1;
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setFormData({ ...formData, rating: ratingValue })}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1"
                    >
                      <Star
                        size={28}
                        className={`transition-colors duration-250 ${
                          ratingValue <= (hoverRating ?? formData.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700 hover:text-slate-400 dark:hover:text-slate-500'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold ml-2">
                  ({formData.rating} of 5 Stars)
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label htmlFor="text" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="text"
                required
                rows={5}
                placeholder="Describe your project experience, our support, design metrics, or engineering standards..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:ring-brand-blue/20 transition-all duration-200 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none leading-relaxed"
              />
            </div>

            {/* Logo/Photo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Company Logo / Personal Photo <span className="text-slate-400 dark:text-slate-500">(Optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {formData.avatarUrl ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-rose-500 dark:text-rose-450 font-bold opacity-0 hover:opacity-100 transition-opacity animate-fadeIn"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 flex items-center justify-center text-slate-400 dark:text-slate-550 text-[10px] font-bold flex-shrink-0 select-none">
                    No Image
                  </div>
                )}
                <label className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-slate-700 dark:text-slate-300 shadow-sm">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Max size 500KB. Square ratio recommended.</span>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-95 active:scale-[0.99] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase cursor-pointer text-white shadow-md hover:shadow-xl hover:shadow-brand-blue/10 dark:hover:shadow-brand-blue/5"
              >
                {isSubmitting ? (
                  <span>Submitting Review...</span>
                ) : (
                  <>
                    <Send size={15} />
                    Submit Review
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Small Note */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-500 font-semibold uppercase tracking-widest">
          <Sparkles size={11} className="text-brand-purple" />
          Powered by Mahi Technocrafts Engine
        </div>

      </div>
    </div>
  );
}
