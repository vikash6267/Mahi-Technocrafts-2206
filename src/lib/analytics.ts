'use client';

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
    fbq?: (action: string, eventName: string, params?: Record<string, any>) => void;
  }
}

/**
 * Universal Event Tracker for Google Analytics 4 & Meta Pixel
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>,
  metaEvent?: string
) {
  if (typeof window === 'undefined') return;

  // Track on GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Track on Meta Pixel
  if (typeof window.fbq === 'function') {
    if (metaEvent) {
      window.fbq('track', metaEvent, params);
    } else {
      window.fbq('trackCustom', eventName, params);
    }
  }
}

/**
 * Track WhatsApp CTA Clicks
 */
export function trackWhatsAppClick(location: string = 'unknown') {
  trackEvent(
    'whatsapp_click',
    {
      event_category: 'Engagement',
      event_label: location,
      source: location,
    },
    'Contact'
  );
}

/**
 * Track Direct Phone Call Clicks
 */
export function trackPhoneCall(location: string = 'unknown') {
  trackEvent(
    'phone_call_click',
    {
      event_category: 'Engagement',
      event_label: location,
      source: location,
    },
    'Contact'
  );
}

/**
 * Track Lead & Form Submissions
 */
export function trackLeadSubmission(formName: string, metadata?: Record<string, any>) {
  trackEvent(
    'generate_lead',
    {
      event_category: 'Leads',
      event_label: formName,
      form_name: formName,
      ...metadata,
    },
    'Lead'
  );
}

/**
 * Track Project Scope Estimator Submissions
 */
export function trackEstimatorRequest(projectType: string, industry: string) {
  trackEvent(
    'quote_request',
    {
      event_category: 'Leads',
      event_label: projectType,
      project_type: projectType,
      industry: industry,
    },
    'InitiateCheckout'
  );
}
