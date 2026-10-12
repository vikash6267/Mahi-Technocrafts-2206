import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

// Caching connections across hot-reloads
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// In-memory cache to completely bypass MongoDB Atlas connection latencies
let cachedSiteData: SiteData | null = null;
let cachedApprovedReviews: ReviewItem[] | null = null;
let cachedAllReviews: ReviewItem[] | null = null;
let cachedBlogs: BlogItem[] | null = null;
let cachedBlogsTime = 0;
let cachedCareers: CareerItem[] | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds TTL

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    if (!MONGODB_URI || !MONGODB_DB) {
      throw new Error('MONGODB_URI and MONGODB_DB must be configured.');
    }
    const client = await MongoClient.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    const db = client.db(MONGODB_DB);
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas', error);
    throw new Error('Database connection failed');
  }
}

// Interface definitions
export interface HeroStat {
  id: string;
  value: string;
  label: string;
}

export interface HeroSection {
  tagline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: HeroStat[];
}

export interface AboutSection {
  story: string;
  mission: string;
  vision: string;
  whyChooseUs: string[];
}

export interface FounderSection {
  name: string;
  designation: string;
  message: string;
  image: string;
  socials: {
    instagram: string;
    linkedin: string;
    twitter: string;
  };
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  googleMapEmbed: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
  link: string;
}

export interface SiteData {
  hero: HeroSection;
  about: AboutSection;
  founder: FounderSection;
  services: ServiceItem[];
  projects: ProjectItem[];
  faq: FAQItem[];
  contactInfo: ContactInfo;
}

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  email?: string;
  avatarUrl?: string; // Client photo or logo URL
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface CareerItem {
  id: string;
  title: string;
  type: string;
  location: string;
  experience: string;
  description: string;
  postedAt?: string;
}

// Blog interfaces matching Tiptap content and Advanced SEO parameters
export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogItem {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // TipTap Rich Text HTML content
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  imageAlt: string; // ALT tag for image SEO
  category: string; // Blog category
  tags: string[]; // Blog tags list
  metaTitle: string; // SEO page title
  metaDescription: string; // SEO meta description
  focusKeyword: string; // SEO focus keyword
  canonicalUrl: string; // Canonical URL tag
  ogTitle: string; // Open Graph share title
  ogDescription: string; // Open Graph share description
  ogImage: string; // Open Graph share image URL
  enableBlogSchema: boolean; // JSON-LD Blog Schema toggler
  enableFaqSchema: boolean; // JSON-LD FAQ Schema toggler
  faqs?: BlogFAQ[]; // Dynamic FAQ elements
  status?: 'draft' | 'published'; // Draft or live published
  suggestedImagePrompt?: string; // Suggested Midjourney/Flux image prompt
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'archived';
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  clientName?: string;
  clientPhone?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  userAgent?: string;
}

