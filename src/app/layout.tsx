import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';
import MetaPixel from './meta-pixel';
import AnalyticsTracker from '@/components/AnalyticsTracker';

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
    default: 'Web Design & Software Development in Bhopal | Mahi TechnoCrafts',
    template: '%s | Mahi TechnoCrafts'
  },
  description: 'Mahi TechnoCrafts designs and develops websites, web applications, mobile apps, and business software for companies in Bhopal and across India.',
  alternates: {
    canonical: '/'
  },
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
    title: 'Web Design & Software Development in Bhopal | Mahi TechnoCrafts',
    description: 'Websites, mobile apps, and custom software designed and developed by Mahi TechnoCrafts in Bhopal, India.',
    siteName: 'Mahi TechnoCrafts',
    images: [
      {
        url: 'https://mahitechnocrafts.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'Mahi TechnoCrafts web and software development'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Design & Software Development in Bhopal | Mahi TechnoCrafts',
    description: 'Websites, apps, and business software from Mahi TechnoCrafts, Bhopal.',
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
    description: 'Web design, software development, mobile apps, and digital services based in Bhopal, Madhya Pradesh, India.',
    url: 'https://mahitechnocrafts.in',
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    telephone: '+916267144122',
    email: 'support@mahitechnocrafts.in',
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
    areaServed: [
      { '@type': 'City', name: 'Bhopal' },
      { '@type': 'City', name: 'Indore' },
      { '@type': 'State', name: 'Madhya Pradesh' },
      { '@type': 'Country', name: 'India' }
    ],
    sameAs: [
      'https://github.com/vikash6267',
      'https://www.linkedin.com/company/mahi-technocrafts/',
      'https://www.instagram.com/mahi_technocrafts/',
      'https://x.com/mahi_technocrafts'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Comprehensive IT & Digital Growth Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development & Full-Stack Engineering',
            description: 'Business websites, web portals, and custom application workflows with responsive layouts and technical SEO foundations.',
            url: 'https://mahitechnocrafts.in/services/web-dev'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'Android and iOS app planning, development, integrations, release preparation, and handover scoped to project requirements.',
            url: 'https://mahitechnocrafts.in/services/mobile-dev'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Enterprise AI Solutions & Smart Chatbots',
            description: 'Chat and workflow automation to handle common questions, route enquiries, and support team processes.',
            url: 'https://mahitechnocrafts.in/services/ai-solutions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Digital Marketing & Growth Hacking',
            description: 'Campaign planning, landing pages, paid search and social advertising, and conversion measurement.',
            url: 'https://mahitechnocrafts.in/services/digital-marketing'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'SEO & Generative Engine Optimization (AEO/GEO)',
            description: 'Local search optimization and technical SEO support for businesses in Bhopal and India.',
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
            description: 'Product catalogues, checkout, payment-provider integrations, and order-management workflows.',
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
            description: 'Hosting and security requirements are reviewed and agreed as part of each project scope.',
            url: 'https://mahitechnocrafts.in/services/cloud-services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cyber Security & Server Hardening',
            description: 'Security review and protection requirements are scoped to the systems and risks discussed for each project.',
            url: 'https://mahitechnocrafts.in/services/cyber-security'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Social Media Marketing (SMM) & Branding',
            description: 'Social campaign planning, content direction, brand identity, and audience engagement scoped to your goals.',
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
    description: 'Web design, software development, mobile apps, and digital services from Bhopal, India.',
    publisher: {
      '@id': 'https://mahitechnocrafts.in/#organization'
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

        <AnalyticsTracker />
        <ThemeProvider>
          <SmoothScroll>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
