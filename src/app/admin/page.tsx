'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if session already exists
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide username and password');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login request failed', err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white">
        <Loader2 size={36} className="animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] px-6 relative">
      {/* Visual background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-blue/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-purple/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl glass border border-slate-800/80 shadow-2xl relative z-10 text-white">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="font-display font-black text-2xl tracking-wider text-gradient">
            MAHI TECH CMS
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400">
            Control Center Authorization
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-slate-400">Username</label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                placeholder="admin"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-slate-400">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                Authorizing...
                <Loader2 size={14} className="animate-spin" />
              </>
            ) : (
              <>
                Log In
                <Lock size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
