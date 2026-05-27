'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShieldCheck } from 'lucide-react';

interface TechItem {
  name: string;
  level: string;
}

interface TechCategories {
  [key: string]: TechItem[];
}

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('Frontend');

  // Categories list and technologies map
  const categories = ['Frontend', 'Backend', 'Database', 'Cloud', 'Mobile', 'AI'];

  const techMap: TechCategories = {
    Frontend: [
      { name: 'Next.js', level: 'Expert' },
      { name: 'React.js', level: 'Expert' },
      { name: 'TypeScript', level: 'Expert' },
      { name: 'Tailwind CSS', level: 'Expert' },
      { name: 'Framer Motion', level: 'Advanced' },
      { name: 'HTML5 / CSS3', level: 'Expert' }
    ],
    Backend: [
      { name: 'Node.js / Express', level: 'Expert' },
      { name: 'NestJS', level: 'Advanced' },
      { name: 'Python / FastAPI', level: 'Advanced' },
      { name: 'Go (Golang)', level: 'Intermediate' },
      { name: 'REST APIs / GraphQL', level: 'Expert' }
    ],
    Database: [
      { name: 'PostgreSQL', level: 'Expert' },
      { name: 'MongoDB', level: 'Expert' },
      { name: 'Redis', level: 'Advanced' },
      { name: 'MySQL', level: 'Advanced' },
      { name: 'Prisma / Mongoose', level: 'Expert' }
    ],
    Cloud: [
      { name: 'AWS (S3, EC2, Lambda)', level: 'Advanced' },
      { name: 'Docker', level: 'Advanced' },
      { name: 'Vercel / Netlify', level: 'Expert' },
      { name: 'CI/CD Pipelines', level: 'Advanced' },
      { name: 'Nginx', level: 'Advanced' }
    ],
    Mobile: [
      { name: 'Flutter', level: 'Expert' },
      { name: 'React Native', level: 'Advanced' },
      { name: 'iOS Swift', level: 'Intermediate' },
      { name: 'Android Kotlin', level: 'Intermediate' }
    ],
    AI: [
      { name: 'OpenAI API', level: 'Advanced' },
      { name: 'Google Gemini', level: 'Advanced' },
      { name: 'LangChain', level: 'Advanced' },
      { name: 'Vector DBs (Pinecone)', level: 'Advanced' }
    ]
  };

  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030014]/40" id="tech-stack">
      {/* Background neon glows */}
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-96 h-96 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-sky-700 dark:text-brand-blue">
            Our Stack
          </h2>
          <p className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Architected with Modern Standards
          </p>
          <div className="w-16 h-[2px] bg-brand-blue mx-auto mt-4" />
        </div>

        {/* Categories Tab selector with sliding indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16 max-w-4xl mx-auto relative z-10 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition-all duration-300 border ${
                activeCategory === cat
                  ? 'border-brand-blue/30 text-white'
                  : 'bg-slate-50 dark:bg-[#080612] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-350 dark:hover:border-slate-700'
              }`}
            >
              {activeCategory === cat && (
                <motion.span
                  layoutId="activeTechTab"
                  className="absolute inset-0 bg-brand-blue rounded-xl shadow-lg shadow-brand-blue/15 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Tech Grid containing logos */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {techMap[activeCategory].map((tech) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  key={tech.name}
                  className="p-6 rounded-2xl glass border border-slate-200/50 dark:border-slate-800/80 hover:border-brand-purple/20 transition-all duration-350 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-slate-800 dark:text-white text-sm">
                        {tech.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{tech.level}</p>
                    </div>
                  </div>

                  <CheckCircle size={14} className="text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
