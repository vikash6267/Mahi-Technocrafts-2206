import { getSiteData, getApprovedReviews } from '@/lib/db';
import HomeClient from './HomeClient';

// Enable ISR (Incremental Static Regeneration) for instant load speeds
export const revalidate = 10;

export default async function Page() {
  const data = await getSiteData();
  const reviews = await getApprovedReviews();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mahi Technocrafts',
    url: 'https://mahitechnocrafts.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mahitechnocrafts.in/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Mahi TechnoCrafts',
    '@id': 'https://mahitechnocrafts.in',
    description: 'Mahi TechnoCrafts is the top website development company in Bhopal, crafting world-class digital solutions including web development, mobile apps, UI/UX designs, and custom software.',
    url: 'https://mahitechnocrafts.in/',
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    telephone: `+91${data.contactInfo.phone}`,
    email: data.contactInfo.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
      addressLocality: 'Bhopal',
      addressRegion: 'MP',
      postalCode: '462001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.2694,
      longitude: 77.4019
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '00:00',
      closes: '23:59'
    },
    sameAs: [
      'https://www.instagram.com/mahi_technocrafts/',
      'https://www.linkedin.com/company/mahi-technocrafts/'
    ]
  };

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

  const schemas: any[] = [websiteSchema, localBusinessSchema];
  if (faqSchema) {
    schemas.push(faqSchema);
  }

  return (
    <>
      {schemas.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, '\\u003c')
          }}
        />
      ))}
      <HomeClient data={data} reviews={reviews} />
    </>
  );
}
