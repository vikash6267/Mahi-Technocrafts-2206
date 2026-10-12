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

// Target Business Sectors
const TARGET_INDUSTRIES = [
  { name: 'Healthcare & Specialty Clinics', category: 'Healthcare Tech', painPoint: 'appointment scheduling, patient communication, and records workflows' },
  { name: 'Real Estate Builders & Townships', category: 'Real Estate Tech', painPoint: 'property information, buyer enquiries, and project updates' },
  { name: 'Retailers, D2C Brands & Supermarkets', category: 'E-Commerce Growth', painPoint: 'online product catalogues, checkout, and inventory workflows' },
  { name: 'Coaching Institutes & EdTech Academies', category: 'EdTech & Education', painPoint: 'student portals, learning resources, tests, and fee workflows' },
  { name: 'Manufacturing Plants & Warehouses', category: 'Industrial Software', painPoint: 'inventory visibility, production workflows, and operational records' },
  { name: 'Chartered Accountants & Financial Advisors', category: 'FinTech & Legal', painPoint: 'client document access, enquiry handling, and appointment workflows' },
  { name: 'Restaurants, Cafes & Cloud Kitchens', category: 'Hospitality Tech', painPoint: 'menus, direct enquiry and ordering workflows, and booking information' },
  { name: 'Fitness Gyms & Wellness Centers', category: 'Fitness & Lifestyle', painPoint: 'member records, schedules, and subscription workflows' },
  { name: 'Logistics, Fleets & Transport Services', category: 'Logistics Tech', painPoint: 'dispatch records, fleet workflows, and trip information' }
];

// Modern Technology Solutions & Frameworks
const TECH_SOLUTIONS = [
  { name: 'Business Website Development', slugKey: 'business-website-development' },
  { name: 'Cross-Platform Mobile Apps', slugKey: 'mobile-app-development' },
  { name: 'Business Messaging and Workflow Automation', slugKey: 'business-workflow-automation' },
  { name: 'Custom ERP, CRM, and Inventory Workflows', slugKey: 'custom-business-software' },
  { name: 'Cloud Deployment and Backup Planning', slugKey: 'cloud-deployment-planning' }
];

// Strategic Content Angles
const CONTENT_ANGLES = [
  'Practical planning checklist based on common project requirements',
  'Technology options compared with trade-offs and selection criteria',
  'Cost factors and questions to clarify before requesting an estimate',
  'Local search fundamentals and accurate business information',
  'Implementation risks, accessibility, privacy, and maintenance considerations'
];

// Static sample posts are not used as substitutes for researched content.

/**
 * Generates an automated strategic topic blueprint based on randomized permutations
 */
function getSystemPromptBlueprint(existingTitles: string): string {
  const industry = TARGET_INDUSTRIES[Math.floor(Math.random() * TARGET_INDUSTRIES.length)];
  const tech = TECH_SOLUTIONS[Math.floor(Math.random() * TECH_SOLUTIONS.length)];
  const angle = CONTENT_ANGLES[Math.floor(Math.random() * CONTENT_ANGLES.length)];

  return `You are an experienced technology editor writing useful, accurate articles for Mahi TechnoCrafts, a web and software services business based in Bhopal, India.

TOPIC ASSIGNMENT:
- Target Industry: ${industry.name} (Focus Area: ${industry.painPoint})
- Technology Stack / Solution: ${tech.name}
- Content Strategy Angle: ${angle}

COMPANY CONTEXT:
- The business offers website design and development, web applications, mobile apps, ecommerce, SEO, and digital marketing.
- Mention company contact/location only when it is useful to the article and consistent with verified site information.
- Do not force a sales pitch or company claims into educational articles.

EXISTING BLOG TITLES (DO NOT REPEAT OR DUPLICATE THESE):
${existingTitles}

CONTENT GUIDELINES:
1. Language: 100% professional, fluent, engaging ENGLISH.
2. Title: clear and specific to the reader's problem. Do not force a city or neighborhood into it.
3. Meta Description: 140-160 characters with clear call-to-action.
4. Body Structure: Use useful headings, paragraphs, and lists. Be complete without padding; use fewer words when the topic does not need a long article.
5. Answer Engine Optimization (AEO): Answer user queries directly in the first 2 sentences of each section so Google AI Overviews and ChatGPT can quote it.
6. Include 3-4 practical FAQs with clear answers.
7. Suggested Image Prompt: Photorealistic 8k studio photography prompt matching this exact business scenario.
8. Location policy: Mention Bhopal only when the article genuinely answers a local search or uses verified first-hand local knowledge. Never insert a random neighborhood, imply a client/project/local result that is not documented, or repeat the company location merely for SEO. For general educational topics, write for the relevant Indian business audience without a locality.
9. Evidence policy: Do not invent client stories, performance statistics, rankings, guarantees, prices, timelines, certifications, integrations, or product capabilities. Use only facts supplied in the prompt; qualify unknown details and explain what depends on project scope.

RESPOND STRICTLY WITH A VALID JSON OBJECT (NO MARKDOWN CODEBLOCKS, NO PREAMBLE):
{
  "title": "...",
  "slug": "unique-kebab-case-slug",
  "meta_description": "...",
  "category": "${industry.category}",
  "focus_keyword": "...",
  "suggested_image_prompt": "...",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "content_html": "<h2>...</h2><p>...</p><h3>...</h3><p>...</p>",
  "faq": [
    { "question": "...", "answer": "..." },
    { "question": "...", "answer": "..." }
  ]
}`;
}

