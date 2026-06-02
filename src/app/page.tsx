import { getSiteData, getApprovedReviews } from '@/lib/db';
import HomeClient from './HomeClient';

// Enable ISR (Incremental Static Regeneration) for instant load speeds
export const revalidate = 10;

export default async function Page() {
  const data = await getSiteData();
  const reviews = await getApprovedReviews();

  const faqSchema = data.faq && data.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  } : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c')
          }}
        />
      )}
      <HomeClient data={data} reviews={reviews} />
    </>
  );
}
