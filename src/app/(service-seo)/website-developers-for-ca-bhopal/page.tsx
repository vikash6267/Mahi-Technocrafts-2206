import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('website-developers-for-ca-bhopal');
export default function Page() {
  return <LandingPage slug="website-developers-for-ca-bhopal" />;
}
