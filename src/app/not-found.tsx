import Link from 'next/link';
import { Home, ArrowLeft, Search, Code2, Smartphone, Palette, BrainCircuit, Database, Cloud } from 'lucide-react';

export const metadata = {
  title: '404 – Page Not Found | Mahi TechnoCrafts',
  description: 'The page you are looking for could not be found. Explore our services or return home.',
};

const quickLinks = [
  { href: '/services/web-dev', label: 'Web Development', icon: Code2 },
  { href: '/services/mobile-dev', label: 'Mobile Apps', icon: Smartphone },
  { href: '/services/uiux-design', label: 'UI/UX Design', icon: Palette },
  { href: '/services/ai-solutions', label: 'AI Solutions', icon: BrainCircuit },
  { href: '/services/erp-crm', label: 'Business Software', icon: Database },
  { href: '/services/cloud-services', label: 'Cloud Hosting', icon: Cloud },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafaff] dark:bg-[#02000d] flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center space-y-10">
        {/* 404 Hero */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <span className="text-[120px] sm:text-[160px] font-display font-black leading-none select-none text-gradient opacity-20 dark:opacity-10">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 sm:w-20 sm:h-20 text-sky-500 dark:text-sky-400 opacity-80" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or may have been moved.
            Explore our services below or head back home.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all duration-200"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-sm font-bold rounded-xl shadow-sm hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            View All Services
          </Link>
        </div>

        {/* Quick Service Links */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Or jump to a service
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-sky-400/50 dark:hover:border-sky-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200 shadow-sm group"
              >
                <Icon size={15} className="text-sky-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact nudge */}
        <p className="text-xs text-slate-400 dark:text-slate-600">
          Still can't find what you need?{' '}
          <Link href="/contact" className="text-sky-500 hover:text-sky-600 font-semibold underline underline-offset-2">
            Contact us
          </Link>{' '}
          and we'll help right away.
        </p>
      </div>
    </div>
  );
}
