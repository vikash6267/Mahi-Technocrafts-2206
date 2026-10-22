import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('it-company-in-bhopal');
export default function Page() {
  return <LandingPage slug="it-company-in-bhopal" />;
}
