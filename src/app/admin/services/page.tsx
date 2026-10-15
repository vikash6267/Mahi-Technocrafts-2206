'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  RefreshCw,
  Globe,
  Smartphone,
  Database,
  Bot,
  Search,
  ShoppingCart
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { SiteData, ServiceItem } from '@/lib/db';

export default function AdminServicesPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    icon: 'Sparkles'
  });

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

  const saveConfigurationData = async (updatedData: SiteData) => {
    setIsSaving(true);
    setSaveStatus('');
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        setSiteData(updatedData);
        setSaveStatus('Services updated successfully!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to update services.');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('A network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData || !serviceForm.title.trim()) return;

    const newServiceItem: ServiceItem = {
      id: `service-${Date.now()}`,
      ...serviceForm
    };

    const updatedData: SiteData = {
      ...siteData,
      services: [...siteData.services, newServiceItem]
    };

    saveConfigurationData(updatedData);
    setServiceForm({ title: '', description: '', icon: 'Sparkles' });
  };

  const handleDeleteService = (id: string) => {
    if (!siteData || !confirm('Are you sure you want to remove this service?')) return;
    const updatedData: SiteData = {
      ...siteData,
      services: siteData.services.filter((s) => s.id !== id)
    };
    saveConfigurationData(updatedData);
  };

  return (
    <AdminLayoutShell
      title="Services & Solutions Architecture"
      subtitle="Manage core business services, feature descriptions, and technology icons"
    >
      <div className="space-y-6">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-sky-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Add Service Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-sky-600" />
                <span>Add New Service Offering</span>
              </h2>
              <p className="text-xs text-slate-500">Live service cards displayed on home and service pages</p>
            </div>
            <button onClick={fetchSiteData} className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-600">
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <form onSubmit={handleAddService} className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 16 Web Applications"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Service Icon</label>
                <select
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Sparkles">✨ Sparkles (AI / Modern)</option>
                  <option value="Globe">🌐 Globe (Web Development)</option>
                  <option value="Smartphone">📱 Smartphone (Mobile Apps)</option>
                  <option value="Database">🗄️ Database (ERP & CRM)</option>
                  <option value="Bot">🤖 Bot (Automations & WhatsApp)</option>
                  <option value="Search">🔍 Search (SEO Marketing)</option>
                  <option value="ShoppingCart">🛒 ShoppingCart (E-Commerce)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="High-speed web platforms, mobile-first design, SEO ranking optimization..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Save New Service</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Services Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Active Services ({(siteData?.services || []).length})
          </h3>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-sky-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(siteData?.services || []).map((service) => (
                <div
                  key={service.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold">
                      {service.icon === 'Globe' && <Globe size={20} />}
                      {service.icon === 'Smartphone' && <Smartphone size={20} />}
                      {service.icon === 'Database' && <Database size={20} />}
                      {service.icon === 'Bot' && <Bot size={20} />}
                      {service.icon === 'Search' && <Search size={20} />}
                      {service.icon === 'ShoppingCart' && <ShoppingCart size={20} />}
                      {!['Globe', 'Smartphone', 'Database', 'Bot', 'Search', 'ShoppingCart'].includes(service.icon) && <Sparkles size={20} />}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{service.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Service"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayoutShell>
  );
}
