import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mahitechnocrats:qNfbRMgnCthyu59@cluster1.xqa5iyj.mongodb.net/New-Mahitechoncrafts";
const MONGODB_DB = "New-Mahitechoncrafts";

// Caching connections across hot-reloads
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
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

// Default Seed Content for Homepage
const defaultSiteData: SiteData = {
  hero: {
    tagline: "Your Imagination, Our Creation",
    description: "At Mahi Technocrafts, we craft world-class, premium digital solutions that empower businesses to scale, innovate, and dominate. Experience futuristic design, custom software engineering, and enterprise-grade performance.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Explore Services",
    stats: [
      { id: "1", value: "150+", label: "Projects Completed" },
      { id: "2", value: "80+", label: "Clients Served" },
      { id: "3", value: "8+", label: "Years Experience" },
      { id: "4", value: "25+", label: "Team Members" }
    ]
  },
  about: {
    story: "Founded with a vision to bridge the gap between complex engineering and elegant design, Mahi Technocrafts has evolved into a premier tech agency. We don't just write code; we design experiences that inspire trust and drive growth.",
    mission: "To empower global enterprises and startups with cutting-edge technology, scalable architectures, and visually stunning interfaces that elevate their brand value.",
    vision: "To become a global beacon of digital craftsmanship, pioneering human-centric artificial intelligence and next-generation web technologies.",
    whyChooseUs: [
      "Futuristic, pixel-perfect UI/UX design matching global SaaS leaders.",
      "High-performance, secure, and clean scalable architectures.",
      "Dedicated post-launch maintenance and 24/7 technical support.",
      "Agile delivery with complete transparency and client-first communication."
    ]
  },
  founder: {
    name: "Vikash Maheshwari",
    designation: "Founder & CEO",
    message: "Technology is the canvas, and code is the paint. At Mahi Technocrafts, we believe in crafting digital ecosystems that aren't just functional, but cinematic. We treat every line of code, every pixel, and every animation with absolute dedication to perfection. We are here to bring your boldest ideas to life.",
    image: "/images/founder.jpg",
    socials: {
      instagram: "https://www.instagram.com/mahi_technocrafts/",
      linkedin: "#",
      twitter: "#"
    }
  },
  services: [
    {
      id: "web-dev",
      icon: "Code2",
      title: "Web Development",
      description: "Custom Next.js & React applications optimized for search speed, high conversions, and pixel-perfect aesthetics."
    },
    {
      id: "mobile-dev",
      icon: "Smartphone",
      title: "Mobile App Development",
      description: "High-fidelity cross-platform Flutter & React Native applications engineered for performance and fluid UI interactions."
    },
    {
      id: "uiux-design",
      icon: "Palette",
      title: "UI/UX Design",
      description: "Premium user journeys, wireframes, and high-fidelity clickable mockups following Apple & Stripe-grade guidelines."
    },
    {
      id: "ai-solutions",
      icon: "BrainCircuit",
      title: "AI Solutions",
      description: "Bespoke LLM integrations, retrieval-augmented generation pipelines, and smart automation systems for modern workforces."
    },
    {
      id: "erp-crm",
      icon: "Database",
      title: "ERP & CRM Systems",
      description: "Enterprise resource planning and customer relationship databases built for scaling team operations smoothly."
    },
    {
      id: "cloud-services",
      icon: "Cloud",
      title: "Cloud & DevOps Solutions",
      description: "AWS/GCP serverless setups, auto-scaling architectures, and continuous deployment pipelines maintaining 99.9% uptime."
    }
  ],
  faq: [
    {
      q: "What services does Mahi Technocrafts offer?",
      a: "We offer premium Web Development, Mobile App Development, UI/UX Design, Custom AI Integrations, Cloud DevOps setup, and Enterprise ERP/CRM solutions."
    },
    {
      q: "How long does a standard web project take to develop?",
      a: "A standard landing page or portfolio takes 2-4 weeks, while a full enterprise web application ranges from 8-12 weeks depending on features, integrations, and testing."
    },
    {
      q: "Are your websites optimized for Google Search SEO?",
      a: "Absolutely. SEO is built into our core foundation. We use Next.js server-side rendering, HTML5 semantics, structured JSON-LD schema, optimized metadata, automatic open graph cards, and rapid load speed architectures."
    },
    {
      q: "Do you provide post-launch maintenance?",
      a: "Yes! We provide flexible support agreements that cover security patches, content edits, cloud environment monitoring, and performance audits."
    }
  ],
  projects: [
    {
      id: "project-1",
      title: "FinTech Ledger System",
      description: "Secure, real-time transaction ledger for enterprise platforms with modern visualization graphs and custom CSV export.",
      image: "/images/project-fintech.jpg",
      imageAlt: "FinTech secure ledger tracking interface",
      tags: ["Next.js", "MongoDB", "AWS S3", "Tailwind"],
      link: "#"
    },
    {
      id: "project-2",
      title: "AI Support Assistant",
      description: "Chat widget integrated with custom LLMs, vector search bases, and smooth message streaming interactions.",
      image: "/images/project-ai.jpg",
      imageAlt: "AI chatbot interface showing chat conversation bubble",
      tags: ["React Native", "Python", "FastAPI", "OpenAI"],
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
    enableFaqSchema: true,
    faqs: [
      { q: "Is Next.js good for search engine indexing?", a: "Yes, because it serves pre-rendered HTML pages directly to web crawlers rather than serving blank shells." }
    ]
  },
  {
    slug: "top-web-development-company-in-bhopal-nextjs-ai",
    title: "Top Web Development Company in Bhopal: Driving Local Business Growth with Next.js & AI",
    excerpt: "Discover how premium Next.js website engineering and custom AI integrations empower local Bhopal enterprises to rank high on Google and double client conversions in 2026.",
    content: "<h3>Why Bhopal Businesses Need Modern Web Architectures</h3><p>Bhopal is witnessing a digital revolution. From local retail businesses in New Market and MP Nagar to enterprise service companies across Madhya Pradesh, having an online presence is no longer optional. However, a generic, slow website will not help you stand out. To dominate Google search results and attract high-paying clients, you need a high-performance, premium web application built by a professional web development company in Bhopal.</p><h3>1. High-Performance Next.js and Local Search Dominance</h3><p>Modern search engines like Google prioritize loading speed, mobile responsiveness, and clean semantic structures. Traditional websites built with basic templates load slowly and fail Core Web Vitals checks. Next.js offers Server-Side Rendering (SSR) and Static Site Generation (SSG), serving pre-rendered, rapid HTML pages directly to users and search crawlers. This ensures your site ranks top for local keywords like \"website developer in Bhopal\" or \"software development services near me\".</p><h3>2. The Role of Structured Schema Markup in Local Indexing</h3><p>If you want Google to index your business quickly and display rich snippets (like maps, FAQ lists, and star ratings) directly in search results, schema markup is essential. By implementing Organization, FAQ, and BlogPosting JSON-LD schemas, you tell Google's crawlers exactly who you are, what services you provide, and where you are located. Mahi Technocrafts integrates these advanced schemas automatically into every dynamic page.</p><h3>3. Integrating Artificial Intelligence for Business Operations</h3><p>In 2026, premium websites do more than just display text. By integrating custom AI chatbots, automated service booking forms, and intelligent client onboarding pipelines, local businesses can double their conversions. Whether you operate a healthcare clinic, educational institute, or logistics firm in Bhopal, custom AI workflows can automate up to 70% of support queries and capture leads 24/7.</p>",
    author: "Vikash Maheshwari",
    publishedAt: "2026-05-26",
    readTime: "6 min read",
    coverImage: "https://idcard-pro-images.s3.ap-south-1.amazonaws.com/mahi-technocrafts/blog-bhopal.jpg",
    imageAlt: "Mahi Technocrafts team of web developers in Bhopal Madhya Pradesh office workspace",
    category: "Local SEO",
    tags: ["Web Development", "Bhopal", "Next.js", "Local SEO"],
    metaTitle: "Top Web Development Company in Bhopal | Mahi Technocrafts",
    metaDescription: "Looking for the best web development company in Bhopal? Mahi Technocrafts engineers premium, fast Next.js websites, mobile apps, and custom AI systems.",
    focusKeyword: "Web Development Company in Bhopal",
    canonicalUrl: "https://mahitechnocrafts.in/blog/top-web-development-company-in-bhopal-nextjs-ai",
    ogTitle: "Top Web Development Company in Bhopal | Mahi Technocrafts",
    ogDescription: "Discover how premium Next.js website engineering and custom AI integrations empower local Bhopal enterprises to rank high on Google.",
    ogImage: "https://idcard-pro-images.s3.ap-south-1.amazonaws.com/mahi-technocrafts/blog-bhopal.jpg",
    enableBlogSchema: true,
    enableFaqSchema: true,
    faqs: [
      { q: "Which is the best web development company in Bhopal?", a: "Mahi Technocrafts is widely considered the top web development company in Bhopal, Madhya Pradesh, specializing in high-performance Next.js websites, iOS/Android mobile apps, and custom enterprise AI integrations." },
      { q: "How does local SEO help businesses in Bhopal?", a: "Local SEO optimizes your digital presence to rank high for search queries like 'web developers near me' or 'software agency in Bhopal', driving high-intent local traffic and clients straight to your business." },
      { q: "Does Mahi Technocrafts provide custom software services in Bhopal?", a: "Yes, Mahi Technocrafts is a full-service software development agency in Bhopal offering custom React development, Flutter app engineering, ERP databases, and cloud hosting solutions." }
    ]
  }
];

// Async MongoDB wrappers
export async function getSiteData(): Promise<SiteData> {
  const { db } = await connectToDatabase();
  const collection = db.collection('content');
  
  let data = await collection.findOne({ _id: 'site_configs' as any });
  
  if (!data) {
    // Seed default content
    const seed = { _id: 'site_configs', ...defaultSiteData };
    await collection.insertOne(seed as any);
    return defaultSiteData;
  }
  
  // Clean MongoDB _id before returning
  const { _id, ...cleanData } = data;
  return cleanData as unknown as SiteData;
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
    return true;
  } catch (error) {
    console.error('Error writing content to MongoDB', error);
    return false;
  }
}

