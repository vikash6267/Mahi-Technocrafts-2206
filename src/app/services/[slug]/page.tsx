import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { ArrowLeft, Sparkles, ChevronRight, CheckCircle2, MessageSquare, PhoneCall, BookOpen, HelpCircle } from 'lucide-react';
import { getSiteData, getBlogs, BlogItem } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper component to resolve dynamic lucide icons
const ServiceIcon = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore
  const Icon = Icons[name];
  if (!Icon) return <Icons.HelpCircle className={className} />;
  return <Icon className={className} />;
};

const serviceDetailsMap: Record<string, {
  title: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  icon: string;
  longDescription: string;
  features: string[];
  faqs: { q: string; a: string }[];
}> = {
  'website-development': {
    title: 'Website Development',
    metaTitle: 'Website Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Top website development company in Bhopal. High-speed custom web design, React, Next.js, and custom e-commerce web solutions in Bhopal.',
    headline: 'Website Development Company in Bhopal',
    icon: 'Code2',
    longDescription: 'Mahi TechnoCrafts is the premier website development agency in Bhopal, engineering high-speed, secure, and SEO-optimized custom web solutions near you. Our MERN and Next.js developers craft stunning online systems designed to scale your business and generate maximum local customer conversions.',
    features: [
      'Superfast Server-Side Rendered (SSR) Next.js Websites',
      'Fully Responsive Mobile-First Coding',
      'Pre-Integrated Local Business & WebSite Schemas',
      'Interactive Custom Dashboards & Admin Panels',
      'Search-Engine Friendly Clean Semantics'
    ],
    faqs: [
      {
        q: 'Why is Mahi TechnoCrafts the best web development company in Bhopal?',
        a: 'We don\'t just build basic layouts. We engineer superfast, secure Next.js websites that load instantly, score 90+ in Core Web Vitals, and are pre-integrated with Local SEO schema to rank #1 in Bhopal.'
      },
      {
        q: 'How much does web development cost in Bhopal?',
        a: 'Our custom high-performance business websites start with budget-friendly rates, taking about 2-4 weeks to design, develop, and launch in Bhopal.'
      },
      {
        q: 'Will my website rank on Google Search in Bhopal?',
        a: 'Yes, absolutely. We include robots.txt, dynamic sitemaps, custom metadata, and structured JSON-LD schemas out of the box to guarantee your business appears in local searches.'
      }
    ]
  },
  'mobile-app-development': {
    title: 'Mobile App Development',
    metaTitle: 'Mobile App Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best mobile app development company in Bhopal. High-performance React Native, Flutter, secure iOS and Android custom apps in Bhopal.',
    headline: 'Mobile App Development Company in Bhopal',
    icon: 'Smartphone',
    longDescription: 'Mahi TechnoCrafts is the top-tier mobile app development agency in Bhopal, Madhya Pradesh. We build feature-rich, high-performance, and secure Android and iOS applications with seamless APIs, custom dashboard integrations, and stunning user interfaces.',
    features: [
      'High-Performance React Native & Flutter Apps',
      'Seamless API Integrations & Real-Time Sync',
      'Advanced Cloud Database Backends',
      'Publishing Support on App Store & Google Play',
      'Premium UI/UX Transitions and Micro-Animations'
    ],
    faqs: [
      {
        q: 'Which is the top mobile app development agency in Bhopal?',
        a: 'Mahi TechnoCrafts stands out by delivering native-performing cross-platform apps using Flutter and React Native, fully integrated with secure databases and custom APIs.'
      },
      {
        q: 'Do you publish the mobile apps on Play Store and App Store?',
        a: 'Yes, we handle the complete publishing pipeline, ensuring compliance with Google Play Store and Apple App Store review guidelines.'
      },
      {
        q: 'How long does mobile app development take?',
        a: 'Depending on features, a custom mobile app takes about 6 to 10 weeks to fully design, code, test, and release.'
      }
    ]
  },
  'seo-services': {
    title: 'SEO & Generative Engine Optimization',
    metaTitle: 'SEO Services in Bhopal | Local SEO & GEO | Mahi TechnoCrafts',
    metaDescription: 'Best SEO services company in Bhopal. Boost your Google Search, Google Maps, and AI Engine rankings with expert Local SEO and GEO solutions.',
    headline: 'SEO & Generative Engine Optimization in Bhopal',
    icon: 'TrendingUp',
    longDescription: 'Elevate your organic reach with the best SEO services company in Bhopal. Mahi TechnoCrafts provides cutting-edge Local SEO, Google Business Profile (GBP) ranking optimization, NAP consistency, and modern Generative Engine Optimization (GEO) to ensure your business ranks #1 in standard search and AI systems.',
    features: [
      'High-Impact Local SEO & Google Maps Ranking',
      'Generative Engine Optimization (GEO) for ChatGPT & Gemini',
      'Dynamic Schema Markups (LocalBusiness, FAQ, Breadcrumb)',
      'High-Quality Content Strategy & Keyphrase Analysis',
      'Crawl Budget Management & Indexing Fixes'
    ],
    faqs: [
      {
        q: 'How does Mahi TechnoCrafts improve local SEO in Bhopal?',
        a: 'We optimize your site speed, structure clean HTML5 semantic tags, implement robust local JSON-LD schemas globally, and sync your website content perfectly with Bhopal-based local keywords.'
      },
      {
        q: 'What is Generative Engine Optimization (GEO)?',
        a: 'GEO is the practice of optimizing your site\'s structure, E-E-A-T signals, and FAQ schemas so that conversational AI engines like ChatGPT, Gemini, and Perplexity read and recommend your business in their answers.'
      },
      {
        q: 'How long does it take to see results in search rankings?',
        a: 'While technical changes and sitemaps are crawled in hours, organic authority building and top rankings in Bhopal local queries typically take 3 to 6 months of steady optimization.'
      }
    ]
  },
  'ai-solutions': {
    title: 'Smart AI Solutions & Chatbots',
    metaTitle: 'AI Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best AI solutions and chatbot development company in Bhopal. Automate customer support, sales pipelines, and daily operations with smart AI bots.',
    headline: 'AI Development & Smart Chatbots in Bhopal',
    icon: 'Cpu',
    longDescription: 'Mahi TechnoCrafts is the top AI development company in Bhopal. We engineer custom AI agents, automated workflow pipelines, smart conversational chatbots, and intelligent analytics dashboards to save overhead costs and boost user engagement.',
    features: [
      'Conversational AI Chatbots with Instant Replies',
      'Lead Capture & Automatic CRM Syncing',
      'Custom LLM API Connections (OpenAI, Gemini)',
      'Automated Workflow & Data Entry Pipelines',
      'Smart Analytics Dashboards for Business Performance'
    ],
    faqs: [
      {
        q: 'How can smart AI chatbots benefit my business in Bhopal?',
        a: 'AI chatbots handle 80%+ of customer inquiries instantly 24/7, capture hot leads, and escalate complex support issues to your team, reducing manual support costs significantly.'
      },
      {
        q: 'Can you integrate custom AI models with our existing systems?',
        a: 'Yes, we build robust API connections to integrate custom AI models, OpenAI APIs, and chatbot flows directly into your current CRM or web dashboard.'
      },
      {
        q: 'Is my data secure when using OpenAI or Gemini APIs?',
        a: 'Yes, we implement secure enterprise-grade API connections and strict data boundaries to ensure your business data is never used for external public model training.'
      }
    ]
  },
  'cyber-security': {
    title: 'Cyber Security Services',
    metaTitle: 'Cyber Security Services in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best cybersecurity services company in Bhopal. Safe server hardening, secure code audits, vulnerability assessments, and data protection 24/7.',
    headline: 'Cyber Security Services in Bhopal',
    icon: 'ShieldAlert',
    longDescription: 'Protect your digital assets with the premier cyber security agency in Bhopal. Mahi TechnoCrafts provides robust server hardening, secure code auditing, data encryption models, and vulnerability assessments to safeguard your customer data from modern cyber threats.',
    features: [
      'Comprehensive Vulnerability Assessments & Audits',
      'Secure Server Hardening & SSL Configurations',
      'Encrypted Custom Database Architecture',
      'Malware Removal & Active Firewall Systems',
      'Secure Code Audits to Prevent Injection Attacks'
    ],
    faqs: [
      {
        q: 'Why is cybersecurity important for local businesses in Bhopal?',
        a: 'Data leaks and server downtime can destroy a brand\'s reputation and lead to huge financial losses. Secure code and SSL encryption are also ranking factors in Google Search.'
      },
      {
        q: 'Do you perform security audits for existing websites and mobile apps?',
        a: 'Yes, we run comprehensive security assessments, penetration testing, and code audits to locate vulnerabilities and patch them instantly.'
      },
      {
        q: 'What is your server hardening process?',
        a: 'We close unused ports, set up robust firewalls, restrict SSH access, encrypt data at rest and in transit, and schedule automated regular backups.'
      }
    ]
  },
  'ecommerce-development': {
    title: 'E-Commerce Development',
    metaTitle: 'E-Commerce Web Design & Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best e-commerce web development company in Bhopal. Custom online shopping stores with fast payments, simple dashboards, and inventory management.',
    headline: 'E-Commerce Store Development in Bhopal',
    icon: 'ShoppingBag',
    longDescription: 'Mahi TechnoCrafts is the leading e-commerce web design and development company in Bhopal. We design fast, secure, and conversion-optimized online shopping stores with seamless payment gateway integrations, simple inventory management systems, and high-impact e-commerce SEO.',
    features: [
      'High-Speed Custom Shopping Stores',
      'Razorpay, Paytm, and Stripe Payment Gateways',
      'Easy Admin Panel for Inventory & Orders',
      'Discount Coupons & Loyalty Program Setups',
      'High-Impact E-Commerce Product Schema & SEO'
    ],
    faqs: [
      {
        q: 'What payment gateways do you support for e-commerce stores?',
        a: 'We support all major payment gateways including Razorpay, Paytm, Cashfree, PayPal, Stripe, and custom UPI scanning setups.'
      },
      {
        q: 'Is the e-commerce store easy to manage for non-technical users?',
        a: 'Yes, absolutely! We build extremely simple custom admin dashboards where you can add products, update prices, track sales, and view invoices in one click.'
      },
      {
        q: 'Will my e-commerce store work fast on mobile devices?',
        a: 'Yes, all our shopping layouts are built with mobile-first responsiveness and high-performance server rendering to guarantee near-instant shopping cart loading speeds.'
      }
    ]
  }
};

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const details = serviceDetailsMap[slug];

  if (!details) {
    return {
      title: 'Service Not Found | Mahi TechnoCrafts',
      description: 'The requested service details page could not be found.'
    };
  }

  return {
    title: details.metaTitle,
    description: details.metaDescription,
    alternates: {
      canonical: `https://mahitechnocrafts.in/services/${slug}`
    },
    openGraph: {
      title: details.metaTitle,
      description: details.metaDescription,
      url: `https://mahitechnocrafts.in/services/${slug}`,
      type: 'website'
    }
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const details = serviceDetailsMap[slug];

  if (!details) {
    notFound();
  }

  const data = await getSiteData();
  let blogs: BlogItem[] = [];
  try {
    blogs = await getBlogs();
  } catch (error) {
    console.error('Error fetching blogs for internal linking', error);
  }

  // Filter out the current service for related listings
  const relatedServices = data.services.filter(s => s.id !== slug);
  const relatedBlogs = blogs.slice(0, 3);

  // Breadcrumb Structured Data Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://mahitechnocrafts.in'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://mahitechnocrafts.in/services'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: details.title,
        item: `https://mahitechnocrafts.in/services/${slug}`
      }
    ]
  };

  // Service Structured Data Schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: details.title,
    serviceType: details.title,
    provider: {
      '@type': 'ProfessionalService',
      name: 'Mahi TechnoCrafts',
      url: 'https://mahitechnocrafts.in',
      logo: 'https://mahitechnocrafts.in/logo.png',
      telephone: '+916267144122',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
        addressLocality: 'Bhopal',
        addressRegion: 'MP',
        postalCode: '462001',
        addressCountry: 'IN'
      }
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Bhopal'
    },
    description: details.metaDescription
  };

  // FAQ Page Structured Data Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: details.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    }))
  };

  const schemas = [breadcrumbSchema, serviceSchema, faqSchema];

  return (
    <>
      {/* Dynamic JSON-LD Schemas */}
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c')
          }}
        />
      ))}

      <div className="min-h-screen bg-[#fafaff] py-16 dark:bg-[#030014]/10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Breadcrumb Navigation Bar */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold tracking-wide mb-10 overflow-x-auto whitespace-nowrap bg-white py-3 px-5 rounded-xl border border-slate-200/50 shadow-sm select-none">
            <Link href="/" className="hover:text-sky-700 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link href="/services" className="hover:text-sky-700 transition-colors">Services</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-800 font-bold">{details.title}</span>
          </nav>

          {/* Back to all services */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 hover:text-sky-800 transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to All Services
          </Link>

          {/* Hero details card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-8 space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 to-purple-500" />
              
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[10px] font-bold uppercase tracking-widest text-sky-700">
                  <Sparkles size={10} className="animate-spin text-purple-500" />
                  SEO & AI Optimized
                </span>
                
                <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-slate-900 leading-tight">
                  {details.headline}
                </h1>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <ServiceIcon name={details.icon} className="w-6 h-6" />
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {details.longDescription}
              </p>

              {/* Strategic feature list */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">
                  Why Choose Mahi TechnoCrafts?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs text-slate-600 leading-normal">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA Box */}
            <div className="lg:col-span-4 bg-gradient-to-tr from-slate-900 to-slate-950 p-8 rounded-3xl text-white shadow-2xl space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-purple-500/10 pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <h3 className="font-display font-bold text-lg tracking-wide">
                  Start Your Project in Bhopal Today
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Let\'s build something beautiful and SEO-friendly. Speak directly with our lead developer near Hamidia Road and rank #1 in search engines.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                  <PhoneCall size={16} className="text-sky-400" />
                  <span className="text-xs font-semibold text-slate-300">+91 6267144122</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} className="text-sky-400" />
                  <span className="text-xs font-semibold text-slate-300">support@mahitechnocrafts.in</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 font-bold text-xs uppercase tracking-wider text-center text-white rounded-xl shadow-lg shadow-sky-500/15 cursor-pointer transition-all duration-200 mt-2 block relative z-10"
              >
                Get a Free Quote
              </Link>
            </div>
          </div>

          {/* Localized FAQ Section */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl mb-16">
            <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900 mb-8 flex items-center gap-2">
              <HelpCircle className="text-sky-600" size={20} />
              Frequently Asked Questions (Bhopal SEO FAQ)
            </h2>

            <div className="space-y-6">
              {details.faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#fafaff] border border-slate-100 text-left space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related services internal linking */}
          <div className="space-y-8 mb-16">
            <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900 text-left">
              Explore Our Other Services
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              {relatedServices.map(service => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-sky-500/30 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-[150px]"
                >
                  <div className="space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                      <ServiceIcon name={service.icon} className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-xs tracking-wide line-clamp-2">
                      {service.title}
                    </h3>
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 inline-flex items-center gap-1 group-hover:text-sky-800">
                    Read More
                    <ChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Related blogs internal linking */}
          {relatedBlogs.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900 text-left flex items-center gap-2">
                <BookOpen size={20} className="text-sky-600" />
                Latest Insights from Our Blog
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map(blog => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="p-6 rounded-2xl bg-white border border-slate-200/60 hover:border-purple-500/30 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-[180px]"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                        {blog.tags[0] || 'Tech'}
                      </span>
                      <h3 className="font-bold text-slate-800 text-xs sm:text-sm tracking-wide line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 inline-flex items-center gap-1 mt-2">
                      Read Article
                      <ChevronRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Generate static params for prerendering at build time
export async function generateStaticParams() {
  return [
    { slug: 'website-development' },
    { slug: 'mobile-app-development' },
    { slug: 'seo-services' },
    { slug: 'ai-solutions' },
    { slug: 'cyber-security' },
    { slug: 'ecommerce-development' }
  ];
}
