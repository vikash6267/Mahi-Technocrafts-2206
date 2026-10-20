import { ClientProposal } from './db';

export const DEFAULT_COMPANY_DETAILS = {
  companyName: 'Mahi TechnoCrafts',
  companyTagline: 'Engineering Digital Excellence & Scalable Software',
  companyAddress: 'Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, Madhya Pradesh, India - 462001',
  companyEmail: 'contact@mahitechnocrafts.in',
  companyPhone: '+91 62671 44122',
  companyWebsite: 'https://mahitechnocrafts.in',
  companyLogoUrl: '/logo.png',
  companyGst: '',
  signatoryName: 'Vikash Maheshwari',
  signatoryDesignation: 'Founder & Technical Director'
};

export const DEFAULT_DISPLAY_OPTIONS = {
  showLogo: true,
  showCompanyDetails: true,
  showGst: true,
  showClientDetails: true,
  showOverview: true,
  showScopeOfWork: true,
  showTechStack: true,
  showPricingTable: true,
  showMilestones: true,
  showTermsAndConditions: true,
  showSignatures: true,
  showCompanySignatory: true,
  showClientSignatory: true,
  showCopyrightFooter: true
};

export const SAMPLE_PROPOSAL_JSON = {
  proposalNumber: "MTC-PROP-2026-1088",
  title: "Full-Stack Web Portal & E-Commerce Application",
  category: "web_development",
  status: "sent",
  clientName: "Rajesh Kumar",
  clientCompany: "Apex Innovations Pvt Ltd",
  clientEmail: "rajesh@apexinnovations.in",
  clientPhone: "+91 98765 43210",
  clientAddress: "Zone-II, MP Nagar, Bhopal, MP - 462011",
  companyName: "Mahi TechnoCrafts",
  companyTagline: "Engineering Digital Excellence & Scalable Software",
  companyAddress: "Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, Madhya Pradesh, India - 462001",
  companyEmail: "contact@mahitechnocrafts.in",
  companyPhone: "+91 62671 44122",
  companyWebsite: "https://mahitechnocrafts.in",
  companyLogoUrl: "/logo.png",
  companyGst: "",
  proposalDate: "2026-10-20",
  validUntil: "2026-11-05",
  overview: "Mahi TechnoCrafts proposes designing and engineering an enterprise-grade digital web portal with sub-second page speeds, seamless payment gateway integrations, and self-service administrative controls.",
  scopeOfWork: [
    "Complete UI/UX Figma wireframes & interactive prototypes",
    "Next.js 16 high-performance responsive web application",
    "Secure REST APIs & role-based authentication (RBAC)",
    "Payment Gateway integration (Razorpay / UPI / Cards)",
    "Admin Dashboard for user management & live analytics",
    "Cloud VPS deployment, SSL certificate & daily backups"
  ],
  techStack: {
    frontend: ["Next.js 16", "React 19", "Tailwind CSS"],
    backend: ["Node.js", "Server Actions", "REST APIs"],
    database: ["MongoDB Atlas", "Redis Cache"],
    cloudHosting: ["AWS / Cloud VPS", "Cloudflare CDN", "SSL"]
  },
  currency: "INR",
  items: [
    {
      id: "item_1",
      name: "UI/UX Architecture & Figma Prototype",
      description: "User journey mapping, mobile-first responsive wireframes and design system.",
      qty: 1,
      rate: 15000,
      amount: 15000
    },
    {
      id: "item_2",
      name: "Frontend Application Engineering",
      description: "Next.js responsive web application, fast page transitions and customer portal.",
      qty: 1,
      rate: 30000,
      amount: 30000
    },
    {
      id: "item_3",
      name: "Backend APIs & Payment Gateway",
      description: "Secure database, Razorpay integration, automated PDF invoices and alerts.",
      qty: 1,
      rate: 20000,
      amount: 20000
    },
    {
      id: "item_4",
      name: "Deployment, SSL & Speed Optimization",
      description: "Production server setup, SSL security, CDN and Google 90+ score optimization.",
      qty: 1,
      rate: 10000,
      amount: 10000
    }
  ],
  subtotal: 75000,
  discount: 5000,
  taxRate: 18,
  taxAmount: 12600,
  grandTotal: 82600,
  projectDuration: "4 to 6 Weeks",
  milestones: [
    {
      phase: "Phase 1: Architecture & UI/UX Sign-off",
      duration: "Week 1 - 2",
      deliverables: "Technical blueprint, database schema, and Figma layout approval.",
      percentage: 30
    },
    {
      phase: "Phase 2: Core Development & Integration",
      duration: "Week 3 - 4",
      deliverables: "Frontend screens, backend APIs, client portal, and payment sandbox.",
      percentage: 40
    },
    {
      phase: "Phase 3: QA, Beta Staging & Go-Live",
      duration: "Week 5 - 6",
      deliverables: "Security testing, production rollout, and staff training.",
      percentage: 30
    }
  ],
  terms: {
    paymentTerms: [
      "30% Advance deposit upon contract signing to initiate project.",
      "40% Milestone payment upon demonstration of core development on staging.",
      "30% Final balance payment before production deployment and code handover."
    ],
    warrantySupport: "90 Days complimentary post-launch technical warranty covering bug fixes.",
    validityDays: 15,
    clientObligations: [
      "Provide brand assets, images, and content in a timely manner.",
      "Designate a single primary point of contact for milestone approvals."
    ]
  },
  signatoryName: "Vikash Maheshwari",
  signatoryDesignation: "Founder & Technical Director",
  clientSignatoryName: "Rajesh Kumar",
  displayOptions: {
    showLogo: true,
    showCompanyDetails: true,
    showGst: false,
    showClientDetails: true,
    showOverview: true,
    showScopeOfWork: true,
    showTechStack: true,
    showPricingTable: true,
    showMilestones: true,
    showTermsAndConditions: true,
    showSignatures: true,
    showCompanySignatory: true,
    showClientSignatory: true,
    showCopyrightFooter: true
  },
  notes: "All intellectual property rights will be transferred upon final invoice settlement."
};

