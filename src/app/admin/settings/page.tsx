'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Upload,
  Globe,
  Building2,
  Mail,
  Phone,
  MapPin,
  History,
  QrCode,
  Copy,
  Check,
  AlertTriangle,
  Smartphone,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { SiteData } from '@/lib/db';
import { AdminSessionUser } from '@/lib/admin-auth';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'security' | 'audit' | 'content'>('security');

  // Current session user
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);

  // Security Form States (Change Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // MFA & 2FA Setup States
  const [mfaStatus, setMfaStatus] = useState<{ enabled: boolean; message?: string }>({ enabled: false });
  const [mfaSetupData, setMfaSetupData] = useState<{ secret: string; uri: string; qrUrl: string } | null>(null);
  const [mfaVerifyCode, setMfaVerifyCode] = useState('');
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Site Content States
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [isSiteSaving, setIsSiteSaving] = useState(false);
  const [siteSaveStatus, setSiteSaveStatus] = useState('');
  const [isUploadingFounder, setIsUploadingFounder] = useState(false);

  // Recent Audit Logs for Audit Tab
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // 1. Initial Data Fetching
  useEffect(() => {
    // Fetch Current User
    fetch('/api/admin/login')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(console.error);

    // Fetch MFA Status
    fetchMfaStatus();
  }, []);

  // Fetch on-demand when switching tabs
  useEffect(() => {
    if (activeTab === 'audit') {
      fetchRecentAuditLogs();
    } else if (activeTab === 'content' && !siteData) {
      fetchSiteData();
    }
  }, [activeTab, siteData]);

  const fetchMfaStatus = async () => {
    try {
      const res = await fetch('/api/admin/mfa');
      if (res.ok) {
        const data = await res.json();
        setMfaStatus({ enabled: Boolean(data.enabled) });
        if (!data.enabled && data.secret) {
          setMfaSetupData({
            secret: data.secret,
            uri: data.uri,
            qrUrl: data.qrUrl
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch MFA status:', err);
    }
  };

  const fetchSiteData = async () => {
    setIsSiteLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        setSiteData(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch site data:', err);
    } finally {
      setIsSiteLoading(false);
    }
  };

  const fetchRecentAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/audit-logs?limit=15');
      if (res.ok) {
        const data = await res.json();
        setRecentLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // 2. Password Change Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordStatus({ type: 'success', message: data.message || 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordStatus({ type: 'error', message: 'Network error changing password.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 3. MFA Enable / Disable Handlers
  const handleEnableMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaSetupData || !mfaVerifyCode) return;

    setIsMfaLoading(true);
    setMfaMessage(null);
    try {
      const res = await fetch('/api/admin/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: mfaSetupData.secret, code: mfaVerifyCode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMfaStatus({ enabled: true });
        setMfaSetupData(null);
        setMfaVerifyCode('');
        setMfaMessage({ type: 'success', text: 'Google Authenticator 2FA enabled successfully!' });
      } else {
        setMfaMessage({ type: 'error', text: data.error || 'Invalid 6-digit code. Please verify the code in your Authenticator app.' });
      }
    } catch {
      setMfaMessage({ type: 'error', text: 'Network error activating MFA.' });
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!confirm('Are you sure you want to disable Google Authenticator? Your account will revert to Email OTP verification.')) {
      return;
    }

    setIsMfaLoading(true);
    setMfaMessage(null);
    try {
      const res = await fetch('/api/admin/mfa', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setMfaStatus({ enabled: false });
        setMfaMessage({ type: 'success', text: 'Google Authenticator disabled. Login will now use Email OTP.' });
        fetchMfaStatus();
      } else {
        setMfaMessage({ type: 'error', text: data.error || 'Failed to disable MFA.' });
      }
    } catch {
      setMfaMessage({ type: 'error', text: 'Network error disabling MFA.' });
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleCopySecret = () => {
    if (mfaSetupData?.secret) {
      navigator.clipboard.writeText(mfaSetupData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2500);
    }
  };

  // 4. Site Content Handlers
  const uploadImageToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'S3 upload failed');
    }
    return data.url;
  };

  const handleFounderPortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !siteData) return;
    setIsUploadingFounder(true);
    try {
      const url = await uploadImageToS3(file);
      setSiteData({
        ...siteData,
        founder: { ...siteData.founder, image: url }
      });
      alert('Founder photo uploaded successfully to S3!');
    } catch (err: any) {
      alert(`Founder portrait upload failed: ${err.message}`);
    } finally {
      setIsUploadingFounder(false);
    }
  };

  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData) return;

    setIsSiteSaving(true);
    setSiteSaveStatus('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      if (res.ok) {
        setSiteSaveStatus('Site configuration updated successfully in MongoDB Atlas!');
        setTimeout(() => setSiteSaveStatus(''), 4000);
      } else {
        setSiteSaveStatus('Failed to update site configuration.');
      }
    } catch (err) {
      setSiteSaveStatus('Network error while saving settings.');
    } finally {
      setIsSiteSaving(false);
    }
  };

  return (
    <AdminLayoutShell
      title="Admin Settings & Account Security"
      subtitle="Manage your password, Two-Factor Authentication (Email OTP & Google Authenticator), and view audit history"
    >
      <div className="space-y-6">
        {/* Navigation Tabs Header */}
        <div className="p-1.5 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1">
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Shield size={15} />
            <span>Account Security & 2FA MFA</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <History size={15} />
            <span>Audit & Login History</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Globe size={15} />
            <span>Site Content & Branding</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SECURITY & 2FA / PASSWORD */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Account Profile Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-600/20">
                  {(currentUser?.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {currentUser?.name || 'Founder Account'}
                    </h2>
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-md bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      {currentUser?.role || 'superadmin'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    @{currentUser?.username || 'superadmin'} · 30-Day Sliding Session Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span>Session auto-extends on activity</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Password Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <KeyRound size={18} className="text-sky-500" />
                  <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                    Change Password
                  </h3>
                </div>

                {passwordStatus && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                      passwordStatus.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {passwordStatus.type === 'success' ? (
                      <CheckCircle size={15} className="shrink-0" />
                    ) : (
                      <XCircle size={15} className="shrink-0" />
                    )}
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="Enter current password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showCurrentPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="At least 6 characters"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isChangingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                    <span>Update Account Password</span>
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication (2FA) & Google Authenticator */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                      Two-Factor Authentication (2FA)
                    </h3>
                  </div>
                  {mfaStatus.enabled ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Google Authenticator ON
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                      Email OTP Active
                    </span>
                  )}
                </div>

                {mfaMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      mfaMessage.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {mfaMessage.type === 'success' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span>{mfaMessage.text}</span>
                  </div>
                )}

                {mfaStatus.enabled ? (
                  /* Google Authenticator is Active */
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-2">
                      <div className="flex items-center gap-2 font-bold">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span>Google Authenticator (TOTP) is Active</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                        Every sign-in to the control desk requires entering the 6-digit TOTP code generated by your Authenticator app.
                      </p>
                    </div>

                    <button
                      onClick={handleDisableMfa}
                      disabled={isMfaLoading}
                      className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isMfaLoading ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                      <span>Disable Google Authenticator (Switch to Email OTP)</span>
                    </button>
                  </div>
                ) : (
                  /* Google Authenticator Setup View */
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      By default, a 6-digit security OTP is sent to <strong>vikasmaheshwari6267@gmail.com</strong>.
                      To enable instantaneous login via <strong>Google Authenticator</strong>, scan the QR code below:
                    </p>

                    {mfaSetupData ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                          {/* QR Code */}
                          <div className="p-2 bg-white rounded-xl shadow-md shrink-0">
                            <img
                              src={mfaSetupData.qrUrl}
                              alt="Scan with Authenticator"
                              className="w-28 h-28 object-contain"
                            />
                          </div>

                          <div className="space-y-2 min-w-0 flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              Scan with Google Authenticator or Microsoft Authenticator
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Or manually type this secret key:
                            </p>
                            <div className="flex items-center gap-1.5">
                              <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[11px] text-sky-600 dark:text-sky-400 truncate">
                                {mfaSetupData.secret}
                              </code>
                              <button
                                onClick={handleCopySecret}
                                className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 cursor-pointer"
                                title="Copy Secret"
                              >
                                {copiedSecret ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Test Verification Form */}
                        <form onSubmit={handleEnableMfa} className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={mfaVerifyCode}
                            onChange={(e) => setMfaVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Enter 6-digit code"
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono tracking-widest text-center text-sm font-bold"
                          />
                          <button
                            type="submit"
                            disabled={isMfaLoading || mfaVerifyCode.length !== 6}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                          >
                            {isMfaLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                            <span>Activate 2FA</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <button
                          onClick={fetchMfaStatus}
                          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                        >
                          Generate Authenticator QR Code
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AUDIT LOGS OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-sm text-slate-900 dark:text-white">
                  Recent System & Security Audit Logs
                </h3>
                <p className="text-xs text-slate-400">
                  Last 15 administrative actions, sign-ins, and security modifications
                </p>
              </div>
              <Link
                href="/admin/audit-logs"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>Open Full Audit Trail Dashboard</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {isLoadingLogs ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Loader2 size={20} className="animate-spin mx-auto text-sky-500 mb-1" />
                        <span>Loading audit records...</span>
                      </td>
                    </tr>
                  ) : recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <span>No audit records recorded yet.</span>
                      </td>
                    </tr>
                  ) : (
                    recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                          {new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {log.actor?.name || log.actor?.username}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-sky-600 dark:text-sky-400 font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {log.city || 'Bhopal'}, {log.state || 'MP'} ({log.ip})
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600'
                                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-600'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SITE CONTENT & BRANDING */}
        {/* ========================================================================= */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {siteSaveStatus && (
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle size={16} className="text-sky-600 shrink-0" />
                <span>{siteSaveStatus}</span>
              </div>
            )}

            {isSiteLoading || !siteData ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center">
                <Loader2 size={32} className="animate-spin mx-auto text-sky-500" />
                <p className="text-xs font-bold text-slate-400 mt-2">Loading site configuration...</p>
              </div>
            ) : (
              <form onSubmit={handleSaveSiteContent} className="space-y-6 text-xs">
                {/* 1. Hero Section */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-sm text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe size={16} />
                    1. Homepage Hero Banner
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Hero Main Tagline</label>
                    <input
                      type="text"
                      value={siteData.hero.tagline}
                      onChange={(e) =>
                        setSiteData({ ...siteData, hero: { ...siteData.hero, tagline: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Hero Subtitle / Description</label>
                    <textarea
                      rows={3}
                      value={siteData.hero.description}
                      onChange={(e) =>
                        setSiteData({ ...siteData, hero: { ...siteData.hero, description: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. Company Story & About */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-sm text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={16} />
                    2. Company Story & About Overview
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Company Story / Mission</label>
                    <textarea
                      rows={4}
                      value={siteData.about.story}
                      onChange={(e) =>
                        setSiteData({ ...siteData, about: { ...siteData.about, story: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Founder Details */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-sm text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    3. Founder & Leadership Section
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Founder Name</label>
                      <input
                        type="text"
                        value={siteData.founder.name}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, name: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Founder Designation</label>
                      <input
                        type="text"
                        value={siteData.founder.designation}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, designation: e.target.value } })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Founder Portrait Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={siteData.founder.image || ''}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, image: e.target.value } })
                        }
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                        placeholder="/images/founder.jpg"
                      />
                      <label className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload size={14} />
                        <span>{isUploadingFounder ? 'Uploading...' : 'Upload S3'}</span>
                        <input type="file" accept="image/*" onChange={handleFounderPortraitUpload} className="hidden" disabled={isUploadingFounder} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Founder Message Quote</label>
                    <textarea
                      rows={3}
                      value={siteData.founder.message}
                      onChange={(e) =>
                        setSiteData({ ...siteData, founder: { ...siteData.founder, message: e.target.value } })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white leading-relaxed"
                    />
                  </div>
                </div>

                {/* 4. Company Contact Information */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-display font-black text-sm text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={16} />
                    4. Company Contact Details & Map
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Company Official Email</label>
                      <input
                        type="email"
                        value={siteData.contactInfo?.email || ''}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            contactInfo: { ...(siteData.contactInfo || {}), email: e.target.value } as any
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Company Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={siteData.contactInfo?.phone || ''}
                        onChange={(e) =>
                          setSiteData({
                            ...siteData,
                            contactInfo: { ...(siteData.contactInfo || {}), phone: e.target.value } as any
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Office Physical Address</label>
                    <input
                      type="text"
                      value={siteData.contactInfo?.address || ''}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          contactInfo: { ...(siteData.contactInfo || {}), address: e.target.value } as any
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Google Maps Embed URL</label>
                    <input
                      type="text"
                      value={siteData.contactInfo?.googleMapEmbed || ''}
                      onChange={(e) =>
                        setSiteData({
                          ...siteData,
                          contactInfo: { ...(siteData.contactInfo || {}), googleMapEmbed: e.target.value } as any
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSiteSaving}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    {isSiteSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    <span>Save All Site Configurations</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
