import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  BookOpen, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { getSiteData, getBlogs, BlogItem } from '@/lib/db';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper component to resolve dynamic lucide icons
const ServiceIcon = ({ name, className }: { name: string; className?: string }) => {
  // @ts-ignore
  const Icon = Icons[name];
  if (!Icon) return <Icons.Code2 className={className} />;
  return <Icon className={className} />;
};

interface ServiceDetailEntry {
  title: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  icon: string;
  priceHook: string;
  deliveryTime: string;
  longDescription: string;
  features: string[];
  faqs: { q: string; a: string }[];
}

const serviceDetailsMap: Record<string, ServiceDetailEntry> = {
  /* ── Core Services from Navbar Dropdown ──────────────── */
  'web-dev': {
    title: 'Web Development',
    metaTitle: 'Website Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Top website development company in Bhopal. High-speed custom web design, mobile-friendly stores, and business websites starting from ₹2,999*.',
    headline: 'Top Website Development Company in Bhopal',
    icon: 'Globe',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '7-14 Days',
    longDescription: 'Mahi TechnoCrafts is the premier website development agency in Bhopal, engineering high-speed, secure, and Google-ranked custom websites. Our expert design team crafts stunning websites designed to scale your business and generate maximum customer phone calls and inquiries.',
    features: [
      'Superfast Loading Mobile & Desktop Business Websites',
      '100% Mobile Responsive & Modern User-Friendly Design',
      'Pre-Integrated Local Business Schemas for Top Google Rankings',
      'Simple Mobile Admin Panel to Update Prices & Photos in 30s',
      'Instant WhatsApp Chat & Lead Capture Forms Integration'
    ],
    faqs: [
      {
        q: 'Why is Mahi TechnoCrafts the best web development company in Bhopal?',
        a: 'We build superfast, secure websites that load in under 1 second on mobile phones, look stunning, and are pre-integrated with Local SEO to rank #1 in Bhopal.'
      },
      {
        q: 'How much does web development cost in Bhopal?',
        a: 'Our custom high-performance business websites start with budget-friendly rates from ₹2,999*, taking about 7–14 days to design, develop, test, and launch.'
      },
      {
        q: 'Will my website rank on Google Search in Bhopal?',
        a: 'Yes. We include robots.txt, dynamic sitemaps, custom metadata, and structured JSON-LD schemas out of the box to guarantee your business appears in local searches.'
      }
    ]
  },

  'mobile-dev': {
    title: 'Mobile App Development',
    metaTitle: 'Mobile App Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best mobile app development company in Bhopal. High-performance, secure iOS and Android custom mobile apps starting from ₹9,999*.',
    headline: 'Mobile App Development Company in Bhopal',
    icon: 'Smartphone',
    priceHook: 'Starting from ₹9,999*',
    deliveryTime: '2-4 Weeks',
    longDescription: 'Mahi TechnoCrafts is the top-tier mobile app development agency in Bhopal, Madhya Pradesh. We build feature-rich, high-performance, and secure Android and iPhone applications with instant push notifications, 1-click UPI payments, and stunning interfaces.',
    features: [
      'High-Performance Android & iPhone (iOS) Mobile Apps',
      'Instant Push Notifications & Live Customer Alerts',
      '1-Click Google Pay & PhonePe UPI Payment Gateways',
      'Full Publishing Support on Google Play Store & Apple App Store',
      'Easy Mobile Admin Panel to Manage App Content'
    ],
    faqs: [
      {
        q: 'Which is the top mobile app development agency in Bhopal?',
        a: 'Mahi TechnoCrafts delivers fast, smooth mobile apps for Android and iPhone, fully integrated with secure databases, UPI payments, and WhatsApp.'
      },
      {
        q: 'Do you publish mobile apps on Play Store and App Store?',
        a: 'Yes, we handle the complete publishing pipeline, ensuring your app goes live smoothly on Google Play and Apple App Store.'
      },
      {
        q: 'How long does mobile app development take?',
        a: 'Depending on features, a custom mobile app takes about 2 to 4 weeks to fully design, code, test, and release.'
      }
    ]
  },

  'digital-marketing': {
    title: 'Digital Marketing & Growth',
    metaTitle: 'Digital Marketing Agency in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Top digital marketing agency in Bhopal. Google Ads, Meta PPC, targeted lead funnels, and high-converting marketing strategies starting from ₹4,999*.',
    headline: 'Data-Driven Digital Marketing & Lead Generation in Bhopal',
    icon: 'TrendingUp',
    priceHook: 'Starting from ₹4,999*',
    deliveryTime: 'Continuous Growth',
    longDescription: 'Accelerate your customer acquisition with Mahi TechnoCrafts. We design full-funnel digital marketing campaigns across Google Search, Instagram, Facebook, and LinkedIn to generate high-intent inbound calls and leads for your business in Bhopal and across India.',
    features: [
      'High-ROI Google Search & Local Maps PPC Campaigns',
      'Targeted Facebook & Instagram Conversion Ads',
      'Sales Funnel Landing Page Design & CRO Optimization',
      'Lead Automation with Direct WhatsApp & CRM Routing',
      'Transparent Weekly Reporting & ROI Attribution'
    ],
    faqs: [
      {
        q: 'How quickly can digital marketing generate leads for my business?',
        a: 'With targeted Google and Meta Ads, our clients typically begin receiving verified inquiries within 48 to 72 hours of campaign launch.'
      },
      {
        q: 'What makes Mahi TechnoCrafts different from other digital marketing agencies in Bhopal?',
        a: 'We combine high-speed website engineering with deep analytics, ensuring the traffic we generate lands on lightning-fast pages designed specifically to convert.'
      },
      {
        q: 'Do you provide marketing for local businesses in Bhopal?',
        a: 'Yes, we specialize in hyper-local targeting across Bhopal, Indore, and Madhya Pradesh to drive local footfall and inquiries.'
      }
    ]
  },

  'seo-services': {
    title: 'SEO & Generative Engine Optimization',
    metaTitle: 'SEO Services in Bhopal | Local SEO & GEO | Mahi TechnoCrafts',
    metaDescription: 'Best SEO services company in Bhopal. Boost your Google Search, Google Maps, and AI Engine rankings with expert Local SEO and GEO solutions starting from ₹2,999*.',
    headline: 'SEO & Generative Engine Optimization in Bhopal',
    icon: 'Search',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: 'Monthly Retainer',
    longDescription: 'Elevate your organic reach with the best SEO services company in Bhopal. Mahi TechnoCrafts provides cutting-edge Local SEO, Google Business Profile (GBP) ranking optimization, NAP consistency, and modern Generative Engine Optimization (GEO) to ensure your business ranks #1 in standard search and AI systems.',
    features: [
      'High-Impact Local SEO & Google Maps Ranking Optimization',
      'Generative Engine Optimization (GEO) for ChatGPT, Gemini & Perplexity',
      'Dynamic Schema Markups (LocalBusiness, FAQ, Breadcrumb)',
      'High-Quality Content Strategy & Keyphrase Analysis',
      'Crawl Budget Management & Indexing Fixes'
    ],
    faqs: [
      {
        q: 'How does Mahi TechnoCrafts improve local SEO in Bhopal?',
        a: 'We optimize site speed, structure clean HTML5 semantic tags, implement robust local JSON-LD schemas globally, and sync your website content with Bhopal-based local keywords.'
      },
      {
        q: 'What is Generative Engine Optimization (GEO)?',
        a: 'GEO is the practice of optimizing your site\'s structure, E-E-A-T signals, and FAQ schemas so that conversational AI engines like ChatGPT, Gemini, and Perplexity recommend your business.'
      },
      {
        q: 'How long does it take to see results in search rankings?',
        a: 'While technical fixes index within days, top competitive organic rankings typically show strong compounding growth over 2 to 4 months.'
      }
    ]
  },

  'branding-identity': {
    title: 'Branding & Visual Identity',
    metaTitle: 'Branding & Logo Design Agency in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best branding agency in Bhopal. Premium logo design, brand guideline books, visual identity, and UI/UX design starting from ₹2,999*.',
    headline: 'Premium Branding & Visual Identity in Bhopal',
    icon: 'Palette',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-2 Weeks',
    longDescription: 'Establish an unforgettable brand with Mahi TechnoCrafts. We craft distinctive logo identities, typography guidelines, corporate stationery, and modern visual design languages that build instant credibility and trust with your customers.',
    features: [
      'Custom Vector Logo Concepts with Unlimited Revisions',
      'Comprehensive Brand Style Guide (Colors, Typography, Usage)',
      'Business Cards, Letterheads & Social Media Branding Kits',
      'Packaging & Product Mockup Visuals',
      'Full Vector & High-Res Source File Handover (AI, SVG, PNG)'
    ],
    faqs: [
      {
        q: 'What deliverables are included in a branding package?',
        a: 'You receive original vector logo files, color codes (RGB/HEX/CMYK), typography fonts, social media display kits, and a PDF brand guideline document.'
      },
      {
        q: 'Can you redesign our existing company logo without losing our identity?',
        a: 'Yes, we specialize in modern brand refreshes that clean up and modernize your look while preserving your core recognized elements.'
      },
      {
        q: 'How long does a branding project take?',
        a: 'A complete branding package takes 5 to 10 days from initial moodboard concepts to final asset delivery.'
      }
    ]
  },

  'social-media-marketing': {
    title: 'Social Media Marketing (SMM)',
    metaTitle: 'Social Media Marketing Agency in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best social media marketing agency in Bhopal. Instagram Reels, creative post designs, community management, and paid growth starting from ₹3,999*.',
    headline: 'High-Engagement Social Media Marketing in Bhopal',
    icon: 'Megaphone',
    priceHook: 'Starting from ₹3,999*',
    deliveryTime: 'Monthly Growth',
    longDescription: 'Turn your social media channels into lead generation engines. Mahi TechnoCrafts crafts viral Instagram Reels, aesthetic carousel posts, and targeted engagement campaigns that grow your followers and drive real business inquiries in Bhopal and nationwide.',
    features: [
      'High-Impact Instagram Reels & Short-Form Video Production',
      'Aesthetic Brand Post Designs & Carousel Infographics',
      'Daily Community Engagement & DM Lead Qualification',
      'Influencer Collaboration & Local PR Outreaches',
      'Monthly Content Calendar & Performance Reports'
    ],
    faqs: [
      {
        q: 'Which social media platforms do you manage?',
        a: 'We manage Instagram, Facebook, LinkedIn, YouTube Shorts, and X (Twitter) tailored to your industry.'
      },
      {
        q: 'Do you create original video reels and graphics?',
        a: 'Yes, our creative team handles everything from scriptwriting and motion graphics to captions, hashtags, and scheduling.'
      },
      {
        q: 'How does social media marketing help B2B and local companies in Bhopal?',
        a: 'Active, high-quality social channels build massive credibility, warm up prospective clients before they buy, and generate direct inquiries in DMs.'
      }
    ]
  },

  'ecommerce-management': {
    title: 'E-Commerce Management & Growth',
    metaTitle: 'E-Commerce Store Setup & Management in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best e-commerce setup and management agency in Bhopal. Online stores, WhatsApp catalog shops, Amazon/Flipkart onboarding, and ad funnels starting from ₹4,999*.',
    headline: 'End-to-End E-Commerce Store Setup & Scaling in Bhopal',
    icon: 'ShoppingCart',
    priceHook: 'Starting from ₹4,999*',
    deliveryTime: '7-14 Days',
    longDescription: 'Launch and scale your online store with Mahi TechnoCrafts. We provide full-service online shopping store design, 1-click UPI payments, WhatsApp catalog syncing, automated shipping courier integration, and sales growth funnels.',
    features: [
      'High-Speed Online Shopping Store with 1-Click Mobile Checkout',
      'Google Pay, PhonePe & Paytm UPI Payment Gateway Setup',
      'Automated Courier Shipping Sync (Shiprocket / Delhivery)',
      'Amazon, Flipkart & Meesho Marketplace Seller Onboarding',
      'Direct WhatsApp Order Notification for Store Owner'
    ],
    faqs: [
      {
        q: 'Can you help set up automated shipping and COD verification?',
        a: 'Yes, we integrate Shiprocket, Delhivery, and custom COD OTP verification to reduce fake orders and returns.'
      },
      {
        q: 'Do you provide marketing to get our first 100 orders?',
        a: 'Yes, our e-commerce packages include Meta Ads setup, Google Shopping ads, and email/WhatsApp abandoned-cart recovery.'
      },
      {
        q: 'How much does it cost to launch an e-commerce store?',
        a: 'Our high-performance custom online store packages start from ₹2,999* with affordable maintenance plans.'
      }
    ]
  },

  'uiux-design': {
    title: 'UI/UX Design & Prototyping',
    metaTitle: 'UI/UX Design Agency in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best UI/UX design agency in Bhopal. Beautiful, conversion-focused app and website Figma prototypes starting from ₹2,999*.',
    headline: 'Conversion-Centric UI/UX Design Agency in Bhopal',
    icon: 'Palette',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-3 Weeks',
    longDescription: 'Mahi TechnoCrafts crafts stunning, user-centric UI/UX designs for websites and mobile applications in Bhopal. Our design philosophy blends aesthetics with functionality — creating interfaces that look beautiful, feel natural, and convert visitors into loyal customers.',
    features: [
      'Custom Figma Wireframes & High-Fidelity Prototypes',
      'Mobile-First Responsive Design Systems',
      'Micro-Animation & Interaction Design',
      'Accessibility-Compliant WCAG Layouts',
      'Brand Identity & Design Language Guides'
    ],
    faqs: [
      {
        q: 'Why does great UI/UX design matter for my business?',
        a: 'Studies show that users form an opinion about a website in under 50ms. A clean, intuitive design builds trust instantly and significantly reduces bounce rates.'
      },
      {
        q: 'Do you provide Figma design files after the project?',
        a: 'Yes, we hand over all design source files, component libraries, and style guides so your team can maintain and extend the design independently.'
      },
      {
        q: 'Can you redesign my existing website or app?',
        a: 'Absolutely. We audit your current interface, identify UX pain points, and deliver a modernised design that improves engagement and conversions.'
      }
    ]
  },

  'erp-crm': {
    title: 'Custom Business Software & ERP',
    metaTitle: 'Custom ERP & CRM Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best custom ERP & CRM software development company in Bhopal. Manage customers, sales, inventory, and operations in one smart dashboard.',
    headline: 'Custom ERP & CRM Software Development in Bhopal',
    icon: 'Database',
    priceHook: 'Starting from ₹9,999*',
    deliveryTime: '3-6 Weeks',
    longDescription: 'Mahi TechnoCrafts builds powerful, easy-to-use custom ERP and CRM business software for companies in Bhopal and across India. From sales pipeline management to inventory tracking and automated invoicing, our systems centralise every business operation into one elegant dashboard.',
    features: [
      'Custom CRM for Leads, Clients & Follow-Ups',
      'Inventory & Stock Management Modules',
      'Automated Invoice & Billing Generation',
      'Role-Based Access Control & User Permissions',
      'Real-Time Business Analytics & Reports'
    ],
    faqs: [
      {
        q: 'How is custom ERP software better than off-the-shelf solutions?',
        a: 'Off-the-shelf tools charge heavy monthly subscriptions and force you to adapt your workflow to their system. Custom software is built precisely around how your business operates.'
      },
      {
        q: 'Can the software be accessed on mobile devices?',
        a: 'Yes, all our business software is built with a responsive web dashboard accessible on any device — desktop, tablet, or smartphone.'
      },
      {
        q: 'How long does custom business software take to build?',
        a: 'A standard CRM or ERP module takes 3 to 6 weeks depending on the number of features and integrations.'
      }
    ]
  },

  'cloud-services': {
    title: 'Secure Cloud Hosting & DevOps',
    metaTitle: 'Cloud Hosting & DevOps Services in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best secure cloud hosting and DevOps services in Bhopal. 99.9% uptime, SSL, daily backups, and scalable infrastructure for your business.',
    headline: 'Secure Cloud Hosting & DevOps in Bhopal',
    icon: 'Cloud',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: 'Instant Setup',
    longDescription: 'Mahi TechnoCrafts provides enterprise-grade cloud hosting and DevOps services for businesses in Bhopal and across India. We set up scalable, secure, and high-availability infrastructure on AWS, Vercel, and DigitalOcean — ensuring your website or app stays online, fast, and protected 24/7.',
    features: [
      '99.9% Uptime SLA with Auto-Scaling Infrastructure',
      'SSL Certificates & HTTPS Enforcement',
      'Automated Daily Backups & Disaster Recovery',
      'CI/CD Pipelines for Zero-Downtime Deployments',
      'DDoS Protection & Web Application Firewall'
    ],
    faqs: [
      {
        q: 'Which cloud providers do you work with?',
        a: 'We work with AWS, DigitalOcean, Vercel, and Cloudflare — choosing the best fit based on your budget, traffic requirements, and geographic audience.'
      },
      {
        q: 'What happens if my server goes down?',
        a: 'Our monitoring systems alert us within minutes of any downtime. With automated backups and redundant setups, we restore service typically in under 30 minutes.'
      },
      {
        q: 'Do you handle server migrations?',
        a: 'Yes, we perform full zero-downtime migrations from shared hosting to modern cloud infrastructure without disrupting your live traffic.'
      }
    ]
  },

  'ai-solutions': {
    title: 'Smart AI Solutions & Chatbots',
    metaTitle: 'AI Development Company in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best AI solutions and chatbot development company in Bhopal. Automate customer support, sales pipelines, and daily operations with smart AI bots.',
    headline: 'AI Development & Smart Chatbots in Bhopal',
    icon: 'Cpu',
    priceHook: 'Starting from ₹3,999*',
    deliveryTime: '1-3 Weeks',
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
    priceHook: 'Starting from ₹4,999*',
    deliveryTime: '1-2 Weeks',
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
  }
};

