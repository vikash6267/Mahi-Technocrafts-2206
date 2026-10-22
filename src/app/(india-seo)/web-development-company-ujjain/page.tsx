import type { Metadata } from 'next';
import LandingPage from '@/app/(service-seo)/LandingPage';
import { getIndiaServiceMetadata } from '@/lib/india-service-pages';

export const metadata: Metadata = getIndiaServiceMetadata('web-development-company-ujjain');
export default function Page() {
  return <LandingPage slug="web-development-company-ujjain" />;
}
