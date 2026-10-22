import type { Metadata } from 'next';
import { getSiteData, getApprovedReviews } from '@/lib/db';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://mahitechnocrafts.in',
  },
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