// Default Seed Content for Homepage
// Default Seed Content for Homepage
const defaultSiteData: SiteData = {
  hero: {
    tagline: "Your Imagination, Our Creation",
    description: "At Mahi Technocrafts, we build beautiful, easy-to-use websites, mobile apps, and custom software that help your business grow. We combine elegant design with smooth performance to make your brand stand out.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Explore Services",
    stats: []
  },
  about: {
    story: "Founded with a simple goal—to make high-quality websites and software easy for everyone, Mahi Technocrafts has grown into a trusted tech partner. We don't just build websites; we design complete online systems that help you win more customers.",
    mission: "To help businesses of all sizes succeed online by providing them with beautiful, fast, and secure websites and apps that make their customers happy.",
    vision: "To be the most trusted tech partner for businesses worldwide, creating smart, simple, and friendly digital tools for everyday work.",
    whyChooseUs: [
      "Project scope, deliverables, and handover are agreed before work begins.",
      "Responsive layouts are planned for the devices your customers use.",
      "Support and maintenance options are discussed as part of each project.",
      "We explain technical choices and keep project decisions visible."
    ]
  },
  founder: {
    name: "Vikash Maheshwari",
    designation: "Founder & CEO",
    message: "At Mahi Technocrafts, we believe in building websites and apps that are not just functional, but beautiful and easy to use. We treat every project with absolute dedication to perfection, helping to bring your boldest business ideas to life.",
    image: "/images/founder.jpg",
    socials: {
      instagram: "https://www.instagram.com/mahi_technocrafts/",
      linkedin: "https://www.linkedin.com/company/mahi-technocrafts/",
      twitter: "https://x.com/mahi_technocrafts"
    }
  },
  services: [
    {
      id: "web-dev",
      icon: "Code2",
      title: "Web Development",
      description: "Fast, secure, and search-friendly websites built to look stunning on both mobile and desktop screens."
    },
    {
      id: "mobile-dev",
      icon: "Smartphone",
      title: "Mobile App Development",
      description: "Smooth and beautiful mobile apps for both iPhone and Android, designed to give your users a great experience."
    },
    {
      id: "uiux-design",
      icon: "Palette",
      title: "Beautiful App & Website Design",
      description: "Beautiful and easy-to-use designs that make it simple and natural for customers to browse your website or app."
    },
    {
      id: "ai-solutions",
      icon: "BrainCircuit",
      title: "Smart Chatbots & Automation",
      description: "Smart automatic chatbots and assistants that reply to customer messages instantly and save your team's time."
    },
    {
      id: "erp-crm",
      icon: "Database",
      title: "Custom Business Software",
      description: "Custom dashboards and easy software to manage your customers, sales, and daily business tasks in one place."
    },
    {
      id: "cloud-services",
      icon: "Cloud",
      title: "Secure Cloud Hosting",
      description: "Cloud hosting and deployment options scoped to your application, traffic, security, and support requirements."
    }
  ],
  faq: [
    {
      q: "What services does Mahi TechnoCrafts offer?",
      a: "We plan and build business websites, ecommerce experiences, web applications, mobile apps, custom software, and digital marketing work. We confirm the right scope after understanding your requirements."
    },
    {
      q: "How long does a project take?",
      a: "The schedule depends on features, content readiness, integrations, and review cycles. We agree on a realistic timeline after confirming the project scope."
    },
    {
      q: "Can you guarantee a Google ranking?",
      a: "No. Search rankings depend on many factors outside a provider's control. We can improve technical SEO, page content, and local business information, then measure progress."
    },
    {
      q: "Do you provide post-launch maintenance?",
      a: "Support and maintenance options depend on the project. We discuss the tasks, period, and response expectations before work begins."
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "Business Management Dashboard",
      description: "An easy-to-use online system that helps business owners track sales, manage inventory, and view clean monthly reports.",
      image: "/images/project-fintech.jpg",
      imageAlt: "Business dashboard interface",
      tags: ["Web Dashboard", "Easy Controls", "Sales Reports"],
      link: "#"
    },
    {
      id: "project-2",
      title: "Smart Chat Assistant",
      description: "A friendly automated chat assistant for real estate brokers to reply to customer questions about properties instantly.",
      image: "/images/project-ai.jpg",
      imageAlt: "Chat assistant interface",
      tags: ["Instant Replies", "Automatic Answers", "Customer Support"],
      link: "#"
    }
  ],
  contactInfo: {
    email: "support@mahitechnocrafts.in",
    phone: "6267144122",
    address: "Hamidia Rd, Badabagh, Shahjahanabad, Bhopal, Madhya Pradesh 462001",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3665.819385966398!2d77.39485777602073!3d23.2505504789505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c4273dfc9d2f3%3A0xe2126f50b4d45d8b!2sBadabagh%2C%20Bhopal%2C%20Madhya%20Pradesh%20462001!5e0!3m2!1sen!2sin!4v1716712395723!5m2!1sen!2sin"
  }
};

