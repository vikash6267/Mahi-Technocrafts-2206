import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import LayoutWrapper from '@/components/LayoutWrapper';

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
    default: 'Mahi Technocrafts | Premium Web & AI Solutions',
    template: '%s | Mahi Technocrafts'
  },
  description: 'Mahi Technocrafts is a premium software agency and the best developer near me in Bhopal, crafting world-class digital solutions including web development, mobile apps, UI/UX designs, and custom AI systems.',
  alternates: {
    canonical: '/'
  },
  keywords: [
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
    title: 'Mahi Technocrafts | Premium Web & AI Solutions',
    description: 'Your Imagination, Our Creation. Premium software development agency specializing in Next.js, React, Mobile Apps, AI, and custom engineering near you.',
    siteName: 'Mahi Technocrafts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahi Technocrafts | Premium Web & AI Solutions',
    description: 'Your Imagination, Our Creation. Premium software development agency specializing in Next.js, React, Mobile Apps, AI, and custom engineering near you.',
    creator: '@mahi_technocrafts',
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
        <ThemeProvider>
          <SmoothScroll>
            <LayoutWrapper>{children}</LayoutWrapper>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
