import type { Metadata } from 'next';
import LandingPage from '@/app/(service-seo)/LandingPage';
import { getIndiaServiceMetadata } from '@/lib/india-service-pages';

export const metadata: Metadata = getIndiaServiceMetadata('software-development-company-in-india');
export default function Page() {
  return <LandingPage slug="software-development-company-in-india" />;
}
