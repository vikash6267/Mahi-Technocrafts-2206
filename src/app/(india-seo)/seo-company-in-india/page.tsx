import type { Metadata } from 'next';
import LandingPage from '@/app/(service-seo)/LandingPage';
import { getIndiaServiceMetadata } from '@/lib/india-service-pages';

export const metadata: Metadata = getIndiaServiceMetadata('seo-company-in-india');
export default function Page() {
  return <LandingPage slug="seo-company-in-india" />;
}
