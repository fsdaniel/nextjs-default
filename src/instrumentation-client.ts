// This file is used by Next.js for client-side instrumentation
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';
import { browserTracingIntegration, replayIntegration, httpClientIntegration } from '@sentry/nextjs';

export function register() {
  if (typeof window !== 'undefined') {
    // Get DSN from environment variable
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
    console.log('Initializing Sentry client SDK with DSN:', dsn);
    
    Sentry.init({
      dsn,
      debug: true, // Enable debug mode for more verbose logging
      // Enable performance monitoring
      tracesSampleRate: 1.0,
      // Enable profiling - helps identify performance bottlenecks
      profilesSampleRate: 0.5,
      integrations: [
        browserTracingIntegration(),
        replayIntegration(),
        httpClientIntegration(),
      ],
      // Capture Replay for performance issues
      replaysSessionSampleRate: 0.1,
      // Capture Replay for error issues
      replaysOnErrorSampleRate: 1.0,
      // Prevent the SDK from sending PII data
      sendDefaultPii: false,
      // Performance monitoring settings
      tracePropagationTargets: ["localhost", "gt.bm.onlydaniel.me", /^\//],
      // Add a beforeSend to validate error capture is working
      beforeSend(event) {
        console.log('Sending event to Sentry/GlitchTip from client:', event);
        return event;
      },
    });
    
    // Log a test event to check if initialization was successful
    const testEventId = Sentry.captureMessage('Sentry client SDK initialized', { level: 'debug' });
    console.log('Sentry client test event ID:', testEventId);
    
    // Add an error event listener to the window to capture uncaught errors
    window.addEventListener('error', (event) => {
      console.log('Window error event captured:', event);
    });
  }
} 