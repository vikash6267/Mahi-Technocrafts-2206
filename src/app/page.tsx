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
    name: 'Mahi Technocrafts',
    description: 'Mahi Technocrafts is a premium tech company and the best software developer near me in Bhopal, crafting world-class digital solutions including web development, mobile apps, UI/UX designs, and custom AI systems.',
    url: 'https://mahitechnocrafts.in',
    logo: 'https://mahitechnocrafts.in/logo.png',
    image: 'https://mahitechnocrafts.in/logo.png',
    telephone: `+91${data.contactInfo.phone}`,
    email: data.contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hamidia Rd, Badabagh, Shahjahanabad',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      postalCode: '462001',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.250550,
      longitude: 77.394857
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '19:00'
    },
    sameAs: [
      'https://www.instagram.com/mahi_technocrafts/',
      'https://www.linkedin.com/company/mahi-technocrafts/'
    ],
    priceRange: '$$'
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
