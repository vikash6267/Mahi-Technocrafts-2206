export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { initAutonomousBlogScheduler } = await import('@/lib/server-scheduler');
      initAutonomousBlogScheduler();
    } catch (error) {
      console.error('Failed to initialize server-scheduler in instrumentation:', error);
    }
  }
}
