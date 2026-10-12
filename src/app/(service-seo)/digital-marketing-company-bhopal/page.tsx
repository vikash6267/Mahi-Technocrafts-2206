import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('digital-marketing-company-bhopal');
export default function Page() { return <LandingPage slug="digital-marketing-company-bhopal" />; }
