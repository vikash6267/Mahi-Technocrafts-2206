import React from 'react';
import ReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Client Reviews & Testimonials | Mahi TechnoCrafts Bhopal',
  description: 'Read verified 4.9/5 star client reviews and testimonials from 150+ businesses who built websites, mobile apps, and software with Mahi TechnoCrafts Bhopal.',
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
    title: 'Client Reviews & Testimonials | Mahi TechnoCrafts Bhopal',
    description: '4.9/5 star rating across 150+ successful web and software projects.',
    url: 'https://mahitechnocrafts.in/reviews',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Mahi TechnoCrafts Client Reviews' }]
  }
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
