import { getBlogs, saveBlog, BlogItem } from '@/lib/db';
import { sendNewBlogNotification } from '@/lib/email';
import { publishToGoogleIndexing } from '@/lib/google-indexing';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface GeminiBlogOutput {
  title: string;
  slug: string;
  meta_description: string;
  content_html: string;
  tags: string[];
  category?: string;
  focus_keyword?: string;
  faq: Array<{ question: string; answer: string }>;
  suggested_image_prompt?: string;
}

const AUTONOMOUS_TOPIC_BANK: GeminiBlogOutput[] = [
  {
    title: 'How Much Does It Cost to Build a Custom Website in 2026: Complete Pricing Guide',
    slug: 'website-development-cost-pricing-guide-2026',
    meta_description: 'Discover the realistic cost of building a high-converting business website in 2026. Transparent pricing starting at ₹2,999 with 6 months free maintenance.',
    category: 'Website Pricing',
    focus_keyword: 'website development cost in bhopal',
    suggested_image_prompt: 'High-end modern professional photograph of a software design agency workspace in Bhopal, developers working on dual 4k displays with clean React code and financial analytics dashboard, natural warm sunlight, cinematic lighting, photorealistic 8k',
    tags: ['Web Development', 'Website Cost', 'Pricing Guide', 'Small Business IT'],
    faq: [
      {
        question: 'How much does a professional business website cost in Bhopal?',
        answer: 'At Mahi TechnoCrafts, full-featured business websites start at just ₹2,999 ($39), including full source code ownership, mobile optimization, and 6 months of 100% free maintenance.'
      },
      {
        question: 'How long does it take to design and launch a custom website?',
        answer: 'A standard custom business website is delivered and launched live within 7 to 14 business days.'
      },
      {
        question: 'Can I easily update prices, products, and images myself?',
        answer: 'Yes, we provide an intuitive, mobile-friendly admin dashboard where you can edit content, add products, and update prices in under 30 seconds without coding knowledge.'
      }
    ],
    content_html: `<h2>How Much Does a Custom Business Website Really Cost in 2026?</h2>
<p>In 2026, the average cost of developing a modern, mobile-responsive business website ranges from <strong>₹2,999 to ₹25,000+</strong> depending on features, integrations, and customization. At Mahi TechnoCrafts, we eliminate hidden agency markups and provide 100% transparent pricing backed by <strong>6 Months of Free Technical Maintenance</strong> and complete source code ownership.</p>

<h3>1. Essential Business Showcase Website (₹2,999 – ₹6,999)</h3>
<p>Designed specifically for local service businesses, clinics, shops, and coaching centers aiming for top Google Search rankings. Features include ultra-fast loading speeds (<1s), 1-click WhatsApp inquiry buttons, interactive Google Maps integration, and comprehensive on-page SEO.</p>

<h3>2. E-Commerce & Online Store with UPI / WhatsApp Sync (₹4,999 – ₹14,999)</h3>
<p>Empower your brand to sell products 24/7 without paying 30% marketplace commissions. Includes 1-click Google Pay and PhonePe checkout, instant WhatsApp order notifications, and real-time inventory management.</p>

<h3>3. Custom Web Portals & Enterprise Software (₹9,999 – ₹29,999)</h3>
<p>Tailored web systems for hospitals, real estate developers, schools, and manufacturing units. Features include patient appointment booking, 3D property walkthroughs, automated GST billing, and role-based staff permissions.</p>

<h3>Key Factors to Check Before Hiring a Web Development Agency</h3>
<ul>
  <li><strong>Sub-Second Loading Speed:</strong> Over 80% of web traffic comes from mobile devices. If your website takes more than 2 seconds to load, potential customers bounce to competitors.</li>
  <li><strong>Local & AI Search Optimization (SEO + AEO):</strong> Ensure your website is structured for Google Search and AI answer engines like ChatGPT and Perplexity.</li>
  <li><strong>Full Source Code Ownership:</strong> Never get locked into proprietary monthly rental models. You must own your domain, code, and database completely.</li>
</ul>

<h3>Claim Your Free Interactive Prototype Today</h3>
<p>Ready to boost your digital revenue? Mahi TechnoCrafts provides a <strong>Free 24-Hour Interactive Prototype</strong> tailored to your exact business workflow. Contact our founder Vikash Maheshwari and our engineering team via WhatsApp (+91 6267144122) to get started.</p>`
  },
  {
    title: 'Why Doctors and Healthcare Clinics Need an Online Appointment Portal in 2026',
    slug: 'why-doctors-and-clinics-need-online-appointment-portal',
    meta_description: 'Learn how automated doctor appointment portals reduce waiting room crowding by 75% and securely manage digital prescriptions and patient records.',
    category: 'Healthcare Tech',
    focus_keyword: 'hospital appointment portal bhopal',
    suggested_image_prompt: 'Professional medical photography of a smiling doctor in modern clinic holding a high-tech tablet with digital health records and appointment calendar, clean teal medical lighting, shallow depth of field, 8k',
    tags: ['Healthcare Software', 'Doctor Appointment', 'Clinic Portal', 'Medical Tech'],
    faq: [
      {
        question: 'Can patients book appointments directly via WhatsApp?',
        answer: 'Yes, our automated WhatsApp integration allows patients to select doctor time slots and receive instant booking confirmations in just two clicks.'
      },
      {
        question: 'Are patient medical records kept private and HIPAA compliant?',
        answer: 'Yes, we implement bank-grade 256-bit SSL encryption and secure cloud databases to guarantee 100% data confidentiality for all patient histories.'
      }
    ],
    content_html: `<h2>How Modern Healthcare Portals Transform Clinic and Hospital Management</h2>
<p>Modern medical practices and specialty clinics utilize online appointment booking portals to <strong>reduce reception desk overcrowding by 75%</strong> while giving patients 24/7 self-service scheduling. Over 50+ healthcare providers in Central India have upgraded to automated WhatsApp confirmations and digital prescription workflows.</p>

<h3>1. Eliminate Waiting Room Crowding with Smart Slot Scheduling</h3>
<p>Patients choose their preferred time slot from their smartphones before visiting the clinic. This eliminates chaotic waiting room lines and keeps the doctor OPD schedule highly organized and predictable.</p>

<h3>2. Automated WhatsApp Appointment Reminders</h3>
<p>Automated WhatsApp alerts sent 2 hours prior to scheduled consultations reduce patient no-show rates by more than 80%, maximizing doctor consulting hours.</p>

<h3>3. Digital Prescriptions (Rx) and Lab Report Downloads</h3>
<p>Doctors can generate structured digital prescriptions with drug dosage templates, delivered directly to the patient smartphone. Pathology and radiology reports can be securely downloaded in PDF format.</p>

<h3>Partner with Mahi TechnoCrafts for Healthcare Solutions</h3>
<p>We build secure, HIPAA-compliant clinic management systems and doctor websites starting from <strong>₹2,999*</strong> with 6 months of complimentary support. Schedule a free live demo on WhatsApp today.</p>`
  },
  {
    title: 'WhatsApp E-Commerce vs Traditional Online Stores: 0% Commission Retail Guide',
    slug: 'whatsapp-ecommerce-vs-traditional-online-stores-retail-guide',
    meta_description: 'Save up to 30% marketplace commissions by launching a direct WhatsApp e-commerce store with 1-click UPI payments and real-time order synchronization.',
    category: 'E-Commerce Growth',
    focus_keyword: 'whatsapp ecommerce store bhopal',
    suggested_image_prompt: 'Vibrant commercial photography of a modern retail boutique store owner holding a smartphone with UPI payment QR code and digital orders dashboard, warm ambient lighting, highly detailed, photorealistic 8k',
    tags: ['E-Commerce', 'Retail Tech', 'WhatsApp Store', 'UPI Checkout'],
    faq: [
      {
        question: 'Do customer payments deposit directly into my bank account?',
        answer: 'Yes, 100% of customer payments settle instantly into your linked UPI bank account without any third-party gateway deductions or commissions.'
      },
      {
        question: 'How fast can a retail store launch its WhatsApp online shop?',
        answer: 'A fully functional product catalog with UPI checkout and WhatsApp order routing can be launched live in 7 to 10 days.'
      }
    ],
    content_html: `<h2>Why Retailers and D2C Brands Are Moving to WhatsApp E-Commerce</h2>
<p>Direct WhatsApp e-commerce stores allow retail businesses and local merchants to <strong>save up to 30% in high marketplace commissions</strong>. Customers browse your catalog, select products, and complete checkout using Google Pay or PhonePe, with instant order notifications sent straight to your WhatsApp business number.</p>

<h3>1. Frictionless 1-Click UPI Payments</h3>
<p>Customers avoid complex account registrations or tedious OTP forms. They complete orders instantly using UPI QR codes or native payment apps like Google Pay, PhonePe, and Paytm.</p>

<h3>2. Instant WhatsApp Order Alerts for Fast Fulfillment</h3>
<p>Every completed transaction generates an itemized order receipt, customer delivery address, and payment confirmation delivered instantly to your WhatsApp dashboard.</p>

<h3>3. Mobile-First Product & Inventory Updates</h3>
<p>Store owners can update inventory, upload new product photos, or adjust pricing in 30 seconds directly from their mobile devices.</p>`
  },
  {
    title: 'Top Real Estate Web Technologies: 3D Floor Plans and Automated Buyer Inquiries',
    slug: 'real-estate-web-technologies-3d-floor-plans-property-leads',
    meta_description: 'Discover how modern property showcase portals with 3D virtual tours and built-in EMI calculators generate 4.5x more verified buyer inquiries.',
    category: 'Real Estate Tech',
    focus_keyword: 'real estate portal development bhopal',
    suggested_image_prompt: 'Stunning architectural photography of a luxury modern residential high-rise tower at sunset with illuminated glass windows, architectural blueprint overlay, clean golden hour lighting, 8k ultra realistic',
    tags: ['Real Estate', 'Builder Portal', 'Property Leads', '3D Walkthrough'],
    faq: [
      {
        question: 'Can interactive location maps and nearby landmarks be integrated?',
        answer: 'Yes, we embed dynamic Google Maps showing nearby schools, metro stations, hospitals, and commercial hubs to maximize buyer trust.'
      }
    ],
    content_html: `<h2>How Real Estate Builders and Brokers Maximize Property Sales Online</h2>
<p>Over 90% of modern home buyers begin their property search online. A modern, high-impact real estate showcase portal equipped with 3D architectural renders, virtual walkthroughs, and interactive floor plans delivers <strong>4.5x more verified buyer leads</strong> than traditional static classifieds.</p>

<h3>1. Immersive 3D Walkthroughs and Floor Plan Visualizers</h3>
<p>Prospective buyers can explore realistic sample apartment layouts, high-resolution interior photos, and site progress updates directly from their phones.</p>

<h3>2. Built-in Home Loan EMI Calculator</h3>
<p>Integrated financial calculators allow prospective buyers to estimate monthly loan payments and eligibility instantly, speeding up decision-making cycles.</p>

<h3>3. Direct 1-Click WhatsApp & Call Connect</h3>
<p>Buyer inquiries are instantly dispatched to your sales team with unit preferences, enabling immediate follow-up and faster site-visit bookings.</p>`
  },
  {
    title: 'WhatsApp AI Chatbots and Business Automation: Save 25+ Hours Every Week',
    slug: 'whatsapp-ai-chatbots-customer-automation-business-guide',
    meta_description: 'Explore how 24/7 WhatsApp AI chatbots respond to customer inquiries in under 2 seconds, qualify sales leads, and auto-generate GST invoices.',
    category: 'AI Automations',
    focus_keyword: 'whatsapp ai chatbot bhopal',
    suggested_image_prompt: 'High-tech creative photography of an executive reviewing automated AI customer conversation metrics on a glass holographic tablet, glowing emerald green UI accents, modern corporate atmosphere, 8k',
    tags: ['AI Chatbot', 'WhatsApp Automation', 'Customer Support', 'Business Growth'],
    faq: [
      {
        question: 'Does the AI chatbot require dedicated server hardware?',
        answer: 'No, our cloud API infrastructure is 100% lightweight, ultra-fast, and scales automatically without requiring local server hardware.'
      }
    ],
    content_html: `<h2>Scale Customer Support 24/7 with Autonomous WhatsApp AI Workflows</h2>
<p>In 2026, AI is no longer optional—it functions as a 24/7 digital team member that <strong>responds to customer inquiries within 2 seconds</strong>, captures sales leads, and generates instant GST quotations without manual delay.</p>

<h3>1. 24/7 Instant Response Time</h3>
<p>Customer inquiries are answered immediately, whether at midnight or on holidays. Never lose a high-value customer lead to slow response times.</p>

<h3>2. Automated GST Quotes and Invoicing</h3>
<p>Generate professional PDF invoices and price estimates dynamically and dispatch them via WhatsApp automatically upon request.</p>

<h3>Launch Your AI Automation with Mahi TechnoCrafts</h3>
<p>We build tailored AI customer workflows and CRM integrations starting at ₹3,999*. Connect with our technical team today for a live demo!</p>`
  }
];

