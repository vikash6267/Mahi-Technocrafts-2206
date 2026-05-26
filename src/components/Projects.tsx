'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';
import { ProjectItem } from '@/lib/db';

interface ProjectsProps {
  data: ProjectItem[];
}

export default function Projects({ data }: ProjectsProps) {
  if (!data || data.length === 0) return null;

  return (
    <section className="relative py-28 overflow-hidden bg-slate-50 dark:bg-[#02000a]/50" id="projects">
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-purple flex items-center justify-center gap-2">
            <Sparkles size={12} className="animate-pulse" />
            Case Studies
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our Premium Digital <span className="text-gradient">Craftsmanship</span>
          </p>
          <div className="w-16 h-[2px] bg-brand-purple mx-auto mt-4" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {data.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-3xl overflow-hidden glass border border-slate-200 dark:border-slate-800/80 hover:border-brand-purple/20 transition-all duration-300 flex flex-col relative interactive-hover cursor-pointer"
            >
              {/* S3 Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-200 dark:border-slate-850">
                {project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.imageAlt || project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-650 font-display font-bold">
                    No Project Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-slate-800 dark:text-white text-base md:text-lg">
                      {project.title}
                    </h3>
                    {project.link && project.link !== '#' && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-brand-purple transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap pt-2">
                  {project.tags?.map((t, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