const defaultBlogs: BlogItem[] = [
  {
    slug: "why-nextjs-is-the-best-for-seo",
    title: "Why Next.js is the Ultimate Framework for SEO in 2026",
    excerpt: "Discover how Next.js features like Server Components, Server-Side Rendering (SSR), and built-in metadata support can propel your business to the top of Google search results.",
    content: "<h3>Why Next.js is the Ultimate SEO Tool</h3><p>In the highly competitive digital landscape, visibility is everything. Search Engine Optimization (SEO) determines whether your business gets discovered by potential clients or remains hidden. If you're building a modern web application, Next.js stands out as the ultimate tool for achieving top SEO rankings. Here is why.</p><h3>1. React Server Components (RSC) and SSR</h3><p>Traditional Single Page Applications (SPAs) load an empty HTML shell and render content using client-side JavaScript. This makes it difficult for search engine web crawlers to index your content quickly. Next.js solves this by rendering React components on the server first, serving a fully populated HTML page to the crawler immediately.</p><h3>2. Built-in Metadata API</h3><p>Next.js provides a robust, native Metadata API. This allows you to configure your site's header tags dynamically for every single page. Search engines love clean and precise metadata.</p>",
    author: "Vikash Maheshwari",
    publishedAt: "2026-05-24",
    readTime: "5 min read",
    coverImage: "/images/blog-seo.jpg",
    imageAlt: "Next.js search optimization graphic logo",
    category: "SEO",
    tags: ["SEO", "Next.js", "Web Development"],
    metaTitle: "Why Next.js is the Ultimate Framework for SEO in 2026",
    metaDescription: "Learn how Next.js Server Components, Server-Side Rendering (SSR), and native Metadata APIs optimize your website's search engine visibility and loading speed.",
    focusKeyword: "Next.js SEO",
    canonicalUrl: "https://mahitechnocrafts.in/blog/why-nextjs-is-the-best-for-seo",
    ogTitle: "Why Next.js is the Ultimate Framework for SEO in 2026",
    ogDescription: "Discover how Next.js features can propel your business to the top of Google search results.",
    ogImage: "/images/blog-seo.jpg",
    enableBlogSchema: true,
    enableFaqSchema: false,
    faqs: [
      { q: "Is Next.js good for search engine indexing?", a: "Yes, because it serves pre-rendered HTML pages directly to web crawlers rather than serving blank shells." }
    ]
  },
  {
    slug: "top-web-development-company-in-bhopal-nextjs-ai",
    title: "Choosing a Web Development Company in Bhopal: A Practical Guide",
    excerpt: "Discover how premium Next.js website engineering and custom AI integrations empower local Bhopal enterprises to rank high on Google and double client conversions in 2026.",
    content: "<h3>Why Bhopal Businesses Need Modern Web Architectures</h3><p>Bhopal is witnessing a digital revolution. From local retail businesses in New Market and MP Nagar to enterprise service companies across Madhya Pradesh, having an online presence is no longer optional. However, a generic, slow website will not help you stand out. To dominate Google search results and attract high-paying clients, you need a high-performance, premium web application built by a professional web development company in Bhopal.</p><h3>1. High-Performance Next.js and Local Search Dominance</h3><p>Modern search engines like Google prioritize loading speed, mobile responsiveness, and clean semantic structures. Traditional websites built with basic templates load slowly and fail Core Web Vitals checks. Next.js offers Server-Side Rendering (SSR) and Static Site Generation (SSG), serving pre-rendered, rapid HTML pages directly to users and search crawlers. This can make important page content easier for search engines to access, but does not guarantee indexing or rankings.</p><h3>2. The Role of Structured Schema Markup in Local Indexing</h3><p>If you want Google to index your business quickly and display rich snippets (like maps, FAQ lists, and star ratings) directly in search results, schema markup is essential. By implementing Organization, FAQ, and BlogPosting JSON-LD schemas, you tell Google's crawlers exactly who you are, what services you provide, and where you are located. Mahi Technocrafts integrates these advanced schemas automatically into every dynamic page.</p><h3>3. Integrating Artificial Intelligence for Business Operations</h3><p>AI tools and workflow automation can be useful when they address a clear business need. Their results depend on data quality, integrations, safeguards, and ongoing review.</p>",
    author: "Vikash Maheshwari",
    publishedAt: "2026-05-26",
    readTime: "6 min read",
    coverImage: "https://idcard-pro-images.s3.ap-south-1.amazonaws.com/mahi-technocrafts/blog-bhopal.jpg",
    imageAlt: "Mahi Technocrafts team of web developers in Bhopal Madhya Pradesh office workspace",
    category: "Local SEO",
    tags: ["Web Development", "Bhopal", "Next.js", "Local SEO"],
    metaTitle: "Choosing a Web Development Company in Bhopal | Mahi Technocrafts",
    metaDescription: "Learn what to compare in a web development proposal, from scope and mobile usability to ownership and support.",
    focusKeyword: "Web Development Company in Bhopal",
    canonicalUrl: "https://mahitechnocrafts.in/blog/top-web-development-company-in-bhopal-nextjs-ai",
    ogTitle: "Choosing a Web Development Company in Bhopal | Mahi Technocrafts",
    ogDescription: "Review project scope, search foundations, ownership, and support before choosing a web development partner.",
    ogImage: "https://idcard-pro-images.s3.ap-south-1.amazonaws.com/mahi-technocrafts/blog-bhopal.jpg",
    enableBlogSchema: true,
    enableFaqSchema: false,
    faqs: [
      { q: "Which is the best web development company in Bhopal?", a: "Compare providers by relevant work, clear deliverables, technical fit, communication, ownership, and support. Choose a team whose proposal matches your needs." },
      { q: "How does local SEO help businesses in Bhopal?", a: "Local SEO optimizes your digital presence to rank high for search queries like 'web developers near me' or 'software agency in Bhopal', driving high-intent local traffic and clients straight to your business." },
      { q: "Does Mahi Technocrafts provide custom software services in Bhopal?", a: "Yes, Mahi Technocrafts is a full-service software development agency in Bhopal offering custom React development, Flutter app engineering, ERP databases, and cloud hosting solutions." }
    ]
  }
];

