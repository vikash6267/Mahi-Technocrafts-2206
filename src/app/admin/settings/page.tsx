'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  CheckCircle,
  Loader2,
  RefreshCw,
  Upload,
  Globe,
  Building2,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { SiteData } from '@/lib/db';

export default function AdminSettingsPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isUploadingFounder, setIsUploadingFounder] = useState(false);

  const fetchSiteData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        setSiteData(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch site data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData) return;

    setIsSaving(true);
    setSaveStatus('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      if (res.ok) {
        setSaveStatus('Site configuration updated successfully in MongoDB Atlas!');
        setTimeout(() => setSaveStatus(''), 4000);
      } else {
        setSaveStatus('Failed to update site configuration.');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('Network error while saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayoutShell
      title="Site Content & Company Settings"
      subtitle="Customize Hero banner text, company story, founder quote, and contact info"
    >
      <div className="space-y-6">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-sky-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {isLoading || !siteData ? (
          <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center">
            <Loader2 size={32} className="animate-spin mx-auto text-sky-500" />
            <p className="text-xs font-bold text-slate-400 mt-2">Loading site configuration...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 text-xs">
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
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>Save All Site Configurations</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayoutShell>
  );
}
