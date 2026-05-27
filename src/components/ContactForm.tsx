'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactFormProps {
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    googleMapEmbed: string;
  };
}

export default function ContactForm({ contactInfo }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitResult({ success: true, message: data.message });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        // Trigger confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setSubmitResult({ success: false, message: data.error || 'Failed to submit form.' });
      }
    } catch (error) {
      console.error('Contact submission error', error);
      setSubmitResult({ success: false, message: 'An unexpected network error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030014]/40" id="contact">
      {/* Background neon glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            Contact Us
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Let&apos;s Build Something Great
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Details & Map Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white">Get in Touch</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed">
                Have a project mind or questions about our tech? Reach out today. Our crew is available to answer all queries and consults.
              </p>
            </div>

            {/* Address cards */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex gap-4 p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-850">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-xs">Email Us</h4>
                  <a href={`mailto:${contactInfo.email}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-blue mt-0.5 block transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-850">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-xs">Call Us</h4>
                  <a href={`tel:${contactInfo.phone}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-blue mt-0.5 block transition-colors">
                    +91 {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4 p-4 rounded-xl glass border border-slate-200/50 dark:border-slate-850">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-xs">Our Office</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {contactInfo.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-850 h-56 shadow-md">
              <iframe
                title="Mahi Technocrafts Office Map"
                src={contactInfo.googleMapEmbed}
                className="w-full h-full border-0 grayscale opacity-80 dark:opacity-60"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 p-8 rounded-2xl glass border border-slate-200 dark:border-slate-800/80 shadow-2xl relative">
            <h3 className="text-xl font-display font-bold text-slate-800 dark:text-white mb-6">Send a Message</h3>

            {submitResult?.success ? (
              <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex flex-col items-center justify-center text-center gap-4 py-12">
                <CheckCircle2 size={44} className="animate-bounce" />
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-slate-800 dark:text-white text-base">Message Sent Successfully!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                    {submitResult.message}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${
                        errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      } rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-blue`}
                      placeholder="Vikash Maheshwari"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${
                        errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      } rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-blue`}
                      placeholder="support@mahitechnocrafts.in"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-blue"
                      placeholder="6267144122"
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-blue"
                      placeholder="Web development inquiry"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white dark:bg-slate-900 border ${
                      errors.message ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    } rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-blue resize-none`}
                    placeholder="Briefly describe your project details or questions..."
                  />
                  {errors.message && <span className="text-[10px] text-red-500 font-semibold">{errors.message}</span>}
                </div>

                {/* Form feedback error */}
                {submitResult && !submitResult.success && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                    {submitResult.message}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-sky-600 dark:bg-brand-blue hover:bg-sky-700 dark:hover:bg-brand-blue/90 text-white rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-brand-blue/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      Sending Message...
                      <Loader2 size={14} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
