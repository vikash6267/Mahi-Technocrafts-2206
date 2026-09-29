import { generateAutonomousBlog } from '@/lib/gemini-blog';
import { getBlogs } from '@/lib/db';

let isSchedulerRunning = false;
let isGenerating = false;

// Minimum hours between automatic blog posts (runs daily if >= 24h)
const MIN_HOURS_BETWEEN_BLOGS = 24;

async function checkAndGenerateBlog() {
  if (isGenerating) return;
  isGenerating = true;

  try {
    const blogs = await getBlogs();
    let latestTime = 0;

    for (const b of blogs) {
      if (b.publishedAt) {
        const t = new Date(b.publishedAt).getTime();
        if (!isNaN(t) && t > latestTime) {
          latestTime = t;
        }
      }
    }

    const now = Date.now();
    const hoursSinceLastBlog = latestTime > 0 ? (now - latestTime) / (1000 * 60 * 60) : 9999;

    console.log(`[Autonomous Blog Engine] Checking schedule: Last blog was published ${hoursSinceLastBlog.toFixed(1)} hours ago.`);

    if (hoursSinceLastBlog >= MIN_HOURS_BETWEEN_BLOGS) {
      console.log(`[Autonomous Blog Engine] Threshold reached (>= ${MIN_HOURS_BETWEEN_BLOGS}h). Triggering autonomous blog generation...`);
      const result = await generateAutonomousBlog({ status: 'published' });
      if (result.success && result.blog) {
        console.log(`[Autonomous Blog Engine] Successfully generated & published: "${result.blog.title}"`);
      } else {
        console.error('[Autonomous Blog Engine] Generation failed:', result.error);
      }
    }
  } catch (err) {
    console.error('[Autonomous Blog Engine] Scheduler check error:', err);
  } finally {
    isGenerating = false;
  }
}

/**
 * Self-Hosted Background Scheduler for VPS Server
 * Runs automatically inside the Node.js Next.js server process
 */
export function initAutonomousBlogScheduler() {
  if (isSchedulerRunning) {
    return;
  }

  // Prevent running in browser or build-time phases
  if (typeof window !== 'undefined' || process.env.NEXT_PHASE === 'phase-production-build') {
    return;
  }

  isSchedulerRunning = true;
  console.log('[Autonomous Blog Engine] VPS Server Scheduler Initialized.');

  // Run initial check 30 seconds after server boot
  setTimeout(() => {
    checkAndGenerateBlog();
  }, 30 * 1000);

  // Check every 30 minutes if it is time to generate the next blog post
  const CHECK_INTERVAL_MS = 30 * 60 * 1000;
  setInterval(() => {
    checkAndGenerateBlog();
  }, CHECK_INTERVAL_MS);
}

