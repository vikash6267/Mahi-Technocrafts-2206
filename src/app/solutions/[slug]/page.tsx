import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  ArrowRight,
  Clock,
  Award,
  Layers,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getSiteData } from '@/lib/db';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export interface SolutionDetail {
  title: string;
  industry: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  emoji: string;
  heroBadge: string;
  priceHook: string;
  deliveryTime: string;
  summary: string;
  painPoints: { problem: string; solution: string }[];
  coreModules: { title: string; desc: string; iconText: string }[];
  techStack: string[];
  processSteps: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

const solutionDetailsMap: Record<string, SolutionDetail> = {
  'healthcare': {
    title: 'Healthcare & Clinic Management Software',
    industry: 'Healthcare',
    metaTitle: 'Healthcare & Hospital Software Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Top healthcare web & mobile app development company in Bhopal. HIPAA-compliant clinic management, doctor booking, EHR records, and telemedicine apps.',
    headline: 'Healthcare & Clinic Management Software Solutions',
    emoji: '🏥',
    heroBadge: 'HIPAA-Compliant & Secure',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-4 Weeks',
    summary: 'Mahi TechnoCrafts develops secure, high-performance healthcare software, telemedicine mobile apps, and electronic health record (EHR) portals for hospitals, diagnostic labs, and medical practitioners in Bhopal and across India.',
    painPoints: [
      {
        problem: 'Long patient waiting lines & chaotic manual appointment books.',
        solution: 'Automated 24/7 online doctor booking with instant WhatsApp appointment confirmations.'
      },
      {
        problem: 'Lost physical prescriptions and scattered medical reports.',
        solution: 'Encrypted patient portal where patients and doctors access past test records securely.'
      },
      {
        problem: 'High no-show rates for scheduled consultations.',
        solution: 'Automated SMS and WhatsApp reminder alerts sent 2 hours before appointments.'
      }
    ],
    coreModules: [
      { title: 'Doctor Scheduling & Slot Booking', desc: 'Real-time appointment slot booking with calendar sync for single or multi-doctor clinics.', iconText: '📅' },
      { title: 'Electronic Health Records (EHR)', desc: 'Bank-grade encrypted medical history, diagnostic reports, and digital prescription creation.', iconText: '📁' },
      { title: 'Telemedicine & Video Consultation', desc: 'One-click HD video call integration with in-call digital prescription generation.', iconText: '📹' },
      { title: 'Pharmacy & Inventory Billing', desc: 'Medicine stock tracking, expiry alerts, and GST-compliant thermal printing invoices.', iconText: '💊' },
      { title: 'Lab Test Management', desc: 'Direct patient report upload portal with automated PDF delivery via WhatsApp.', iconText: '🔬' },
      { title: 'Multi-Branch Hospital Admin', desc: 'Centralized dashboard to manage staff shifts, doctor payouts, and daily revenue stats.', iconText: '🏢' }
    ],
    techStack: ['Next.js 15', 'React Native (iOS/Android)', 'WebRTC Video', 'PostgreSQL', '256-Bit SSL Encryption', 'AWS Cloud'],
    processSteps: [
      { step: '01', title: 'Clinic Workflow Audit', desc: 'We analyze your current patient flow and clinic requirements to blueprint the architecture.' },
      { step: '02', title: 'Interactive Prototype', desc: 'We create simple UI wireframes for doctor and patient apps so you test the flow before coding.' },
      { step: '03', title: 'Secure Development', desc: 'Our engineers build fast, HIPAA-compliant databases and integrate WhatsApp/SMS APIs.' },
      { step: '04', title: 'Staff Training & Launch', desc: 'We train your reception and medical staff and provide 24/7 ongoing support.' }
    ],
    faqs: [
      { q: 'Is patient data completely secure and private?', a: 'Yes. We implement 256-bit SSL encryption at rest and in transit, with role-based access control ensuring only authorized doctors view patient records.' },
      { q: 'Can patients book appointments directly through WhatsApp?', a: 'Yes! We integrate automated WhatsApp chatbot workflows so patients can check available slots and book in seconds.' },
      { q: 'How much does healthcare software development cost in Bhopal?', a: 'Our customized clinic website and booking solutions start with affordable packages from ₹2,999*, with modular upgrades based on your requirements.' }
    ]
  },

  'ecommerce': {
    title: 'Retail & E-Commerce Store Development',
    industry: 'Retail & E-Commerce',
    metaTitle: 'E-Commerce Website Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best e-commerce website development company in Bhopal. High-speed custom online stores, 1-click Razorpay checkout, inventory sync, and mobile apps.',
    headline: 'High-Converting E-Commerce & Retail Stores',
    emoji: '🛒',
    heroBadge: 'Sub-Second Loading & High Conversions',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-3 Weeks',
    summary: 'Turn visitors into paying customers with lightning-fast, custom e-commerce stores engineered by Mahi TechnoCrafts. We build headless Next.js online stores, multi-vendor marketplaces, and D2C brand websites with seamless UPI and payment integrations.',
    painPoints: [
      {
        problem: 'Slow page loading speeds causing 60%+ visitors to abandon carts.',
        solution: 'Server-side rendered Next.js architecture with sub-0.5s page load times.'
      },
      {
        problem: 'Expensive marketplace commissions (up to 30%) eating into profits.',
        solution: 'Your own branded online store with 0% platform commission and direct customer ownership.'
      },
      {
        problem: 'Manual inventory management leading to out-of-stock cancellations.',
        solution: 'Automated real-time stock sync with low-stock alerts and automatic invoice generation.'
      }
    ],
    coreModules: [
      { title: 'Sub-Second Product Catalog', desc: 'Instant search, filter by size/color/price, and fast image loading on 4G/5G networks.', iconText: '⚡' },
      { title: '1-Click Checkout & UPI Gateway', desc: 'Razorpay, Paytm, Cashfree, and Stripe integrations supporting PhonePe, GPay, and cards.', iconText: '💳' },
      { title: 'Automated WhatsApp Order Updates', desc: 'Instant WhatsApp notifications for order confirmation, dispatch tracking, and delivery.', iconText: '📲' },
      { title: 'Dynamic Discount & Coupon Engine', desc: 'Create BOGO offers, countdown flash sale timers, and personalized cart-recovery coupons.', iconText: '🏷️' },
      { title: 'Inventory & Order Dashboard', desc: 'Easy-to-use admin panel to add products, print thermal shipping labels, and track profits.', iconText: '📦' },
      { title: 'Customer Review & Rating System', desc: 'Rich visual customer reviews with photo uploads and Google product schema for SEO.', iconText: '⭐' }
    ],
    techStack: ['Next.js 15 (SSR)', 'Tailwind CSS', 'Razorpay / Cashfree APIs', 'MongoDB Atlas', 'Cloudflare CDN', 'Redis Caching'],
    processSteps: [
      { step: '01', title: 'Product & Brand Strategy', desc: 'We review your product catalog, target audience, and payment workflows.' },
      { step: '02', title: 'Conversion-Focused UI/UX', desc: 'We design high-converting mobile-first shopping interfaces tested for maximum checkout rates.' },
      { step: '03', title: 'Store Engineering & Testing', desc: 'We connect secure payment gateways, automated shipping APIs, and SEO schemas.' },
      { step: '04', title: 'Go Live & Marketing Setup', desc: 'We launch your store, set up Google Merchant Center, Meta Pixels, and Analytics.' }
    ],
    faqs: [
      { q: 'Can non-technical staff manage product additions and orders?', a: 'Yes, 100%! We provide an ultra-simple admin dashboard where you can add products, change prices, and view sales in one click from your phone.' },
      { q: 'Do you integrate all Indian payment gateways like UPI and Cash on Delivery?', a: 'Yes. We support Razorpay, Paytm, Cashfree, Stripe, UPI QR codes, and Cash on Delivery (COD) with automated OTP verification.' },
      { q: 'How does an e-commerce website help my local Bhopal store?', a: 'A custom online store lets you sell 24/7 across Bhopal, Madhya Pradesh, and all of India without paying huge marketplace cuts.' }
    ]
  },

  'ai-solutions': {
    title: 'AI Solutions, WhatsApp Automation & Smart CRM',
    industry: 'AI & Automations',
    metaTitle: 'AI Solutions & WhatsApp Chatbot Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Top AI solution and WhatsApp automation development company in Bhopal. 24/7 AI chatbots, lead scoring, automatic GST invoicing, and workflow bots.',
    headline: '24/7 AI WhatsApp Assistants & Workflow Automation',
    emoji: '🤖',
    heroBadge: '24/7 Instant Auto-Replies & Lead Scoring',
    priceHook: 'Starting from ₹3,999*',
    deliveryTime: '1-2 Weeks',
    summary: 'Automate your customer inquiries, qualify leads instantly, and eliminate manual paperwork with custom AI chatbots, WhatsApp business bots, and smart workflow automations engineered by Mahi TechnoCrafts.',
    painPoints: [
      {
        problem: 'Losing high-value buyer inquiries at night or during peak busy hours.',
        solution: '24/7 AI WhatsApp bot that replies within 2 seconds with catalogs and pricing.'
      },
      {
        problem: 'Wasting 3–4 hours daily typing manual quotes, invoices, and payment reminders.',
        solution: 'Automated invoice generator that creates PDF bills and sends payment links directly on WhatsApp.'
      },
      {
        problem: 'Unorganized customer leads scattered across notebooks and personal WhatsApp.',
        solution: 'Centralized AI CRM dashboard that logs, tags, and routes every incoming customer lead automatically.'
      }
    ],
    coreModules: [
      { title: '24/7 WhatsApp AI Chatbot', desc: 'Natural conversational assistant that answers customer questions and shares PDF catalogs.', iconText: '🤖' },
      { title: 'Automatic Lead Qualification', desc: 'Asks smart questions to capture budget, location, and requirement before alerting your sales team.', iconText: '🎯' },
      { title: '1-Click GST Invoice Generator', desc: 'Auto-calculates taxes, generates professional PDF bills, and syncs payment status.', iconText: '🧾' },
      { title: 'Automated Payment Follow-up Bot', desc: 'Sends gentle automated WhatsApp payment reminder alerts for pending customer dues.', iconText: '🔔' },
      { title: 'Multi-Agent Support Inbox', desc: 'One central WhatsApp number shared across multiple sales team members with role permissions.', iconText: '👥' },
      { title: 'Live Performance Analytics', desc: 'Track customer conversation counts, response speeds, and sales closure rates in real time.', iconText: '📈' }
    ],
    techStack: ['OpenAI / DeepSeek AI', 'WhatsApp Business Cloud API', 'Node.js', 'PostgreSQL', 'Secure Cloud Hosting'],
    processSteps: [
      { step: '01', title: 'Conversation Flow Blueprint', desc: 'We map your customer FAQs, catalog items, and sales qualification rules.' },
      { step: '02', title: 'AI Assistant Training', desc: 'We train the AI model on your exact business knowledge base and tone of voice.' },
      { step: '03', title: 'WhatsApp & CRM Integration', desc: 'We connect official Meta WhatsApp Cloud APIs and configure automated triggers.' },
      { step: '04', title: 'Testing & Launch', desc: 'We test across edge cases, train your team, and provide 6 months free maintenance.' }
    ],
    faqs: [
      { q: 'Will the AI bot work with our official WhatsApp number?', a: 'Yes! We integrate official Meta WhatsApp Business Cloud APIs so you keep your existing company phone number with green tick verification support.' },
      { q: 'Can human staff take over when a client needs personal attention?', a: 'Absolutely. Whenever a customer asks for a manager or human rep, the AI bot smoothly alerts your sales team for instant live takeover.' },
      { q: 'How much does WhatsApp AI chatbot development cost in Bhopal?', a: 'Our custom AI chatbot and automation packages start from an affordable ₹3,999* with complete setup, integration, and 6 months free maintenance.' }
    ]
  },

  'manufacturing': {
    title: 'Manufacturing & Industrial ERP Solutions',
    industry: 'Manufacturing',
    metaTitle: 'Manufacturing ERP Software Development Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best custom manufacturing ERP software development in Bhopal. Track factory production, raw materials, inventory, vendor orders, and supply chains.',
    headline: 'Custom Manufacturing ERP & Factory Operations Software',
    emoji: '🏭',
    heroBadge: 'End-to-End Factory Automation',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '3-6 Weeks',
    summary: 'Modernize your plant operations with custom manufacturing ERP software designed by Mahi TechnoCrafts. From raw material procurement and machine downtime logs to automated batch quality control and dispatch tracking.',
    painPoints: [
      {
        problem: 'Paper logs and Excel sheets causing material wastage and stock errors.',
        solution: 'Real-time digital inventory tracker with barcode and QR scanning.'
      },
      {
        problem: 'Lack of visibility into stage-by-stage factory production bottlenecks.',
        solution: 'Live floor production dashboard showing output per shift and worker allocation.'
      },
      {
        problem: 'Delayed supplier payments and missed purchase orders.',
        solution: 'Automated PO generation with vendor approval cycles and GST payment records.'
      }
    ],
    coreModules: [
      { title: 'Raw Material Inventory & Stock Alerts', desc: 'Automatic reorder point triggers when raw material stock falls below threshold.', iconText: '📊' },
      { title: 'Work Order & Batch Tracking', desc: 'Trace every manufactured batch from raw material arrival to final dispatch packaging.', iconText: '🏷️' },
      { title: 'Quality Control (QC) Inspection', desc: 'Digital check-sheets for stage-wise defect logging and quality compliance certificates.', iconText: '🔍' },
      { title: 'Machine Maintenance & Downtime Logs', desc: 'Preventive maintenance calendar alerts and breakdown repair history logging.', iconText: '⚙️' },
      { title: 'Vendor & Purchase Order Manager', desc: 'Request for quotation (RFQ) workflows and automated GST purchase invoices.', iconText: '📑' },
      { title: 'Executive Analytics & Profitability', desc: 'Visual cost-per-unit breakdown, labor efficiency reports, and revenue projections.', iconText: '📈' }
    ],
    techStack: ['Node.js / Express', 'PostgreSQL', 'React Web Dashboard', 'Docker', 'Role-Based Access Control', 'AWS EC2'],
    processSteps: [
      { step: '01', title: 'Factory Floor Analysis', desc: 'We map out your raw material intake, fabrication stages, and dispatch cycles.' },
      { step: '02', title: 'Custom Module Blueprint', desc: 'We tailor the software modules around your exact industrial workflow without bloat.' },
      { step: '03', title: 'ERP Build & Hardware Sync', desc: 'We build the secure cloud database and test barcode scanner integrations.' },
      { step: '04', title: 'On-Site Deployment & Training', desc: 'We deploy the system and train your floor supervisors and management team.' }
    ],
    faqs: [
      { q: 'Is this ERP tailored to our specific manufacturing industry?', a: 'Yes. Unlike rigid off-the-shelf software, we build custom modules tailored to engineering, textiles, chemicals, food processing, or fabrication.' },
      { q: 'Can the ERP work on tablets on the factory floor?', a: 'Yes, our dashboards are fully responsive and optimized for touch tablets, desktop computers, and mobile phones.' },
      { q: 'Can we migrate our existing Excel data into the new ERP?', a: 'Yes! We provide seamless one-click Excel/CSV data import tools to transfer all your vendor, inventory, and product records.' }
    ]
  },

  'real-estate': {
    title: 'Real Estate & Property Management Portals',
    industry: 'Real Estate',
    metaTitle: 'Real Estate Website & Portal Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best real estate website development company in Bhopal. Property portals, 3D virtual tour integration, broker lead CRM, and WhatsApp broadcasts.',
    headline: 'High-Converting Real Estate Portals & Builder Showcases',
    emoji: '🏢',
    heroBadge: 'High-Intent Buyer Lead Engine',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-4 Weeks',
    summary: 'Empower your real estate agency or construction firm with premium property portals built by Mahi TechnoCrafts. We combine interactive floor plans, 3D virtual tours, neighborhood maps, and instant WhatsApp lead capture systems.',
    painPoints: [
      {
        problem: 'Low-quality leads from generic property aggregator portals.',
        solution: 'Your own branded property website capturing 100% exclusive buyer inquiries.'
      },
      {
        problem: 'Clients unable to visualize ongoing construction and layout plans.',
        solution: 'Interactive 360° virtual tours, downloadable PDF brochures, and layout overlays.'
      },
      {
        problem: 'Lost inquiries due to slow broker follow-up.',
        solution: 'Instant WhatsApp lead routing sending buyer details directly to the assigned agent.'
      }
    ],
    coreModules: [
      { title: 'Interactive Property Search & Filters', desc: 'Filter by location (Bhopal neighborhoods, MP Nagar, Hoshangabad Rd), BHK, price range, and amenities.', iconText: '🔍' },
      { title: '360° Virtual Tour & Video Integration', desc: 'Embed Matterport 3D walkthroughs, YouTube aerial drone shots, and sample flat videos.', iconText: '🎥' },
      { title: 'Direct WhatsApp Lead Capture', desc: 'One-click "Book Site Visit" button sending pre-filled property details to sales agents.', iconText: '💬' },
      { title: 'Interactive EMI & Loan Calculator', desc: 'Real-time mortgage estimation tool with down-payment and tenure sliders.', iconText: '🧮' },
      { title: 'Builder Project Showcase', desc: 'Display master plans, RERA registration numbers, construction timelines, and specs.', iconText: '🏗️' },
      { title: 'Agent & Broker Sub-Portal', desc: 'Manage broker commissions, assigned inquiries, and client follow-up status logs.', iconText: '👥' }
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'Mapbox / Google Maps API', 'MongoDB Atlas', 'WhatsApp Cloud API', 'AWS S3'],
    processSteps: [
      { step: '01', title: 'Brand & Project Mapping', desc: 'We structure your luxury residential, commercial, or plotting portfolios.' },
      { step: '02', title: 'High-End Visual UI Design', desc: 'We design premium, aesthetic layouts highlighting project architecture and amenities.' },
      { step: '03', title: 'Portal Development & Map Sync', desc: 'We build interactive filters, neighborhood location maps, and WhatsApp triggers.' },
      { step: '04', title: 'SEO & Google Ads Integration', desc: 'We integrate RERA tags, Local SEO schemas, and Meta/Google conversion pixels.' }
    ],
    faqs: [
      { q: 'Will our property listings rank for local Bhopal real estate searches?', a: 'Yes! We pre-integrate localized schema markups (RealEstateAgent, Place, FAQ) and optimize neighborhood keywords so you rank top on Google.' },
      { q: 'Can we update property photos and prices ourselves?', a: 'Yes, our custom admin dashboard allows you to add, edit, or mark properties as "Sold Out" in seconds.' },
      { q: 'Can we integrate RERA details and project brochures?', a: 'Yes, we include dedicated sections for RERA certificates, downloadable PDF floor plans, and specification sheets.' }
    ]
  },

  'restaurants': {
    title: 'Restaurant, Cafe & Food Ordering Systems',
    industry: 'Restaurants & Hospitality',
    metaTitle: 'Restaurant Website & POS Software in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best restaurant website & online food ordering system in Bhopal. 0% commission QR digital menus, table reservation, and kitchen billing POS.',
    headline: '0% Commission Online Ordering & Restaurant POS Software',
    emoji: '🍽️',
    heroBadge: 'Save 30% Delivery Commissions',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-3 Weeks',
    summary: 'Stop losing 30% of your restaurant profits to third-party delivery apps. Mahi TechnoCrafts builds direct online food ordering websites, contactless QR table menus, kitchen display POS systems, and automated customer loyalty programs.',
    painPoints: [
      {
        problem: 'Hefty commission fees eating into restaurant margins.',
        solution: 'Direct online ordering portal with 100% of the profits kept in your bank account.'
      },
      {
        problem: 'Long customer waiting times for printed menus and bills.',
        solution: 'Instant QR code on each table allowing guests to browse photos, order, and pay.'
      },
      {
        problem: 'No customer data to drive repeat weekday dining.',
        solution: 'Automated loyalty database sending SMS/WhatsApp offers on birthdays and slow days.'
      }
    ],
    coreModules: [
      { title: 'Contactless QR Table Ordering', desc: 'Guests scan the table QR code to view live food photos, customize ingredients, and order.', iconText: '📱' },
      { title: 'Direct Delivery & Takeaway Portal', desc: 'Zero-commission online ordering with real-time delivery fee calculation by distance.', iconText: '🛵' },
      { title: 'Kitchen Order Ticket (KOT) Display', desc: 'Orders directly pop up on the kitchen tablet screen and print to the thermal printer.', iconText: '👨‍🍳' },
      { title: 'Instant Table Reservation', desc: 'Allow patrons to book tables in advance with automated SMS confirmations.', iconText: '🪑' },
      { title: 'POS Billing & GST Invoicing', desc: 'Split bills, apply happy hour discounts, and generate thermal receipts in one tap.', iconText: '🧾' },
      { title: 'Customer Loyalty & Deals Engine', desc: 'Send automated discount coupons to repeat diners to boost slow weekday footfall.', iconText: '🎁' }
    ],
    techStack: ['Next.js (PWA)', 'Node.js', 'Thermal Printer ESC/POS', 'UPI / QR Payments', 'WebSockets Real-Time Sync'],
    processSteps: [
      { step: '01', title: 'Menu & Outlet Setup', desc: 'We organize your food categories, ingredient addons, and outlet timings.' },
      { step: '02', title: 'Custom Brand Layout', desc: 'We design mouth-watering food menus optimized for smartphone screens.' },
      { step: '03', title: 'POS & KOT Integration', desc: 'We configure kitchen order tickets, delivery zones, and payment gateways.' },
      { step: '04', title: 'Table QR Standees & Go-Live', desc: 'We generate custom table QR standees and launch your direct ordering engine.' }
    ],
    faqs: [
      { q: 'Do we need special hardware to run this restaurant system?', a: 'No! It runs on any regular smartphone, tablet, laptop, or existing thermal POS printer.' },
      { q: 'Can we change menu prices and mark items out-of-stock quickly?', a: 'Yes, with one tap on the restaurant manager app, you can disable items or change prices instantly.' },
      { q: 'How do customers pay for online orders?', a: 'Customers pay seamlessly using UPI apps (PhonePe, GPay, Paytm), credit/debit cards, or Cash on Delivery.' }
    ]
  },

  'education': {
    title: 'Education, EdTech & Institute Management Systems',
    industry: 'Education',
    metaTitle: 'Education Website & LMS Software in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best school, college & coaching website development in Bhopal. Anti-piracy LMS, online mock tests, student fee collection, and live classes.',
    headline: 'Complete LMS, Coaching & School Management Portals',
    emoji: '🎓',
    heroBadge: 'Scale to 50,000+ Students',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-4 Weeks',
    summary: 'Empower your coaching institute, school, or college with custom EdTech software built by Mahi TechnoCrafts. We engineer anti-piracy DRM video course portals, online test series with instant rank generation, and automated student fee management systems.',
    painPoints: [
      {
        problem: 'Piracy of expensive recorded video lectures on social media.',
        solution: 'DRM-encrypted video player with dynamic student watermarking preventing screen recording.'
      },
      {
        problem: 'Manual fee collection tracking and awkward parent follow-ups.',
        solution: 'Automated online fee portal with automated WhatsApp payment reminder alerts.'
      },
      {
        problem: 'Paper exam evaluation taking days to announce results.',
        solution: 'Online mock test portal with instant scorecards, answer keys, and percentile ranks.'
      }
    ],
    coreModules: [
      { title: 'Anti-Piracy Video Course Player', desc: 'Stream lectures with dynamic moving student watermarks (Name + Phone) and DRM protection.', iconText: '🔒' },
      { title: 'Online Mock Test & Exam Portal', desc: 'NTA/JEE/NEET pattern online test series with time limits, negative marking, and rank lists.', iconText: '📝' },
      { title: 'Student Fee & EMI Collection', desc: 'UPI/Card automated fee gateway with instant GST fee receipts sent to parents.', iconText: '💳' },
      { title: 'Live Class & Attendance Tracker', desc: 'Zoom/YouTube live embeds with automated student attendance logs per session.', iconText: '🔴' },
      { title: 'Study Material & PDF Notes Vault', desc: 'Organized topic-wise PDF notes with disable-download view-only modes.', iconText: '📚' },
      { title: 'Parent Communication & Notices', desc: 'Broadcast exam dates, holiday schedules, and performance reports via WhatsApp.', iconText: '📢' }
    ],
    techStack: ['Next.js 15', 'React Native (Student Mobile App)', 'AWS CloudFront HLS Streaming', 'PostgreSQL', 'Razorpay Subscriptions'],
    processSteps: [
      { step: '01', title: 'Academic Structure Audit', desc: 'We map out your batches, course tiers, test patterns, and fee plans.' },
      { step: '02', title: 'Student-Friendly UI Design', desc: 'We design an intuitive portal that even young students and parents can use effortlessly.' },
      { step: '03', title: 'Video & Test Engine Build', desc: 'We deploy secure video streaming servers and automated exam grading algorithms.' },
      { step: '04', title: 'Student Onboarding & Launch', desc: 'We import your existing student records and launch the web and Android app.' }
    ],
    faqs: [
      { q: 'Can we prevent students from downloading and sharing our video lectures?', a: 'Yes! We implement encrypted HLS video streaming and dynamic watermarks with the student\'s mobile number moving on screen.' },
      { q: 'Can students take mock tests on their smartphones?', a: 'Yes, our exam engine works smoothly on both low-cost Android smartphones and desktop browsers.' },
      { q: 'Can we manage multiple coaching branches with one admin account?', a: 'Yes, our central admin dashboard lets you manage multiple branches, batch teachers, and student groups seamlessly.' }
    ]
  },

  'finance': {
    title: 'FinTech, Loan & Invoicing Software Solutions',
    industry: 'Finance & FinTech',
    metaTitle: 'FinTech & Finance Software Development Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best financial software development company in Bhopal. Custom loan management, digital wallets, GST invoicing, and encrypted accounting portals.',
    headline: 'Bank-Grade Encrypted FinTech & Invoicing Platforms',
    emoji: '💰',
    heroBadge: '256-Bit Bank Grade Encryption',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '3-6 Weeks',
    summary: 'Build high-trust financial applications, digital ledger software, and automated GST billing portals with Mahi TechnoCrafts. We engineer robust, audit-compliant FinTech backends with real-time interest calculation and multi-tier encryption.',
    painPoints: [
      {
        problem: 'Data security vulnerabilities and fear of compliance audits.',
        solution: '256-bit encrypted databases with role-based permissions and immutable audit logs.'
      },
      {
        problem: 'Delayed loan EMI collections and manual interest calculation mistakes.',
        solution: 'Automated EMI scheduling with automated WhatsApp repayment alerts.'
      },
      {
        problem: 'Messy accounting ledgers requiring hours of manual reconciliation.',
        solution: '1-click financial P&L statements, balance sheets, and automated GST filing exports.'
      }
    ],
    coreModules: [
      { title: 'Loan Origination & EMI Tracker', desc: 'Dynamic principal/interest calculators with automated monthly amortization schedules.', iconText: '📊' },
      { title: 'KYC & Document Verification', desc: 'Encrypted document upload vault for Aadhaar, PAN, and bank statement verification.', iconText: '🪪' },
      { title: 'GST-Compliant Automated Invoicing', desc: 'Generate multi-currency GST invoices with automated tax breakdown and thermal printing.', iconText: '🧾' },
      { title: 'Payment Gateway & Escrow Sync', desc: 'Automated bank payout APIs, virtual account creation, and UPI collection links.', iconText: '🏦' },
      { title: 'Investor & Portfolio Portal', desc: 'Interactive ROI graphs, dividend payout history, and financial summary reports.', iconText: '📈' },
      { title: 'Immutable Audit Trail Logs', desc: 'Every financial entry is timestamped with user ID logs for 100% compliance audits.', iconText: '🛡️' }
    ],
    techStack: ['Node.js', 'PostgreSQL', '256-Bit AES Encryption', 'Docker Containers', 'AWS KMS Keys', 'Redis'],
    processSteps: [
      { step: '01', title: 'Financial Architecture & Security Blueprint', desc: 'We define the transaction models, compliance constraints, and cryptographic policies.' },
      { step: '02', title: 'Double-Entry Ledger Design', desc: 'We architect a mathematical double-entry bookkeeping engine with zero rounding errors.' },
      { step: '03', title: 'Security & Penetration Testing', desc: 'We execute vulnerability checks, SQL injection prevention, and API hardening.' },
      { step: '04', title: 'Compliant Cloud Deployment', desc: 'We deploy on isolated AWS VPC networks with automated daily disaster recovery backups.' }
    ],
    faqs: [
      { q: 'How do you ensure data confidentiality for financial records?', a: 'All sensitive data is encrypted using AES-256 at rest and TLS 1.3 in transit, with strict multi-factor authentication (MFA) requirements.' },
      { q: 'Can the software automatically calculate GST and generate reports?', a: 'Yes! It calculates SGST, CGST, and IGST automatically and exports GSTR-1 ready CSV and JSON files.' },
      { q: 'Can we integrate automated bank payout APIs?', a: 'Yes, we integrate ICICI, RazorpayX, and Cashfree payout APIs for instant beneficiary disbursements.' }
    ]
  },

  'agriculture': {
    title: 'AgriTech & Farm Management Platforms',
    industry: 'Agriculture',
    metaTitle: 'AgriTech Software & Portal Development in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Best AgriTech software development company in Bhopal. Mandi price broadcast systems, farmer-to-buyer marketplaces, and cold storage inventory ERP.',
    headline: 'AgriTech Platforms & Smart Mandi Supply Chain Systems',
    emoji: '🌾',
    heroBadge: 'Vernacular & High Impact',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-4 Weeks',
    summary: 'Empower farmers, Mandi traders, and agribusinesses with custom AgriTech solutions developed by Mahi TechnoCrafts. We build daily Mandi rate broadcasters, farmer onboarding apps with Hindi voice prompts, and cold storage inventory log systems.',
    painPoints: [
      {
        problem: 'Farmers lacking access to real-time Mandi commodity rates.',
        solution: 'Automated WhatsApp and SMS daily price broadcast system based on regional Mandis.'
      },
      {
        problem: 'Middlemen taking high cuts between growers and bulk buyers.',
        solution: 'Direct B2B farmer-to-buyer digital marketplace with transparent bidding.'
      },
      {
        problem: 'Spoilage in cold storage due to poor tracking of perishable lots.',
        solution: 'Digital shelf-life tracker with temperature alerts and lot dispatch queues.'
      }
    ],
    coreModules: [
      { title: 'Live Mandi Price Dashboard', desc: 'Real-time daily rates for wheat, soybean, gram, and vegetables across Madhya Pradesh Mandis.', iconText: '🌾' },
      { title: 'Direct Farmer Marketplace', desc: 'Farmers list produce with quality photos, expected quantity, and minimum bid prices.', iconText: '🤝' },
      { title: 'Vernacular Multi-Language Interface', desc: 'Complete Hindi and English bilingual support with voice search capabilities.', iconText: '🗣️' },
      { title: 'Cold Storage & Warehouse ERP', desc: 'Track gunny bags, chamber locations, inward weight, and automated farmer storage receipts.', iconText: '❄️' },
      { title: 'Fertilizer & Seed Store Billing', desc: 'POS system for agro-dealers with batch tracking and government subsidy record keeping.', iconText: '🌱' },
      { title: 'Weather & Crop Advisory System', desc: 'Automated weather alert forecasts and pest disease remedy guides.', iconText: '🌦️' }
    ],
    techStack: ['Next.js (Lightweight PWA)', 'Node.js', 'PostgreSQL', 'WhatsApp Cloud API', 'AWS Cloud'],
    processSteps: [
      { step: '01', title: 'Agri-Workflow Mapping', desc: 'We map your target commodity supply chain, Mandi processes, and farmer interaction touchpoints.' },
      { step: '02', title: 'Vernacular Hindi UI Design', desc: 'We design large, clear visual buttons with high contrast for outdoor sunlight usage.' },
      { step: '03', title: 'Marketplace & SMS Sync', desc: 'We build the trade bidding portal and connect bulk SMS/WhatsApp gateways.' },
      { step: '04', title: 'Field Launch & Farmer Onboarding', desc: 'We deploy lightweight Progressive Web Apps (PWAs) that work even on low 2G/3G speeds.' }
    ],
    faqs: [
      { q: 'Will the app work on basic smartphones and slow mobile internet?', a: 'Yes! We build ultra-lightweight Progressive Web Apps (PWAs) optimized to load in under 1 second even on 2G/3G rural networks.' },
      { q: 'Is the platform available in Hindi language?', a: 'Yes, we provide full Hindi vernacular interfaces so farmers and rural traders can navigate with zero difficulties.' },
      { q: 'Can cold storage owners manage farmer receipts and billing?', a: 'Yes, our cold storage module generates instant digital receipts with gunny bag counts and calculates storage rent automatically.' }
    ]
  },

  'hospitality': {
    title: 'Hotel, Resort & Travel Booking Portals',
    industry: 'Hospitality & Tourism',
    metaTitle: 'Hotel & Resort Direct Booking Website in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Direct hotel and resort booking portals in Bhopal. 0% OTA commission, instant advance UPI payments, guest ID verification, and seasonal tour packages.',
    headline: '0% Commission Direct Hotel & Resort Booking Portals',
    emoji: '🏨',
    heroBadge: 'Save 20-30% OTA Fees',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '2-3 Weeks',
    summary: 'Stop losing 20-30% of your room revenues to online travel agencies. We build direct hotel booking websites with instant UPI payments, real-time room availability calendars, guest digital KYC, and automated check-in WhatsApp alerts.',
    painPoints: [
      { problem: 'High OTA commissions eating hotel margins.', solution: 'Direct booking website capturing 100% of room revenues in your bank account.' },
      { problem: 'Double bookings caused by manual telephone register logs.', solution: 'Centralized live room calendar synced with instant payment confirmations.' },
      { problem: 'Slow check-in counter lines.', solution: 'Mobile guest check-in with digital Aadhaar/Passport photo upload before arrival.' }
    ],
    coreModules: [
      { title: 'Direct Room Booking & Live Calendar', desc: 'Guests select check-in/out dates, pick deluxe/suite rooms, and pay advance.', iconText: '📅' },
      { title: '1-Click UPI & Card Payment Gateway', desc: 'Instant PhonePe, Google Pay, and credit card payments with instant invoices.', iconText: '💳' },
      { title: 'Digital Guest ID Verification (KYC)', desc: 'Guests upload ID proofs securely from their mobile phones before checking in.', iconText: '🪪' },
      { title: 'Automated Check-in WhatsApp Alerts', desc: 'Send booking vouchers, Google Maps directions, and Wi-Fi codes automatically.', iconText: '💬' }
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'PostgreSQL', 'WhatsApp Cloud API', 'AWS S3'],
    processSteps: [
      { step: '01', title: 'Room & Tariff Mapping', desc: 'We structure room categories, seasonal pricing, and amenity photo galleries.' },
      { step: '02', title: 'Luxury UI Design', desc: 'We design high-converting visual layouts showcasing your resort and amenities.' },
      { step: '03', title: 'Booking Engine & UPI Setup', desc: 'We integrate real-time room calendars, payment gateways, and WhatsApp triggers.' },
      { step: '04', title: 'Launch & Direct Traffic Setup', desc: 'We deploy the website with Google Hotel Search and Local SEO optimization.' }
    ],
    faqs: [
      { q: 'Can we accept advance token amounts instead of full payment?', a: 'Yes! You can configure 20%, 50%, or 100% advance deposit rules per booking.' },
      { q: 'Can guests upload their ID proof online?', a: 'Yes, guests can upload Aadhaar or driving license photos directly from their phone camera.' },
      { q: 'Does it support seasonal discount coupons?', a: 'Yes, you can create promo codes for holidays, corporate stays, and wedding events.' }
    ]
  },

  'fitness-salon': {
    title: 'Salon, Spa, Gym & Fitness Studio Apps',
    industry: 'Wellness & Fitness',
    metaTitle: 'Salon Appointment & Gym Management Software in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Complete appointment booking & gym membership software in Bhopal. Slot booking, member attendance, automated renewal reminders, and diet routines.',
    headline: 'Salon Slot Booking & Gym Membership Management Software',
    emoji: '💇',
    heroBadge: 'Zero Waiting Lines',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-3 Weeks',
    summary: 'Eliminate chaotic waiting chairs at salons and automate gym membership renewals. We build custom slot booking systems, QR code member attendance, automated monthly renewal WhatsApp alerts, and digital diet plan portals.',
    painPoints: [
      { problem: 'Crowded waiting sofas and lost haircut/spa clients.', solution: 'Online slot booking allowing clients to pick their preferred stylist and time.' },
      { problem: 'Missed monthly gym fee renewals and expired memberships.', solution: 'Automated WhatsApp payment links sent 3 days before renewal expiry.' },
      { problem: 'Manual paper registers for member entry tracking.', solution: '1-second QR code scan check-in on the gym reception tablet.' }
    ],
    coreModules: [
      { title: 'Beauty & Haircut Slot Booking', desc: 'Select beauty service, pick stylist, and book available time slots in 30 seconds.', iconText: '✂️' },
      { title: 'Gym Membership Auto-Renewals', desc: 'Track 1-month, 3-month, and annual plans with automated WhatsApp reminders.', iconText: '💪' },
      { title: 'QR Code Attendance Tracker', desc: 'Members scan reception QR code from their phone for instant entry logging.', iconText: '📱' },
      { title: 'Custom Workout & Diet PDF Portal', desc: 'Trainers assign workout charts and diet plans accessible on client phones.', iconText: '🥗' }
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'MongoDB Atlas', 'WhatsApp Cloud API', 'Razorpay'],
    processSteps: [
      { step: '01', title: 'Service & Package Structuring', desc: 'We list your services, staff stylists, gym membership tiers, and pricing.' },
      { step: '02', title: 'Mobile-First UI Design', desc: 'We design a clean, modern interface optimized for one-hand smartphone booking.' },
      { step: '03', title: 'Slot Engine & WhatsApp Sync', desc: 'We build the slot scheduler and connect automated WhatsApp notifications.' },
      { step: '04', title: 'Launch & Reception Training', desc: 'We train your front-desk staff to manage appointments in under 10 minutes.' }
    ],
    faqs: [
      { q: 'Can clients pay for services in advance?', a: 'Yes! You can enable full advance payment, token advance, or "Pay at Counter" option.' },
      { q: 'Can trainers update workout plans for each member?', a: 'Yes, trainers get an easy dashboard to assign customized exercise charts and calorie goals.' },
      { q: 'Will members get reminder messages before their subscription expires?', a: 'Yes, automated WhatsApp and SMS alerts with UPI payment links are sent automatically.' }
    ]
  },

  'automobile': {
    title: 'Automobile Garage, Detailing & EV Software',
    industry: 'Automotive & EV',
    metaTitle: 'Car Garage & Automobile Repair Software in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Digital car repair job cards, vehicle service WhatsApp reminders, spare parts billing POS, and EV charging station slot booking software in Bhopal.',
    headline: 'Digital Garage Job Cards & Vehicle Service Reminder Software',
    emoji: '🚗',
    heroBadge: '3x Repeat Service Calls',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-3 Weeks',
    summary: 'Upgrade your auto workshop, detailing studio, or EV charging station with smart digital workflows. We build digital vehicle job cards with damage photos, automated service due WhatsApp alerts, spare parts inventory POS, and EV slot reservation apps.',
    painPoints: [
      { problem: 'Paper job cards getting lost or dirty in workshops.', solution: 'Digital job card logged on phone with before/after photos and parts estimate.' },
      { problem: 'Customers forgetting their 6-month vehicle service schedule.', solution: 'Automated WhatsApp reminder sent based on last service date and mileage.' },
      { problem: 'Disputes over spare parts charges and billing estimates.', solution: 'Itemized digital GST estimate approved by client on WhatsApp before repair.' }
    ],
    coreModules: [
      { title: 'Digital Vehicle Repair Job Cards', desc: 'Log vehicle number, fuel level, scratch photos, and requested service items.', iconText: '📋' },
      { title: 'Automated Service Due WhatsApp Alerts', desc: 'Send reminders for oil change, wheel alignment, and insurance expiry.', iconText: '🔔' },
      { title: 'Spare Parts Inventory & GST Billing', desc: 'Track stock of lubricants, filters, and brake pads with 1-click GST invoice printing.', iconText: '🛠️' },
      { title: 'Live Vehicle Repair Status Tracker', desc: 'Customers track job progress (Washing > Mechanical > Polish > Ready) on their phone.', iconText: '🚗' }
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'PostgreSQL', 'WhatsApp Cloud API', 'AWS S3'],
    processSteps: [
      { step: '01', title: 'Garage Workflow Audit', desc: 'We map your intake, technician assignment, spare parts usage, and billing flow.' },
      { step: '02', title: 'Workshop Dashboard Setup', desc: 'We configure job card templates, parts catalog, and service rate lists.' },
      { step: '03', title: 'WhatsApp Alert Automation', desc: 'We connect automated service alerts and customer approval triggers.' },
      { step: '04', title: 'Go-Live & Mechanic Training', desc: 'We train your mechanics and front-desk team to log job cards on mobile.' }
    ],
    faqs: [
      { q: 'Can we attach photos of vehicle scratches to avoid disputes?', a: 'Yes! Mechanics can take up to 10 photos of the vehicle at intake and save them to the job card.' },
      { q: 'Can customers approve repair estimates via WhatsApp?', a: 'Yes, the client receives a detailed PDF estimate on WhatsApp with an "Approve" button.' },
      { q: 'Does it manage spare parts stock and reorder alerts?', a: 'Yes, it automatically deducts parts used during service and notifies you when stock runs low.' }
    ]
  },

  'legal-consulting': {
    title: 'Lawyer, CA & Professional Consulting Portals',
    industry: 'Legal & Professional Services',
    metaTitle: 'Lawyer Case Diary & CA Practice Software in Bhopal | Mahi TechnoCrafts',
    metaDescription: 'Court case hearing diary, confidential document vault, client consultation booking, and 80G NGO donation portals developed in Bhopal.',
    headline: 'Confidential Client Case Diaries & Practice Management Portals',
    emoji: '⚖️',
    heroBadge: '100% Encrypted & Private',
    priceHook: 'Starting from ₹2,999*',
    deliveryTime: '1-3 Weeks',
    summary: 'Professional practice management systems for advocates, Chartered Accountants, and NGOs. We build next hearing date automated alerts, encrypted client case vaults, 1-click consultation booking, and automated 80G tax exemption donation receipts.',
    painPoints: [
      { problem: 'Missed court hearing dates and chaotic paper diaries.', solution: 'Digital case diary with automated WhatsApp hearing reminders the evening before.' },
      { problem: 'Unsecured client financial and legal documents on WhatsApp.', solution: 'Bank-grade encrypted client vault with password-protected document downloads.' },
      { problem: 'Time lost on manual consultation fee follow-ups.', solution: '1-Click consultation booking with advance token fee collection.' }
    ],
    coreModules: [
      { title: 'Digital Court Case Hearing Diary', desc: 'Log case number, court room, judge, opposing counsel, and next hearing dates.', iconText: '⚖️' },
      { title: 'Bank-Grade Client Document Vault', desc: 'Store petitions, balance sheets, and audit reports with 256-bit AES encryption.', iconText: '🔒' },
      { title: 'Online Paid Consultation Scheduler', desc: 'Clients pick 30-min or 60-min video/in-office consultation slots with UPI payment.', iconText: '📅' },
      { title: 'Instant 80G NGO Donation Receipts', desc: 'Generate instant tax-exempt 80G donation receipts for non-profit organizations.', iconText: '📜' }
    ],
    techStack: ['Next.js 15', 'Tailwind CSS', 'PostgreSQL (Encrypted)', 'WhatsApp Cloud API', 'AWS S3'],
    processSteps: [
      { step: '01', title: 'Practice Workflow Mapping', desc: 'We structure your case categories, document requirements, and consultation fees.' },
      { step: '02', title: 'Prestigious & Trustworthy UI', desc: 'We design an authoritative, premium digital presence reflecting your legal expertise.' },
      { step: '03', title: 'Encrypted Vault & Diary Setup', desc: 'We build encrypted storage and sync automated calendar hearing reminders.' },
      { step: '04', title: 'Launch & Security Audit', desc: 'We perform end-to-end security audits to ensure 100% client data confidentiality.' }
    ],
    faqs: [
      { q: 'Is client case data kept 100% private and encrypted?', a: 'Yes, all case files and client records are stored with 256-bit AES bank-grade encryption with zero third-party access.' },
      { q: 'Will advocates get automated alerts before court hearing dates?', a: 'Yes, an automated WhatsApp summary of tomorrow\'s court hearings is sent every evening at 8 PM.' },
      { q: 'Can clients pay consultation fees before booking an appointment?', a: 'Yes, clients pay via UPI (GPay/PhonePe) to confirm their consultation slot on your calendar.' }
    ]
  }
};

// Aliases for alternate route slugs
solutionDetailsMap['retail-ecommerce'] = solutionDetailsMap['ecommerce'];
solutionDetailsMap['realestate'] = solutionDetailsMap['real-estate'];

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const details = solutionDetailsMap[slug];

  if (!details) {
    return {
      title: 'Industry Solution | Mahi TechnoCrafts',
      description: 'Custom software solutions for every business industry.'
    };
  }

  return {
    title: details.metaTitle,
    description: details.metaDescription,
    alternates: {
      canonical: `https://mahitechnocrafts.in/solutions/${slug}`
    },
    openGraph: {
      title: details.metaTitle,
      description: details.metaDescription,
      url: `https://mahitechnocrafts.in/solutions/${slug}`,
      type: 'website'
    }
  };
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const details = solutionDetailsMap[slug];

  if (!details) {
    notFound();
  }

  const data = await getSiteData();

  // JSON-LD Breadcrumb Schema
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
        name: 'Solutions',
        item: 'https://mahitechnocrafts.in/solutions'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: details.title,
        item: `https://mahitechnocrafts.in/solutions/${slug}`
      }
    ]
  };

  // JSON-LD Service Schema for AEO / AI Search Engines
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: details.title,
    serviceType: `${details.industry} Software Development`,
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

  // JSON-LD FAQ Schema
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
      {/* Dynamic JSON-LD Structured Data */}
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
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide mb-8 overflow-x-auto whitespace-nowrap bg-white dark:bg-slate-900 py-3 px-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm select-none">
            <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <Link href="/solutions" className="hover:text-sky-600 transition-colors">Solutions</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-800 dark:text-white font-bold">{details.title}</span>
          </nav>

          {/* Back button */}
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 hover:text-sky-800 transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to All Solutions
          </Link>

          {/* Hero Header Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            
            {/* Left Main Banner */}
            <div className="lg:col-span-8 space-y-7 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-500 via-purple-500 to-emerald-500" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                    <Sparkles size={11} className="text-purple-500 animate-spin" />
                    {details.heroBadge}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {details.priceHook}
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  {details.headline}
                </h1>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-3xl">
                {details.emoji}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                {details.summary}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing</span>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{details.priceHook}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Delivery Speed</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{details.deliveryTime}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Support</span>
                  <span className="text-xs font-bold text-emerald-600">24/7 Dedicated</span>
                </div>
              </div>
            </div>

            {/* Right Sidebar Consultation Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl space-y-6 flex flex-col justify-between border border-slate-800 relative overflow-hidden">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">
                  Free 30-Min Strategy Call
                </span>
                
                <h3 className="font-display font-bold text-xl tracking-tight text-white">
                  Get a Free Custom Proposal & Wireframe
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discuss your business requirements with our lead technical architect near Hamidia Road, Bhopal. Get an exact timeline and discount estimate in 24 hours.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-3 text-slate-300">
                  <PhoneCall size={15} className="text-sky-400 flex-shrink-0" />
                  <a href="tel:+916267144122" className="hover:text-white font-semibold">+91 6267144122</a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MessageSquare size={15} className="text-sky-400 flex-shrink-0" />
                  <a href="mailto:support@mahitechnocrafts.in" className="hover:text-white font-semibold">support@mahitechnocrafts.in</a>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck size={15} className="text-emerald-400 flex-shrink-0" />
                  <span>100% Confidentiality & Non-Disclosure</span>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 font-bold text-xs uppercase tracking-wider text-center text-white rounded-xl shadow-xl shadow-sky-500/20 transition-all block mt-2"
              >
                Claim Free Custom Quote
              </Link>
            </div>
          </div>

          {/* Problem vs Solution Transformation */}
          <div className="mb-16 space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Industry Challenges vs. <span className="text-gradient">Our High-Tech Solution</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                How we eliminate operational friction and accelerate revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {details.painPoints.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full">
                      The Challenge
                    </span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.problem}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      Mahi Solution
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.solution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Modules Grid */}
          <div className="mb-16 space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                Core Modules & <span className="text-gradient">Feature Suite</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Built modularly so you can scale from day one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {details.coreModules.map((module, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40 shadow-sm hover:shadow-xl transition-all duration-200 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                    {module.iconText}
                  </div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {module.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Roadmap */}
          <div className="mb-16 p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <div className="text-left space-y-2">
              <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                4-Step Development & <span className="text-gradient">Launch Roadmap</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Transparent milestones with zero surprise delays.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {details.processSteps.map((step, idx) => (
                <div key={idx} className="space-y-3 relative">
                  <span className="text-3xl font-display font-black text-sky-600/30 dark:text-sky-400/30">
                    {step.step}
                  </span>
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Quality & Guarantees Strip */}
          <div className="mb-16 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="text-emerald-500 flex-shrink-0" size={22} />
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">Included In Every Solution Package:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                '🛡️ 6 Months Free Maintenance',
                '⚡ 24/7 Priority Tech Support',
                '🤖 AI & WhatsApp Automation',
                '⚡ Sub-1s Mobile Speed',
                '🔒 Bank-Grade SSL & Security',
                '📱 100% Mobile Phone Ready',
                '💳 1-Click UPI Payment Sync',
                '🔍 Google #1 Local SEO Setup',
                '🤝 100% Full Code Ownership'
              ].map((feat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 shadow-sm"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mb-16 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-8 flex items-center gap-2">
              <HelpCircle className="text-sky-600" size={22} />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {details.faqs.map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-left space-y-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Q: {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Conversion CTA */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-700 to-purple-800 text-white text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-display font-black">
              Ready to Launch Your {details.industry} Platform?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Join 150+ companies who chose Mahi TechnoCrafts. Get your custom scope, prototype, and discounted quote starting from ₹2,999* with 6 months free maintenance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/contact"
                className="px-8 py-4 bg-white hover:bg-slate-100 text-sky-700 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all"
              >
                Schedule Free Strategy Call
              </Link>
              <a
                href="https://wa.me/916267144122?text=Hi%20Mahi%20TechnoCrafts,%20I%20want%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                Instant WhatsApp Chat
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'healthcare' },
    { slug: 'ecommerce' },
    { slug: 'retail-ecommerce' },
    { slug: 'ai-solutions' },
    { slug: 'real-estate' },
    { slug: 'realestate' },
    { slug: 'agriculture' },
    { slug: 'restaurants' },
    { slug: 'education' },
    { slug: 'manufacturing' },
    { slug: 'finance' },
    { slug: 'hospitality' },
    { slug: 'fitness-salon' },
    { slug: 'automobile' },
    { slug: 'legal-consulting' },
  ];
}
