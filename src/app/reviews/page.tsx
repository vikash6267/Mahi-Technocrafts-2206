import React from 'react';
import ReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Client Reviews | Mahi Technocrafts',
  description: 'Read reviews and testimonials from our clients, or submit your own feedback about working with Mahi Technocrafts.',
  alternates: {
    canonical: '/reviews'
  }
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}
