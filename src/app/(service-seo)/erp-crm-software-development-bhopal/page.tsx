import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('erp-crm-software-development-bhopal');

export default function Page() {
  return <LandingPage slug="erp-crm-software-development-bhopal" />;
}
