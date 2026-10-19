'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentVisitIdRef = useRef<string | null>(null);
  const activeSecondsRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<any>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Initialize Visitor ID & UTM attribution
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Persistent Visitor ID
    let visitorId = localStorage.getItem('mt_visitor_id');
    if (!visitorId) {
      visitorId = `vtr_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('mt_visitor_id', visitorId);
    }

    // 2. UTM Parameters Attribution
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      if (utmSource || utmCampaign) {
        sessionStorage.setItem(
          'mt_utm',
          JSON.stringify({
            source: utmSource || '',
            medium: utmMedium || '',
            campaign: utmCampaign || ''
          })
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Send duration update via Beacon or keepalive Fetch
  const sendDurationBeacon = (visitId: string, activeSec: number) => {
    if (!visitId || activeSec <= 0) return;
    const payload = JSON.stringify({ visitId, activeSeconds: activeSec });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track-duration', blob);
    } else {
      fetch('/api/analytics/track-duration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  };

  // Main Tracking Effect on Route Change
  useEffect(() => {
    // STRICT RULE: Never track inside /admin area (Admin/Superadmin visits are excluded!)
    if (typeof window === 'undefined' || !pathname || pathname.startsWith('/admin')) {
      return;
    }

    // Send final duration for previous visit if switching pages
    if (currentVisitIdRef.current) {
      sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
    }

    // Reset active timer for new page load
    activeSecondsRef.current = 0;
    lastTickTimeRef.current = Date.now();

    const visitorId = localStorage.getItem('mt_visitor_id') || `vtr_${Date.now()}`;
    let sessionId = sessionStorage.getItem('mt_session_id');
    if (!sessionId) {
      sessionId = `ses_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      sessionStorage.setItem('mt_session_id', sessionId);
    }

    let utm: any = {};
    try {
      utm = JSON.parse(sessionStorage.getItem('mt_utm') || '{}');
    } catch {
      utm = {};
    }

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // 1. Post Visit Telemetry with client IP detection fallback
    const sendVisit = (detectedIp?: string) => {
      fetch('/api/analytics/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          path: fullPath,
          pageTitle: document.title || 'Mahi Technocrafts',
          referrer: document.referrer || 'Direct',
          utmSource: utm.source || undefined,
          utmMedium: utm.medium || undefined,
          utmCampaign: utm.campaign || undefined,
          clientIp: detectedIp || sessionStorage.getItem('mt_client_ip') || undefined
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && !data.skipped) {
            currentVisitIdRef.current = data.visitId;
          }
        })
        .catch(() => {});
    };

    const existingIp = sessionStorage.getItem('mt_client_ip');
    if (existingIp) {
      sendVisit(existingIp);
    } else {
      fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(1200) })
        .then((r) => r.json())
        .then((d) => {
          if (d?.ip) {
            sessionStorage.setItem('mt_client_ip', d.ip);
            sendVisit(d.ip);
          } else {
            sendVisit();
          }
        })
        .catch(() => {
          sendVisit();
        });
    }

    // 2. Active Tab-Aware Dwell Time Heartbeat (Every 15 Seconds)
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

    heartbeatTimerRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        const deltaSeconds = Math.round((now - lastTickTimeRef.current) / 1000);
        lastTickTimeRef.current = now;

        if (deltaSeconds > 0 && deltaSeconds < 60) {
          activeSecondsRef.current += deltaSeconds;

          if (currentVisitIdRef.current) {
            fetch('/api/analytics/track-duration', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                visitId: currentVisitIdRef.current,
                activeSeconds: activeSecondsRef.current
              })
            }).catch(() => {});
          }
        }
      } else {
        lastTickTimeRef.current = Date.now();
      }
    }, 15000);

    // 3. Tab Visibility & Page Hide Handlers
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (currentVisitIdRef.current) {
          sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
        }
      } else {
        lastTickTimeRef.current = Date.now();
      }
    };

    const handlePageHide = () => {
      if (currentVisitIdRef.current) {
        sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);

      if (currentVisitIdRef.current) {
        sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
      }
    };
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
