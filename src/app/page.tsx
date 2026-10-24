import type { Metadata } from 'next';
import { getSiteData, getApprovedReviews } from '@/lib/db';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Website Developer in Bhopal | Best Web Development Company - Mahi TechnoCrafts',
  description: 'Looking for the best website developer in Bhopal? Mahi TechnoCrafts builds high-speed custom websites, web portals, mobile apps & e-commerce software across MP Nagar, Arera Colony & Bhopal. Call +91 62671 44122.',
  alternates: {
    canonical: 'https://mahitechnocrafts.in',
  },
  openGraph: {
    title: 'Website Developer in Bhopal | Best Web Development Company - Mahi TechnoCrafts',
    description: 'Looking for the best website developer in Bhopal? Mahi TechnoCrafts builds high-speed custom websites, web portals, mobile apps & e-commerce software across MP Nagar, Arera Colony & Bhopal.',
    url: 'https://mahitechnocrafts.in',
    siteName: 'Mahi TechnoCrafts',
    images: [
      {
        url: 'https://mahitechnocrafts.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'Mahi TechnoCrafts Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Developer in Bhopal | Best Web Development Company - Mahi TechnoCrafts',
    description: 'Looking for the best website developer in Bhopal? Mahi TechnoCrafts builds high-speed custom websites, web portals, mobile apps & e-commerce software.',
    images: ['https://mahitechnocrafts.in/logo.png']
  }
};

// Enable ISR (Incremental Static Regeneration) for instant load speeds
export const revalidate = 10;

export default async function Page() {
  const data = await getSiteData();
  const reviews = await getApprovedReviews();

  return (
    <HomeClient data={data} reviews={reviews} />
  );
}
