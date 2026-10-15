'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Upload,
  Globe,
  Eye,
  CheckCircle,
  ExternalLink,
  Edit,
  RefreshCw,
  Search
} from 'lucide-react';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';
import { BlogItem, BlogFAQ } from '@/lib/db';

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

export default function AdminBlogsPage() {
  const [blogsList, setBlogsList] = useState<BlogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [editingBlogSlug, setEditingBlogSlug] = useState<string | null>(null);
  const [isGeneratingAiBlog, setIsGeneratingAiBlog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initialBlogFormState = {
    slug: '',
    title: '',
    excerpt: '',
    content: '<h3>Introduce your topic</h3><p>Start typing your rich article text here...</p>',
    author: 'Vikash Maheshwari',
    coverImage: '/images/blog-default.jpg',
    imageAlt: '',
    category: 'Web Development',
    tags: 'Next.js, Tailwind, React',
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    enableBlogSchema: true,
    enableFaqSchema: false,
    faqs: [] as BlogFAQ[],
    status: 'published' as 'draft' | 'published',
    suggestedImagePrompt: ''
  };

  const [blogForm, setBlogForm] = useState<typeof initialBlogFormState>(initialBlogFormState);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBlogsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setBlogForm((prev) => ({
      ...prev,
      title,
      slug,
      metaTitle: title,
      ogTitle: title
    }));
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

  const handleBlogCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToS3(file);
      setBlogForm((prev) => ({ ...prev, coverImage: url, ogImage: url }));
      alert('Blog cover uploaded successfully!');
    } catch (err: any) {
      alert(`Cover upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addFAQ = () => {
    setBlogForm((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { q: '', a: '' }]
    }));
  };

  const updateFAQ = (idx: number, field: 'q' | 'a', val: string) => {
    const nextFAQs = [...blogForm.faqs];
    nextFAQs[idx][field] = val;
    setBlogForm((prev) => ({ ...prev, faqs: nextFAQs }));
  };

  const removeFAQ = (idx: number) => {
    setBlogForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx)
    }));
  };

  const handleEditBlog = (blog: BlogItem) => {
    setBlogForm({
      slug: blog.slug,
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content,
      author: blog.author || 'Vikash Maheshwari',
      coverImage: blog.coverImage || '/images/blog-default.jpg',
      imageAlt: blog.imageAlt || '',
      category: blog.category || 'Web Development',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || 'Next.js, Tailwind, React',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      focusKeyword: blog.focusKeyword || '',
      canonicalUrl: blog.canonicalUrl || '',
      ogTitle: blog.ogTitle || '',
      ogDescription: blog.ogDescription || '',
      ogImage: blog.ogImage || '',
      enableBlogSchema: blog.enableBlogSchema !== undefined ? blog.enableBlogSchema : true,
      enableFaqSchema: blog.enableFaqSchema !== undefined ? blog.enableFaqSchema : false,
      faqs: blog.faqs || [],
      status: blog.status || 'published',
      suggestedImagePrompt: blog.suggestedImagePrompt || ''
    });

    setIsHtmlMode(blog.content.includes('style=') || blog.content.includes('<div'));
    setEditingBlogSlug(blog.slug);
    setShowCreateForm(true);
  };

  const handleGenerateAiBlog = async () => {
    setIsGeneratingAiBlog(true);
    setSaveStatus('Generating a high-converting blog draft via Gemini AI...');
    try {
      const res = await fetch('/api/cron/blog?secret=mahi_auto_blog_cron_secret_2026', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus(`Draft ready for review: "${data.blog.title}"`);
        fetchBlogs();
      } else {
        setSaveStatus(`Gemini Generation Error: ${data.error || 'Failed to generate'}`);
      }
    } catch (e: any) {
      setSaveStatus(`Network Error: ${e.message}`);
    } finally {
      setIsGeneratingAiBlog(false);
      setTimeout(() => setSaveStatus(''), 7000);
    }
  };

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('');

    const tagsArray = blogForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      ...blogForm,
      tags: tagsArray,
      metaTitle: blogForm.metaTitle || blogForm.title,
      metaDescription: blogForm.metaDescription || blogForm.excerpt,
      canonicalUrl: blogForm.canonicalUrl || `https://mahitechnocrafts.in/blog/${blogForm.slug}`,
      ogTitle: blogForm.ogTitle || blogForm.metaTitle || blogForm.title,
      ogDescription: blogForm.ogDescription || blogForm.metaDescription || blogForm.excerpt,
      ogImage: blogForm.ogImage || blogForm.coverImage,
      imageAlt: blogForm.imageAlt || blogForm.title
    };

    try {
      if (editingBlogSlug && editingBlogSlug !== payload.slug) {
        try {
          await fetch(`/api/blog?slug=${editingBlogSlug}`, { method: 'DELETE' });
        } catch (err) {
          console.error('Failed to delete old slug during rename:', err);
        }
      }

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveStatus(editingBlogSlug ? 'Blog post updated successfully!' : 'Blog post published successfully!');
        setEditingBlogSlug(null);
        fetchBlogs();
        setBlogForm(initialBlogFormState);
        setShowCreateForm(false);
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        const err = await res.json();
        setSaveStatus(`Failed: ${err.error || 'Server error'}`);
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('A network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blog?slug=${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogsList(blogsList.filter((b) => b.slug !== slug));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBlogs = blogsList.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.category || '').toLowerCase().includes(q) ||
      (b.slug || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayoutShell
      title="Blogs & AI Article Writer"
      subtitle="Publish SEO-ranked articles, visual TipTap editor, and autonomous Gemini AI generator"
    >
      <div className="space-y-6">
        {saveStatus && (
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center gap-2">
            <CheckCircle size={16} className="text-sky-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {/* Top Header Controls */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">
              {showCreateForm ? (editingBlogSlug ? 'Edit Article' : 'Create New Article') : 'All Published & Draft Blogs'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {blogsList.length} articles in database &bull; Live SEO Schema & TipTap rich formatting
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!showCreateForm ? (
              <>
                <button
                  type="button"
                  disabled={isGeneratingAiBlog}
                  onClick={handleGenerateAiBlog}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAiBlog ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-amber-300" />
                      <span>Gemini AI Writing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300 animate-pulse" />
                      <span>Generate with Gemini AI</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setEditingBlogSlug(null);
                    setBlogForm(initialBlogFormState);
                    setShowCreateForm(true);
                  }}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>+ Create Blog</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingBlogSlug(null);
                  setBlogForm(initialBlogFormState);
                }}
                className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to All Blogs</span>
              </button>
            )}
          </div>
        </div>

        {/* Editor Form Mode */}
        {showCreateForm ? (
          <form onSubmit={handleAddBlog} className="space-y-6">
            {/* 1. Article Content */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070918] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-2">
                <Sparkles size={15} />
                1. Article Content & Headlines
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Post Title *</label>
                  <input
                    type="text"
                    value={blogForm.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. Website Development Cost in Bhopal 2026"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">URL Slug (lowercase-with-hyphens) *</label>
                  <input
                    type="text"
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. website-development-cost-bhopal"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Short Excerpt *</label>
                <input
                  type="text"
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  placeholder="Summary for cards and social snippets..."
                  required
                />
              </div>

              {/* Dynamic TipTap Rich Text / Raw HTML Editor */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Article Body ({isHtmlMode ? 'Raw HTML Code Mode' : 'Visual Rich Text Mode'}) *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsHtmlMode(!isHtmlMode)}
                    className="px-2.5 py-1 text-[11px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/60 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer"
                  >
                    {isHtmlMode ? '✍️ Switch to Visual Editor' : '💻 Switch to Raw HTML'}
                  </button>
                </div>

                {isHtmlMode ? (
                  <textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm((prev) => ({ ...prev, content: e.target.value }))}
                    className="w-full h-80 px-4 py-3 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 rounded-2xl focus:outline-none focus:border-sky-500"
                    placeholder="<p>Paste or write your HTML code here...</p>"
                  />
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                    <TiptapEditor
                      content={blogForm.content}
                      onChange={(newHtml) => setBlogForm((prev) => ({ ...prev, content: newHtml }))}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Media & Visuals */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070918] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-2">
                <Upload size={15} />
                2. Featured Cover Image (AWS S3)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Cover Image URL *</label>
                  <input
                    type="text"
                    value={blogForm.coverImage}
                    onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value, ogImage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    required
                  />
                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors">
                      <Upload size={14} />
                      <span>{isUploading ? 'Uploading to S3...' : 'Upload Image File to AWS S3'}</span>
                      <input type="file" accept="image/*" onChange={handleBlogCoverUpload} className="hidden" disabled={isUploading} />
                    </label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Image SEO Alt Tag *</label>
                  <input
                    type="text"
                    value={blogForm.imageAlt}
                    onChange={(e) => setBlogForm({ ...blogForm, imageAlt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                    placeholder="Descriptive alt text for Google Image ranking"
                  />
                </div>
              </div>

              {blogForm.suggestedImagePrompt && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 space-y-1 text-xs text-indigo-900 dark:text-indigo-300">
                  <span className="font-bold uppercase text-[10px] tracking-wider block text-indigo-600 dark:text-indigo-400">
                    AI Suggested Image Generation Prompt:
                  </span>
                  <p className="font-mono text-[11px] leading-relaxed">{blogForm.suggestedImagePrompt}</p>
                </div>
              )}
            </div>

            {/* 3. Taxonomy & Status */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070918] shadow-sm space-y-4">
              <h3 className="font-display font-bold text-sm text-sky-600 dark:text-sky-400 flex items-center gap-2">
                <Globe size={15} />
                3. Taxonomy, Author & Publication Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Category *</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  >
                    <option>Web Development</option>
                    <option>Mobile Apps</option>
                    <option>SEO</option>
                    <option>AI Solutions</option>
                    <option>Cloud Architecture</option>
                    <option>E-Commerce</option>
                    <option>Healthcare Tech</option>
                    <option>Real Estate Tech</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={blogForm.tags}
                    onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1.5">Publication Status</label>
                  <select
                    value={blogForm.status}
                    onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="published">🚀 Published (Live)</option>
                    <option value="draft">📝 Draft (Editorial Review)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. FAQs Schema Builder */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070918] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-sky-600 dark:text-sky-400">
                  4. Google FAQ Structured Data (FAQ Schema)
                </h3>
                <button
                  type="button"
                  onClick={addFAQ}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
                >
                  + Add FAQ Item
                </button>
              </div>

              {blogForm.faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-500">FAQ #{idx + 1}</span>
                    <button type="button" onClick={() => removeFAQ(idx)} className="text-rose-500 hover:text-rose-700 text-xs">
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Question (e.g. How long does it take to develop?)"
                    value={faq.q}
                    onChange={(e) => updateFAQ(idx, 'q', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs"
                  />
                  <textarea
                    rows={2}
                    placeholder="Answer for rich snippet results..."
                    value={faq.a}
                    onChange={(e) => updateFAQ(idx, 'a', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingBlogSlug(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 flex items-center gap-2"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{editingBlogSlug ? 'Update Blog Post' : 'Publish Blog Post'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Table / Grid of Blogs */
          <div className="space-y-4">
            {/* Search Input */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles by title, category, or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <button onClick={fetchBlogs} title="Refresh" className="w-8 h-8 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-sky-600">
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {isLoading ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center">
                <Loader2 size={32} className="animate-spin mx-auto text-sky-500" />
                <p className="text-xs font-bold text-slate-400 mt-2">Loading articles from MongoDB Atlas...</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="p-16 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <FileText size={32} className="mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No blog posts found</p>
                <p className="text-xs text-slate-400">Click &quot;+ Create Blog&quot; or &quot;Generate with Gemini AI&quot; above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.slug}
                    className="p-5 rounded-3xl bg-white dark:bg-[#070918] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Blog Cover Image Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-850 shrink-0 border border-slate-200 dark:border-slate-800 relative shadow-sm">
                        {blog.coverImage ? (
                          <img
                            src={blog.coverImage}
                            alt={blog.imageAlt || blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FileText size={20} />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                            {blog.category}
                          </span>
                          {blog.status === 'draft' ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                              Draft (Review)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                              Live Published
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {blog.publishedAt}
                          </span>
                          {blog.readTime && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              �• {blog.readTime}
                            </span>
                          )}
                          {blog.focusKeyword && (
                            <span className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                              🎯 {blog.focusKeyword}
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {blog.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-1 max-w-2xl">
                          {blog.excerpt}
                        </p>

                        <div className="text-[11px] text-slate-400 font-mono">
                          Slug: /{blog.slug}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 flex items-center gap-1.5"
                      >
                        <Eye size={13} />
                        <span>Preview</span>
                      </a>

                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 flex items-center gap-1.5"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog.slug)}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600"
                        title="Delete article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
