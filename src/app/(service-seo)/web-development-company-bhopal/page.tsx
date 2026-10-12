import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('web-development-company-bhopal');
export default function Page() { return <LandingPage slug="web-development-company-bhopal" />; }
