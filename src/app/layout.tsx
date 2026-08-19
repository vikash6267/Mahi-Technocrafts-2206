import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';

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
    '@type': 'ProfessionalService',
    '@id': 'https://mahitechnocrafts.in/#organization',
    name: 'Mahi TechnoCrafts',
    alternateName: 'Mahi Technocrafts',
    description: 'Mahi TechnoCrafts is the top website development company in Bhopal, founded by Vikash Maheshwari. We craft world-class digital solutions including Next.js web development, React mobile apps, UI/UX designs, AI solutions, e-commerce platforms, and custom software for businesses in Bhopal and across India.',
    url: 'https://mahitechnocrafts.in/',
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    telephone: '+916267144122',
    email: 'support@mahitechnocrafts.in',
    priceRange: '$$',
    founder: {
      '@type': 'Person',
      name: 'Vikash Maheshwari',
      jobTitle: 'Founder & CEO'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
      addressLocality: 'Bhopal',
      addressRegion: 'MP',
      postalCode: '462001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.2694,
      longitude: 77.4019
    },
    areaServed: [
      {
        '@type': 'City',
        name: 'Bhopal'
      },
      {
        '@type': 'State',
        name: 'Madhya Pradesh'
      },
      {
        '@type': 'Country',
        name: 'India'
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
      'https://www.instagram.com/mahi_technocrafts/',
      'https://www.linkedin.com/company/mahi-technocrafts/'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web Development',
            description: 'Custom website development using Next.js, React, and MERN stack'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mobile App Development',
            description: 'iOS and Android mobile application development'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce Development',
            description: 'Custom online store and e-commerce platform development'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UI/UX Design',
            description: 'User interface and user experience design services'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Solutions',
            description: 'Artificial intelligence and machine learning integration'
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

        <ThemeProvider>
          <SmoothScroll>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
