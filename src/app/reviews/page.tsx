import React from 'react';
import ReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Share Feedback | Mahi TechnoCrafts',
  description: 'Share feedback about your experience working with Mahi TechnoCrafts. Submissions are reviewed before publication.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: '/reviews'
  },
  keywords: [
    'Mahi TechnoCrafts reviews',
    'web development company reviews bhopal',
    'best software agency bhopal rating',
    'client testimonials mahi technocrafts'
  ],
  openGraph: {
    title: 'Share Feedback | Mahi TechnoCrafts',
    description: 'Share feedback about your experience working with Mahi TechnoCrafts.',
    url: 'https://mahitechnocrafts.in/reviews',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Mahi TechnoCrafts Client Reviews' }]
  }
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