// Async MongoDB wrappers
export async function getSiteData(): Promise<SiteData> {
  if (cachedSiteData) {
    return cachedSiteData;
  }
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('content');
    
    let data = await collection.findOne({ _id: 'site_configs' as any });
    
    if (!data) {
      // Seed default content
      const seed = { _id: 'site_configs', ...defaultSiteData };
      await collection.insertOne(seed as any);
      cachedSiteData = defaultSiteData;
      return defaultSiteData;
    }
    
    // Clean MongoDB _id before returning
    const { _id, ...cleanData } = data;
    cachedSiteData = cleanData as unknown as SiteData;
    return cachedSiteData;
  } catch (error) {
    console.error('getSiteData failed, falling back to default site data:', error);
    return defaultSiteData;
  }
}

export async function updateSiteData(data: SiteData): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('content');
    
    await collection.updateOne(
      { _id: 'site_configs' as any },
      { $set: data },
      { upsert: true }
    );
    cachedSiteData = data; // Update cache
    return true;
  } catch (error) {
    console.error('Error writing content to MongoDB', error);
    return false;
  }
}

export async function getBlogs(): Promise<BlogItem[]> {
  const now = Date.now();
  if (cachedBlogs && (now - cachedBlogsTime < CACHE_TTL_MS)) {
    return cachedBlogs;
  }
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogs');
    
    const blogs = await collection.find({}).sort({ publishedAt: -1 }).toArray();
    cachedBlogs = blogs.map(({ _id, ...b }) => b) as unknown as BlogItem[];
    cachedBlogsTime = now;
    return cachedBlogs;
  } catch (error) {
    console.error('getBlogs failed, falling back to cached or default blogs:', error);
    return cachedBlogs || defaultBlogs;
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  try {
    if (cachedBlogs) {
      const match = cachedBlogs.find(b => b.slug === slug);
      if (match) return match;
    }
    const { db } = await connectToDatabase();
    const collection = db.collection('blogs');
    
    const blog = await collection.findOne({ slug });
    if (!blog) return null;
    
    const { _id, ...cleanBlog } = blog;
    return cleanBlog as unknown as BlogItem;
  } catch (error) {
    console.error(`getBlogBySlug failed for ${slug}, trying local fallback:`, error);
    const localBlog = defaultBlogs.find(b => b.slug === slug);
    return localBlog || null;
  }
}

