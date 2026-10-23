import type { Metadata } from 'next';
import LandingPage from '@/app/(service-seo)/LandingPage';
import { getIndiaServiceMetadata } from '@/lib/india-service-pages';

export const metadata: Metadata = getIndiaServiceMetadata('website-developers-for-coaching-institutes');
export default function Page() {
  return <LandingPage slug="website-developers-for-coaching-institutes" />;
}
