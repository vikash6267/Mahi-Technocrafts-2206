'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
  Sparkles,
  Star,
  Inbox,
  Globe,
  Eye,
  PlusCircle,
  Upload,
  ArrowLeft,
  ArrowRight,
  User,
  LayoutGrid,
  Briefcase,
  ExternalLink,
  Info
} from 'lucide-react';
import { SiteData, BlogItem, ContactSubmission, BlogFAQ, ProjectItem, ServiceItem, ReviewItem, CareerItem } from '@/lib/db';

// Dynamically import Tiptap Editor (SSR: false because it relies on client browser DOM)
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'content' | 'services' | 'projects' | 'blogs' | 'contacts' | 'reviews' | 'careers'>('content');
  const [isLoading, setIsLoading] = useState(true);

  // Authenticated state & details stores
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [blogsList, setBlogsList] = useState<BlogItem[]>([]);
  const [contactList, setContactList] = useState<ContactSubmission[]>([]);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [careersList, setCareersList] = useState<CareerItem[]>([]);

  // New review form
  const [reviewForm, setReviewForm] = useState({
    name: '',
    role: '',
    company: '',
    text: '',
    rating: 5,
    email: '',
    avatarUrl: ''
  });
  const [isSavingReview, setIsSavingReview] = useState(false);

  // New career posting form
  const [careerForm, setCareerForm] = useState({
    title: '',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '2+ Years',
    description: ''
  });
  const [isSavingCareer, setIsSavingCareer] = useState(false);
  const [isUploadingReviewAvatar, setIsUploadingReviewAvatar] = useState(false);

  // Editing states
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingFounder, setIsUploadingFounder] = useState(false);
  const [isUploadingProject, setIsUploadingProject] = useState(false);

  // Toggle for blogs create editor
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New items temp states (Services & Projects CRUD)
  const [serviceForm, setServiceForm] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    description: '',
    icon: 'Sparkles'
  });

  const [projectForm, setProjectForm] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    description: '',
    image: '',
    imageAlt: '',
    tags: [],
    link: ''
  });
  const [projectTagsInput, setProjectTagsInput] = useState('');

  // Blog creation forms state
  const [blogForm, setBlogForm] = useState<{
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    coverImage: string;
    imageAlt: string;
    category: string;
    tags: string;
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    enableBlogSchema: boolean;
    enableFaqSchema: boolean;
    faqs: BlogFAQ[];
  }>({
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
    faqs: []
  });

  // Check auth session and fetch all records
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const authRes = await fetch('/api/admin/login');
        const authData = await authRes.json();
        
        if (!authRes.ok || !authData.authenticated) {
          router.push('/admin');
          return;
        }

        const [contentRes, blogsRes, contactRes, reviewsRes, careersRes] = await Promise.all([
          fetch('/api/content'),
          fetch('/api/blog'),
          fetch('/api/contact'),
          fetch('/api/reviews?admin=true'),
          fetch('/api/careers')
        ]);

        if (contentRes.ok && blogsRes.ok && contactRes.ok && reviewsRes.ok && careersRes.ok) {
          setSiteData(await contentRes.json());
          setBlogsList(await blogsRes.json());
          setContactList(await contactRes.json());
          setReviewsList(await reviewsRes.json());
          setCareersList(await careersRes.json());
        }
      } catch (error) {
        console.error('Fetch dashboard details failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/login', { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin');
      }
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Save homepage configuration (Hero, About, Founder, Services, Projects)
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
        setSaveStatus('Changes saved successfully to database!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Failed to write changes.');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('A network error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save general texts (Hero, About, Founder Quote/Name)
  const saveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteData) {
      saveConfigurationData(siteData);
    }
  };

  // Auto-generate slug from title and pre-fill meta tags
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setBlogForm(prev => ({
      ...prev,
      title,
      slug,
      metaTitle: title,
      ogTitle: title
    }));
  };

  // Image upload handler helper
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

  // Uploader for Blog Cover image
  const handleBlogCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadImageToS3(file);
      setBlogForm(prev => ({ ...prev, coverImage: url, ogImage: url }));
      alert('Blog cover uploaded successfully!');
    } catch (err: any) {
      alert(`Cover upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Uploader for Founder portrait
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
      alert('Founder photo uploaded successfully!');
    } catch (err: any) {
      alert(`Founder portrait upload failed: ${err.message}`);
    } finally {
      setIsUploadingFounder(false);
    }
  };

  // Uploader for Case Study cover
  const handleProjectCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingProject(true);
    try {
      const url = await uploadImageToS3(file);
      setProjectForm(prev => ({ ...prev, image: url }));
      alert('Project thumbnail uploaded successfully!');
    } catch (err: any) {
      alert(`Project thumbnail upload failed: ${err.message}`);
    } finally {
      setIsUploadingProject(false);
    }
  };

  // CRUD: Add Service
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

  // CRUD: Delete Service
  const handleDeleteService = (id: string) => {
    if (!siteData || !confirm('Are you sure you want to remove this service?')) return;
    const updatedData: SiteData = {
      ...siteData,
      services: siteData.services.filter(s => s.id !== id)
    };
    saveConfigurationData(updatedData);
  };

  // CRUD: Add Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData || !projectForm.title.trim()) return;

    const tagsArray = projectTagsInput.split(',').map(t => t.trim()).filter(Boolean);
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

  // CRUD: Delete Project
  const handleDeleteProject = (id: string) => {
    if (!siteData || !confirm('Are you sure you want to remove this project?')) return;
    const updatedData: SiteData = {
      ...siteData,
      projects: (siteData.projects || []).filter(p => p.id !== id)
    };
    saveConfigurationData(updatedData);
  };

  // Add FAQ to FAQ builder array
  const addFAQ = () => {
    setBlogForm(prev => ({
      ...prev,
      faqs: [...prev.faqs, { q: '', a: '' }]
    }));
  };

  // Update FAQ question/answer
  const updateFAQ = (idx: number, field: 'q' | 'a', val: string) => {
    const nextFAQs = [...blogForm.faqs];
    nextFAQs[idx][field] = val;
    setBlogForm(prev => ({ ...prev, faqs: nextFAQs }));
  };

  // Remove FAQ row
  const removeFAQ = (idx: number) => {
    setBlogForm(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx)
    }));
  };

  // Add a new blog post
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
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSaveStatus('Blog post published successfully!');
        const listRes = await fetch('/api/blog');
        if (listRes.ok) setBlogsList(await listRes.json());

        // Reset and hide form
        setBlogForm({
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
          faqs: []
        });
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

  // Delete an existing blog post
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

  // Mark contact submission status
  const toggleContactStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });

      if (res.ok) {
        setContactList(
          contactList.map((c) => (c.id === id ? { ...c, status: nextStatus as 'read' | 'unread' } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve or Reject review
  const handleUpdateReviewStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setReviewsList(prev =>
          prev.map(r => r.id === id ? { ...r, status } : r)
        );
      } else {
        alert('Failed to update review status.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating review status.');
    }
  };

  // Delete review
  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setReviewsList(prev => prev.filter(r => r.id !== id));
      } else {
        alert('Failed to delete review.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting review.');
    }
  };

  // Add review directly
  const handleAddReviewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.role.trim() || !reviewForm.company.trim() || !reviewForm.text.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    setIsSavingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        alert('Review added successfully by Admin (Auto-Approved)!');
        setReviewForm({ name: '', role: '', company: '', text: '', rating: 5, email: '', avatarUrl: '' });
        // Fetch updated reviews
        const listRes = await fetch('/api/reviews?admin=true');
        if (listRes.ok) {
          setReviewsList(await listRes.json());
        }
      } else {
        alert('Failed to add review.');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding review.');
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleReviewAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingReviewAvatar(true);
    try {
      const url = await uploadImageToS3(file);
      setReviewForm(prev => ({ ...prev, avatarUrl: url }));
      alert('Review logo/avatar uploaded successfully!');
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingReviewAvatar(false);
    }
  };

  const handleAddCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerForm.title.trim() || !careerForm.description.trim()) {
      alert('Job title and description are required.');
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
        alert('Job posting published successfully!');
        setCareerForm({
          title: '',
          type: 'Full-Time',
          location: 'Bhopal (On-site)',
          experience: '2+ Years',
          description: ''
        });
        const listRes = await fetch('/api/careers');
        if (listRes.ok) {
          setCareersList(await listRes.json());
        }
      } else {
        const data = await res.json();
        alert(`Failed to save: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving job opportunity.');
    } finally {
      setIsSavingCareer(false);
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm('Are you sure you want to remove this job posting?')) return;
    try {
      const res = await fetch(`/api/careers?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCareersList(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Failed to delete job posting.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting job posting.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <Loader2 size={36} className="animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden font-sans">
      {/* Admin header menu */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-lg tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            MAHI TECH SEO CMS
          </span>
          <span className="px-2.5 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-[9px] uppercase font-bold tracking-wider">
            MongoDB Connected
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs text-red-600 font-semibold cursor-pointer transition-colors"
        >
          <LogOut size={12} />
          Sign Out
        </button>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side menu navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 border-r border-slate-200 p-6 flex flex-col gap-2 bg-white overflow-y-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
          >
            <Settings size={14} />
            Page Content
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
          >
            <LayoutGrid size={14} />
            Manage Services
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
          >
            <Briefcase size={14} />
            Manage Projects
          </button>
          
          <button
            onClick={() => setActiveTab('blogs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-850'
            }`}
          >
            <FileText size={14} />
            Manage Blogs
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer justify-between ${
              activeTab === 'contacts'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-855'
            }`}
          >
            <span className="flex items-center gap-3">
              <MessageSquare size={14} />
              Inquiries
            </span>
            {contactList.filter(c => c.status === 'unread').length > 0 && (
              <span className="px-2 py-0.5 text-[9px] bg-red-500 rounded-full text-white font-bold">
                {contactList.filter(c => c.status === 'unread').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer justify-between ${
              activeTab === 'reviews'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-855'
            }`}
          >
            <span className="flex items-center gap-3">
              <Star size={14} />
              Reviews
            </span>
            {reviewsList.filter(r => r.status === 'pending').length > 0 && (
              <span className="px-2 py-0.5 text-[9px] bg-amber-500 rounded-full text-white font-bold">
                {reviewsList.filter(r => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('careers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer justify-between ${
              activeTab === 'careers'
                ? 'bg-brand-blue text-white shadow-sm shadow-brand-blue/25'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-855'
            }`}
          >
            <span className="flex items-center gap-3">
              <Briefcase size={14} />
              Careers
            </span>
          </button>
        </aside>

        {/* Right Content workspace (Stretched full width) */}
        <main className="flex-1 p-8 overflow-y-auto w-full">
          {/* Tab 1: Static Content Customizer */}
          {activeTab === 'content' && siteData && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Customize Page Content</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Updates generic tagline layouts on the index route</p>
              </div>

              <form onSubmit={saveContent} className="space-y-6">
                {/* Hero Section settings */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-sm text-brand-blue">Hero Section Banner</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hero Tagline</label>
                    <input
                      type="text"
                      value={siteData.hero.tagline}
                      onChange={(e) =>
                        setSiteData({ ...siteData, hero: { ...siteData.hero, tagline: e.target.value } })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Hero Description</label>
                    <textarea
                      rows={3}
                      value={siteData.hero.description}
                      onChange={(e) =>
                        setSiteData({ ...siteData, hero: { ...siteData.hero, description: e.target.value } })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                {/* About Company settings */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-sm text-brand-blue">Company Story & Details</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Company Story</label>
                    <textarea
                      rows={4}
                      value={siteData.about.story}
                      onChange={(e) =>
                        setSiteData({ ...siteData, about: { ...siteData.about, story: e.target.value } })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                {/* Founder Settings */}
                <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-sm text-brand-blue">Founder Quote details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Founder Name</label>
                      <input
                        type="text"
                        value={siteData.founder.name}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, name: e.target.value } })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Founder Designation</label>
                      <input
                        type="text"
                        value={siteData.founder.designation}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, designation: e.target.value } })
                        }
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Founder Portrait Photo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={siteData.founder.image || ''}
                        onChange={(e) =>
                          setSiteData({ ...siteData, founder: { ...siteData.founder, image: e.target.value } })
                        }
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                        placeholder="/images/founder.jpg"
                      />
                      <label className="px-4 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors font-bold select-none flex-shrink-0 shadow-sm shadow-brand-blue/20">
                        {isUploadingFounder ? (
                          <>
                            <Loader2 size={12} className="animate-spin mr-1.5" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={12} className="mr-1.5" />
                            Upload Photo
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFounderPortraitUpload}
                          className="hidden"
                          disabled={isUploadingFounder}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Founder Message Quote</label>
                    <textarea
                      rows={4}
                      value={siteData.founder.message}
                      onChange={(e) =>
                        setSiteData({ ...siteData, founder: { ...siteData.founder, message: e.target.value } })
                      }
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                {/* Action trigger feedback */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors shadow-sm shadow-brand-blue/25"
                  >
                    {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                    <CheckCircle size={14} />
                  </button>
                  {saveStatus && <span className="text-xs text-green-600 font-semibold">{saveStatus}</span>}
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Services List CRUD manager */}
          {activeTab === 'services' && siteData && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Manage Core Capabilities</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Add, edit, or delete dynamic services shown on the website</p>
              </div>

              {/* Form to add a service */}
              <form onSubmit={handleAddService} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <PlusCircle size={14} /> Add New Service
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Service Title *</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., Cloud Migrations"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Lucide Icon Name *</label>
                    <input
                      type="text"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., Cloud, Code2, Smartphone, Palette"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Service Description *</label>
                  <textarea
                    rows={2}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none resize-none focus:border-brand-blue"
                    placeholder="Brief detail explaining the capability..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add Capability
                </button>
              </form>

              {/* Current Services list */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display font-bold text-base text-slate-900">Current Services ({siteData.services?.length || 0})</h3>
                <div className="grid grid-cols-1 gap-4">
                  {siteData.services?.map((service) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex justify-between items-start gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 rounded-md">
                            Icon: {service.icon}
                          </span>
                          <h4 className="font-display font-bold text-slate-850 text-sm">{service.title}</h4>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{service.description}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 text-red-500 hover:text-red-650 cursor-pointer transition-colors flex-shrink-0"
                        title="Remove Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Projects List CRUD manager */}
          {activeTab === 'projects' && siteData && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Manage Case Studies Portfolio</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Upload projects with images and tags, indexing automatically</p>
              </div>

              {/* Form to add a project */}
              <form onSubmit={handleAddProject} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <PlusCircle size={14} /> Add New Case Study
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Project Title *</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., FinTech Transaction Ledger"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Project Link (URL)</label>
                    <input
                      type="text"
                      value={projectForm.link}
                      onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., https://myproject.com or #"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Project Cover Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="S3 image location link..."
                    />
                    <label className="px-4 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors font-bold select-none flex-shrink-0 shadow-sm shadow-brand-blue/20">
                      {isUploadingProject ? (
                        <>
                          <Loader2 size={12} className="animate-spin mr-1.5" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={12} className="mr-1.5" />
                          Upload S3
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProjectCoverUpload}
                        className="hidden"
                        disabled={isUploadingProject}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Image Alt text (SEO Alt)</label>
                    <input
                      type="text"
                      value={projectForm.imageAlt}
                      onChange={(e) => setProjectForm({ ...projectForm, imageAlt: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., Dashboard visual ledger screenshot"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={projectTagsInput}
                      onChange={(e) => setProjectTagsInput(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                      placeholder="E.g., Next.js, S3, MongoDB"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Description *</label>
                  <textarea
                    rows={3}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    placeholder="Describe what the system accomplishes..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> Add Case Study
                </button>
              </form>

              {/* Current Projects list */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display font-bold text-base text-slate-900">Current Portfolio Cases ({siteData.projects?.length || 0})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {siteData.projects?.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between"
                    >
                      {/* Image preview */}
                      <div className="relative aspect-video bg-slate-100 border-b border-slate-200">
                        {project.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={project.image} alt={project.imageAlt} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                        )}
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="absolute top-4 right-4 p-2 rounded-xl bg-white border border-slate-200 text-red-500 hover:text-red-650 shadow-sm cursor-pointer transition-colors"
                          title="Remove Project"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-display font-bold text-slate-850 text-sm">{project.title}</h4>
                          {project.link && (
                            <a href={project.link} className="text-slate-400 hover:text-brand-blue"><ExternalLink size={12} /></a>
                          )}
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{project.description}</p>
                        
                        <div className="flex gap-1.5 flex-wrap pt-2">
                          {project.tags?.map((t, idx) => (
                            <span key={idx} className="text-[8px] font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2 py-0.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Blog Manager (Advanced SEO Panel) */}
          {activeTab === 'blogs' && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900">Advanced SEO Blogs Manager</h2>
                  <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Publish directly to S3 and MongoDB databases</p>
                </div>
                
                {/* Toggle Editor Plus Button */}
                {!showCreateForm ? (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shadow-brand-blue/20 transition-colors"
                  >
                    <Plus size={14} /> Create New Blog
                  </button>
                ) : (
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to Blog List
                  </button>
                )}
              </div>

              {/* Publish blog post form (Toggled by Plus button) */}
              {showCreateForm && (
                <form onSubmit={handleAddBlog} className="space-y-8 animate-fadeIn">
                  
                  {/* Section A: Content & Alt details */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                    <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                      <Sparkles size={14} />
                      1. Article Content (Tiptap Rich Editor)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Post Title *</label>
                        <input
                          type="text"
                          value={blogForm.title}
                          onChange={handleTitleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="Why SEO matters for Next.js in 2026"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Blog URL Slug (lowercase-with-dashes) *</label>
                        <input
                          type="text"
                          value={blogForm.slug}
                          onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase() })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                          placeholder="why-seo-matters-for-nextjs"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Short Excerpt *</label>
                      <input
                        type="text"
                        value={blogForm.excerpt}
                        onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                        placeholder="Discover standard methodologies..."
                        required
                      />
                    </div>

                    {/* Dynamic TipTap Rich Text Editor */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Article Content (Rich Text) *</label>
                      <TiptapEditor
                        content={blogForm.content}
                        onChange={(html) => setBlogForm(prev => ({ ...prev, content: html }))}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Cover image uploader */}
                      <div className="space-y-1.5 lg:col-span-2">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Cover Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={blogForm.coverImage}
                            onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                            placeholder="/images/blog-default.jpg"
                          />
                          <label className="px-4 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors font-bold select-none flex-shrink-0 shadow-sm shadow-brand-blue/20">
                            {isUploading ? (
                              <>
                                <Loader2 size={12} className="animate-spin mr-1.5" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload size={12} className="mr-1.5" />
                                Upload S3
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBlogCoverUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Category *</label>
                        <input
                          type="text"
                          value={blogForm.category}
                          onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="Web Development"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Featured Image Alt Text (SEO Alt) *</label>
                        <input
                          type="text"
                          value={blogForm.imageAlt}
                          onChange={(e) => setBlogForm({ ...blogForm, imageAlt: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="E.g., Next.js SEO visual logo graphic"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Tags (Comma Separated)</label>
                        <input
                          type="text"
                          value={blogForm.tags}
                          onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="Next.js, Tailwind, React"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section B: SEO & Google Preview Metadata */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
                    <h3 className="font-display font-bold text-sm text-brand-purple flex items-center gap-2">
                      <Globe size={14} className="text-brand-purple" />
                      2. Google Search Preview & Meta Metadata
                    </h3>

                    {/* Live Google Search Preview card */}
                    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 font-sans">
                      <span className="text-[9px] uppercase text-slate-400 font-black tracking-wider flex items-center gap-1.5">
                        <Eye size={10} /> Google SERP Snippet Preview
                      </span>
                      <div className="space-y-1 pt-2 select-none">
                        <div className="text-[11px] text-[#202124] leading-none truncate opacity-80">
                          https://mahitechnocrafts.in/blog/{blogForm.slug || 'url-slug'}
                        </div>
                        <div className="text-base text-[#1a0dab] leading-snug hover:underline cursor-pointer font-medium truncate pt-1">
                          {blogForm.metaTitle || blogForm.title || 'Page Title Snippet Preview'}
                        </div>
                        <div className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                          {blogForm.metaDescription || blogForm.excerpt || 'Please fill description excerpt or meta description...'}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">SEO Meta Title (Title Tag)</label>
                        <input
                          type="text"
                          value={blogForm.metaTitle}
                          onChange={(e) => setBlogForm({ ...blogForm, metaTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="Why Next.js is Best for SEO | Mahi Technocrafts"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">SEO Focus Keyword</label>
                        <input
                          type="text"
                          value={blogForm.focusKeyword}
                          onChange={(e) => setBlogForm({ ...blogForm, focusKeyword: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                          placeholder="Next.js SEO"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">SEO Meta Description</label>
                      <textarea
                        rows={2}
                        value={blogForm.metaDescription}
                        onChange={(e) => setBlogForm({ ...blogForm, metaDescription: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none resize-none focus:border-brand-blue"
                        placeholder="Crawl description displaying on google results page..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Canonical Link URL</label>
                        <input
                          type="url"
                          value={blogForm.canonicalUrl}
                          onChange={(e) => setBlogForm({ ...blogForm, canonicalUrl: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="https://mahitechnocrafts.in/blog/slug"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Author Name</label>
                        <input
                          type="text"
                          value={blogForm.author}
                          onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section C: Social (Open Graph) configuration */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                    <h3 className="font-display font-bold text-sm text-pink-600 flex items-center gap-2">
                      <PlusCircle size={14} className="text-pink-500" />
                      3. Social Share Media (Open Graph cards)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">OG Title</label>
                        <input
                          type="text"
                          value={blogForm.ogTitle}
                          onChange={(e) => setBlogForm({ ...blogForm, ogTitle: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="WhatsApp/FB preview Title"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">OG Image Location</label>
                        <input
                          type="text"
                          value={blogForm.ogImage}
                          onChange={(e) => setBlogForm({ ...blogForm, ogImage: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                          placeholder="/images/blog-seo.jpg"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">OG Description</label>
                      <input
                        type="text"
                        value={blogForm.ogDescription}
                        onChange={(e) => setBlogForm({ ...blogForm, ogDescription: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                        placeholder="WhatsApp/FB preview Description"
                      />
                    </div>
                  </div>

                  {/* Section D: Advanced rich results & Schema schemas */}
                  <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-5">
                    <h3 className="font-display font-bold text-sm text-green-600 flex items-center gap-2">
                      <Settings size={14} className="text-green-600" />
                      4. Schema Markup & FAQ Builder
                    </h3>

                    <div className="flex gap-6 select-none font-bold text-xs text-slate-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogForm.enableBlogSchema}
                          onChange={(e) => setBlogForm({ ...blogForm, enableBlogSchema: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 accent-brand-blue"
                        />
                        Enable Article Schema (JSON-LD)
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={blogForm.enableFaqSchema}
                          onChange={(e) => setBlogForm({ ...blogForm, enableFaqSchema: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 accent-brand-blue"
                        />
                        Enable FAQ Schema (JSON-LD)
                      </label>
                    </div>

                    {/* FAQ Builder grid */}
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase font-bold text-slate-500">Dynamic FAQ List</span>
                        <button
                          type="button"
                          onClick={addFAQ}
                          className="px-3 py-1.5 text-[9px] font-bold text-brand-blue bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus size={10} /> Add FAQ Item
                        </button>
                      </div>

                      <div className="space-y-3">
                        {blogForm.faqs.map((faq, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => removeFAQ(idx)}
                              className="absolute top-4 right-4 text-red-500 hover:text-red-700 cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 size={12} />
                            </button>

                            <div className="grid grid-cols-1 gap-2.5 pr-6">
                              <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Question</label>
                                <input
                                  type="text"
                                  value={faq.q}
                                  onChange={(e) => updateFAQ(idx, 'q', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                                  placeholder="E.g., What are benefits?"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Answer</label>
                                <input
                                  type="text"
                                  value={faq.a}
                                  onChange={(e) => updateFAQ(idx, 'a', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-850 focus:outline-none focus:border-brand-blue"
                                  placeholder="E.g., Next.js pre-renders..."
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-colors shadow-sm shadow-brand-blue/25"
                    >
                      {isSaving ? 'Publishing Post...' : 'Publish Blog Post'}
                      <Plus size={14} />
                    </button>
                    {saveStatus && <span className="text-xs text-purple-600 font-bold">{saveStatus}</span>}
                  </div>
                </form>
              )}

              {/* Published blogs list (Only visible when form is hidden) */}
              {!showCreateForm && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base text-slate-900">Published Articles ({blogsList.length})</h3>
                  </div>

                  {blogsList.length === 0 ? (
                    <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                      <Inbox size={32} className="text-slate-300" />
                      <p className="text-xs font-bold">No articles published yet. Click "Create New Blog" to write your first post!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogsList.map((blog) => (
                        <div
                          key={blog.slug}
                          className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex justify-between items-center gap-6 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-1">
                            <h4 className="font-display font-bold text-slate-850 text-sm">{blog.title}</h4>
                            <span className="text-[10px] text-slate-500 block">
                              /{blog.slug} &bull; {blog.publishedAt} &bull; {blog.readTime} &bull; <span className="text-brand-blue font-semibold">{blog.category}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteBlog(blog.slug)}
                              className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 text-red-500 hover:text-red-650 cursor-pointer transition-colors"
                              title="Delete Post"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Customer Queries */}
          {activeTab === 'contacts' && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Customer Inquiries Log</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Inbox details from MongoDB collection</p>
              </div>

              {/* Inquiries list */}
              <div className="space-y-4">
                {contactList.length === 0 ? (
                  <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                    <Inbox size={32} className="text-slate-300" />
                    <p className="text-xs font-bold">Your inbox is completely clear.</p>
                  </div>
                ) : (
                  contactList.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 rounded-2xl border transition-colors shadow-sm ${
                        msg.status === 'unread'
                          ? 'border-brand-blue/30 bg-blue-50/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <h4 className="font-display font-bold text-slate-850 text-sm flex items-center gap-2">
                            {msg.name}
                            {msg.status === 'unread' && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500 text-[8px] text-white uppercase font-black tracking-wider">
                                New
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {msg.email} &bull; {msg.phone || 'No phone'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">
                            {new Date(msg.submittedAt).toLocaleString()}
                          </span>

                          <button
                            onClick={() => toggleContactStatus(msg.id, msg.status)}
                            className="px-2.5 py-1.5 text-[9px] font-bold rounded-lg border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 cursor-pointer transition-colors"
                          >
                            {msg.status === 'unread' ? 'Mark Read' : 'Mark Unread'}
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Subject: {msg.subject}</span>
                        <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 6: Reviews Management */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Customer Reviews & Testimonials</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Approve public reviews or add new customer feedback directly</p>
              </div>

              {/* Form to add a review directly (Admin Auto-Approved) */}
              <form onSubmit={handleAddReviewAdmin} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <PlusCircle size={14} /> Add New Review (Directly Approved)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Customer Name *</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Amit Sharma"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Email Address</label>
                    <input
                      type="email"
                      value={reviewForm.email}
                      onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. amit@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Designation / Role *</label>
                    <input
                      type="text"
                      value={reviewForm.role}
                      onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Director of Engineering"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Company Name *</label>
                    <input
                      type="text"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Logix Supply Co."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Rating (1 to 5) *</label>
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      required
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Client Logo / Photo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={reviewForm.avatarUrl || ''}
                        onChange={(e) => setReviewForm({ ...reviewForm, avatarUrl: e.target.value })}
                        className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                        placeholder="Image URL or upload..."
                      />
                      <label className="px-4 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors font-bold select-none flex-shrink-0 shadow-sm shadow-brand-blue/20">
                        {isUploadingReviewAvatar ? (
                          <>
                            <Loader2 size={12} className="animate-spin mr-1.5" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={12} className="mr-1.5" />
                            Upload Photo
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReviewAvatarUpload}
                          className="hidden"
                          disabled={isUploadingReviewAvatar}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Review Message *</label>
                  <textarea
                    rows={3}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    placeholder="Describe client's feedback here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingReview}
                  className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> {isSavingReview ? 'Saving...' : 'Add Approved Review'}
                </button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900">Submitted Reviews ({reviewsList.length})</h3>
                
                {reviewsList.length === 0 ? (
                  <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                    <Star size={32} className="text-slate-300" />
                    <p className="text-xs font-bold">No reviews found in database.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {reviewsList.map((review) => (
                      <div
                        key={review.id}
                        className={`p-6 rounded-2xl border transition-colors shadow-sm bg-white ${
                          review.status === 'pending'
                            ? 'border-amber-400 bg-amber-50/10'
                            : review.status === 'rejected'
                            ? 'border-rose-200 bg-rose-50/10'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            {review.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={review.avatarUrl}
                                alt={review.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-black text-xs border border-brand-blue/20">
                                {review.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-display font-bold text-slate-855 text-sm">
                                  {review.name}
                                </h4>
                                <span className="text-[10px] text-slate-505">
                                  ({review.role} at {review.company})
                                </span>
                                
                                {/* Status Badge */}
                                <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider ${
                                  review.status === 'approved'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : review.status === 'rejected'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {review.status}
                                </span>
                              </div>
                              {review.email && (
                                <span className="text-[9px] text-slate-500 block mt-1">
                                  Email: {review.email}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Stars rating */}
                            <div className="flex gap-0.5">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">
                              {new Date(review.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Review text */}
                        <p className="text-slate-700 text-xs leading-relaxed py-4 whitespace-pre-line font-medium">
                          &ldquo;{review.text}&rdquo;
                        </p>

                        {/* Review Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex gap-2">
                            {review.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(review.id, 'approved')}
                                className="px-3 py-1.5 text-[9px] font-bold rounded-lg border border-emerald-250 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            
                            {review.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(review.id, 'rejected')}
                                className="px-3 py-1.5 text-[9px] font-bold rounded-lg border border-rose-250 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                              >
                                Reject
                              </button>
                            )}

                            {review.status !== 'pending' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(review.id, 'pending')}
                                className="px-3 py-1.5 text-[9px] font-bold rounded-lg border border-amber-250 bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer transition-colors"
                              >
                                Move to Pending
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 text-red-500 hover:text-red-650 cursor-pointer transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 7: Careers Management */}
          {activeTab === 'careers' && (
            <div className="space-y-8 animate-fadeIn text-xs">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="font-display font-black text-xl text-slate-900">Careers & Job Openings</h2>
                <p className="text-[10px] uppercase text-slate-400 tracking-wider mt-1">Publish job positions dynamically on the careers page</p>
              </div>

              {/* Form to add a career posting */}
              <form onSubmit={handleAddCareer} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
                <h3 className="font-display font-bold text-sm text-brand-blue flex items-center gap-1.5">
                  <PlusCircle size={14} /> Add New Job Posting
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Job Title *</label>
                    <input
                      type="text"
                      value={careerForm.title}
                      onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Senior React / Next.js Engineer"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Job Type *</label>
                    <select
                      value={careerForm.type}
                      onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      required
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Location *</label>
                    <input
                      type="text"
                      value={careerForm.location}
                      onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. Bhopal (On-site) or Remote"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Experience Required *</label>
                    <input
                      type="text"
                      value={careerForm.experience}
                      onChange={(e) => setCareerForm({ ...careerForm, experience: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none focus:border-brand-blue"
                      placeholder="e.g. 2+ Years or Freshers"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Job Description *</label>
                  <textarea
                    rows={4}
                    value={careerForm.description}
                    onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-855 focus:outline-none resize-none focus:border-brand-blue"
                    placeholder="Provide details about the job, requirements, responsibilities..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingCareer}
                  className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={12} /> {isSavingCareer ? 'Publishing...' : 'Publish Job Posting'}
                </button>
              </form>

              {/* Jobs List */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-base text-slate-900">Current Job Openings ({careersList.length})</h3>

                {careersList.length === 0 ? (
                  <div className="p-12 text-center border border-slate-200 rounded-2xl bg-white shadow-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                    <Briefcase size={32} className="text-slate-300" />
                    <p className="text-xs font-bold">No active job opportunities found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {careersList.map((job) => (
                      <div
                        key={job.id}
                        className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex justify-between items-start gap-6"
                      >
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-display font-bold text-slate-855 text-sm">{job.title}</h4>
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[8px] uppercase font-black tracking-wider">
                              {job.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[8px] uppercase font-black tracking-wider">
                              {job.location}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[8px] uppercase font-black tracking-wider">
                              Exp: {job.experience}
                            </span>
                          </div>

                          <p className="text-slate-600 text-xs leading-relaxed">{job.description}</p>
                          
                          {job.postedAt && (
                            <span className="text-[9px] text-slate-400 block mt-1">
                              Posted on: {new Date(job.postedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteCareer(job.id)}
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 text-red-500 hover:text-red-650 cursor-pointer transition-colors flex-shrink-0"
                          title="Remove Job Posting"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