// Aliases for alternate route slugs
serviceDetailsMap['website-development'] = serviceDetailsMap['web-dev'];
serviceDetailsMap['mobile-app-development'] = serviceDetailsMap['mobile-dev'];
serviceDetailsMap['ecommerce-development'] = serviceDetailsMap['ecommerce-management'];

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

      <div className="min-h-screen bg-[#fafaff] dark:bg-[#02000d] py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          
          {/* Breadcrumb Navigation Bar */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide mb-8 overflow-x-auto whitespace-nowrap bg-white dark:bg-slate-900 py-3 px-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm select-none">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link href="/services" className="hover:text-sky-600 transition-colors">Services</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-800 dark:text-white font-bold">{details.title}</span>
          </nav>

          {/* Back to all services */}
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 hover:text-sky-800 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to All Services
          </Link>

          {/* Hero details card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            <div className="lg:col-span-8 space-y-7 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    <Sparkles size={11} className="text-purple-500" />
                    High-Performance Engineering
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {details.priceHook}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  {details.headline}
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-slate-700">
                <ServiceIcon name={details.icon} className="w-7 h-7" />
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {details.longDescription}
              </p>

              {/* Strategic feature list */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white">
                  Why Choose Mahi TechnoCrafts?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {details.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-normal">
                      <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA Box */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-6 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">
                  Instant Project Consultation
                </span>
                <h3 className="font-display font-bold text-xl tracking-wide">
                  Start Your Project in Bhopal Today
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Let&apos;s engineer something fast, beautiful, and revenue-generating. Speak directly with our lead developer near Hamidia Road and rank #1 in search engines.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <PhoneCall size={15} className="text-sky-400" />
                  <span className="font-semibold text-slate-300">+91 6267144122</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare size={15} className="text-sky-400" />
                  <span className="font-semibold text-slate-300">support@mahitechnocrafts.in</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Transparent Pricing & Free Prototype</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-bold text-xs uppercase tracking-wider text-center text-white rounded-xl shadow-xl shadow-sky-500/20 transition-all block mt-2"
              >
                Get a Free Custom Quote
              </Link>
            </div>
          </div>

          {/* Localized FAQ Section */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl mb-16">
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <HelpCircle className="text-sky-600" size={22} />
              Frequently Asked Questions 
            </h2>

            <div className="space-y-4">
              {details.faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Related services internal linking */}
          <div className="space-y-8 mb-16">
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white text-left">
              Explore Our Other Services
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedServices.map(service => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-[150px]"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                      <ServiceIcon name={service.icon} className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs tracking-wide line-clamp-2">
                      {service.title}
                    </h3>
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 inline-flex items-center gap-1 group-hover:text-sky-700">
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
              <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white text-left flex items-center gap-2">
                <BookOpen size={22} className="text-sky-600" />
                Latest Insights from Our Blog
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map(blog => (
                  <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between h-[180px]"
                  >
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        {blog.tags[0] || 'Tech'}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-wide line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 inline-flex items-center gap-1 mt-2">
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
    { slug: 'web-dev' },
    { slug: 'mobile-dev' },
    { slug: 'digital-marketing' },
    { slug: 'seo-services' },
    { slug: 'branding-identity' },
    { slug: 'social-media-marketing' },
    { slug: 'ecommerce-management' },
    { slug: 'uiux-design' },
    { slug: 'ai-solutions' },
    { slug: 'erp-crm' },
    { slug: 'cloud-services' },
    { slug: 'cyber-security' },
    { slug: 'website-development' },
    { slug: 'mobile-app-development' },
    { slug: 'ecommerce-development' },
  ];
}
