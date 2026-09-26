import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';
import MetaPixel from './meta-pixel';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});


export const metadata: Metadata = {
  title: {
    default: 'Best Website Development Company in Bhopal | Mahi TechnoCrafts',
    template: '%s | Mahi TechnoCrafts'
  },
  description: 'Mahi TechnoCrafts is the top website development company in Bhopal, founded by Vikash Maheshwari. Experts in MERN stack, Next.js, React, custom e-commerce, mobile apps, AI solutions, UI/UX design, and local SEO for businesses in Bhopal and across India.',
  alternates: {
    canonical: '/'
  },
  keywords: [
    'website developer in bhopal',
    'best web development company bhopal',
    'web design hamidia road bhopal',
    'mern stack developers bhopal',
    'Mahi Technocrafts',
    'Vikash Maheshwari',
    'near by developer',
    'developer near me',
    'web developer near me',
    'software developer near me',
    'app developer near me',
    'Next.js developers near me',
    'best software company nearby',
    'Web Development Bhopal',
    'Next.js Development Agency',
    'React App Developers',
    'Mobile App Development',
    'UI/UX Design Company',
    'AI Solutions',
    'Bhopal Tech Company',
    'software development company Bhopal',
    'IT services Bhopal',
    'e-commerce development bhopal',
    'custom software bhopal',
    'digital marketing bhopal',
    'SEO company bhopal',
    'app development bhopal'
  ],
  authors: [{ name: 'Vikash Maheshwari', url: 'https://mahitechnocrafts.in/about' }],
  creator: 'Vikash Maheshwari',
  publisher: 'Mahi TechnoCrafts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mahitechnocrafts.in',
    title: 'Best Website Developer in Bhopal | Mahi TechnoCrafts',
    description: 'Get premium custom web applications, mobile apps, and e-commerce stores in Bhopal from Mahi TechnoCrafts. Expert Next.js, React, and MERN stack development.',
    siteName: 'Mahi TechnoCrafts',
    images: [
      {
        url: 'https://mahitechnocrafts.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'Mahi TechnoCrafts - Best Web Development Company Bhopal'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Website Developer in Bhopal | Mahi TechnoCrafts',
    description: 'Get premium custom web applications and e-commerce stores in Bhopal from Mahi TechnoCrafts.',
    creator: '@mahi_technocrafts',
    images: ['https://mahitechnocrafts.in/logo.png']
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'technology',
  metadataBase: new URL('https://mahitechnocrafts.in')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': 'https://mahitechnocrafts.in/#organization',
    name: 'Mahi TechnoCrafts',
    alternateName: ['MTC', 'Mahi TechnoCrafts Bhopal', 'Mahi TechnoCrafts India', 'Mahi Technocrafts'],
    description: 'Mahi TechnoCrafts is the top-rated IT service company, custom software development agency, and AI automation partner in Bhopal, Madhya Pradesh, serving clients across India and worldwide. We specialize in web apps, mobile apps, AI chatbots, custom ERP/CRM, and global digital marketing.',
    url: 'https://mahitechnocrafts.in',
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    telephone: '+916267144122',
    email: 'support@mahitechnocrafts.in',
    priceRange: '₹₹₹',
    founder: {
      '@type': 'Person',
      name: 'Vikash Maheshwari',
      jobTitle: 'Founder & Chief Technology Officer',
      url: 'https://mahitechnocrafts.in/about',
      sameAs: [
        'https://github.com/vikash6267',
        'https://www.linkedin.com/company/mahi-technocrafts/'
      ]
    },
    knowsAbout: [
      'Custom Software Development Bhopal',
      'Enterprise AI Solutions & Chatbots India',
      'Full-Stack Web Application Engineering',
      'Next.js & React App Development',
      'Mobile App Development (iOS & Android)',
      'Digital Marketing & Growth Hacking',
      'Search Engine Optimization (SEO & AEO)',
      'Generative Engine Optimization (GEO)',
      'WhatsApp CRM & Workflow Automation',
      'Custom ERP & Business POS Software',
      'E-commerce Store Development & Management',
      'Cloud Infrastructure & Secure Hosting AWS',
      'Cyber Security Audits & Server Hardening',
      'UI/UX Branding & Product Design',
      'Smart ID Card Printing & RFID Solutions'
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.2694,
      longitude: 77.4019
    },
    areaServed: [
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'State', name: 'Madhya Pradesh' },
      { '@type': 'Country', name: 'India' },
      {
        '@type': 'Place',
        name: 'Worldwide',
        sameAs: 'https://en.wikipedia.org/wiki/Earth'
      }
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://github.com/vikash6267',
      'https://www.linkedin.com/company/mahi-technocrafts/',
      'https://www.instagram.com/mahi_technocrafts/',
      'https://x.com/mahi_technocrafts'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Comprehensive IT & Digital Growth Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development & Full-Stack Engineering',
            description: 'Custom web application and portal engineering using Next.js, React, Node.js, and modern high-speed architectures.',
            url: 'https://mahitechnocrafts.in/services/web-dev'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'Native iOS and Android mobile app development with 1-click UPI payments and App Store / Play Store publishing.',
            url: 'https://mahitechnocrafts.in/services/mobile-dev'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise AI Solutions & Smart Chatbots',
            description: 'Custom AI conversational bots, OpenAI/Gemini integrations, and WhatsApp CRM automation to scale business inquiries 24/7.',
            url: 'https://mahitechnocrafts.in/services/ai-solutions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing & Growth Hacking',
            description: 'Full-funnel Google Ads, Meta PPC, conversion-optimized landing pages, and lead generation campaigns.',
            url: 'https://mahitechnocrafts.in/services/digital-marketing'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO & Generative Engine Optimization (AEO/GEO)',
            description: 'Local SEO Bhopal, Google Maps #1 rank optimization, and Answer Engine Optimization for ChatGPT, Perplexity, and Gemini.',
            url: 'https://mahitechnocrafts.in/services/seo-services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom ERP & Business POS Software',
            description: 'Tailored enterprise resource planning, CRM, inventory, and automated billing software.',
            url: 'https://mahitechnocrafts.in/services/erp-crm'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-Commerce Store Setup & Management',
            description: 'High-speed online shopping stores, automated shipping sync, COD verification, and WhatsApp catalog integration.',
            url: 'https://mahitechnocrafts.in/services/ecommerce-management'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UI/UX Design & Prototyping',
            description: 'Conversion-centric Figma prototypes, design systems, and responsive user interfaces.',
            url: 'https://mahitechnocrafts.in/services/uiux-design'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Secure Cloud Hosting & DevOps',
            description: 'Enterprise AWS cloud setups, 99.9% uptime SLA, automated backups, and zero-downtime deployments.',
            url: 'https://mahitechnocrafts.in/services/cloud-services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cyber Security & Server Hardening',
            description: 'Vulnerability assessments, SSL enforcement, malware protection, and secure encrypted database architecture.',
            url: 'https://mahitechnocrafts.in/services/cyber-security'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Marketing (SMM) & Branding',
            description: 'Viral Instagram Reels, brand identity style guides, vector logos, and community engagement.',
            url: 'https://mahitechnocrafts.in/services/social-media-marketing'
          }
        }
      ]
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://mahitechnocrafts.in/#website',
    name: 'Mahi TechnoCrafts',
    url: 'https://mahitechnocrafts.in/',
    description: 'Best website development company in Bhopal offering Next.js, React, mobile app development, and digital solutions',
    publisher: {
      '@id': 'https://mahitechnocrafts.in/#organization'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://mahitechnocrafts.in/blog?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-IN'
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Global Structured Data JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(/</g, '\\u003c')
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c')
          }}
        />

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T4S7M098JF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T4S7M098JF');
          `}
        </Script>

        {/* Meta Pixel for Ads Tracking */}
        <MetaPixel pixelId="4037427749886747" />

        <ThemeProvider>
          <SmoothScroll>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
