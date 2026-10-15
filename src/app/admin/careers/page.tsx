'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  RefreshCw,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { CareerItem } from '@/lib/db';

export default function AdminCareersPage() {
  const [careersList, setCareersList] = useState<CareerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCareer, setIsSavingCareer] = useState(false);

  const [careerForm, setCareerForm] = useState({
    title: '',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '2+ Years',
    description: ''
  });

  const fetchCareers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/careers');
      if (res.ok) {
        setCareersList(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch careers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleAddCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerForm.title || !careerForm.description) {
      alert('Please provide title and description');
      return;
    }

    setIsSavingCareer(true);
    try {
      const res = await fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(careerForm)
      });

      if (res.ok) {
        const createdCareer = await res.json();
        setCareersList([createdCareer, ...careersList]);
        setCareerForm({
          title: '',
          type: 'Full-Time',
          location: 'Bhopal (On-site)',
          experience: '2+ Years',
          description: ''
        });
        alert('Job opening published successfully!');
      } else {
        alert('Failed to save job opening.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while posting job.');
    } finally {
      setIsSavingCareer(false);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm('Are you sure you want to remove this job opening?')) return;
    try {
      const res = await fetch(`/api/careers?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCareersList(careersList.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayoutShell
      title="Careers & Engineering Opportunities"
      subtitle="Publish open engineering roles, internships, and hiring requirements"
    >
      <div className="space-y-6">
        {/* Post Job Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-sky-600" />
                <span>Post New Job Vacancy</span>
              </h2>
              <p className="text-xs text-slate-500">Live roles published on /careers page for candidate applications</p>
            </div>
            <button onClick={fetchCareers} className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-600">
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <form onSubmit={handleAddCareer} className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Next.js / React Engineer"
                  value={careerForm.title}
                  onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Job Type</label>
                <select
                  value={careerForm.type}
                  onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                  <option>Remote</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Experience Required</label>
                <input
                  type="text"
                  placeholder="e.g. 2-4 Years or Fresher"
                  value={careerForm.experience}
                  onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bhopal (MP Nagar Zone II) or Remote"
                  value={careerForm.location}
                  onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Role Description & Responsibilities *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Responsibilities, required technical skills, salary package..."
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSavingCareer}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Publish Job Opening</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Openings */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Current Openings ({careersList.length})
          </h3>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-sky-500" />
            </div>
          ) : careersList.length === 0 ? (
            <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#070918] text-slate-400">
              No open job postings found. Post your first vacancy above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {careersList.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                        {job.type}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Exp: {job.experience}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{job.title}</h4>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{job.location}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteCareer(job.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove opening"
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
