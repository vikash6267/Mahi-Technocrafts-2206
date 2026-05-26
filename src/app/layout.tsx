import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: {
    default: 'Mahi Technocrafts | Premium Web & AI Solutions',
    template: '%s | Mahi Technocrafts'
  },
  description: 'Mahi Technocrafts is a premium software agency and the best developer near me in Bhopal, crafting world-class digital solutions including web development, mobile apps, UI/UX designs, and custom AI systems.',
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
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mahi Technocrafts Premium Web & AI solutions'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahi Technocrafts | Premium Web & AI Solutions',
    description: 'Your Imagination, Our Creation. Premium software development agency specializing in Next.js, React, Mobile Apps, AI, and custom engineering near you.',
    creator: '@mahi_technocrafts',
    images: ['/og-image.jpg']
  },
  metadataBase: new URL('https://mahitechnocrafts.in')
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
