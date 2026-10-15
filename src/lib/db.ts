import { MongoClient, Db } from 'mongodb';

const DEFAULT_MONGODB_URI = 'mongodb+srv://varn:Varn2025@cluster0.dstcy.mongodb.net/Vikash-Personal';
const DEFAULT_MONGODB_DB = 'Vikash-Personal';

export function getMongoConfig() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGODB_URI;
  const dbName = process.env.MONGODB_DB || DEFAULT_MONGODB_DB;
  return { uri, dbName };
}

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
    const { uri, dbName } = getMongoConfig();
    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    const db = client.db(dbName);
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

export type ReminderCategory =
  | 'domain'
  | 'hosting'
  | 'payment'
  | 'amc'
  | 'ssl'
  | 'milestone'
  | 'general';

export interface ClientReminder {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  company?: string;
  title: string;
  description: string;
  category: ReminderCategory;
  dueDate: string; // YYYY-MM-DD format
  dueTime?: string; // e.g. "14:00"
  amount?: string; // e.g. "₹15,000" or "$250"
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'notified' | 'completed' | 'cancelled';
  notifyClientEmail: boolean;
  notifyAdminEmail: boolean;
  lastNotifiedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Financial & Accounting Engine (Income & Expenses)
// ---------------------------------------------------------------------------

export type FinanceType = 'income' | 'expense';

export type FinanceCategory =
  // Income categories
  | 'client_payment'
  | 'project_milestone'
  | 'retainer'
  | 'domain_hosting_charge'
  | 'amc_service'
  | 'consulting'
  | 'other_income'
  // Expense categories
  | 'server_hosting'
  | 'domain_purchase'
  | 'software_tools'
  | 'salaries_freelancers'
  | 'marketing_ads'
  | 'office_supplies'
  | 'legal_tax'
  | 'other_expense';

export interface FinanceRecord {
  id: string;
  type: FinanceType;
  title: string;
  description?: string;
  amount: number;
  category: FinanceCategory | string;
  date: string; // YYYY-MM-DD format
  status: 'completed' | 'pending';
  paymentMethod?: string; // 'upi' | 'bank_transfer' | 'cash' | 'credit_card' | 'cheque' | 'stripe' | 'other'
  clientName?: string;
  vendorName?: string;
  referenceNumber?: string; // UTR / Invoice # / Bill # / Receipt #
  invoiceUrl?: string;
  reminderId?: string; // Linked client reminder if converted from reminder
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  pendingIncome: number;
  pendingExpense: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  thisMonthNet: number;
  lastMonthIncome: number;
  lastMonthExpense: number;
  incomeCount: number;
  expenseCount: number;
  categoryBreakdown: {
    income: Record<string, number>;
    expense: Record<string, number>;
  };
  monthlyTrend: Array<{
    month: string; // "2026-10"
    label: string; // "Oct 2026"
    income: number;
    expense: number;
    net: number;
  }>;
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
    
    const { _id, createdAt, messages, ...restDoc } = session as any;

    const setDoc: any = {
      ...restDoc,
      updatedAt: now,
    };
    if (messages !== undefined) {
      setDoc.messages = messages;
    }

    const setOnInsertDoc: any = {
      createdAt: createdAt || session.createdAt || now,
    };
    if (messages === undefined) {
      setOnInsertDoc.messages = [];
    }

    await collection.updateOne(
      { sessionId: session.sessionId },
      { 
        $set: setDoc,
        $setOnInsert: setOnInsertDoc
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

// ---------------------------------------------------------------------------
// Client Reminders & Expiry Tracking Engine
// ---------------------------------------------------------------------------

export async function getReminders(): Promise<ClientReminder[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('client_reminders');
    const reminders = await collection.find({}).sort({ dueDate: 1, createdAt: -1 }).toArray();
    return reminders.map(({ _id, ...r }) => r) as unknown as ClientReminder[];
  } catch (error) {
    console.error('getReminders failed:', error);
    return [];
  }
}

export async function getReminderById(id: string): Promise<ClientReminder | null> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('client_reminders');
    const item = await collection.findOne({ id });
    if (!item) return null;
    const { _id, ...clean } = item;
    return clean as unknown as ClientReminder;
  } catch (error) {
    console.error('getReminderById failed:', error);
    return null;
  }
}

export async function saveReminder(reminder: ClientReminder): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('client_reminders');
    const now = new Date().toISOString();