// Bhopal & Regional Commercial Hubs for Hyper-Local Dominance
export const BHOPAL_HUBS = [
  'MP Nagar Zone-1 & Zone-2',
  'Arera Colony & 10 No. Market',
  'Indrapuri & BHEL Industrial Area',
  'TT Nagar & New Market',
  'Gulmohar & Shahpura',
  'Bawadiya Kalan & Danish Nagar',
  'Kolar Road',
  'Hoshangabad Road & Misrod',
  'Hamidia Road & Old Bhopal',
  'Bhopal & Central India'
];

export const TARGET_INDUSTRIES = [
  'Healthcare Clinics, Hospitals & Specialist Doctors (OPD management, WhatsApp slot booking)',
  'Retail Stores, Kirana Supermarkets & D2C Brands (0% commission online shop, UPI checkout)',
  'Real Estate Builders, Townships & Property Brokers (Lead capture CRM, 3D property walkthroughs)',
  'Manufacturing Units, Factories & Warehouses (Raw material inventory, automated GST billing)',
  'Schools, Coaching Institutes & EdTech Academies (Student attendance, fee collection portals)',
  'Lawyers, CA Tax Firms & Corporate Consultancies (Digital case diaries, encrypted client vaults)',
  'Restaurants, Cafes & Cloud Kitchens (QR digital menu, 0% commission direct online ordering)'
];

