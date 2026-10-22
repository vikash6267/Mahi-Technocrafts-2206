import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('website-developers-for-gym-fitness-bhopal');
export default function Page() {
  return <LandingPage slug="website-developers-for-gym-fitness-bhopal" />;
}
