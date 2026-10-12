import type { Metadata } from 'next';

export type BhopalServicePage = {
  slug: string;
  title: string;
  metaDescription: string;
  summary: string;
  image: string;
  imageAlt: string;
  label: string;
  focus: string[];
  value: string;
  faqs: { question: string; answer: string }[];
};

export const bhopalServicePages: BhopalServicePage[] = [
  {
    slug: 'website-design-company-bhopal',
    title: 'Website Design Company in Bhopal',
    metaDescription: 'Plan a modern, mobile-friendly website for your Bhopal business. Mahi TechnoCrafts designs clear, accessible experiences built around your customers.',
    summary: 'Looking for a website designing company or website designer in Bhopal? We plan responsive business websites around your brand, customers, and goals, with clear content and an easy next step.',
    image: '/images/herosection.webp',
    imageAlt: 'Web design and development workspace at Mahi TechnoCrafts',
    label: 'Website design',
    focus: ['Brand-led layouts and page structure', 'Mobile and tablet responsive design', 'Accessible typography and clear calls to action', 'Search-friendly page hierarchy'],
    value: 'Design that makes it easier for customers to understand your services, explore your work, and contact your team.',
    faqs: [
      { question: 'What is included in website design?', answer: 'The scope can include page planning, visual direction, responsive layouts, typography, calls to action, and handoff for development. The exact deliverables depend on your project.' },
      { question: 'Can you redesign my existing business website?', answer: 'Yes. We can review the current site, identify usability and content issues, and plan a redesign that fits your brand and business priorities.' },
      { question: 'Will the design work on mobile phones?', answer: 'Yes. Mobile layouts are part of the design process, so navigation, text, images, and key actions are planned for smaller screens as well as desktop.' },
      { question: 'How much does business website design cost in Bhopal?', answer: 'Website design cost depends on the number of pages, content, custom layouts, and whether development is included. Share your requirements for a project-specific estimate.' },
    ],
  },
  {
    slug: 'web-development-company-bhopal',
    title: 'Web Development Company in Bhopal',
    metaDescription: 'Mahi TechnoCrafts builds business websites, web portals, and custom applications in Bhopal with responsive interfaces and technical SEO foundations.',
    summary: 'Need a website development company or web developer in Bhopal? We build business websites, web portals, and custom applications around how your customers and team need to use them.',
    image: '/images/herosection.webp',
    imageAlt: 'Laptop displaying a web development workspace',
    label: 'Web development',
    focus: ['Business websites and landing pages', 'Custom portals and dashboards', 'CMS and third-party integrations', 'Performance, accessibility, and technical SEO'],
    value: 'A maintainable web experience with the right features for your team, rather than a one-size-fits-all template.',
    faqs: [
      { question: 'What kinds of websites do you develop?', answer: 'We develop company websites, service pages, ecommerce experiences, and custom web applications. We confirm the requirements and integrations before recommending an approach.' },
      { question: 'Can my team update the website after launch?', answer: 'We can include a content management system or an admin workflow where it fits the project, and provide a handover for routine updates.' },
      { question: 'Do you provide support after launch?', answer: 'Support and maintenance can be included in the project plan. We agree on the tasks, duration, and response expectations before work begins.' },
      { question: 'How long does website development take?', answer: 'The timeline depends on page count, content readiness, integrations, and review cycles. We confirm milestones after understanding the scope.' },
    ],
  },
  {
    slug: 'ecommerce-development-company-bhopal',
    title: 'E-commerce Development Company in Bhopal',
    metaDescription: 'Launch or improve your online store with ecommerce development in Bhopal. Product catalogues, checkout, order management, and mobile-first shopping experiences.',
    summary: 'Looking for ecommerce website development in Bhopal? We build online stores with practical product catalogues, checkout, payment, and order-management workflows for your customers and team.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Organized retail shelves representing an online product catalogue',
    label: 'E-commerce development',
    focus: ['Product catalogues, categories, and search', 'Cart, checkout, and payment gateway integration', 'Order notifications and fulfilment workflows', 'Mobile-first store management'],
    value: 'A store experience designed around your products, payment options, fulfilment process, and customers.',
    faqs: [
      { question: 'Can you connect payment gateways to my store?', answer: 'We can integrate a suitable payment provider based on your business, account eligibility, and technical requirements. Provider charges and approval terms are separate.' },
      { question: 'Can I manage products and orders myself?', answer: 'Yes. We can provide an admin interface for product, inventory, and order updates, with a handover so your team can manage daily tasks.' },
      { question: 'Can the store connect with delivery or accounting tools?', answer: 'Where supported, we can scope integrations for shipping, accounting, messaging, or inventory systems after reviewing the tools and access available.' },
      { question: 'Can you set up shipping and Indian payment options?', answer: 'We can scope suitable payment and shipping integrations after checking your provider accounts, service areas, and fulfilment process. Provider fees and approval terms apply separately.' },
    ],
  },
  {
    slug: 'mobile-app-development-company-bhopal',
    title: 'Mobile App Development Company in Bhopal',
    metaDescription: 'Discuss Android and iOS app development in Bhopal with Mahi TechnoCrafts. Plan customer apps, internal tools, APIs, notifications, and app releases.',
    summary: 'A useful mobile app starts with a clear job to do. We help shape the experience, choose a practical build approach, and connect the app to the services and data your workflow needs.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Mobile phone displaying an app interface',
    label: 'Mobile app development',
    focus: ['Android and iOS customer applications', 'Internal team and field-work tools', 'API, login, and payment integrations', 'Testing, release preparation, and handover'],
    value: 'An app planned around real user tasks, with a clear scope for the first release and room to improve over time.',
    faqs: [
      { question: 'Do you build apps for Android and iPhone?', answer: 'We can plan Android, iOS, or cross-platform app development based on your users, feature needs, budget, and maintenance requirements.' },
      { question: 'Can the app use my existing website or software data?', answer: 'Often, yes. We first review whether your current system has a suitable API and then scope the integration, permissions, and data flow.' },
      { question: 'Do you publish apps to Google Play or the App Store?', answer: 'We can help prepare a release and guide the submission process. Store accounts, review decisions, and approval timelines are controlled by each platform.' },
      { question: 'What affects mobile app development cost?', answer: 'App cost depends on platforms, features, design, integrations, and ongoing maintenance. We define a first-release scope before preparing an estimate.' },
    ],
  },
  {
    slug: 'digital-marketing-company-bhopal',
    title: 'Digital Marketing Company in Bhopal',
    metaDescription: 'Build a practical digital marketing plan for your Bhopal business. Mahi TechnoCrafts helps with campaign planning, content, landing pages, and measurement.',
    summary: 'Searching for a digital marketing agency in Bhopal? We coordinate campaign planning, useful content, landing pages, and measurement around your audience and business objectives.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Marketing team reviewing a digital campaign together',
    label: 'Digital marketing',
    focus: ['Campaign and audience planning', 'Landing pages and lead capture', 'Content and social media direction', 'Analytics and conversion measurement'],
    value: 'A coordinated plan that makes it easier to see what is being promoted, who it is for, and how enquiries are measured.',
    faqs: [
      { question: 'Which digital marketing channels can you support?', answer: 'The plan may include search, social media, content, or paid advertising depending on your goals, audience, and available budget.' },
      { question: 'Can you build a landing page for a campaign?', answer: 'Yes. We can create a focused landing page with relevant information, a clear call to action, and analytics tags agreed for the campaign.' },
      { question: 'How do you report campaign performance?', answer: 'We agree on useful measures such as visits, enquiries, and conversions, then review available analytics and campaign data with you.' },
      { question: 'Which digital marketing services should my business start with?', answer: 'It depends on how customers find your service, your budget, and your goals. We review your audience and current website before recommending a practical mix of search, content, social, or paid campaigns.' },
    ],
  },
  {
    slug: 'seo-company-bhopal',
    title: 'SEO Company in Bhopal',
    metaDescription: 'Improve your website’s search foundations with SEO support in Bhopal. Technical audits, local search, structured content, and measurable improvements.',
    summary: 'Need SEO services in Bhopal? We improve the foundations that help people discover your business: useful pages, local business information, technical health, and clear measurement.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Website analytics dashboard used to review search and business performance',
    label: 'Search engine optimization',
    focus: ['Technical SEO review and prioritised fixes', 'Local search and Google Business Profile guidance', 'Page structure, internal links, and useful content', 'Structured data and search performance reporting'],
    value: 'A clear view of what is holding the site back and a prioritised plan to improve discovery and the visitor experience.',
    faqs: [
      { question: 'Can an SEO company guarantee a first-page or number-one ranking?', answer: 'No responsible SEO provider can guarantee a specific ranking. Search results depend on many factors outside any one company’s control. We focus on sound improvements and transparent reporting.' },
      { question: 'Do you help with local SEO in Bhopal?', answer: 'Yes. Local SEO work can include accurate business details, Google Business Profile guidance, location-relevant pages, reviews strategy, and technical improvements.' },
      { question: 'How soon will SEO changes show results?', answer: 'Timing varies with the site, competition, search demand, and the work required. We set realistic milestones and review progress instead of promising a fixed ranking date.' },
      { question: 'How much do SEO services in Bhopal cost?', answer: 'SEO pricing depends on your site, locations, competition, and the work required. After reviewing your goals and website, we can outline a suitable scope and estimate.' },
    ],
  },
  {
    slug: 'google-ads-agency-bhopal',
    title: 'Google Ads Agency in Bhopal',
    metaDescription: 'Plan measurable Google Ads campaigns for your Bhopal business. Mahi TechnoCrafts supports keyword planning, landing pages, conversion tracking, and reporting.',
    summary: 'Paid search can help you reach people actively looking for a service. We plan campaigns around your offer, location, budget, landing page, and a measurement setup you can review.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Campaign analytics charts displayed on a laptop screen',
    label: 'Google Ads',
    focus: ['Keyword and campaign structure planning', 'Location and audience settings', 'Landing pages and enquiry tracking', 'Budget, search terms, and performance reviews'],
    value: 'A campaign you can understand and measure, with spend and conversion goals discussed before launch.',
    faqs: [
      { question: 'Is the Google Ads budget included in your service fee?', answer: 'Advertising spend is paid to Google and is separate from management or development fees. We clarify both costs and account ownership before a campaign begins.' },
      { question: 'Can you target customers in Bhopal?', answer: 'Campaigns can be configured for locations relevant to your business. We review service areas and targeting settings with you before launch.' },
      { question: 'Do you guarantee leads or sales from Google Ads?', answer: 'No. Results depend on demand, competition, offer, budget, and landing-page experience. We can set up measurement and use campaign data to guide improvements.' },
      { question: 'What does Google Ads management cost?', answer: 'Google Ads management fees depend on campaign scope and support required. They are separate from the advertising budget paid to Google; both should be clear before launch.' },
    ],
  },
];

export function getBhopalServicePage(slug: string) {
  return bhopalServicePages.find((page) => page.slug === slug);
}

export function getBhopalServiceMetadata(slug: string): Metadata {
  const page = getBhopalServicePage(slug);
  if (!page) return { title: 'Bhopal Digital Services', robots: { index: false, follow: false } };

  const canonical = `https://mahitechnocrafts.in/${page.slug}`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: `${page.title} | Mahi TechnoCrafts`,
      description: page.metaDescription,
      siteName: 'Mahi TechnoCrafts',
      images: [{ url: page.image, alt: page.imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.title} | Mahi TechnoCrafts`,
      description: page.metaDescription,
      images: [page.image],
    },
  };
}