/**
 * Converts numeric amount into readable Indian currency words
 */
export function formatIndianCurrencyWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return 'Zero Rupees Only';

  const singleDigits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teenDigits = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];
  const tensDigits = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(num: number): string {
    if (num < 10) return singleDigits[num];
    if (num < 20) return teenDigits[num - 10];
    return `${tensDigits[Math.floor(num / 10)]} ${singleDigits[num % 10]}`.trim();
  }

  function convertThreeDigits(num: number): string {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    let res = '';
    if (hundred > 0) res += `${singleDigits[hundred]} Hundred `;
    if (rest > 0) res += convertTwoDigits(rest);
    return res.trim();
  }

  const rounded = Math.round(amount);
  const crore = Math.floor(rounded / 10000000);
  const lakh = Math.floor((rounded % 10000000) / 100000);
  const thousand = Math.floor((rounded % 100000) / 1000);
  const remainder = rounded % 1000;

  let words = '';
  if (crore > 0) words += `${convertTwoDigits(crore)} Crore `;
  if (lakh > 0) words += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand > 0) words += `${convertTwoDigits(thousand)} Thousand `;
  if (remainder > 0) words += convertThreeDigits(remainder);

  return `${words.trim()} Rupees Only`;
}

/**
 * Auto-generate a sequential reference number
 */