export const TARGET_SOLUTIONS = [
  'High-Speed Custom Business Websites & Client Portals',
  'Smart AI Customer Chatbots & WhatsApp CRM Automations',
  'Custom Mobile Applications (Android & iOS)',
  'Automated GST Billing, POS & Inventory Systems',
  'Local Search Dominance & Google Maps #1 Ranking'
];

/**
 * Autonomous Gemini Blog Generation Engine with Dynamic Hyper-Local Blueprint and Instant Google Indexing
 */
export async function generateAutonomousBlog(options?: {
  status?: 'draft' | 'published';
}): Promise<{ success: boolean; blog?: BlogItem; error?: string }> {
  try {
    const existingBlogs = await getBlogs();
    const existingTitles = existingBlogs.map(b => b.title).join('\n- ');
    const existingSlugs = existingBlogs.map(b => b.slug);

    // Pick a randomized combination to target a unique high-value local/industry permutation
    const selectedHub = BHOPAL_HUBS[Math.floor(Math.random() * BHOPAL_HUBS.length)];
    const selectedIndustry = TARGET_INDUSTRIES[Math.floor(Math.random() * TARGET_INDUSTRIES.length)];
    const selectedSolution = TARGET_SOLUTIONS[Math.floor(Math.random() * TARGET_SOLUTIONS.length)];

    const systemPrompt = `
ROLE:
You are the Chief Technology Officer and a master B2B copywriter for "Mahi TechnoCrafts" (Central India's premier custom software and website development agency located at Hamidia Road, Bhopal, founded by Full-Stack Architect Vikash Maheshwari, Phone/WhatsApp: +91 6267144122, Website: mahitechnocrafts.in).

OBJECTIVE:
Write an authoritative, engaging, 100% FLUENT ENGLISH business blog post specifically tailored for ${selectedIndustry} in or around ${selectedHub}, seeking ${selectedSolution}.

BUSINESS VALUE & POSITIONING:
- Focus on real business outcomes: Saving staff time, getting 3x more customer inquiries and phone calls, eliminating manual spreadsheets, and automating 24/7 client booking.
- Educate the business owner: Compare slow, bloated generic templates (like old WordPress sites or unreliable freelancers) with modern, custom-coded high-speed web and mobile architectures.
- The Mahi TechnoCrafts Advantage:
  * Complete projects start from just ₹2,999 ($39) with transparent pricing.
  * 6 Months of 100% Free Technical Maintenance & Bug Fixes included.
  * 100% Full Source Code and Database Ownership (Zero lock-in).
  * 1-Click WhatsApp integration and UPI payment support (Google Pay, PhonePe).
  * Direct founder support from Vikash Maheshwari (+91 6267144122).
- Internal Linking: Naturally integrate 2-3 links to our main service routes within content_html:
  * <a href="/services/web-dev">custom website development</a>
  * <a href="/services/ai-solutions">smart AI & WhatsApp automation</a>
  * <a href="/services/mobile-dev">mobile app development</a>
  * <a href="/estimator">30-second cost estimator</a>
  * <a href="/contact">free 24-hour prototype consultation</a>

ALREADY PUBLISHED BLOGS (DO NOT REPEAT THESE TOPICS):
- ${existingTitles}

CONTENT INSTRUCTIONS:
1. Language: Write STRICTLY in 100% clear, fluent ENGLISH. Do NOT use Hindi or Hinglish words.
2. Title: 50-60 characters, high-converting, combining industry need and location.
3. Meta Description: 140-160 characters with clear value proposition and call to action.
4. Structure: Semantic HTML using <h2> and <h3> tags, bullet lists <ul><li>.
5. Answer-First (AEO Optimization): Answer the core question directly in the very first sentence of each section so AI search engines (ChatGPT, Perplexity, Gemini, Google AI Overview) can quote it.
6. Length: 800-1200 words of rich, practical, actionable content.
7. FAQs: Include 3-4 highly relevant Q&A pairs.
8. Call to Action: End with a clear CTA directing readers to contact Mahi TechnoCrafts on WhatsApp (+91 6267144122) for a free prototype.
9. Suggested Image Prompt: Write a detailed, realistic, high-definition prompt (8k photorealistic style) tailored specifically to this article.

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN CODEBLOCKS, NO PREAMBLE):
{
  "title": "...",
  "slug": "clean-lowercase-hyphenated-slug",
  "meta_description": "...",
  "category": "...",
  "focus_keyword": "...",
  "content_html": "<h2>...</h2><p>...</p><h3>...</h3><p>...</p>",
  "tags": ["Tag 1", "Tag 2", "Tag 3", "Tag 4"],
  "faq": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ],
  "suggested_image_prompt": "High-end professional photography of..."
}
`;

    let parsed: GeminiBlogOutput | null = null;

    // Step 1: Attempt Gemini Endpoints
    const candidateEndpoints = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    ];

    for (const endpoint of candidateEndpoints) {
      try {
        const isLegacyPro = endpoint.includes('gemini-pro:');
        const reqBody: any = {
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2500 }
        };

        if (!isLegacyPro) {
          reqBody.generationConfig.responseMimeType = 'application/json';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify(reqBody)
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
              parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
              console.log('[Gemini Blog Engine] Success with direct Gemini API call!');
              break;
            }
          }
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    // Step 2: Intelligent Autonomous English Fallback if API key fails
    if (!parsed) {
      console.log('[Gemini Blog Engine] Using autonomous high-intent English topic bank...');
      let chosen = AUTONOMOUS_TOPIC_BANK.find(t => !existingSlugs.includes(t.slug));
      
      if (!chosen) {
        const count = existingBlogs.length + 1;
        chosen = {
          title: `Strategic Digital Transformation for Indian Businesses: 2026 Edition ${count}`,
          slug: `strategic-digital-transformation-indian-businesses-edition-${count}`,
          meta_description: `Learn how modern high-speed websites, WhatsApp AI automation, and cloud tools help local businesses accelerate growth in 2026.`,
          category: 'Business Growth',
          focus_keyword: 'business website developer bhopal',
          suggested_image_prompt: 'Modern high-tech conference room in Bhopal with software consultants discussing digital strategy, laptops displaying growth charts and modern code, photorealistic 8k',
          tags: ['Business Growth', 'Web Development', 'Bhopal IT', 'Mahi TechnoCrafts'],
          faq: [
            {
              question: 'Why choose Mahi TechnoCrafts for web development?',
              answer: 'We provide transparent pricing starting at ₹2,999, 6 months of 100% free maintenance, and top-tier SEO optimization for maximum search visibility.'
            }
          ],
          content_html: `<h2>Accelerate Your Business Growth with Modern Digital Solutions</h2>
<p>In today's hyper-competitive digital economy, businesses require <strong>fast, search-ranked websites</strong> and automated communication channels to convert online visitors into paying customers.</p>
<h3>1. Sub-Second Mobile Performance</h3>
<p>Modern consumers browse on smartphones. Delivering lightning-fast load times increases conversion and inquiry rates by over 50%.</p>
<h3>2. 1-Click WhatsApp Customer Engagement</h3>
<p>Allow prospective clients to contact your sales team directly through integrated WhatsApp buttons with zero friction.</p>
<h3>The Mahi TechnoCrafts Guarantee</h3>
<p>Packages start from ₹2,999 with 6 months of free technical maintenance. Connect with our engineering team in Bhopal today!</p>`
        };
      }

      parsed = chosen;
    }

    // Format Slug
    let slug = (parsed.slug || parsed.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (existingSlugs.includes(slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Word count & read time
    const textOnly = (parsed.content_html || '').replace(/<[^>]*>/g, '');
    const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    // Clean Fallback Image (No AI Image Generation, Default Professional Graphic)
    const coverImage = '/images/blog-default.jpg';
    const suggestedPrompt = parsed.suggested_image_prompt || `High-end professional photography of ${parsed.title}, modern tech office workspace with developers, 4k resolution, cinematic lighting`;

    const today = new Date().toISOString().split('T')[0];

    const blogStatus: 'draft' | 'published' = options?.status || 'published';

    // Format blog item
    const newBlogItem: BlogItem = {
      slug: slug,
      title: parsed.title,
      excerpt: parsed.meta_description,
      content: parsed.content_html,
      author: 'Vikash Maheshwari',
      publishedAt: today,
      readTime: readTime,
      coverImage: coverImage,
      imageAlt: parsed.title,
      category: parsed.category || 'Business Growth',
      tags: parsed.tags && parsed.tags.length > 0 ? parsed.tags : ['Web Development', 'Bhopal', 'Software'],
      metaTitle: `${parsed.title.slice(0, 55)} | Mahi TechnoCrafts`,
      metaDescription: parsed.meta_description.slice(0, 160),
      focusKeyword: parsed.focus_keyword || 'website development bhopal',
      canonicalUrl: `https://mahitechnocrafts.in/blog/${slug}`,
      ogTitle: parsed.title,
      ogDescription: parsed.meta_description,
      ogImage: coverImage,
      enableBlogSchema: true,
      enableFaqSchema: true,
      status: blogStatus,
      suggestedImagePrompt: suggestedPrompt,
      faqs: (parsed.faq || []).map(f => ({
        q: f.question,
        a: f.answer
      }))
    };

    const saved = await saveBlog(newBlogItem);

    if (saved) {
      // Trigger Instant Google Indexing API Hook if published
      if (blogStatus === 'published') {
        publishToGoogleIndexing(`https://mahitechnocrafts.in/blog/${slug}`).catch(err => {
          console.error('[Google Indexing API Trigger Error in Autonomous Blog]:', err);
        });
      }

      // Send Email Notification to Vikash with the suggested image prompt
      try {
        await sendNewBlogNotification({
          title: newBlogItem.title,
          slug: newBlogItem.slug,
          category: newBlogItem.category,
          excerpt: newBlogItem.excerpt,
          focusKeyword: newBlogItem.focusKeyword,
          suggestedImagePrompt: suggestedPrompt,
          status: blogStatus
        });
        console.log(`[Gemini Blog Engine] Notification email with image prompt dispatched to admin!`);
      } catch (mailErr) {
        console.error('[Gemini Blog Engine] Email dispatch failed:', mailErr);
      }

      return { success: true, blog: newBlogItem };
    } else {
      return { success: false, error: 'Database save failed' };
    }
  } catch (error: any) {
    console.error('generateAutonomousBlog error:', error);
    return { success: false, error: error.message || 'Failed to generate blog' };
  }
}
