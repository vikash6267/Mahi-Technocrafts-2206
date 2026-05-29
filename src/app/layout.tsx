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
    default: 'Mahi Technocrafts | Beautiful Websites & Custom Apps',
    template: '%s | Mahi Technocrafts'
  },
  description: 'Mahi Technocrafts is a premium tech partner and the best website developer near me in Bhopal, crafting beautiful digital solutions including websites, mobile apps, designs, and smart business automation systems.',
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
    title: 'Mahi Technocrafts | Beautiful Websites & Custom Apps',
    description: 'Your Imagination, Our Creation. Premium website and app development company specializing in fast websites, mobile apps, and custom business software near you.',
    siteName: 'Mahi Technocrafts',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahi Technocrafts | Beautiful Websites & Custom Apps',
    description: 'Your Imagination, Our Creation. Premium website and app development company specializing in fast websites, mobile apps, and custom business software near you.',
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