    const { _id, createdAt, ...updateFields } = reminder as any;
    const doc: any = {
      ...updateFields,
      updatedAt: now,
    };

    await collection.updateOne(
      { id: reminder.id },
      {
        $set: doc,
        $setOnInsert: { createdAt: createdAt || reminder.createdAt || now }
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('saveReminder failed:', error);
    return false;
  }
}

export async function deleteReminder(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('client_reminders');
    const res = await collection.deleteOne({ id });
    return res.deletedCount > 0;
  } catch (error) {
    console.error('deleteReminder failed:', error);
    return false;
  }
}

export async function markReminderStatus(
  id: string,
  status: ClientReminder['status'],
  notes?: string
): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('client_reminders');
    const now = new Date().toISOString();
    const update: any = {
      status,
      updatedAt: now,
    };
    if (status === 'completed') {
      update.completedAt = now;
    }
    if (notes !== undefined) {
      update.notes = notes;
    }
    const res = await collection.updateOne({ id }, { $set: update });
    return res.matchedCount > 0;
  } catch (error) {
    console.error('markReminderStatus failed:', error);
    return false;
  }
}

export async function getReminderStats() {
  const all = await getReminders();
  const todayStr = new Date().toISOString().slice(0, 10);
  const sevenDaysLater = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const pending = all.filter(r => r.status === 'pending' || r.status === 'notified');
  const overdue = pending.filter(r => r.dueDate < todayStr);
  const dueToday = pending.filter(r => r.dueDate === todayStr);
  const upcoming = pending.filter(r => r.dueDate > todayStr && r.dueDate <= sevenDaysLater);
  const completed = all.filter(r => r.status === 'completed');
  const urgent = pending.filter(r => r.priority === 'urgent');

  return {
    total: all.length,
    activePending: pending.length,
    overdue: overdue.length,
    dueToday: dueToday.length,
    upcoming7Days: upcoming.length,
    completed: completed.length,
    urgentCount: urgent.length,
    overdueList: overdue,
    dueTodayList: dueToday,
  };
}

// ---------------------------------------------------------------------------
// Finance & Accounting (Income / Expense) Engine
// ---------------------------------------------------------------------------

export async function getFinanceRecords(filters?: {
  type?: string;
  category?: string;
  month?: string; // e.g. "2026-10"
  status?: string;
  search?: string;
}): Promise<FinanceRecord[]> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('finance_records');

    const query: any = {};
    if (filters?.type && filters.type !== 'all') {
      query.type = filters.type;
    }
    if (filters?.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    if (filters?.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters?.month && filters.month !== 'all') {
      query.date = { $regex: `^${filters.month}` };
    }
    if (filters?.search) {
      const s = filters.search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { clientName: { $regex: s, $options: 'i' } },
        { vendorName: { $regex: s, $options: 'i' } },
        { referenceNumber: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
      ];
    }

    const records = await collection.find(query).sort({ date: -1, createdAt: -1 }).toArray();
    return records.map(({ _id, ...r }) => r) as unknown as FinanceRecord[];
  } catch (error) {
    console.error('getFinanceRecords failed:', error);
    return [];
  }
}

export async function getFinanceRecordById(id: string): Promise<FinanceRecord | null> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('finance_records');
    const item = await collection.findOne({ id });
    if (!item) return null;
    const { _id, ...clean } = item;
    return clean as unknown as FinanceRecord;
  } catch (error) {
    console.error('getFinanceRecordById failed:', error);
    return null;
  }
}

