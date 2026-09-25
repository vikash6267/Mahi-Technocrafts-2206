import { generateAutonomousBlog } from '@/lib/gemini-blog';

let isSchedulerRunning = false;
let lastRunTimestamp = 0;

// Run auto-blog generation every 3 days (in milliseconds)
const GENERATION_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000; 

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

  // Check every 1 hour if it's time to generate the next blog post
  const CHECK_INTERVAL_MS = 60 * 60 * 1000; // 1 Hour

  setInterval(async () => {
    try {
      const now = Date.now();
      
      // If 3 days have elapsed since last auto generation
      if (now - lastRunTimestamp >= GENERATION_INTERVAL_MS) {
        console.log('[Autonomous Blog Engine] Triggering scheduled Gemini blog generation on VPS...');
        const result = await generateAutonomousBlog();
        
        if (result.success && result.blog) {
          lastRunTimestamp = now;
          console.log(`[Autonomous Blog Engine] Successfully generated & published: "${result.blog.title}"`);
        } else {
          console.error('[Autonomous Blog Engine] Generation failed:', result.error);
        }
      }
    } catch (err) {
      console.error('[Autonomous Blog Engine] Scheduler error:', err);
    }
  }, CHECK_INTERVAL_MS);
}