export async function saveBlog(blog: BlogItem): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogs');
    
    await collection.updateOne(
      { slug: blog.slug },
      { $set: blog },
      { upsert: true }
    );
    cachedBlogs = null; // Invalidate cache
    return true;
  } catch (error) {
    console.error('Error saving blog to MongoDB', error);
    return false;
  }
}

export async function deleteBlogBySlug(slug: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('blogs');
    
    const result = await collection.deleteOne({ slug });
    cachedBlogs = null; // Invalidate cache
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting blog from MongoDB', error);
    return false;
  }
}

export async function getContacts(): Promise<ContactSubmission[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contacts');
    
    const contacts = await collection.find({}).toArray();
    return contacts.map(({ _id, ...c }) => c) as unknown as ContactSubmission[];
  } catch (error) {
    console.error('getContacts failed, returning empty:', error);
    return [];
  }
}

export async function saveContact(contact: ContactSubmission): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contacts');
    
    await collection.insertOne(contact as any);
    return true;
  } catch (error) {
    console.error('Error saving inquiry to MongoDB', error);
    return false;
  }
}

export async function updateContactStatus(id: string, status: 'read' | 'unread' | 'archived'): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('contacts');
    
    const result = await collection.updateOne(
      { id },
      { $set: { status } }
    );
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating inquiry status', error);
    return false;
  }
}

// Never seed sample testimonials as if they were customer feedback.
const defaultReviews: ReviewItem[] = [];

const sampleReviewSignatures = new Set([
  'amit sharma|logix supply co.',
  'rohan mehta|holo startups',
  'sneha patel|kira global inc',
]);

function isSampleReview(review: ReviewItem) {
  return sampleReviewSignatures.has(`${review.name.trim().toLowerCase()}|${review.company.trim().toLowerCase()}`);
}

export async function getReviews(): Promise<ReviewItem[]> {
  if (cachedAllReviews) {
    return cachedAllReviews;
  }
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('reviews');
    
    const reviews = await collection.find({}).toArray();
    if (reviews.length === 0) {
      cachedAllReviews = defaultReviews;
      return defaultReviews;
    }
    cachedAllReviews = reviews.map(({ _id, ...r }) => r) as unknown as ReviewItem[];
    return cachedAllReviews;
  } catch (error) {
    console.error('getReviews failed, falling back to defaults:', error);
    return defaultReviews;
  }
}

export async function getApprovedReviews(): Promise<ReviewItem[]> {
  if (cachedApprovedReviews) {
    return cachedApprovedReviews;
  }
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('reviews');
    
    const reviews = await collection.find({ status: 'approved' }).toArray();
    if (reviews.length === 0) {
      const allReviews = await getReviews();
      cachedApprovedReviews = allReviews.filter(r => r.status === 'approved' && !isSampleReview(r));
      return cachedApprovedReviews;
    }
    cachedApprovedReviews = reviews
      .map(({ _id, ...r }) => r as unknown as ReviewItem)
      .filter((review) => !isSampleReview(review));
    return cachedApprovedReviews;
  } catch (error) {
    console.error('getApprovedReviews failed, falling back to defaults:', error);
    return defaultReviews.filter(r => r.status === 'approved');
  }
}

export async function saveReview(review: ReviewItem): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('reviews');
    
    await collection.updateOne(
      { id: review.id },
      { $set: review },
      { upsert: true }
    );
    cachedAllReviews = null; // Invalidate cache
    cachedApprovedReviews = null; // Invalidate cache
    return true;
  } catch (error) {
    console.error('Error saving review to MongoDB', error);
    return false;
  }
}

