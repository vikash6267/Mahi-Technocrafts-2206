import type { Metadata } from 'next';

export type BhopalServicePackage = {
  name: string;
  price: string;
  duration: string;
  popular?: boolean;
  bestFor: string;
  features: string[];
};

export type BhopalServicePage = {
  slug: string;
  title: string;
  h1: string;
  tagline: string;
  metaDescription: string;
  summary: string;
  image: string;
  imageAlt: string;
  label: string;
  startingPrice: string;
  deliveryTime: string;
  ratingValue: number;
  reviewCount: number;
  focus: string[];
  packages: BhopalServicePackage[];
  value: string;
  targetKeywords: string[];
  faqs: { question: string; answer: string }[];
};

export const BHOPAL_LOCALITIES = [
  'M.P. Nagar Zone 1',
  'M.P. Nagar Zone 2',
  'Arera Colony',
  'New Market',
  'Kolar Road',
  'Indrapuri',
  'BHEL Township',
  'Shahjahanabad',
  'Hamidia Road',
  'Hoshangabad Road',
  'Govindpura Industrial Area',
  'T.T. Nagar',
  'Ayodhya Bypass',
  'Lalghati',
  'Bairagarh (Sant Hirdaram Nagar)',
  'Chuna Bhatti',
  'Bawadiya Kalan',
  'Shivaji Nagar',
  'Ashoka Garden',
  'Mandideep Industrial Area',
  'Raisen Road',
  'Karond'
];

