import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Website, App & SEO FAQs in Bhopal',
  description: 'Answers about website design, software, mobile apps, SEO, digital marketing, project scope, and working with Mahi TechnoCrafts in Bhopal.',
  alternates: {
    canonical: '/faq'
  },
  openGraph: {
    title: 'Website, App & SEO FAQs in Bhopal | Mahi TechnoCrafts',
    description: 'Clear answers about services, project scope, timelines, pricing, and support.',
    url: 'https://mahitechnocrafts.in/faq',
    siteName: 'Mahi TechnoCrafts',
    images: [{ url: 'https://mahitechnocrafts.in/logo.png', width: 1200, height: 630, alt: 'Mahi TechnoCrafts FAQ' }]
  }
};

const faqs = [
  {
    category: "About Mahi TechnoCrafts & Services",
    questions: [
      {
        q: "What does Mahi TechnoCrafts do?",
        a: "Mahi TechnoCrafts is a Bhopal-based business offering website design and development, ecommerce, mobile apps, business software, SEO, Google Ads, and digital marketing. The project scope is agreed with each client."
      },
      {
        q: "Where is Mahi TechnoCrafts based, and where does it work?",
        a: "Mahi TechnoCrafts is based in Bhopal, Madhya Pradesh, and works with businesses in Bhopal and clients across India. Contact the team to confirm availability for your project."
      },
      {
        q: "How can I discuss a project or request a quote?",
        a: "Use the contact page or call/WhatsApp +91 6267144122. Share your goals, required features, existing tools, and preferred timeline. The team can then discuss a suitable scope and quote."
      }
    ]
  },
  {
    category: "Web & Custom Software Development",
    questions: [
      {
        q: "What affects the cost of a website or software project?",
        a: "Cost depends on the required pages or features, design, integrations, content, and support. Share your requirements for a project-specific estimate; third-party, hosting, and advertising charges are discussed separately where applicable."
      },
      {
        q: "How long does a website or app project take?",
        a: "The timeline depends on scope, content readiness, integrations, feedback, and external approvals. Mahi TechnoCrafts agrees on milestones and an estimated schedule after understanding the requirements."
      },
      {
        q: "Can my team update the website after launch?",
        a: "A content management system or admin workflow can be included when it fits the project. Editing needs, access roles, handover, and any ongoing support should be agreed in the scope."
      }
    ]
  },
  {
    category: "Mobile Apps, Ecommerce & Automation",
    questions: [
      {
        q: "Do you develop Android and iOS apps?",
        a: "Mahi TechnoCrafts can plan and develop Android, iOS, or cross-platform apps based on the intended users, features, integrations, budget, and maintenance needs. The approach is confirmed during scoping."
      },
      {
        q: "Can an ecommerce website support online payments and order management?",
        a: "An ecommerce project can include a product catalogue, checkout, payment-provider integration, and order workflows. Provider eligibility, approval, fees, and terms depend on the provider and are not controlled by Mahi TechnoCrafts."
      }
    ]
  },
  {
    category: "SEO, AI & Digital Marketing",
    questions: [
      {
        q: "What SEO work can you help with for a Bhopal business?",
        a: "SEO work can include a technical review, local search guidance, page structure, internal links, useful content, structured data, and performance measurement. Ranking positions and timing depend on search engines and competition, so no specific position is guaranteed."
      },
      {
        q: "Can you help a website appear in AI search tools such as ChatGPT, Gemini, or Claude?",
        a: "We can improve the foundations that help search and AI systems understand a business: clear public service pages, accurate contact and location details, crawlable content, internal links, and relevant structured data. AI tools choose which sources to show, so inclusion or recommendations cannot be guaranteed."
      },
      {
        q: "Can you build AI chat or workflow automation?",
        a: "Chat and workflow automation can be scoped to handle common questions, route enquiries, or support team processes. Feasibility depends on the required tools, integrations, data, and provider access."
      }
    ]
  },
  {
    category: "Project Support",
    questions: [
      {
        q: "What happens after a project launches?",
        a: "Handover and post-launch support depend on the agreed project scope. Maintenance tasks, coverage period, response expectations, hosting, and third-party costs should be confirmed in the proposal."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <>
      <div className="min-h-screen py-16 max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Bhopal IT & Web Services Help Center
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Get clear answers to common questions about website design, mobile apps, development costs, 
            timelines, and software services in Bhopal by Mahi TechnoCrafts.
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
