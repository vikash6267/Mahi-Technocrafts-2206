import type { Metadata } from 'next';
import LandingPage from '@/app/(service-seo)/LandingPage';
import { getIndiaServiceMetadata } from '@/lib/india-service-pages';

export const metadata: Metadata = getIndiaServiceMetadata('mobile-app-development-company-in-india');
export default function Page() {
  return <LandingPage slug="mobile-app-development-company-in-india" />;
}