export const bhopalServicePages: BhopalServicePage[] = [
  {
    slug: 'web-development-company-bhopal',
    title: 'Top Web Development Company in Bhopal | Best Website Developers',
    h1: 'Best Web Development Company in Bhopal',
    tagline: 'Rated #1 Website & Web Portal Engineering Agency in Bhopal · 4.9★ from 187+ Verified Clients',
    metaDescription: 'Looking for the best web development company in Bhopal? Mahi TechnoCrafts builds high-speed, SEO-ready custom websites & web portals in MP Nagar, Arera Colony & Bhopal. 4.9★ rating. Call +91 62671 44122.',
    summary: 'Need a top-rated website development company or expert web developer in Bhopal? Mahi TechnoCrafts delivers sub-second page loading speeds, mobile-first responsive architecture, and custom web applications tailored for local businesses and enterprises across Bhopal & MP.',
    image: '/images/herosection.webp',
    imageAlt: 'Web development workspace and code editors at Mahi TechnoCrafts Bhopal',
    label: 'Web Development',
    startingPrice: '₹7,999',
    deliveryTime: '5 - 12 Days',
    ratingValue: 4.9,
    reviewCount: 187,
    focus: [
      'Next.js 16, React 19 & Tailwind CSS modern web applications',
      'Dynamic business websites with administrative CMS & CRM sync',
      'Sub-second Google Core Web Vitals & 95+ PageSpeed scores',
      'Technical On-Page SEO, Schema.org integration & search readiness',
      'Custom web portals, client dashboards & role-based authentication',
      'Automated WhatsApp inquiry alerts, payment gateways & daily backups'
    ],
    packages: [
      {
        name: 'Starter Business Website',
        price: '₹7,999 - ₹12,999',
        duration: '5 to 7 Days',
        bestFor: 'Local businesses, clinics, consultants, and startups in Bhopal',
        features: [
          'Up to 5 Mobile-First Responsive Pages',
          'Free 1 Year Domain & SSL Certificate setup',
          'Fast Next.js Static Generation',
          'Direct WhatsApp Chat & Click-to-Call Buttons',
          'Google Maps & Local Search Schema',
          'Contact Form synced to Email & Admin Dashboard'
        ]
      },
      {
        name: 'Corporate & Growth Portal',
        price: '₹18,000 - ₹32,000',
        duration: '8 to 14 Days',
        popular: true,
        bestFor: 'Established companies, manufacturers, schools, and service agencies',
        features: [
          'Up to 15 Pages with Custom Brand Layouts',
          'Self-Service Admin CMS to update blogs & services',
          '90+ Google PageSpeed Score Guarantee',
          'Lead Capture CRM with Audit Logging',
          'Advanced Schema Markup (LocalBusiness, Service, FAQ)',
          '90 Days Free Post-Launch Technical Support'
        ]
      },
      {
        name: 'Enterprise Web Application',
        price: '₹45,000 - ₹95,000+',
        duration: '3 to 6 Weeks',
        bestFor: 'Custom SaaS products, ERP/CRM portals, multi-branch businesses',
        features: [
          'Full-Stack Node.js / PostgreSQL / MongoDB architecture',
          'Role-Based Access Control (Admin, Staff, Customer)',
          'Payment Gateway (Razorpay, UPI, Credit Cards, NetBanking)',
          'Automated PDF invoice generation & SMS/WhatsApp alerts',
          'AWS / Cloud VPS High-Availability Deployment',
          'Complete Source Code Ownership & Developer Handover'
        ]
      }
    ],
    value: 'Engineered for sub-second page speeds, Google 1st-page organic discovery, and high lead-to-client conversion rates.',
    targetKeywords: [
      'web development company in bhopal',
      'website development company in bhopal',
      'best website developers in bhopal',
      'top 10 web development companies in bhopal',
      'website development in mp nagar bhopal',
      'custom web application developers bhopal',
      'web developers near me bhopal',
      'website development cost in bhopal',
      'nextjs react web agency bhopal',
      'bhopal it company for website'
    ],
    faqs: [
      {
        question: 'What is the cost of website development in Bhopal?',
        answer: 'Website development cost in Bhopal with Mahi TechnoCrafts starts from ₹7,999 for a standard business website. Comprehensive corporate portals range from ₹18,000 to ₹35,000, while complex custom web applications and e-commerce stores range from ₹40,000 to ₹95,000 depending on features and integrations.'
      },
      {
        question: 'How long does it take to develop a business website in Bhopal?',
        answer: 'A standard 5-to-10 page corporate website is typically designed, reviewed, tested, and launched in 5 to 10 working days. Custom web applications, ERP dashboards, and large-scale platforms take approximately 2 to 5 weeks with weekly milestone demos.'
      },
      {
        question: 'Will my website rank on Google in Bhopal and nearby cities?',
        answer: 'Yes. All websites built by Mahi TechnoCrafts are built on Next.js with technical on-page SEO, localized Schema.org structured data, meta tags, OpenGraph previews, and Google Search Console sitemap indexing so your business ranks for localized searches across Bhopal and Madhya Pradesh.'
      },
      {
        question: 'Do I get 100% source code ownership and hosting control?',
        answer: 'Absolutely. Unlike template agencies that lock you into monthly rental fees, Mahi TechnoCrafts provides 100% source code ownership, database access, and hosting credentials upon project sign-off.'
      },
      {
        question: 'Can you develop websites for businesses in MP Nagar, Arera Colony, and Kolar?',
        answer: 'Yes. We cater to clients across all areas of Bhopal including MP Nagar Zone 1 & 2, Arera Colony, New Market, Kolar Road, Indrapuri, BHEL, Shahjahanabad, Hoshangabad Road, and Mandideep with in-person consultations and fast remote support.'
      },
      {
        question: 'What technical support do you provide after the website goes live?',
        answer: 'Every project comes with 90 days of complimentary technical warranty support covering bug fixes, speed checks, security patches, and minor text/image updates to ensure smooth operation.'
      }
    ]
  },
  {
    slug: 'website-design-company-bhopal',
    title: 'Best Website Design Company in Bhopal | UI/UX & Web Designers',
    h1: 'Creative Website Design Company in Bhopal',
    tagline: 'Stunning Modern UI/UX Design & High-Converting Websites · 4.9★ Rated Agency',
    metaDescription: 'Searching for the best website design company in Bhopal? Mahi TechnoCrafts creates modern, mobile-responsive UI/UX designs and high-converting websites in MP Nagar & Bhopal. Call +91 62671 44122.',
    summary: 'Looking for creative website designers or a website designing company in Bhopal? We craft visually captivating, mobile-first websites with custom Figma wireframes, accessible typography, and intuitive customer navigation that convert visitors into paying clients.',
    image: '/images/herosection.webp',
    imageAlt: 'Website design layouts and responsive mobile screens at Mahi TechnoCrafts Bhopal',
    label: 'Website Design',
    startingPrice: '₹6,999',
    deliveryTime: '4 - 10 Days',
    ratingValue: 4.9,
    reviewCount: 164,
    focus: [
      'Bespoke Figma UI/UX prototyping and interactive wireframes',
      'Mobile-first responsive design adapted for smartphones, tablets & desktops',
      'Conversion-rate optimized landing pages with distinct calls to action',
      'Modern aesthetics: clean gradients, glassmorphism, micro-animations & dark mode',
      'Fast-loading visual assets, SVG vector icons & WebP image compression',
      'Complete brand identity matching: logos, typography, and color palettes'
    ],
    packages: [
      {
        name: 'Landing Page & Micro Site',
        price: '₹6,999 - ₹10,999',
        duration: '4 to 6 Days',
        bestFor: 'Ad campaigns, product launches, local professionals, single services',
        features: [
          'High-converting single-page responsive design',
          'Interactive lead generation form & WhatsApp button',
          'Fast CDN hosting with SSL certificate',
          'Google Analytics & Meta Pixel tracking setup',
          'Mobile and desktop speed optimization'
        ]
      },
      {
        name: 'Full Corporate Web Design',
        price: '₹14,999 - ₹28,000',
        duration: '7 to 12 Days',
        popular: true,
        bestFor: 'SMEs, service providers, healthcare clinics, and schools',
        features: [
          'Up to 10 Custom Designed Pages in Figma first',
          'Interactive UI components, sliders & testimonials',
          'SEO-friendly semantic HTML structure',
          'Custom icons, stock photography & vector assets',
          'Cross-browser testing (Chrome, Safari, Firefox, Edge)',
          '90 Days free design revision and support'
        ]
      },
      {
        name: 'Custom E-Commerce / Brand Redesign',
        price: '₹35,000 - ₹65,000',
        duration: '2 to 4 Weeks',
        bestFor: 'Retailers, D2C brands, and firms needing a complete modern revamp',
        features: [
          'Comprehensive design system with reusable components',
          'Detailed product catalog, filters & checkout flows',
          'User journey mapping & cart abandonment minimization',
          'Interactive mobile prototype before development',
          'Complete brand asset handover (Figma, SVGs, Fonts)'
        ]
      }
    ],
    value: 'Design engineered around consumer psychology to build immediate trust and generate steady inquiries.',
    targetKeywords: [
      'website design company in bhopal',
      'website designing in bhopal',
      'best web designers in bhopal',
      'top website designers mp nagar bhopal',
      'ui ux designer in bhopal',
      'website redesign services bhopal',
      'low cost web design bhopal',
      'creative web designing agency bhopal',
      'responsive website design bhopal'
    ],
    faqs: [
      {
        question: 'What is the cost of website designing in Bhopal?',
        answer: 'Website design in Bhopal starts from ₹6,999 for high-converting landing pages. Multi-page custom corporate designs range from ₹14,999 to ₹28,000, while bespoke design systems with interactive Figma prototypes range from ₹35,000 upwards.'
      },
      {
        question: 'Can you redesign my existing slow or outdated website?',
        answer: 'Yes! We frequently redesign outdated WordPress, PHP, or HTML websites, transforming them into lightning-fast, sleek modern experiences with modern typography, improved mobile navigation, and higher Google search rankings.'
      },
      {
        question: 'Will I be able to preview and approve the design before coding starts?',
        answer: 'Yes. We share interactive Figma wireframes and high-fidelity mockups for your feedback and approval before our developers write a single line of production code.'
      },
      {
        question: 'Will my website look great on mobile phones?',
        answer: 'Yes. Over 75% of Indian web traffic is mobile. We design mobile-first so your website looks stunning and functions effortlessly on iPhones, Android devices, tablets, and laptops.'
      }
    ]
  },
  {
    slug: 'software-development-company-bhopal',
    title: 'Best Software Development Company in Bhopal | Custom ERP & CRM',
    h1: 'Custom Software Development Company in Bhopal',
    tagline: 'Enterprise ERP, CRM, Billing & SaaS Solutions · 4.9★ Rated Software Engineers',
    metaDescription: 'Top custom software development company in Bhopal. Mahi TechnoCrafts builds scalable ERP, CRM, inventory & billing software for Bhopal businesses. Secure, fast, 100% code ownership. Call +91 62671 44122.',
    summary: 'Searching for a trusted software development company in Bhopal? Mahi TechnoCrafts engineers custom business software, cloud ERPs, CRM platforms, billing & inventory systems, and multi-user administrative dashboards that streamline operations and cut operational costs.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Software engineers building enterprise web software at Mahi TechnoCrafts Bhopal',
    label: 'Software Development',
    startingPrice: '₹24,999',
    deliveryTime: '2 - 6 Weeks',
    ratingValue: 4.9,
    reviewCount: 142,
    focus: [
      'Custom ERP & CRM development for manufacturers, distributors & retailers',
      'Billing, GST invoicing & automated inventory management systems',
      'Multi-branch management dashboards with real-time analytics',
      'Role-based permissions (Super Admin, Manager, Accountant, Operator)',
      'Automated WhatsApp & Email notifications on key business triggers',
      'Cloud VPS database architecture with daily encrypted automated backups'
    ],
    packages: [
      {
        name: 'Custom Billing & Inventory Software',
        price: '₹24,999 - ₹45,000',
        duration: '2 to 3 Weeks',
        bestFor: 'Wholesalers, retail stores, traders, and small factories in Bhopal',
        features: [
          'GST compliant invoice generation & print layouts',
          'Real-time stock & inventory level alerts',
          'Customer & supplier ledger tracking',
          'Daily profit & loss overview reports',
          'Single or multi-device local / cloud access'
        ]
      },
      {
        name: 'Full Business ERP / CRM Suite',
        price: '₹55,000 - ₹1,20,000',
        duration: '4 to 8 Weeks',
        popular: true,
        bestFor: 'Growing enterprises, schools, hospitals, and manufacturing firms',
        features: [
          'Custom workflow automation matching your exact business logic',
          'Multi-user login with granular permissions',
          'Lead management & customer follow-up pipelines',
          'Payment gateway integration & accounting sync',
          'Automated daily data backups & 99.9% uptime SLA',
          'Full training sessions for your staff in Bhopal'
        ]
      },
      {
        name: 'Enterprise SaaS & Cloud Platform',
        price: '₹1,25,000+',
        duration: '8 to 14 Weeks',
        bestFor: 'Tech startups, national service aggregators, and enterprise platforms',
        features: [
          'Microservices architecture built on Node.js / Python / PostgreSQL',
          'High concurrency handling thousands of active users',
          'RESTful API architecture ready for mobile apps',
          'Automated CI/CD deployment pipelines on AWS / DigitalOcean',
          'Complete IP transfer, source code handover & technical documentation'
        ]
      }
    ],
    value: 'Eliminate repetitive manual errors and scale your business operations with tailor-made software you 100% own.',
    targetKeywords: [
      'software development company in bhopal',
      'software company in bhopal',
      'best software developers in bhopal',
      'custom software development bhopal',
      'erp software company bhopal',
      'crm software developers in bhopal',
      'billing software company bhopal',
      'top it software agencies in mp nagar bhopal',
      'school management software bhopal',
      'hospital software developers bhopal'
    ],
    faqs: [
      {
        question: 'What types of custom software do you build in Bhopal?',
        answer: 'We develop custom business software including ERP systems, CRM pipelines, GST billing & inventory systems, hospital clinic management software, school/coaching management portals, real estate booking engines, and customized SaaS web platforms.'
      },
      {
        question: 'How is custom software better than off-the-shelf software?',
        answer: 'Pre-made software charges expensive monthly subscriptions per user and forces you to adapt your business to their rigid templates. With custom software from Mahi TechnoCrafts, you pay once, own the software 100%, and have features tailored exactly to your unique workflow.'
      },
      {
        question: 'Is our company data secure and confidential?',
        answer: 'Yes. We sign strict Non-Disclosure Agreements (NDAs), use enterprise-grade database encryption, enforce role-based access controls, and configure daily automated backups to cloud servers with SSL 256-bit encryption.'
      },
      {
        question: 'Do you provide training for our employees?',
        answer: 'Yes. We conduct hands-on training sessions (in-person in Bhopal or remote video calls) and provide step-by-step user manuals and recorded walkthroughs so your team can master the software easily.'
      }
    ]
  },
  {
    slug: 'it-company-in-bhopal',
    title: 'Best IT Company in Bhopal | Top IT Solutions & Services Agency',
    h1: 'Top-Rated IT Company in Bhopal',
    tagline: 'End-to-End Information Technology & Digital Engineering Partner · 4.9★ Rated',
    metaDescription: 'Searching for the best IT company in Bhopal? Mahi TechnoCrafts provides end-to-end IT solutions, software development, cloud computing & web engineering in MP Nagar & Bhopal. Call +91 62671 44122.',
    summary: 'Looking for a reliable IT company in Bhopal? Mahi TechnoCrafts is a verified IT solutions provider offering full-stack web development, custom software engineering, cloud architecture, mobile apps, and technical consultation to modern businesses across Bhopal, Madhya Pradesh, and globally.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'IT consulting and cloud engineering team at Mahi TechnoCrafts Bhopal',
    label: 'IT Solutions',
    startingPrice: '₹9,999',
    deliveryTime: '1 - 4 Weeks',
    ratingValue: 4.9,
    reviewCount: 195,
    focus: [
      'Comprehensive IT consulting and digital transformation roadmaps',
      'Custom web portals, enterprise cloud solutions & API integrations',
      'Secure database management, migration & optimization',
      'Domain, high-speed VPS hosting, SSL & enterprise email setups',
      'Cybersecurity audits, performance benchmarking & uptime monitoring',
      'Dedicated technical support and IT infrastructure maintenance'
    ],
    packages: [
      {
        name: 'IT Starter Pack for Businesses',
        price: '₹9,999 - ₹18,000',
        duration: '1 to 2 Weeks',
        bestFor: 'New ventures, trading firms, and professional firms setting up IT',
        features: [
          'Professional Business Website with SSL & Domain',
          'Google Workspace / Enterprise Email configuration',
          'Local Search & Google Business Profile Optimization',
          'Official WhatsApp Business API setup guidance',
          'Cybersecurity & backup fundamentals'
        ]
      },
      {
        name: 'Full Digital IT Infrastructure',
        price: '₹35,000 - ₹75,000',
        duration: '3 to 5 Weeks',
        popular: true,
        bestFor: 'Established institutions, corporate offices, and growing retailers',
        features: [
          'Custom Web Portal with Administrative Dashboard',
          'Centralized customer database with search & filters',
          'Automated data backup & recovery protocol',
          'Payment Gateway & SMS/Email integration',
          'Dedicated IT support engineer for 6 months'
        ]
      },
      {
        name: 'Enterprise Technology Partner (AMC)',
        price: 'Custom Quote',
        duration: 'Annual Contract',
        bestFor: 'Corporates and organizations requiring ongoing IT management',
        features: [
          'Continuous website & software monitoring (99.9% uptime)',
          'Monthly security patches, dependency upgrades & speed tuning',
          'On-demand feature additions & database maintenance',
          'Priority 1-hour ticket response time SLA',
          'Quarterly IT performance & security audit reviews'
        ]
      }
    ],
    value: 'A single, dependable IT technology partner handling everything from website engineering to enterprise software and cloud stability.',
    targetKeywords: [
      'it company in bhopal',
      'best it company in bhopal',
      'top 10 it companies in bhopal',
      'it companies in mp nagar bhopal',
      'information technology company bhopal',
      'it solutions provider in bhopal',
      'top it agencies bhopal',
      'software and it consulting bhopal',
      'it service provider near me bhopal'
    ],
    faqs: [
      {
        question: 'Which is the best IT company in Bhopal for small and mid-sized businesses?',
        answer: 'Mahi TechnoCrafts is rated among the top IT companies in Bhopal with a 4.9★ rating. We specialize in custom web development, software engineering, mobile apps, and cloud IT services with transparent pricing, full source code ownership, and quick response times.'
      },
      {
        question: 'Where is your office located in Bhopal?',
        answer: 'Our main office is situated on Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, MP 462001. We frequently meet clients across M.P. Nagar, Arera Colony, New Market, Kolar, and Hoshangabad Road for in-person project discussions.'
      },
      {
        question: 'Do you offer Annual Maintenance Contracts (AMC) for IT and websites?',
        answer: 'Yes. We offer flexible Annual Maintenance Contracts (AMC) that cover routine security updates, database backups, bug fixes, speed audits, and technical enhancements with dedicated support.'
      },
      {
        question: 'Can you help digitize manual paperwork in our Bhopal office?',
        answer: 'Yes! We specialize in digital transformation—taking your manual register/Excel based processes and building simple, fast web or mobile interfaces so your staff can enter, track, and export reports in seconds.'
      }
    ]
  },
  {
    slug: 'ecommerce-development-company-bhopal',
    title: 'E-commerce Website Development in Bhopal | Online Store Builders',
    h1: 'E-Commerce Website Development in Bhopal',
    tagline: 'High-Converting Online Stores, Instant UPI Payments & Logistics Sync · 4.9★ Rated',
    metaDescription: 'Launch your online store with Bhopal’s top ecommerce development company. Mahi TechnoCrafts builds fast, mobile-first ecommerce stores with Razorpay, UPI & auto shipping. Call +91 62671 44122.',
    summary: 'Looking for e-commerce website development in Bhopal? We build fast, high-converting online stores with easy product management, Indian payment gateway integrations (PhonePe, GPay, Paytm, Cards), shipping API sync, and automated WhatsApp order notifications.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Organized retail products and mobile shopping checkout screens',
    label: 'E-Commerce Development',
    startingPrice: '₹19,999',
    deliveryTime: '7 - 18 Days',
    ratingValue: 4.9,
    reviewCount: 153,
    focus: [
      'Fast product catalog with search, filters, categories & stock tracking',
      '1-click checkout with Indian payment gateways (Razorpay, Cashfree, UPI, Cards)',
      'Automated WhatsApp and SMS order confirmation & tracking alerts',
      'Mobile-first shopping cart designed to minimize checkout drop-offs',
      'Admin dashboard to manage products, pricing, discounts, coupons & orders',
      'Integration with courier APIs (Shiprocket, Delhivery, Bluedart) for auto-dispatch'
    ],
    packages: [
      {
        name: 'Starter Online Store',
        price: '₹19,999 - ₹28,000',
        duration: '7 to 10 Days',
        bestFor: 'Local boutiques, sweet shops, clothing stores, and specialized artisans in Bhopal',
        features: [
          'Up to 100 Products with Categories & Variants',
          'Direct UPI (GPay / PhonePe) & Cash on Delivery (COD)',
          'Instant WhatsApp Order Notifications',
          'Mobile-friendly shopping cart & order manager',
          'Free SSL security & domain configuration'
        ]
      },
      {
        name: 'Full E-Commerce Portal',
        price: '₹34,999 - ₹55,000',
        duration: '12 to 20 Days',
        popular: true,
        bestFor: 'Growing retail brands, D2C ventures, and electronics/apparel stores',
        features: [
          'Unlimited Products & High-Speed Search Filters',
          'Full Razorpay / Cashfree Payment Gateway (Cards, NetBanking, EMI)',
          'Shiprocket / Delhivery Automated Courier API Integration',
          'Customer Account Dashboard with Order History',
          'Discount Coupons, Promotional Banners & Abandoned Cart Recovery',
          '90 Days Free Post-Launch Technical Maintenance'
        ]
      },
      {
        name: 'Custom Multi-Vendor Marketplace',
        price: '₹75,000 - ₹1,50,000',
        duration: '4 to 8 Weeks',
        bestFor: 'Hyperlocal delivery apps, multi-seller portals, wholesale B2B platforms',
        features: [
          'Separate Vendor Dashboards with commission payouts',
          'Customer app ready REST APIs',
          'Real-time delivery driver tracking & geo-fencing',
          'High concurrency cloud VPS infrastructure',
          'Complete source code ownership & handover'
        ]
      }
    ],
    value: 'Designed to maximize completed transactions and handle festive peak shopping traffic without slowdowns.',
    targetKeywords: [
      'ecommerce website development in bhopal',
      'ecommerce development company bhopal',
      'online store maker bhopal',
      'shopify developers in bhopal',
      'woocommerce website developers bhopal',
      'ecommerce website cost in bhopal',
      'payment gateway integration bhopal',
      'd2c website design bhopal',
      'bhopal ecommerce agency'
    ],
    faqs: [
      {
        question: 'How much does an e-commerce website cost in Bhopal?',
        answer: 'Starter e-commerce stores with UPI payments in Bhopal start from ₹19,999. Feature-rich stores with full payment gateway, shipping tracking, and coupon managers range from ₹34,999 to ₹55,000, while multi-vendor marketplaces start from ₹75,000.'
      },
      {
        question: 'Can customers pay via Google Pay, PhonePe, and Credit Cards?',
        answer: 'Yes! We integrate trusted Indian payment gateways such as Razorpay, Cashfree, and Paytm that support instant UPI apps (GPay, PhonePe, Paytm), NetBanking (50+ banks), Debit/Credit Cards, and EMI options.'
      },
      {
        question: 'Can I add and update products myself without technical coding knowledge?',
        answer: 'Yes. We provide an intuitive mobile-friendly admin dashboard where you can add new products, update prices, manage stock, create discount codes, and view sales reports in just a few taps.'
      },
      {
        question: 'Can the store connect with delivery services like Shiprocket or Delhivery?',
        answer: 'Yes. We connect courier APIs such as Shiprocket, Delhivery, or Pickrr so tracking numbers, airway bills (AWB), and shipping labels are generated automatically upon order placement.'
      }
    ]
  },
  {
    slug: 'mobile-app-development-company-bhopal',
    title: 'Mobile App Development Company in Bhopal | Android & iOS Apps',
    h1: 'Mobile App Development Company in Bhopal',
    tagline: 'High-Performance Android & iOS Apps Built with Flutter & React Native · 4.9★ Rated',
    metaDescription: 'Top mobile app development company in Bhopal. Mahi TechnoCrafts builds native & cross-platform Android/iOS apps with cloud APIs, push notifications & payment integrations. Call +91 62671 44122.',
    summary: 'Looking for mobile app developers in Bhopal? We engineer feature-rich Android and iOS mobile applications using modern frameworks like Flutter and React Native. From idea wireframing to Google Play Store & Apple App Store launch, we handle the complete lifecycle.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Mobile application UI and smartphone prototype at Mahi TechnoCrafts',
    label: 'Mobile App Development',
    startingPrice: '₹29,999',
    deliveryTime: '2 - 6 Weeks',
    ratingValue: 4.9,
    reviewCount: 138,
    focus: [
      'Cross-platform Android & iOS apps using Flutter and React Native',
      'Real-time push notifications, OTP SMS login & user profiles',
      'Payment gateway, Google Maps, GPS tracking & camera integrations',
      'Fast RESTful backend APIs with sub-100ms response times',
      'Google Play Store and Apple App Store release preparation & compliance',
      'Offline data caching, secure token authentication & encrypted storage'
    ],
    packages: [
      {
        name: 'MVP / Single Platform Android App',
        price: '₹29,999 - ₹49,000',
        duration: '2 to 3 Weeks',
        bestFor: 'Service booking, catalog browsing, and early-stage startup validation',
        features: [
          'Native-feel Android Application',
          'Phone OTP Authentication (Firebase / Twilio)',
          'Product or Service Listing with Booking Form',
          'Push Notifications via Firebase Cloud Messaging',
          'Google Play Store submission guidance'
        ]
      },
      {
        name: 'Dual Platform (Android + iOS) Cross-Platform',
        price: '₹55,000 - ₹95,000',
        duration: '4 to 6 Weeks',
        popular: true,
        bestFor: 'E-commerce, logistics, on-demand services, and community platforms',
        features: [
          'Single codebase for both Android & iOS (Flutter / React Native)',
          'Razorpay / In-App Payment Gateway integration',
          'Live GPS Tracking & Google Maps API',
          'Admin Web Panel to manage users, orders & content',
          'Play Store & App Store deployment support',
          '90 Days Free bug fixes & maintenance warranty'
        ]
      },
      {
        name: 'Custom On-Demand / Marketplace App Suite',
        price: '₹1,10,000 - ₹2,20,000',
        duration: '6 to 12 Weeks',
        bestFor: 'Rideshare, food delivery, doctor consultation, multi-vendor apps',
        features: [
          '3-in-1 Suite: Customer App, Partner/Driver App & Web Admin',
          'Live Socket-based real-time chat & status tracking',
          'Automated wallet, referral & coupon mechanisms',
          'High scalability cloud infrastructure setup',
          'Complete source code ownership & handover'
        ]
      }
    ],
    value: 'Intuitive user experiences with smooth 60fps animations, rock-solid stability, and battery-friendly background sync.',
    targetKeywords: [
      'mobile app development company in bhopal',
      'android app developers in bhopal',
      'ios app development bhopal',
      'flutter app developers bhopal',
      'react native agency bhopal',
      'mobile app development cost in bhopal',
      'best app developers mp nagar bhopal',
      'on demand app development bhopal'
    ],
    faqs: [
      {
        question: 'How much does mobile app development cost in Bhopal?',
        answer: 'Mobile app development in Bhopal with Mahi TechnoCrafts starts from ₹29,999 for basic Android utility apps. Dual-platform (Android + iOS) apps built on Flutter range between ₹55,000 to ₹95,000, while complex on-demand platforms (like Uber or Zomato model) range from ₹1,10,000 upwards.'
      },
      {
        question: 'Do you develop apps for both Android and iPhone (iOS)?',
        answer: 'Yes! Using Flutter and React Native, we build apps that run flawlessly on both Android smartphones and Apple iPhones with a single shared codebase, saving you up to 40% in development and maintenance costs.'
      },
      {
        question: 'Will you help publish our mobile app to the Google Play Store?',
        answer: 'Yes. We prepare all release bundles, privacy policies, promotional screenshots, and guide you step-by-step through Google Play Console and Apple App Store verification.'
      },
      {
        question: 'Can the app connect to our existing website or software?',
        answer: 'Yes! We can build custom REST APIs that sync your mobile app with your existing website database, CRM, or accounting software in real time.'
      }
    ]
  },
  {
    slug: 'digital-marketing-company-bhopal',
    title: 'Best Digital Marketing Company in Bhopal | SEO, Ads & Social Media',
    h1: 'Results-Driven Digital Marketing Company in Bhopal',
    tagline: 'High-ROI Lead Generation, Google Ads & Social Media Marketing · 4.9★ Agency',
    metaDescription: 'Grow your business with Bhopal’s top digital marketing company. Mahi TechnoCrafts delivers high-ROI Google Ads, SEO, Social Media & lead generation in MP Nagar & Bhopal. Call +91 62671 44122.',
    summary: 'Searching for a digital marketing company in Bhopal that actually delivers leads? Mahi TechnoCrafts plans and executes data-backed performance marketing campaigns: Google Ads, Meta Ads (Facebook & Instagram), SEO, and conversion-optimized landing pages that bring qualified customer inquiries to your phone.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Digital marketing campaign dashboard and performance analytics',
    label: 'Digital Marketing',
    startingPrice: '₹8,999/mo',
    deliveryTime: 'Monthly Retainer',
    ratingValue: 4.9,
    reviewCount: 171,
    focus: [
      'High-intent Google Search Ads & Local Map Ads for immediate calls',
      'Targeted Facebook & Instagram Lead Ads for local Bhopal audiences',
      'Complete Funnel Optimization: High-converting landing pages & WhatsApp automation',
      'Local SEO & Google Business Profile (GBP) ranking optimization',
      'Content creation, graphic design & weekly social media posting',
      'Transparent weekly performance reporting with Cost-Per-Lead (CPL) metrics'
    ],
    packages: [
      {
        name: 'Local Lead Generation Starter',
        price: '₹8,999 / month',
        duration: 'Monthly Campaign',
        bestFor: 'Clinics, coaching classes, interior designers, local contractors',
        features: [
          'Google Search Ads or Meta Lead Ads campaign setup',
          'Audience targeting for Bhopal and nearby districts',
          'High-converting landing page creation',
          'Weekly budget & lead count tracking',
          'Ad spend paid directly to Google/Meta with full transparency'
        ]
      },
      {
        name: 'Complete Digital Growth Retainer',
        price: '₹18,500 / month',
        duration: 'Monthly Retainer',
        popular: true,
        bestFor: 'Hospitals, real estate developers, educational institutes, B2B firms',
        features: [
          'Omnichannel Ads: Google Search, YouTube & Instagram Reels',
          'Local SEO & Google Business Profile 3-Pack ranking',
          '12 Custom Social Media creatives & reels per month',
          'WhatsApp Business automated inquiry responder setup',
          'Dedicated account manager & bi-weekly review meetings in Bhopal'
        ]
      },
      {
        name: 'Brand Dominance & Performance Suite',
        price: '₹35,000 / month',
        duration: 'Monthly Retainer',
        bestFor: 'Multi-branch companies, large retail brands, and national expansion',
        features: [
          'Comprehensive SEO & Content Marketing roadmap',
          'Advanced Remarketing funnels across Google Display & Meta',
          'Competitor ad intelligence & bid optimization',
          'Custom conversion tracking via Google Analytics 4 & GTM',
          'Detailed monthly ROI and customer acquisition cost reports'
        ]
      }
    ],
    value: 'We focus on customer inquiries, phone calls, and revenue generated—not vanity likes or fake impressions.',
    targetKeywords: [
      'digital marketing company in bhopal',
      'best digital marketing agency in bhopal',
      'digital marketing in mp nagar bhopal',
      'lead generation agency bhopal',
      'social media marketing company bhopal',
      'performance marketing agency bhopal',
      'bhopal marketing agency for small business',
      'digital marketing services charges bhopal'
    ],
    faqs: [
      {
        question: 'How much does digital marketing cost per month in Bhopal?',
        answer: 'Digital marketing management packages at Mahi TechnoCrafts start at ₹8,999/month for focused local lead generation. Comprehensive omnichannel campaigns (SEO + Google Ads + Social Media) range from ₹18,500 to ₹35,000/month. Ad spend is separate and paid directly to Google/Meta.'
      },
      {
        question: 'How quickly can we start receiving customer inquiries?',
        answer: 'With targeted Google Ads and Meta Lead campaigns, client inquiries, phone calls, and WhatsApp messages typically begin within 24 to 48 hours of campaign launch.'
      },
      {
        question: 'Is advertising budget included in your agency fee?',
        answer: 'No. Advertising spend is paid directly to Google or Meta through your own ad account for 100% financial transparency. We charge a flat management fee to strategize, design, optimize, and report on the campaigns.'
      },
      {
        question: 'Can you target specific localities like MP Nagar, Arera Colony, or Kolar?',
        answer: 'Yes! We configure geo-fenced targeting for specific pin codes, neighborhoods, or a radius around your physical store or clinic in Bhopal to minimize wasted ad spend.'
      }
    ]
  },
  {
    slug: 'seo-company-bhopal',
    title: 'Top SEO Company in Bhopal | Rank #1 on Google Search & Maps',
    h1: 'Best SEO Company in Bhopal',
    tagline: 'Guaranteed On-Page, Off-Page & Local Google Map 3-Pack Optimization · 4.9★ Rated',
    metaDescription: 'Rank #1 on Google with Bhopal’s leading SEO company. Mahi TechnoCrafts provides technical SEO, local SEO, keyword ranking & link building in Bhopal. Call +91 62671 44122.',
    summary: 'Want your website to show up on Google 1st Page when customers search for your services in Bhopal? Mahi TechnoCrafts delivers ethical, high-impact White-Hat SEO services: keyword research, technical website audits, high-authority backlinks, and Google Business Profile ranking.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'SEO keyword rankings and organic traffic growth charts',
    label: 'SEO Services',
    startingPrice: '₹7,999/mo',
    deliveryTime: '3 - 6 Months',
    ratingValue: 4.9,
    reviewCount: 162,
    focus: [
      'Comprehensive technical SEO audit and Core Web Vitals speed optimization',
      'Local SEO & Google Business Profile (Google Maps 3-Pack) optimization',
      'High-intent commercial keyword mapping and localized content creation',
      'White-hat link building from trusted, niche-relevant Indian business directories',
      'Structured data (Schema.org LocalBusiness, FAQPage, Review) implementation',
      'Monthly Google Search Console & Google Analytics 4 ranking progress reports'
    ],
    packages: [
      {
        name: 'Local SEO & Maps 3-Pack Booster',
        price: '₹7,999 / month',
        duration: '3 Months Minimum',
        bestFor: 'Local stores, clinics, lawyers, repair shops, and single-location businesses',
        features: [
          'Google Business Profile (GBP) complete optimization',
          'NAP (Name, Address, Phone) consistency across 40+ local directories',
          'Targeting up to 10 localized Bhopal keywords',
          'Review generation strategy & monthly ranking progress report',
          'Basic on-page SEO fixes on your current website'
        ]
      },
      {
        name: 'Full Organic Search SEO Campaign',
        price: '₹14,999 / month',
        duration: '6 Months Retainer',
        popular: true,
        bestFor: 'Service businesses, educational institutes, B2B companies, and e-commerce stores',
        features: [
          'Targeting up to 25 High-Intent Keywords',
          'Complete Technical SEO overhaul (Speed, Crawlability, Sitemaps, Robots.txt)',
          '2 Optimized blog articles & landing pages per month',
          'High-authority backlink outreach & PR mentions',
          'Competitor keyword gap analysis & bi-weekly tracking'
        ]
      },
      {
        name: 'Statewide & Pan-India SEO Dominance',
        price: '₹28,000 / month',
        duration: '6 to 12 Months',
        bestFor: 'Enterprises, multi-city brands, and high-competition industries',
        features: [
          'Targeting 50+ Competitive Statewide & National Keywords',
          'Advanced programmatic SEO architecture for multi-city landing pages',
          '4 In-depth technical articles & guest post placements per month',
          'Continuous Core Web Vitals monitoring & mobile UX optimization',
          'Dedicated senior SEO strategist & weekly live performance calls'
        ]
      }
    ],
    value: 'Sustainable, long-term organic traffic that brings high-intent customers to your website month after month without paying for ads.',
    targetKeywords: [
      'seo company in bhopal',
      'best seo services in bhopal',
      'local seo agency bhopal',
      'google maps ranking service bhopal',
      'top seo agency in mp nagar bhopal',
      'seo expert in bhopal',
      'website ranking company bhopal',
      'seo package cost in bhopal'
    ],
    faqs: [
      {
        question: 'How long does it take for SEO to rank my website on Google in Bhopal?',
        answer: 'For localized keywords in Bhopal (e.g. "dental clinic in kolar road bhopal" or "website designer in mp nagar"), noticeable rank improvements typically happen in 4 to 8 weeks. Highly competitive state-wide or national keywords typically take 3 to 6 months of steady optimization.'
      },
      {
        question: 'Can you guarantee the #1 ranking on Google?',
        answer: 'Google strictly warns that no honest agency can guarantee a #1 ranking because Google algorithms update frequently. However, we guarantee proven White-Hat methodology, technical excellence, transparent monthly reporting, and trackable ranking improvements.'
      },
      {
        question: 'What is Local SEO and why is it important for Bhopal businesses?',
        answer: 'Local SEO optimizes your Google Business Profile so your business appears in the "Google Maps 3-Pack" at the very top of search results when someone searches on mobile. Over 70% of local calls come through the Maps 3-Pack.'
      },
      {
        question: 'Do you provide monthly reports on keyword rankings?',
        answer: 'Yes! Every month, we provide a transparent PDF report showing exact keyword movements, Google Search impressions, organic clicks, and phone calls generated.'
      }
    ]
  },
  {
    slug: 'google-ads-agency-bhopal',
    title: 'Google Ads Agency in Bhopal | Certified PPC & Search Ad Experts',
    h1: 'Certified Google Ads Agency in Bhopal',
    tagline: 'Maximize ROI & Get Instant High-Quality Phone Calls · Google Certified Partner',
    metaDescription: 'Get instant leads with Bhopal’s top Google Ads agency. Mahi TechnoCrafts plans high-ROI Search, Display & YouTube ad campaigns with lowest cost per lead. Call +91 62671 44122.',
    summary: 'Want urgent client calls today? Google Ads puts your business at the very top of Google Search above all organic results. Mahi TechnoCrafts creates high-converting Google PPC campaigns with negative keyword filtering, conversion tracking, and maximum return on ad spend.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Google Ads campaign analytics charts and conversion metrics',
    label: 'Google Ads & PPC',
    startingPrice: '₹7,999/mo',
    deliveryTime: 'Live in 24 - 48 Hours',
    ratingValue: 4.9,
    reviewCount: 129,
    focus: [
      'High-intent Google Search campaigns for commercial buy-intent keywords',
      'Call-Only ads designed to generate direct phone inquiries on mobile devices',
      'Negative keyword lists to prevent wasted budget on irrelevant student/job searches',
      'Google Tag Manager & Google Analytics 4 conversion event tracking',
      'High-speed landing page creation optimized for Google Quality Score (9/10+)',
      'A/B testing ad copy, headlines, and callout extensions to lower Cost-Per-Click (CPC)'
    ],
    packages: [
      {
        name: 'Search Ads Starter',
        price: '₹7,999 / month',
        duration: 'Monthly Setup & Management',
        bestFor: 'Local businesses looking for immediate phone calls and leads in Bhopal',
        features: [
          'Setup of up to 2 Targeted Google Search Campaigns',
          'Negative keyword curation to stop wasteful clicks',
          'Google conversion tracking setup on phone calls and forms',
          'Bhopal geo-targeted radius optimization',
          'Weekly performance & spend reports'
        ]
      },
      {
        name: 'Growth Performance PPC',
        price: '₹14,999 / month',
        duration: 'Monthly Setup & Management',
        popular: true,
        bestFor: 'Competitive niches: Real estate, healthcare, education, law firms, and B2B',
        features: [
          'Google Search Ads + Display Remarketing to re-engage past visitors',
          'Dedicated high-speed conversion landing page included',
          'Continuous A/B split testing of ad copy & extensions',
          'Competitor bid monitoring to capture top-of-page impression share',
          'Bi-weekly optimization calls with certified Google Ads specialist'
        ]
      },
      {
        name: 'Scale & E-Commerce Shopping Ads',
        price: '₹24,999 / month',
        duration: 'Monthly Setup & Management',
        bestFor: 'Online stores, multi-city services, and high ad spend campaigns (₹1L+ budget)',
        features: [
          'Google Merchant Center feed setup & Performance Max (PMax) ads',
          'Dynamic product remarketing across YouTube, Gmail & Search',
          'ROAS (Return On Ad Spend) target bidding algorithms',
          'Custom Looker Studio live analytics dashboard',
          'Dedicated senior PPC account director'
        ]
      }
    ],
    value: 'Engineered to achieve high Google Ad Quality Scores, lowering your cost per click while dominating page-1 positions.',
    targetKeywords: [
      'google ads agency in bhopal',
      'ppc company in bhopal',
      'google adwords expert bhopal',
      'best ppc agency in mp nagar bhopal',
      'google advertising company bhopal',
      'google ads management charges bhopal',
      'pay per click agency bhopal'
    ],
    faqs: [
      {
        question: 'How quickly do Google Ads show up and start generating leads?',
        answer: 'Once your Google Ads campaign and billing are configured, ads go live within 2 to 4 hours. You can start receiving phone calls and web inquiries on the very same day.'
      },
      {
        question: 'How much should I spend on Google Ads daily in Bhopal?',
        answer: 'For most local businesses in Bhopal, a daily budget of ₹500 to ₹1,500 is a great starting point. As we optimize your Cost-Per-Lead and identify top-performing keywords, you can scale your budget according to your lead volume goals.'
      },
      {
        question: 'How do you prevent money being wasted on useless clicks?',
        answer: 'We implement rigorous negative keyword lists (blocking words like "free", "jobs", "salary", "meaning", "course"), set strict geographic boundaries for Bhopal, and configure exact-match intent targeting so you only pay for genuine buyer clicks.'
      },
      {
        question: 'Who owns the Google Ads account?',
        answer: 'You own the Google Ads account 100%. All billing and payment methods are tied directly to your business card/UPI, ensuring complete financial transparency.'
      }
    ]
  }
];

export function getBhopalServicePage(slug: string): BhopalServicePage | undefined {
  return bhopalServicePages.find((page) => page.slug === slug);
}

export function getBhopalServiceMetadata(slug: string): Metadata {
  const page = getBhopalServicePage(slug);
  if (!page) {
    return {
      title: 'Bhopal Digital & IT Services | Mahi TechnoCrafts',
      robots: { index: false, follow: false }
    };
  }

  const canonical = `https://mahitechnocrafts.in/${page.slug}`;
  return {
    title: page.title,
    description: page.metaDescription,
    keywords: page.targetKeywords,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: `${page.title} | Mahi TechnoCrafts`,
      description: page.metaDescription,
      siteName: 'Mahi TechnoCrafts',
      images: [
        {
          url: page.image,
          width: 1200,
          height: 630,
          alt: page.imageAlt
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | Mahi TechnoCrafts`,
      description: page.metaDescription,
      images: [page.image]
    },
    other: {
      'geo.region': 'IN-MP',
      'geo.placename': 'Bhopal',
      'geo.position': '23.259933;77.412613',
      'ICBM': '23.259933, 77.412613'
    }
  };
}
