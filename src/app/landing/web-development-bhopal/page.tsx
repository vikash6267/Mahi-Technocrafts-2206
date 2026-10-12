import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Website Development in Bhopal | Mahi TechnoCrafts',
  description: 'Plan a fast, mobile-friendly business website with Mahi TechnoCrafts in Bhopal. Explore custom web development and request a consultation.',
  alternates: {
    canonical: '/landing/web-development-bhopal'
  },
  keywords: [
    'website development company in bhopal',
    'web design agency bhopal',
    'software company bhopal',
    'custom website bhopal',
    'ecommerce website bhopal',
    'Mahi TechnoCrafts Bhopal'
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Website Development in Bhopal | Mahi TechnoCrafts',
    description: 'Custom, mobile-friendly business websites planned and built in Bhopal, India.',
    url: 'https://mahitechnocrafts.in/landing/web-development-bhopal',
    siteName: 'Mahi TechnoCrafts',
    images: ['/images/web-dev-landing.webp']
  }
};

export default function WebDevelopmentLandingPage() {
  const benefits = [
    'Modern, mobile-responsive designs',
    'Performance reviewed against agreed requirements',
    'SEO-optimized for Google rankings',
    'Post-launch support options agreed in the project scope',
    'Hosting and security options scoped to project needs',
    'Full source code & database ownership'
  ];

  const packages = [
    {
      name: 'Essential Business Website',
      price: 'Estimate based on scope',
      features: [
        'Tailored modern web design',
        'Responsive layouts for agreed screen sizes',
        'Google Search & Local SEO setup',
        'Direct WhatsApp chat integration',
        'Fast delivery & clean code',
        'Support options documented in the project scope'
      ]
    },
    {
      name: 'Professional Web Application',
      price: 'Estimate based on scope',
      popular: true,
      features: [
        'Custom interactive web application',
        'SEO & Local Business schemas',
        'Lead capture & inquiry CRM sync',
        'Performance goals reviewed for the agreed scope',
        'Full source code & database ownership',
        'Support options documented in the project scope'
      ]
    },
    {
      name: 'E-commerce & Custom Portal',
      price: 'Estimate based on scope',
      features: [
        'Online product catalog & checkout',
        'Instant UPI payments (GPay, PhonePe)',
        'Automated WhatsApp order alerts',
        'Payment provider and transaction fees reviewed before launch',
        'Custom mobile admin controls',
        'Support options documented in the project scope'
      ]
    }
  ];

  // Schema for landing page
  const landingPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Development Services Bhopal',
    provider: {
      '@type': 'Organization',
      name: 'Mahi TechnoCrafts',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bhopal',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN'
      }
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingPageSchema).replace(/</g, '\\u003c')
        }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Get Your Dream Website Built by 
              <span className="block text-yellow-300">Website Developers in Bhopal</span>
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Custom business websites planned around your goals, content, and required features. Request a consultation to discuss scope and next steps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="#contact" 
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
              >
                Get Free Quote <ArrowRight size={20} />
              </a>
              <a 
                href="tel:+916267144122" 
                className="border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center gap-2"
              >
                <Phone size={20} /> Call Now
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm opacity-75">
              <div>Project scope confirmed before work begins</div>
              <div>Mobile-friendly planning</div>
              <div>Clear handover discussion</div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Why Choose Mahi TechnoCrafts for Your Website?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-6 rounded-lg shadow-sm">
                  <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Discuss your website project scope
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We review requirements, integrations, content, and support expectations before sharing a project estimate.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <div key={index} className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 ${pkg.popular ? 'border-blue-500' : 'border-gray-200'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-6">{pkg.price}</div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href="#contact" 
                    className={`w-full py-3 rounded-lg font-semibold text-center block transition-colors ${
                      pkg.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 px-6 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Project?
            </h2>
            
            <p className="text-xl opacity-90">
              Get your free consultation and detailed quote. Our team in Bhopal is ready to help.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <a 
                href="tel:+916267144122" 
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg font-semibold transition-colors"
              >
                <Phone size={20} />
                +91 6267144122
              </a>
              
              <a 
                href="mailto:support@mahitechnocrafts.in" 
                className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg font-semibold transition-colors"
              >
                <Mail size={20} />
                Get Email Quote
              </a>
            </div>

            <div className="text-sm opacity-75">
              <p>Share your project details to discuss requirements and next steps.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
