'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Briefcase,
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  CheckCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { SiteData, ProjectItem } from '@/lib/db';

export default function AdminProjectsPage() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [projectForm, setProjectForm] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    description: '',
    image: '',
    imageAlt: '',
    tags: [],
    link: ''
  });
  const [projectTagsInput, setProjectTagsInput] = useState('');

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
        setSaveStatus('Projects updated successfully in MongoDB Atlas!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to update projects.');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('A network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleProjectCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToS3(file);
      setProjectForm((prev) => ({ ...prev, image: url }));
      alert('Project thumbnail uploaded successfully to S3!');
    } catch (err: any) {
      alert(`Project thumbnail upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData || !projectForm.title.trim()) return;

    const tagsArray = projectTagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const newProjectItem: ProjectItem = {
      id: `project-${Date.now()}`,
      ...projectForm,
      tags: tagsArray
    };

    const updatedData: SiteData = {
      ...siteData,
      projects: [...(siteData.projects || []), newProjectItem]
    };

    saveConfigurationData(updatedData);
    setProjectForm({ title: '', description: '', image: '', imageAlt: '', tags: [], link: '' });
    setProjectTagsInput('');
  };

  const handleDeleteProject = (id: string) => {
    if (!siteData || !confirm('Are you sure you want to remove this project?')) return;
    const updatedData: SiteData = {
      ...siteData,
      projects: (siteData.projects || []).filter((p) => p.id !== id)
    };
    saveConfigurationData(updatedData);
  };

  return (
    <AdminLayoutShell
      title="Portfolio Projects Showcase"
      subtitle="Manage case studies, screenshots, tech tags, and live preview links"
    >
      <div className="space-y-6">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-sky-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Add Project Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={18} className="text-sky-600" />
                <span>Add New Showcase Project</span>
              </h2>
              <p className="text-xs text-slate-500">Live projects featured on homepage and /portfolio</p>
            </div>
            <button onClick={fetchSiteData} className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-600">
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <form onSubmit={handleAddProject} className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern E-Commerce Platform"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Live Website / Demo Link</label>
                <input
                  type="text"
                  placeholder="https://clientwebsite.com"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Project Image URL (S3) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="/images/projects/xyz.webp or S3 link"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <label className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleProjectCoverUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Technology Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Next.js, Tailwind, MongoDB, Stripe"
                  value={projectTagsInput}
                  onChange={(e) => setProjectTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Description & Impact</label>
              <textarea
                rows={2}
                placeholder="High-speed online shopping portal with automated payment gateway..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Project to Showcase</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Projects Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Active Projects ({(siteData?.projects || []).length})
          </h3>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-sky-500" />
            </div>
          ) : (siteData?.projects || []).length === 0 ? (
            <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#070918] text-slate-400">
              No showcase projects found. Add your first project above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(siteData?.projects || []).map((project) => (
                <div
                  key={project.id}
                  className="p-4 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {project.image && (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                        <Image src={project.image} alt={project.title} fill className="object-cover" />
                      </div>
                    )}
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{project.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(project.tags || []).map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 flex items-center gap-1 font-bold">
                        <span>Visit Site</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-400">No link</span>
                    )}

                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove Project"
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
