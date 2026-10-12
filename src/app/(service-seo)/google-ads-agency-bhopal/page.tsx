import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('google-ads-agency-bhopal');
export default function Page() { return <LandingPage slug="google-ads-agency-bhopal" />; }
