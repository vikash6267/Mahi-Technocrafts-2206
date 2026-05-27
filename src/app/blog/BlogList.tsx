'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react';
import { BlogItem } from '@/lib/db';

export default function BlogList({ initialBlogs }: { initialBlogs: BlogItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract all unique tags dynamically
  const allTags = ['All', ...Array.from(new Set(initialBlogs.flatMap(b => b.tags || [])))];

  // Filter logic
  const filteredBlogs = initialBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'All' || blog.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-12">
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#080612]/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>

        {/* Tag Filters list */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all duration-300 ${
                selectedTag === tag
                  ? 'bg-brand-blue border-brand-blue text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blogs Grid list */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredBlogs.map((blog) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={blog.slug}
              className="group p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 shadow-md flex flex-col justify-between relative overflow-hidden interactive-hover cursor-pointer"
            >
              {/* Card visual background elements */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="space-y-4 w-full">
                {/* Cover Image */}
                {blog.coverImage && (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.coverImage}
                      alt={blog.imageAlt || blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                {/* Meta details */}
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {blog.publishedAt}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {blog.readTime}
                  </span>
                </div>

                {/* Title and Excerpt */}
                <h2 className="font-display font-bold text-slate-800 dark:text-white text-base md:text-lg leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                  {blog.excerpt}
                </p>
              </div>

              {/* Action tags and redirect */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                <div className="flex gap-1.5 flex-wrap">
                  {blog.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] font-bold uppercase tracking-wider text-brand-purple bg-purple-500/10 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${blog.slug}`}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue pt-2 inline-block transform group-hover:translate-x-1 transition-transform"
                >
                  Read Article
                  <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty Search state */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-20 p-8 glass rounded-2xl border border-slate-200 dark:border-slate-850">
          <p className="text-slate-400 text-sm font-semibold">No articles match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