export function generateProposalNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MTC-PROP-${year}-${random}`;
}

/**
 * Pre-defined Industry Proposal Templates
 */
export const PROPOSAL_TEMPLATES: Record<
  string,
  {
    name: string;
    description: string;
    data: Omit<ClientProposal, 'id' | 'createdAt' | 'updatedAt' | 'clientName' | 'clientCompany' | 'clientEmail' | 'clientPhone'>;
  }
> = {
  web_development: {
    name: 'Custom Web Development & Portal',
    description: 'High-performance Next.js web application, interactive UI/UX, database architecture, and SEO setup.',
    data: {
      proposalNumber: '',
      title: 'Enterprise Web Application & Portal Development Proposal',
      category: 'web_development',
      status: 'draft',
      ...DEFAULT_COMPANY_DETAILS,
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      overview:
        'Mahi TechnoCrafts is pleased to submit this comprehensive proposal for designing, engineering, and deploying a bespoke web platform tailored to enhance your digital presence, customer engagement, and business operations. Our architectural approach guarantees lightning-fast speed, bulletproof security, modern mobile responsiveness, and effortless administrative control.',
      scopeOfWork: [
        'Complete UI/UX Design System with interactive wireframes and Figma prototypes.',
        'High-performance Next.js & React frontend with responsive cross-device layout.',
        'Scalable REST / GraphQL API layer with secure role-based authentication.',
        'Custom Admin Dashboard for self-service content and user management.',
        'Integrated Contact / Inquiry workflows with automated Email & WhatsApp alerts.',
        'Comprehensive On-Page SEO optimization, schema markup, and Google Analytics setup.',
        'Production cloud deployment on secure servers with automated daily backups & SSL.'
      ],
      techStack: {
        frontend: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Framer Motion'],
        backend: ['Node.js', 'Next.js Server Actions', 'REST APIs'],
        database: ['MongoDB Atlas', 'PostgreSQL / Redis'],
        cloudHosting: ['VPS / AWS EC2', 'Cloudflare CDN', 'Nginx Reverse Proxy'],
        tools: ['Git / GitHub', 'Figma', 'Postman']
      },
      currency: 'INR',
      items: [
        {
          id: 'item_1',
          name: 'UI/UX Research & Design System',
          description: 'Figma interactive prototypes, brand typography, component library, and responsive design systems.',
          qty: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: 'item_2',
          name: 'Frontend Application Engineering',
          description: 'Next.js responsive web application, fast page transitions, client portals, and dynamic pages.',
          qty: 1,
          rate: 28000,
          amount: 28000
        },
        {
          id: 'item_3',
          name: 'Backend API & Database Architecture',
          description: 'Secure API endpoints, database indexing, user authentication, and data integrity layers.',
          qty: 1,
          rate: 22000,
          amount: 22000
        },
        {
          id: 'item_4',
          name: 'Admin Dashboard & Lead Management',
          description: 'Protected administrative control center for content, inquiry management, and analytics.',
          qty: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: 'item_5',
          name: 'Deployment, SSL & Speed Optimization',
          description: 'Server provisioning, SSL certificates, Cloudflare CDN integration, and Google Lighthouse 90+ score audit.',
          qty: 1,
          rate: 10000,
          amount: 10000
        }
      ],
      subtotal: 90000,
      discount: 10000,
      taxRate: 18,
      taxAmount: 14400,
      grandTotal: 94400,
      projectDuration: '4 to 6 Weeks',
      milestones: [
        {
          phase: 'Phase 1: Discovery & UI/UX Wireframing',
          duration: 'Week 1 - 2',
          deliverables: 'Architecture blueprint, Figma wireframes & client visual sign-off.',
          percentage: 30
        },
        {
          phase: 'Phase 2: Core Development & Database Integration',
          duration: 'Week 3 - 4',
          deliverables: 'Frontend screens, backend APIs, authentication, and database schemas.',
          percentage: 40
        },
        {
          phase: 'Phase 3: QA, Beta Staging & Handover',
          duration: 'Week 5 - 6',
          deliverables: 'Cross-browser testing, SEO audit, client review, live production deployment, and 90-day support kickoff.',
          percentage: 30
        }
      ],
      terms: {
        paymentTerms: [
          '30% Advance deposit upon contract signing to initiate discovery and UI/UX design.',
          '40% Milestone payment upon completion of core development & staging demo presentation.',
          '30% Final balance payment prior to production deployment, DNS cutover, and source code delivery.'
        ],
        warrantySupport: '90 Days complimentary post-launch technical warranty covering bug fixes and maintenance.',
        validityDays: 15,
        clientObligations: [
          'Provide brand visual assets, text copy, and corporate collateral in a timely manner.',
          'Designate a single primary point of contact for milestone approvals within 48-72 hours.'
        ],
        extraClauses: [
          'Any additional feature additions beyond the agreed scope will be estimated separately in change requests.',
          'Annual domain & third-party cloud hosting subscriptions will be billed directly or renewed separately.'
        ]
      },
      notes: 'All source code, database structures, and assets will be transferred with 100% intellectual property ownership upon final invoice settlement.'
    }
  },

  mobile_app: {
    name: 'Mobile App Development (iOS & Android)',
    description: 'Cross-platform native mobile app with offline synchronization, push notifications, and store deployment.',
    data: {
      proposalNumber: '',
      title: 'Cross-Platform Mobile App (iOS & Android) Development Proposal',
      category: 'mobile_app',
      status: 'draft',
      ...DEFAULT_COMPANY_DETAILS,
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      overview:
        'This proposal outlines the strategy, architecture, and timeline for developing a high-performance cross-platform mobile application for Android and iOS. Built with state-of-the-art native technology, the app will offer fluid user interaction, real-time push notifications, offline cache capabilities, and seamless backend integration.',
      scopeOfWork: [
        'Complete mobile UI/UX design compliant with Apple Human Interface & Google Material 3 standards.',
        'Single-codebase cross-platform mobile app for iOS (App Store) and Android (Google Play Store).',
        'Secure user authentication (Mobile OTP, Google Sign-in, Apple ID).',
        'Push notifications system via Firebase Cloud Messaging (FCM).',
        'Real-time cloud database synchronization and offline caching.',
        'Admin backend panel for managing mobile users, content, and notification broadcasts.',
        'Full submission and approval assistance on Apple App Store & Google Play Store.'
      ],
      techStack: {
        frontend: ['Flutter / React Native', 'Tailwind / NativeWind', 'Redux / Zustand'],
        backend: ['Node.js', 'Express / Next.js APIs', 'Firebase'],
        database: ['MongoDB', 'Redis', 'SQLite / Hive Local Cache'],
        cloudHosting: ['AWS EC2 / DigitalOcean', 'Firebase Cloud Messaging'],
        tools: ['Xcode', 'Android Studio', 'Figma', 'Fastlane']
      },
      currency: 'INR',
      items: [
        {
          id: 'item_1',
          name: 'Mobile UX/UI Design & Micro-interactions',
          description: 'Design of all mobile screens, interactive Figma prototypes, and icon design.',
          qty: 1,
          rate: 25000,
          amount: 25000
        },
        {
          id: 'item_2',
          name: 'Mobile App Frontend Architecture',
          description: 'Cross-platform app development with native modules, camera/location integrations, and state management.',
          qty: 1,
          rate: 45000,
          amount: 45000
        },
        {
          id: 'item_3',
          name: 'Backend APIs & Notification Engine',
          description: 'Secure REST APIs, OTP SMS gateway, user profiles, and Firebase push notifications.',
          qty: 1,
          rate: 30000,
          amount: 30000
        },
        {
          id: 'item_4',
          name: 'Admin Control Center',
          description: 'Web dashboard for administrators to view app metrics, user records, and broadcast messages.',
          qty: 1,
          rate: 20000,
          amount: 20000
        },
        {
          id: 'item_5',
          name: 'Play Store & App Store Publishing',
          description: 'Store assets creation, signing keys configuration, and compliance review assistance.',
          qty: 1,
          rate: 15000,
          amount: 15000
        }
      ],
      subtotal: 135000,
      discount: 15000,
      taxRate: 18,
      taxAmount: 21600,
      grandTotal: 141600,
      projectDuration: '6 to 8 Weeks',
      milestones: [
        {
          phase: 'Phase 1: Wireframing & Interactive Prototype',
          duration: 'Week 1 - 2',
          deliverables: 'User journey maps, screen designs, and clickable mobile prototypes.',
          percentage: 30
        },
        {
          phase: 'Phase 2: Alpha App Build & API Integrations',
          duration: 'Week 3 - 5',
          deliverables: 'Functional alpha APK / TestFlight build with working authentication and core features.',
          percentage: 40
        },
        {
          phase: 'Phase 3: Beta Testing, Store Launch & Handover',
          duration: 'Week 6 - 8',
          deliverables: 'End-to-end testing on physical devices, App Store & Google Play Store release.',
          percentage: 30
        }
      ],
      terms: {
        paymentTerms: [
          '30% Advance upon project commissioning.',
          '40% Upon delivery of working Alpha build (TestFlight / APK).',
          '30% Upon store approval and production deployment.'
        ],
        warrantySupport: '90 Days free maintenance and bug fix support included.',
        validityDays: 15,
        clientObligations: [
          'Provide active Apple Developer Account ($99/yr) and Google Play Console Account ($25 one-time).',
          'Provide SMS OTP gateway credentials (e.g. Twilio/Msg91).'
        ],
        extraClauses: [
          'Third-party API charges (SMS, Maps, Cloud Storage) are borne by the client.'
        ]
      },
      notes: 'Post-launch store updates and major OS compatibility updates can be covered under our annual maintenance plan.'
    }
  },

  ecommerce: {
    name: 'E-Commerce Online Store & Checkout Engine',
    description: 'Custom e-commerce store with product catalogue, payment gateway, inventory management, and invoice generation.',
    data: {
      proposalNumber: '',
      title: 'High-Converting E-Commerce Web Store Proposal',
      category: 'ecommerce',
      status: 'draft',
      ...DEFAULT_COMPANY_DETAILS,
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      overview:
        'This proposal details the design, development, and launch of an omnichannel E-Commerce platform built for maximum sales conversion. Featuring dynamic catalog filtering, multi-currency support, instantaneous checkout, automated Indian payment gateway integration (Razorpay / Cashfree), and an administrative inventory control suite.',
      scopeOfWork: [
        'Custom storefront design engineered for lightning-fast mobile shopping.',
        'Product management: Variants (size, color), stock tracking, and SKU management.',
        'Payment gateway integration: UPI, Credit/Debit Cards, NetBanking, and COD.',
        'Automated order confirmation emails, WhatsApp updates, and PDF invoice generation.',
        'Discount coupon system, flash sale banners, and customer cart recovery.',
        'Customer account portal with order history, address book, and tracking.',
        'Comprehensive shipping aggregator integration (Shiprocket / Delhivery / Pickrr).'
      ],
      techStack: {
        frontend: ['Next.js 16', 'Tailwind CSS', 'Redux / Zustand'],
        backend: ['Node.js', 'Razorpay SDK', 'Cashfree / Stripe'],
        database: ['MongoDB Atlas', 'Redis Session Cache'],
        cloudHosting: ['AWS EC2', 'Cloudflare CDN'],
        tools: ['Shiprocket API', 'WhatsApp Cloud API']
      },
      currency: 'INR',
      items: [
        {
          id: 'item_1',
          name: 'Storefront UI/UX & Brand Identity',
          description: 'High-conversion e-commerce layout, product cards, category navigation, and checkout UX.',
          qty: 1,
          rate: 20000,
          amount: 20000
        },
        {
          id: 'item_2',
          name: 'Catalog & Inventory Management Engine',
          description: 'Categories, multi-variant products, real-time stock alert thresholds, and search filters.',
          qty: 1,
          rate: 25000,
          amount: 25000
        },
        {
          id: 'item_3',
          name: 'Payment Gateway & Checkout Pipeline',
          description: 'Razorpay / Cashfree checkout, webhook handling, instant refunds, and automated PDF tax invoices.',
          qty: 1,
          rate: 20000,
          amount: 20000
        },
        {
          id: 'item_4',
          name: 'Shipping Integration & Order Tracking',
          description: 'Shiprocket / Delhivery courier API integration, automated AWB generation, and customer tracking.',
          qty: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: 'item_5',
          name: 'Admin Order & Revenue Dashboard',
          description: 'Complete sales analytics, customer records, coupon management, and exportable financial reports.',
          qty: 1,
          rate: 15000,
          amount: 15000
        }
      ],
      subtotal: 95000,
      discount: 10000,
      taxRate: 18,
      taxAmount: 15300,
      grandTotal: 100300,
      projectDuration: '4 to 6 Weeks',
      milestones: [
        {
          phase: 'Phase 1: Store Architecture & UI/UX Design',
          duration: 'Week 1 - 2',
          deliverables: 'Interactive store prototype, catalog taxonomy & layout approval.',
          percentage: 30
        },
        {
          phase: 'Phase 2: Storefront & Payment Integration',
          duration: 'Week 3 - 4',
          deliverables: 'Cart flow, payment gateway sandbox test, automated invoicing & coupon engines.',
          percentage: 40
        },
        {
          phase: 'Phase 3: Logistics Setup, QA & Go-Live',
          duration: 'Week 5 - 6',
          deliverables: 'Shipping aggregator configuration, load testing, production release, and admin training.',
          percentage: 30
        }
      ],
      terms: {
        paymentTerms: [
          '30% Advance on project kickoff.',
          '40% Upon staging store presentation with live test payment demonstration.',
          '30% Before DNS launch and live merchant credential deployment.'
        ],
        warrantySupport: '90 Days free maintenance & priority bug fix support.',
        validityDays: 15,
        clientObligations: [
          'Provide active Merchant KYC verified credentials for Razorpay / Cashfree / Stripe.',
          'Provide product images, descriptions, pricing, and tax (GST) rates.'
        ],
        extraClauses: [
          'Payment gateway transaction fees (approx. 2%) are charged directly by the gateway provider.'
        ]
      },
      notes: 'Includes full admin training via Google Meet for product additions and order processing.'
    }
  },

  custom_software: {
    name: 'Custom ERP / CRM & Business Automation',
    description: 'Tailored enterprise software with multi-role RBAC, client portals, billing, workflow automation, and audit logging.',
    data: {
      proposalNumber: '',
      title: 'Custom ERP & Business Workflow Automation System Proposal',
      category: 'custom_software',
      status: 'draft',
      ...DEFAULT_COMPANY_DETAILS,
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      overview:
        'This proposal outlines the engineering of an automated ERP & CRM software platform engineered to eliminate operational bottlenecks, centralize company data, manage client workflows, and provide management with real-time financial and operational intelligence.',
      scopeOfWork: [
        'Detailed business process mapping and workflow automation blueprint.',
        'Multi-tenant / Multi-role RBAC (Superadmin, Branch Manager, Staff, Client).',
        'Lead management, customer relationship pipeline, and quotation generator.',
        'Billing & Invoicing engine with automated payment reminders (Email/WhatsApp).',
        'Document repository with secure file uploads, role permissions, and digital records.',
        'Immutable audit activity logs for complete enterprise compliance and accountability.',
        'Executive business analytics: Revenue trends, staff performance, and profit margins.'
      ],
      techStack: {
        frontend: ['Next.js 16', 'React 19', 'Tailwind CSS', 'Radix UI'],
        backend: ['Node.js Enterprise Engine', 'Cron Automation Schedulers'],
        database: ['MongoDB Cluster / PostgreSQL', 'Redis Cache'],
        cloudHosting: ['Dedicated Cloud VPS / AWS', 'Automated Daily S3 Backups'],
        tools: ['Docker', 'Nginx', 'Winston Logger']
      },
      currency: 'INR',
      items: [
        {
          id: 'item_1',
          name: 'System Analysis & Architecture Design',
          description: 'Business logic mapping, database entity relationship diagrams, and role permission matrices.',
          qty: 1,
          rate: 25000,
          amount: 25000
        },
        {
          id: 'item_2',
          name: 'RBAC Security & User Management',
          description: 'Multi-role authentication, granular permission matrices, and security audit logging.',
          qty: 1,
          rate: 30000,
          amount: 30000
        },
        {
          id: 'item_3',
          name: 'CRM, Lead Pipeline & Quotation Engine',
          description: 'Client contact management, deal stages, and dynamic proposal generation.',
          qty: 1,
          rate: 35000,
          amount: 35000
        },
        {
          id: 'item_4',
          name: 'Financial Ledger & Billing Automation',
          description: 'Invoice generator, income & expense tracking, and automated reminder alerts.',
          qty: 1,
          rate: 35000,
          amount: 35000
        },
        {
          id: 'item_5',
          name: 'Business Intelligence & Reporting',
          description: 'Executive dashboards, visual financial graphs, and PDF/Excel exportable reports.',
          qty: 1,
          rate: 25000,
          amount: 25000
        }
      ],
      subtotal: 150000,
      discount: 15000,
      taxRate: 18,
      taxAmount: 24300,
      grandTotal: 159300,
      projectDuration: '8 to 10 Weeks',
      milestones: [
        {
          phase: 'Phase 1: Workflow Specification & Wireframes',
          duration: 'Week 1 - 2',
          deliverables: 'Functional specification document, database schema, and UI wireframes.',
          percentage: 30
        },
        {
          phase: 'Phase 2: Core Engine & Role Implementation',
          duration: 'Week 3 - 6',
          deliverables: 'RBAC module, client management, billing workflows, and automated tasks.',
          percentage: 40
        },
        {
          phase: 'Phase 3: Integration, Data Migration & Go-Live',
          duration: 'Week 7 - 10',
          deliverables: 'End-to-end user acceptance testing, staff training sessions, and production rollout.',
          percentage: 30
        }
      ],
      terms: {
        paymentTerms: [
          '30% Advance deposit upon contract execution.',
          '40% Upon mid-project milestone review demonstrating working modules.',
          '30% Upon final deployment, staff onboarding, and administrative handover.'
        ],
        warrantySupport: '120 Days complimentary post-deployment warranty and technical maintenance.',
        validityDays: 20,
        clientObligations: [
          'Provide sample operational spreadsheets, invoicing formats, and workflow charts.',
          'Participate in bi-weekly sprint review meetings for incremental sign-offs.'
        ],
        extraClauses: [
          'Source code and database schema will be backed up daily with full offsite redundancy.'
        ]
      },
      notes: 'Includes complete video walkthrough documentation and dedicated administrative training.'
    }
  },

  digital_marketing: {
    name: 'SEO, Google Ads & Digital Marketing',
    description: 'Holistic digital marketing retainer: Technical SEO, Google Business Profile ranking, and Google Ads management.',
    data: {
      proposalNumber: '',
      title: 'Search Engine Optimization & Paid Ads Growth Strategy Proposal',
      category: 'digital_marketing',
      status: 'draft',
      ...DEFAULT_COMPANY_DETAILS,
      proposalDate: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
      overview:
        'This growth strategy proposal details our targeted digital marketing methodology to position your business at the top of search results, generate high-intent customer leads, and maximize your return on ad spend (ROAS). Combining Technical On-Page SEO, Local Google Map Pack dominance, and high-converting paid search ads.',
      scopeOfWork: [
        'Comprehensive website technical SEO audit, Core Web Vitals speed optimization, and schema markup.',
        'In-depth competitor keyword research targeting high-commercial intent search queries.',
        'Google Business Profile (GBP) local optimization for Map 3-Pack rankings in target cities.',
        'High-converting Google Ads (Search & Call) campaign architecture and negative keyword lists.',
        'Monthly conversion tracking, call tracking, and transparent performance reporting.'
      ],
      techStack: {
        frontend: ['Google Search Console', 'Google Analytics 4', 'Ahrefs / SEMrush'],
        tools: ['Google Tag Manager', 'Google Ads Editor', 'Looker Studio Reporting']
      },
      currency: 'INR',
      items: [
        {
          id: 'item_1',
          name: 'Technical SEO Audit & On-Page Optimization',
          description: 'Meta titles, descriptions, schema JSON-LD, internal linking, and speed enhancement.',
          qty: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: 'item_2',
          name: 'Local SEO & Google Business Profile Ranking',
          description: 'Category optimization, local citations, geo-tagged photo uploads, and review generation strategy.',
          qty: 1,
          rate: 12000,
          amount: 12000
        },
        {
          id: 'item_3',
          name: 'Google Ads (PPC) Campaign Setup & Copywriting',
          description: 'Ad copy creation, keyword match types, extension assets, and negative keyword filtering.',
          qty: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: 'item_4',
          name: 'Conversion Tracking & Analytics Dashboard',
          description: 'GA4 custom event setup, WhatsApp click tracking, form submission tracking, and monthly Looker reports.',
          qty: 1,
          rate: 8000,
          amount: 8000
        }
      ],
      subtotal: 50000,
      discount: 5000,
      taxRate: 18,
      taxAmount: 8100,
      grandTotal: 53100,
      projectDuration: 'Monthly Retainer (3-Month Minimum Recommended)',
      milestones: [
        {
          phase: 'Month 1: Audit, On-Page Fixes & Ad Setup',
          duration: 'Day 1 - 30',
          deliverables: 'Technical audit report, on-page implementation, and Google Ads launch.',
          percentage: 33
        },
        {
          phase: 'Month 2: Optimization, Local Ranking & Ad Scaling',
          duration: 'Day 31 - 60',
          deliverables: 'Search query optimization, negative keyword curation, and local citation expansion.',
          percentage: 33
        },
        {
          phase: 'Month 3: Performance Scaling & ROI Review',
          duration: 'Day 61 - 90',
          deliverables: 'Comprehensive quarterly growth review, organic keyword rankings audit, and continuous scaling.',
          percentage: 34
        }
      ],
      terms: {
        paymentTerms: [
          'Monthly retainer fee payable in advance at the beginning of each 30-day billing cycle.',
          'Google Ads media spend budget is billed directly to the client credit card by Google.'
        ],
        warrantySupport: 'Dedicated campaign manager with weekly WhatsApp updates and monthly video reviews.',
        validityDays: 15,
        clientObligations: [
          'Grant Manager access to Google Ads, Google Analytics 4, and Google Business Profile.',
          'Respond to incoming leads within 15 minutes for maximum sales conversion.'
        ],
        extraClauses: [
          'Ad spend budget is separate from the agency management fee.'
        ]
      },
      notes: 'No long-term lock-in after the initial 3-month setup period. 30 days written notice to pause.'
    }
  }
};
