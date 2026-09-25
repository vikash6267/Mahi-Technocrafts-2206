import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Web Development Bhopal',
  description: 'Get answers to common questions about web development, mobile app development, costs, timelines, and digital marketing services in Bhopal by Mahi TechnoCrafts.',
  alternates: {
    canonical: '/faq'
  },
  keywords: [
    'web development FAQ bhopal',
    'website cost bhopal',
    'mobile app development questions',
    'digital marketing FAQ',
    'bhopal web developer questions'
  ]
};

const faqs = [
  {
    category: "Web Development",
    questions: [
      {
        q: "What is the cost of website development in Bhopal?",
        a: "Website development costs in Bhopal typically range from ₹15,000 for basic websites to ₹2,00,000+ for complex e-commerce or enterprise solutions. At Mahi TechnoCrafts, we provide transparent pricing based on your specific requirements including design complexity, functionality, and timeline."
      },
      {
        q: "How long does it take to develop a website in Bhopal?",
        a: "Standard business websites take 2-4 weeks, e-commerce sites take 4-8 weeks, and complex web applications can take 8-16 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the development process."
      },
      {
        q: "Do you provide website maintenance after launch?",
        a: "Yes, we offer comprehensive maintenance packages including security updates, content updates, performance optimization, backup management, and technical support. Our maintenance plans start from ₹2,000 per month."
      }
    ]
  },
  {
    category: "Mobile App Development",
    questions: [
      {
        q: "What types of mobile apps do you develop in Bhopal?",
        a: "We develop native iOS apps, Android apps, and cross-platform React Native apps. Our expertise includes e-commerce apps, business apps, social media apps, educational apps, and custom enterprise solutions for businesses in Bhopal and across India."
      },
      {
        q: "How much does mobile app development cost in Bhopal?",
        a: "Mobile app development costs vary from ₹50,000 for simple apps to ₹5,00,000+ for complex applications. Factors affecting cost include platform choice (iOS/Android), features, design complexity, backend requirements, and third-party integrations."
      }
    ]
  },
  {
    category: "Digital Marketing & SEO",
    questions: [
      {
        q: "Do you provide SEO services for businesses in Bhopal?",
        a: "Yes, we offer comprehensive SEO services including local SEO for Bhopal businesses, technical SEO, content optimization, Google My Business optimization, and Answer Engine Optimization (AEO) to improve your visibility in AI search results."
      },
      {
        q: "How can I improve my website's Google ranking in Bhopal?",
        a: "To improve Google rankings for Bhopal businesses: optimize for local keywords, create location-specific content, maintain consistent NAP (Name, Address, Phone) information, get local backlinks, optimize Google My Business, and ensure fast website speed and mobile responsiveness."
      }
    ]
  },
  {
    category: "Technical Questions",
    questions: [
      {
        q: "What technologies do you use for web development?",
        a: "We specialize in modern technologies: Next.js, React.js, TypeScript, Node.js, MongoDB, PostgreSQL, AWS, and Tailwind CSS. We choose technologies based on project requirements, scalability needs, and long-term maintenance considerations."
      },
      {
        q: "Do you develop AI-powered websites and applications?",
        a: "Yes, we integrate AI features like chatbots, recommendation engines, voice search, image recognition, and custom machine learning models into websites and mobile apps. We work with OpenAI, Google AI, and custom AI solutions."
      }
    ]
  }
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.flatMap(category => 
      category.questions.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    )
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c')
        }}
      />
      
      <div className="min-h-screen py-16 max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 space-y-4">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
            Get answers to common questions about web development, mobile app development, costs, 
            timelines, and digital marketing services in Bhopal.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                {category.category}
              </h2>
              
              <div className="space-y-6">
                {category.questions.map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      {faq.q}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our expert team in Bhopal is ready to help 
            you with your web development, mobile app, or digital marketing project.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Get Free Consultation
          </a>
        </div>
      </div>
    </>
  );
}