export async function updateReviewStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('reviews');
    
    const result = await collection.updateOne(
      { id },
      { $set: { status } }
    );
    cachedAllReviews = null; // Invalidate cache
    cachedApprovedReviews = null; // Invalidate cache
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating review status', error);
    return false;
  }
}

export async function deleteReviewById(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('reviews');
    
    const result = await collection.deleteOne({ id });
    cachedAllReviews = null; // Invalidate cache
    cachedApprovedReviews = null; // Invalidate cache
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting review from MongoDB', error);
    return false;
  }
}

// Career Default Seed Data
const defaultCareers: CareerItem[] = [
  {
    id: 'job-1',
    title: 'Senior Website & App Developer',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '3+ Years',
    description: 'We are looking for an expert developer with great design taste to build beautiful, fast, and easy-to-use websites and custom business applications.'
  },
  {
    id: 'job-2',
    title: 'Mobile App Developer',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '2+ Years',
    description: 'Seeking a talented mobile app developer to build smooth, beautiful, and secure apps for both iPhone and Android devices.'
  },
  {
    id: 'job-3',
    title: 'Website & App Designer',
    type: 'Full-Time',
    location: 'Remote / Hybrid',
    experience: '2+ Years',
    description: 'Design beautiful and user-friendly visual layouts for modern websites and business dashboards. Strong design skills and experience in creating clean interfaces are required.'
  }
];

export async function getCareers(): Promise<CareerItem[]> {
  if (cachedCareers) {
    return cachedCareers;
  }
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('careers');
    
    const careers = await collection.find({}).toArray();
    if (careers.length === 0) {
      const seed = defaultCareers.map(c => ({ ...c, postedAt: new Date().toISOString() }));
      await collection.insertMany(seed as any[]);
      cachedCareers = seed;
      return seed;
    }
    cachedCareers = careers.map(({ _id, ...c }) => c) as unknown as CareerItem[];
    return cachedCareers;
  } catch (error) {
    console.error('getCareers failed, falling back to default careers:', error);
    return defaultCareers.map(c => ({ ...c, postedAt: new Date().toISOString() }));
  }
}

export async function saveCareer(career: CareerItem): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('careers');
    
    await collection.updateOne(
      { id: career.id },
      { $set: career },
      { upsert: true }
    );
    cachedCareers = null; // Invalidate cache
    return true;
  } catch (error) {
    console.error('Error saving career to MongoDB', error);
    return false;
  }
}

export async function deleteCareerById(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('careers');
    
    const result = await collection.deleteOne({ id });
    cachedCareers = null; // Invalidate cache
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting career from MongoDB', error);
    return false;
  }
}

// ==================== CHATBOT SESSION HELPERS ====================

export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chat_sessions');
    const session = await collection.findOne({ sessionId });
    if (!session) return null;
    const { _id, ...rest } = session;
    return rest as unknown as ChatSession;
  } catch (error) {
    console.error('getChatSession failed:', error);
    return null;
  }
}

export async function saveChatSession(session: Partial<ChatSession> & { sessionId: string }): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chat_sessions');
    const now = new Date().toISOString();
    
    const updateDoc: any = {
      ...session,
      updatedAt: now,
    };
    
    // Don't overwrite _id if it slipped in
    delete updateDoc._id;

    await collection.updateOne(
      { sessionId: session.sessionId },
      { 
        $set: updateDoc,
        $setOnInsert: { 
          createdAt: session.createdAt || now,
          messages: session.messages || []
        } 
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving chat session to MongoDB:', error);
    return false;
  }
}

export async function getAllChatSessions(limit = 100): Promise<ChatSession[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chat_sessions');
    const sessions = await collection.find({}).sort({ updatedAt: -1 }).limit(limit).toArray();
    return sessions.map(({ _id, ...s }) => s) as unknown as ChatSession[];
  } catch (error) {
    console.error('getAllChatSessions failed:', error);
    return [];
  }
}
