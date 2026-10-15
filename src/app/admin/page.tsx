'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if session already exists
  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/login');
        const data = await res.json();
        if (isMounted && res.ok && data.authenticated) {
          router.push('/admin/dashboard');
          return;
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };
    checkSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide your username and password');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login request failed', err);
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030213] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={36} className="animate-spin text-sky-500" />
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
            Verifying Authorization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030213] px-4 sm:px-6 relative overflow-hidden text-slate-100">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-sky-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Background Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-[440px] relative z-10 py-8">
        {/* Main Card */}
        <div
          className="rounded-3xl bg-[#070918]/90 backdrop-blur-xl border border-slate-800/80 p-7 sm:p-9 shadow-2xl relative"
          style={{
            boxShadow:
              '0 25px 60px -15px rgba(14, 165, 233, 0.15), 0 0 50px -10px rgba(99, 102, 241, 0.2)'
          }}
        >
          {/* Brand Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/logo.webp"
                alt="Mahi Technocrafts"
                width={170}
                height={55}
                className="h-10 w-auto mx-auto object-contain drop-shadow"
                priority
              />
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/60 border border-sky-800/60 text-sky-400 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <ShieldCheck size={12} className="text-sky-400" />
                <span>Control Center Authorization</span>
              </div>
              <h1 className="text-xl font-display font-black text-white mt-2 tracking-wide">
                Sign in to Mahi Tech CMS
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Role-based access for Super-Admin & Subadmins
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
              >
                Username or ID
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  id="username"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. superadmin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Password
                </label>
                <span className="text-[10px] text-slate-500 font-medium">Secured • 256-bit</span>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
                  <Lock size={15} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error Alert Box */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-sky-600/25 hover:shadow-sky-500/40 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Authorizing Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Control Desk</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>RBAC Server Online</span>
            </span>

            <Link
              href="/"
              className="text-slate-400 hover:text-sky-400 transition-colors font-medium flex items-center gap-1"
            >
              <span>Back to Website</span>
              &rarr;
            </Link>
          </div>
        </div>

        {/* Access Hint Help */}
        <p className="text-center text-[11px] text-slate-500 mt-5">
          Authorized administrators only • Subadmin access permissions are managed by Super-Admin.
        </p>
      </div>
    </div>
  );
}