export async function saveFinanceRecord(record: FinanceRecord): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('finance_records');
    const now = new Date().toISOString();

    const { _id, createdAt, ...updateFields } = record as any;
    const doc: any = {
      ...updateFields,
      amount: Number(record.amount) || 0,
      updatedAt: now,
    };

    await collection.updateOne(
      { id: record.id },
      {
        $set: doc,
        $setOnInsert: { createdAt: createdAt || record.createdAt || now }
      },
      { upsert: true }
    );
    return true;
  } catch (error) {
    console.error('saveFinanceRecord failed:', error);
    return false;
  }
}

export async function deleteFinanceRecord(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('finance_records');
    const res = await collection.deleteOne({ id });
    return res.deletedCount > 0;
  } catch (error) {
    console.error('deleteFinanceRecord failed:', error);
    return false;
  }
}

export async function getFinanceStats(): Promise<FinanceStats> {
  try {
    const records = await getFinanceRecords();

    const now = new Date();
    const thisMonthStr = now.toISOString().slice(0, 7);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

    let totalIncome = 0;
    let totalExpense = 0;
    let pendingIncome = 0;
    let pendingExpense = 0;
    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    const incomeCatMap: Record<string, number> = {};
    const expenseCatMap: Record<string, number> = {};

    for (const r of records) {
      const amt = Number(r.amount) || 0;
      const rMonth = (r.date || '').slice(0, 7);

      if (r.type === 'income') {
        incomeCount++;
        if (r.status === 'completed') {
          totalIncome += amt;
          incomeCatMap[r.category] = (incomeCatMap[r.category] || 0) + amt;

          if (rMonth === thisMonthStr) {
            thisMonthIncome += amt;
          } else if (rMonth === lastMonthStr) {
            lastMonthIncome += amt;
          }
        } else if (r.status === 'pending') {
          pendingIncome += amt;
        }
      } else if (r.type === 'expense') {
        expenseCount++;
        if (r.status === 'completed') {
          totalExpense += amt;
          expenseCatMap[r.category] = (expenseCatMap[r.category] || 0) + amt;

          if (rMonth === thisMonthStr) {
            thisMonthExpense += amt;
          } else if (rMonth === lastMonthStr) {
            lastMonthExpense += amt;
          }
        } else if (r.status === 'pending') {
          pendingExpense += amt;
        }
      }
    }

    // Generate last 6 months trend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend: Array<{
      month: string;
      label: string;
      income: number;
      expense: number;
      net: number;
    }> = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toISOString().slice(0, 7);
      const mLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;

      let mIncome = 0;
      let mExpense = 0;

      for (const r of records) {
        if (r.status === 'completed' && (r.date || '').startsWith(mStr)) {
          const amt = Number(r.amount) || 0;
          if (r.type === 'income') mIncome += amt;
          if (r.type === 'expense') mExpense += amt;
        }
      }

      monthlyTrend.push({
        month: mStr,
        label: mLabel,
        income: mIncome,
        expense: mExpense,
        net: mIncome - mExpense,
      });
    }

    return {
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense,
      thisMonthIncome,
      thisMonthExpense,
      thisMonthNet: thisMonthIncome - thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
      incomeCount,
      expenseCount,
      categoryBreakdown: {
        income: incomeCatMap,
        expense: expenseCatMap,
      },
      monthlyTrend,
    };
  } catch (error) {
    console.error('getFinanceStats failed:', error);
    return {
      totalIncome: 0,
      totalExpense: 0,
      netProfit: 0,
      pendingIncome: 0,
      pendingExpense: 0,
      thisMonthIncome: 0,
      thisMonthExpense: 0,
      thisMonthNet: 0,
      lastMonthIncome: 0,
      lastMonthExpense: 0,
      incomeCount: 0,
      expenseCount: 0,
      categoryBreakdown: { income: {}, expense: {} },
      monthlyTrend: [],
    };
  }
}

