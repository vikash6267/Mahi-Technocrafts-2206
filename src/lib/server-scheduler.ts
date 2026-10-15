import { generateAutonomousBlog } from '@/lib/gemini-blog';
import { getBlogs, getReminders, saveReminder } from '@/lib/db';
import { sendClientReminderEmail } from '@/lib/email';

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
      const result = await generateAutonomousBlog({ status: 'draft' });
      if (result.success && result.blog) {
        console.log(`[Autonomous Blog Engine] Saved a draft for editorial review: "${result.blog.title}"`);
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
 * Checks pending client reminders (domain, hosting, payment, AMC, etc.)
 * that have reached their due date and dispatches email notifications.
 */
export async function checkAndDispatchDueReminders() {
  try {
    const reminders = await getReminders();
    const todayStr = new Date().toISOString().slice(0, 10);
    const nowMs = Date.now();

    // Check reminders that are due today or overdue, and pending or notified but not notified in last 24h
    const dueReminders = reminders.filter(r => {
      if (r.status === 'completed' || r.status === 'cancelled') return false;
      if (r.dueDate > todayStr) return false; // not due yet

      // If notified in last 24 hours, don't spam
      if (r.lastNotifiedAt) {
        const lastMs = new Date(r.lastNotifiedAt).getTime();
        if (nowMs - lastMs < 24 * 60 * 60 * 1000) {
          return false;
        }
      }
      return true;
    });

    if (dueReminders.length > 0) {
      console.log(`[Reminder Scheduler] Found ${dueReminders.length} due/overdue reminders to notify.`);
      for (const item of dueReminders) {
        // Admin-only reminder alerts per user requirement (no emails to client)
        if (item.notifyAdminEmail !== false) {
          const sentAdmin = await sendClientReminderEmail({ reminder: item, recipientType: 'admin' });
          if (sentAdmin) {
            item.status = 'notified';
            item.lastNotifiedAt = new Date().toISOString();
            await saveReminder(item);
            console.log(`[Reminder Scheduler] Dispatched reminder notice to Admin for: "${item.title}"`);
          }
        }
      }
    }
  } catch (err) {
    console.error('[Reminder Scheduler] Error checking reminders:', err);
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
  console.log('[Autonomous Engine] VPS Server Scheduler Initialized (Blogs & Client Reminders).');

  // Run initial checks 30 seconds after server boot
  setTimeout(() => {
    checkAndGenerateBlog();
    checkAndDispatchDueReminders();
  }, 30 * 1000);

  // Check every 30 minutes if it is time to generate the next blog post and check reminders
  const CHECK_INTERVAL_MS = 30 * 60 * 1000;
  setInterval(() => {
    checkAndGenerateBlog();
    checkAndDispatchDueReminders();
  }, CHECK_INTERVAL_MS);
}