export async function generateAutonomousBlog(options?: { status?: 'draft' | 'published' }) {
  try {
    const existingBlogs = await getBlogs();
    const existingSlugs = existingBlogs.map(b => b.slug);
    const existingTitles = existingBlogs.map(b => `- ${b.title}`).slice(-15).join('\n');

    let parsed: GeminiBlogOutput | null = null;

    // Step 1: Attempt Gemini API with latest supported models
    if (GEMINI_API_KEY) {
      const prompt = getSystemPromptBlueprint(existingTitles);
      const activeGeminiModels = [
        'gemini-3.5-flash',
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-flash-latest'
      ];

      for (const modelName of activeGeminiModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.75,
                maxOutputTokens: 8192
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
              const firstBrace = cleaned.indexOf('{');
              const lastBrace = cleaned.lastIndexOf('}');
              if (firstBrace !== -1 && lastBrace !== -1) {
                const candidateObj = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
                if (candidateObj.title && candidateObj.content_html) {
                  parsed = candidateObj;
                  console.log(`[Gemini Blog Engine] Successfully generated dynamic blog via ${modelName}: "${parsed?.title}"`);
                  break;
                }
              }
            }
          } else {
            const errData = await response.text();
            console.warn(`[Gemini Blog Engine] Model ${modelName} returned HTTP ${response.status}:`, errData.substring(0, 150));
          }
        } catch (err) {
          console.warn(`[Gemini Blog Engine] Error trying model ${modelName}:`, err);
        }
      }
    }

    if (!parsed) {
      return {
        success: false,
        error: GEMINI_API_KEY
          ? 'The AI service did not return a usable article. No fallback content was saved; please retry after reviewing the topic.'
          : 'Configure GEMINI_API_KEY before generating an AI blog draft.'
      };
    }

    // Format and sanitize slug
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

    const coverImage = '/images/blog-default.jpg';
    const suggestedPrompt = parsed.suggested_image_prompt || `High-end professional photography of ${parsed.title}, modern tech office workspace with developers, 4k resolution, cinematic lighting`;
    const today = new Date().toISOString().split('T')[0];
    const blogStatus: 'draft' | 'published' = options?.status || 'draft';

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
      enableFaqSchema: false,
      status: blogStatus,
      suggestedImagePrompt: suggestedPrompt,
      faqs: (parsed.faq || []).map(f => ({
        q: f.question,
        a: f.answer
      }))
    };

    const saved = await saveBlog(newBlogItem);

    if (saved) {
      if (blogStatus === 'published') {
        publishToGoogleIndexing(`https://mahitechnocrafts.in/blog/${slug}`).catch(err => {
          console.error('[Google Indexing API Trigger Error]:', err);
        });
      }

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
      } catch (mailErr) {
        console.error('[Gemini Blog Engine] Email notification failed:', mailErr);
      }

      console.log(`[Gemini Blog Engine] Blog saved as ${blogStatus}: "${newBlogItem.title}"`);
      return { success: true, blog: newBlogItem };
    } else {
      return { success: false, error: 'Database save failed' };
    }
  } catch (error: any) {
    console.error('generateAutonomousBlog error:', error);
    return { success: false, error: error.message || 'Failed to generate blog' };
  }
}
