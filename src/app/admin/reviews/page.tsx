'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Star,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Upload,
  User
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { ReviewItem } from '@/lib/db';

export default function AdminReviewsPage() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [isUploadingReviewAvatar, setIsUploadingReviewAvatar] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    rating: 5,
    email: '',
    avatarUrl: ''
  });

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reviews?admin=true');
      if (res.ok) {
        setReviewsList(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setReviewsList(
          reviewsList.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReviewsList(reviewsList.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
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

  const handleReviewAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingReviewAvatar(true);
    try {
      const url = await uploadImageToS3(file);
      setReviewForm((prev) => ({ ...prev, avatarUrl: url }));
      alert('Client avatar uploaded successfully to S3!');
    } catch (err: any) {
      alert(`Avatar upload failed: ${err.message}`);
    } finally {
      setIsUploadingReviewAvatar(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.text) {
      alert('Please provide client name and review text');
      return;
    }

    setIsSavingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewForm,
          status: 'approved'
        })
      });

      if (res.ok) {
        const createdReview = await res.json();
        setReviewsList([createdReview, ...reviewsList]);
        setReviewForm({
          name: '',
          role: '',
          company: '',
          text: '',
          rating: 5,
          email: '',
          avatarUrl: ''
        });
        alert('Testimonial added & approved successfully!');
      } else {
        alert('Failed to save testimonial.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while adding review.');
    } finally {
      setIsSavingReview(false);
    }
  };

  const pendingCount = reviewsList.filter((r) => r.status === 'pending').length;

  return (
    <AdminLayoutShell
      title="Client Reviews & Testimonials"
      subtitle="Approve public reviews, reject spam, and feature high-rating customer ratings"
    >
      <div className="space-y-6">
        {/* Add Review Form */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                <span>Add Verified Client Testimonial</span>
              </h2>
              <p className="text-xs text-slate-500">Live testimonials featured on homepage and Google review sections</p>
            </div>
            <button onClick={fetchReviews} className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-600">
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <form onSubmit={handleAddReview} className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alok Verma"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Designation / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Founder & Director"
                  value={reviewForm.role}
                  onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Company / Clinic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Verma Dental Care Bhopal"
                  value={reviewForm.company}
                  onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Star Rating (1 - 5)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Great)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Good)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Client Avatar Image URL (S3)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/testimonials/avatar.jpg or S3 link"
                    value={reviewForm.avatarUrl}
                    onChange={(e) => setReviewForm({ ...reviewForm, avatarUrl: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <label className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>{isUploadingReviewAvatar ? 'Uploading...' : 'Upload S3'}</span>
                    <input type="file" accept="image/*" onChange={handleReviewAvatarUpload} className="hidden" disabled={isUploadingReviewAvatar} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Review Feedback Message *</label>
              <textarea
                rows={3}
                required
                placeholder="Mahi Technocrafts transformed our online presence. Our clinic patient bookings increased by 200% within 3 weeks..."
                value={reviewForm.text}
                onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSavingReview}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                <span>Save & Approve Testimonial</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Customer Testimonials ({reviewsList.length})
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                  {pendingCount} Pending Approval
                </span>
              )}
            </h3>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-sky-500" />
            </div>
          ) : reviewsList.length === 0 ? (
            <div className="p-12 text-center border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-[#070918] text-slate-400">
              No reviews found. Add your first client testimonial above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className={`p-5 rounded-3xl bg-white dark:bg-[#070918] border shadow-sm flex flex-col justify-between space-y-3 ${
                    rev.status === 'pending'
                      ? 'border-amber-400 dark:border-amber-800/80 bg-amber-50/20'
                      : rev.status === 'rejected'
                      ? 'border-rose-200 dark:border-rose-900/50 opacity-60'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {rev.avatarUrl ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                            <Image src={rev.avatarUrl} alt={rev.name} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {rev.name[0] || 'C'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{rev.name}</h4>
                          <p className="text-[10px] text-slate-400">{rev.role ? `${rev.role}, ` : ''}{rev.company || 'Client'}</p>
                        </div>
                      </div>

                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic line-clamp-4">
                      &quot;{rev.text}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rev.status === 'approved'
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                        : rev.status === 'rejected'
                        ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                        : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                    }`}>
                      {rev.status.toUpperCase()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'approved')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateReviewStatus(rev.id, 'rejected')}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
