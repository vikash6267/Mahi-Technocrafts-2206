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
  description: 'Mahi TechnoCrafts is the top website development company in Bhopal. Experts in MERN stack, custom e-commerce web design, software, and local SEO solutions.',
  alternates: {
    canonical: '/'
  },
  keywords: [
    'website developer in bhopal',
    'best web development company bhopal',
    'web design hamidia road bhopal',
    'mern stack developers bhopal',
    'Mahi Technocrafts',
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
    'Vikash Maheshwari',
    'Bhopal Tech Company',
    'software development company Bhopal',
    'IT services Bhopal'
  ],
  authors: [{ name: 'Vikash Maheshwari' }],
  creator: 'Vikash Maheshwari',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://mahitechnocrafts.in',
    title: 'Best Website Developer in Bhopal | Mahi TechnoCrafts',
    description: 'Get premium custom web applications and e-commerce stores in Bhopal from Mahi TechnoCrafts.',
    siteName: 'Mahi TechnoCrafts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Website Developer in Bhopal | Mahi TechnoCrafts',
    description: 'Get premium custom web applications and e-commerce stores in Bhopal from Mahi TechnoCrafts.',
    creator: '@mahi_technocrafts',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://mahitechnocrafts.in')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
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
