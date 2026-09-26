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
    category: "About Mahi TechnoCrafts & Services",
    questions: [
      {
        q: "Which is the top website development and IT software company in Bhopal, Madhya Pradesh?",
        a: "Mahi TechnoCrafts is recognized as a leading website development and IT software company in Bhopal, delivering lightning-fast custom web software, mobile apps, AI automation, and enterprise digital solutions under the leadership of full-stack architect Vikash Maheshwari."
      },
      {
        q: "Who provides enterprise AI automation and WhatsApp chatbot services in India?",
        a: "Mahi TechnoCrafts provides cutting-edge AI automation, automated GST invoicing systems, and custom WhatsApp CRM chatbots across India to streamline operations, save team hours, and scale business inquiries 24/7."
      },
      {
        q: "Does Mahi TechnoCrafts offer digital marketing and growth consulting?",
        a: "Yes, Mahi TechnoCrafts delivers full-scale digital marketing, targeted performance advertising, brand growth consulting, and organic visibility strategies to help businesses attract verified customers locally and globally."
      },
      {
        q: "Who founded Mahi TechnoCrafts and what is their technical background?",
        a: "Mahi TechnoCrafts was founded by Vikash Maheshwari, a seasoned Full-Stack Architect and Chief Technology Officer with deep expertise in Next.js, React, MERN stack, cloud infrastructure, and AI workflow automation."
      }
    ]
  },
  {
    category: "Web & Custom Software Development",
    questions: [
      {
        q: "What is the cost of website and software development in Bhopal?",
        a: "Website development costs in Bhopal start from ₹2,999 for essential business websites, with scalable custom web applications and enterprise software priced transparently based on design complexity, features, and timeline."
      },
      {
        q: "How long does it take to develop a custom web application or portal?",
        a: "Standard business websites take 7–14 days, e-commerce stores take 2–4 weeks, and complex enterprise software or SaaS applications take 4–8 weeks with full staging updates."
      },
      {
        q: "What technologies does Mahi TechnoCrafts use for software engineering?",
        a: "We engineer solutions using modern, high-speed technologies: Next.js, React.js, TypeScript, Node.js, Python, MongoDB Atlas, PostgreSQL, Tailwind CSS, and AWS Cloud Infrastructure."
      }
    ]
  },
  {
    category: "Mobile App Development (iOS & Android)",
    questions: [
      {
        q: "What types of mobile apps does Mahi TechnoCrafts develop?",
        a: "We develop native iOS apps, Android apps, and cross-platform React Native / Flutter apps. Our expertise includes e-commerce apps, healthcare portals, real estate apps, on-demand services, and enterprise mobile dashboards."
      },
      {
        q: "Do you assist with publishing mobile apps to Google Play Store and Apple App Store?",
        a: "Yes, we manage the complete publishing pipeline, handling app signing, privacy policies, screenshot assets, and store compliance verification for both Google Play and Apple App Store."
      }
    ]
  },
  {
    category: "AI Solutions, Chatbots & Business Automation",
    questions: [
      {
        q: "How do smart AI chatbots and WhatsApp CRM automation help businesses grow?",
        a: "AI chatbots and WhatsApp CRM bots handle 80%+ of incoming inquiries instantly 24/7, qualify leads automatically, send catalog links, and route hot buyers directly to your sales team on WhatsApp."
      },
      {
        q: "Can you connect custom OpenAI or Gemini APIs to our existing ERP or billing software?",
        a: "Yes, we engineer custom API connectors and intelligent knowledge systems to integrate OpenAI (GPT-4o) and Google Gemini directly with your current databases, ERPs, and customer portals securely."
      }
    ]
  },
  {
    category: "Digital Marketing & Business Growth",
    questions: [
      {
        q: "How does Mahi TechnoCrafts help businesses increase online visibility and customer reach?",
        a: "We implement multi-channel growth systems: Google Business Profile local presence, high-converting Google Search and Meta Ads, structured rich data, and high-speed mobile performance."
      },
      {
        q: "How quickly can performance marketing (Google & Meta Ads) generate customer inquiries?",
        a: "With our targeted Google Search PPC and Meta conversion ad funnels, clients typically begin receiving verified, high-intent customer inquiries within 48 to 72 hours of campaign activation."
      }
    ]
  },
  {
    category: "Custom ERP, CRM & E-Commerce Solutions",
    questions: [
      {
        q: "Why should businesses choose custom ERP/CRM software over monthly SaaS subscriptions?",
        a: "Custom software eliminates recurring monthly license fees, adapts 100% to your unique company workflow, keeps your sensitive data private, and gives you total lifetime source code ownership."
      },
      {
        q: "What e-commerce features are included in an online shopping website build?",
        a: "Our e-commerce stores include 1-click mobile checkout, Google Pay / PhonePe UPI integration, automated courier shipping sync (Shiprocket), COD OTP verification, and direct WhatsApp order alerts."
      }
    ]
  },
  {
    category: "Hosting, Support & Guarantees",
    questions: [
      {
        q: "Do you provide free maintenance and source code ownership after project launch?",
        a: "Yes! Every custom build includes 6 Months of 100% Free Maintenance & Bug Fixes, 24/7 WhatsApp emergency support, and complete 100% source code and database ownership with zero lock-in."
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