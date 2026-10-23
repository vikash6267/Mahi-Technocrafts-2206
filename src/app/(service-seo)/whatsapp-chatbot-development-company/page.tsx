import type { Metadata } from 'next';
import LandingPage from '../LandingPage';
import { getBhopalServiceMetadata } from '@/lib/bhopal-service-pages';

export const metadata: Metadata = getBhopalServiceMetadata('whatsapp-chatbot-development-company');

export default function Page() {
  return <LandingPage slug="whatsapp-chatbot-development-company" />;
}