export async function getBlogs(): Promise<BlogItem[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('blogs');
  
  const blogs = await collection.find({}).toArray();
  return blogs.map(({ _id, ...b }) => b) as unknown as BlogItem[];
}

export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
  const { db } = await connectToDatabase();
  const collection = db.collection('blogs');
  
  const blog = await collection.findOne({ slug });
  if (!blog) return null;
  
  const { _id, ...cleanBlog } = blog;
  return cleanBlog as unknown as BlogItem;
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
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting blog from MongoDB', error);
    return false;
  }
}

export async function getContacts(): Promise<ContactSubmission[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('contacts');
  
  const contacts = await collection.find({}).toArray();
  return contacts.map(({ _id, ...c }) => c) as unknown as ContactSubmission[];
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

// Review Default Seed Data
const defaultReviews: ReviewItem[] = [
  {
    id: '1',
    name: 'Amit Sharma',
    role: 'Director of Engineering',
    company: 'Logix Supply Co.',
    text: 'Mahi Technocrafts developed our custom CRM solution. The performance is incredibly fast, and their team maintains high engineering standards. Highly recommended!',
    rating: 5,
    email: 'amit@logix.com',
    status: 'approved',
    submittedAt: '2026-05-24T12:00:00Z',
  },
  {
    id: '2',
    name: 'Rohan Mehta',
    role: 'Founder',
    company: 'Holo Startups',
    text: 'The UI/UX design matching global leaders like Stripe and Apple really wowed our investors. Mahi Tech team did an excellent job delivering our Next.js dashboard.',
    rating: 5,
    email: 'rohan@holostartups.com',
    status: 'approved',
    submittedAt: '2026-05-25T14:30:00Z',
  },
  {
    id: '3',
    name: 'Sneha Patel',
    role: 'Marketing Head',
    company: 'Kira Global Inc',
    text: 'Our Google Search SEO ranking soared to the top page within two months of migrating our blog site to Next.js with Mahi Technocrafts. Great communication and support.',
    rating: 5,
    email: 'sneha@kiraglobal.com',
    status: 'approved',
    submittedAt: '2026-05-26T09:15:00Z',
  },
];

export async function getReviews(): Promise<ReviewItem[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('reviews');
  
  const reviews = await collection.find({}).toArray();
  if (reviews.length === 0) {
    await collection.insertMany(defaultReviews as any[]);
    return defaultReviews;
  }
  return reviews.map(({ _id, ...r }) => r) as unknown as ReviewItem[];
}

export async function getApprovedReviews(): Promise<ReviewItem[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('reviews');
  
  const reviews = await collection.find({ status: 'approved' }).toArray();
  if (reviews.length === 0) {
    const allReviews = await getReviews();
    return allReviews.filter(r => r.status === 'approved');
  }
  return reviews.map(({ _id, ...r }) => r) as unknown as ReviewItem[];
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
    title: 'Senior React / Next.js Engineer',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '3+ Years',
    description: 'We are looking for an expert Next.js and React engineer with high design standards, proficient in Framer Motion animations, TypeScript, and server layouts.'
  },
  {
    id: 'job-2',
    title: 'Mobile App Developer (Flutter)',
    type: 'Full-Time',
    location: 'Bhopal (On-site)',
    experience: '2+ Years',
    description: 'Seeking a high-fidelity Flutter developer to build fluid and secure iOS/Android corporate applications.'
  },
  {
    id: 'job-3',
    title: 'UI/UX Visual Designer',
    type: 'Full-Time',
    location: 'Remote / Hybrid',
    experience: '2+ Years',
    description: 'Craft premium user experience interfaces matching global standards like Apple and Stripe. High proficiency in Figma and wireframe mapping is required.'
  }
];

export async function getCareers(): Promise<CareerItem[]> {
  const { db } = await connectToDatabase();
  const collection = db.collection('careers');
  
  const careers = await collection.find({}).toArray();
  if (careers.length === 0) {
    const seed = defaultCareers.map(c => ({ ...c, postedAt: new Date().toISOString() }));
    await collection.insertMany(seed as any[]);
    return seed;
  }
  return careers.map(({ _id, ...c }) => c) as unknown as CareerItem[];
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
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting career from MongoDB', error);
    return false;
  }
}
