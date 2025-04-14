// This file is used by Next.js for server-side and edge runtime instrumentation
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/nextjs';

// Export hook for capturing request errors in React Server Components
export const onRequestError = Sentry.captureRequestError;

export async function register() {
  // Get DSN from environment variable
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
  console.log('Initializing Sentry server SDK with DSN:', dsn);

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn,
      debug: true,
      // Enable performance monitoring with full sampling in development
      // Consider reducing this value in production 
      tracesSampleRate: 1.0,
      // Enable profiling for server-side performance
      profilesSampleRate: 0.5,
      // Add server-side integrations
      integrations: [
        nodeProfilingIntegration(),
      ],
      // Prevent the SDK from sending PII data
      sendDefaultPii: false,
      // Performance monitoring settings
      tracePropagationTargets: ["localhost", "gt.bm.onlydaniel.me", /^\//],
      // Enable console logging of SDK activities
      beforeSend(event) {
        console.log('Sending event to Sentry/GlitchTip from server:', event);
        return event;
      },
    });
    
    console.log('Sentry server SDK initialized');
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    Sentry.init({
      dsn,
      debug: true,
      // Enable performance monitoring
      tracesSampleRate: 1.0,
      // Prevent the SDK from sending PII data
      sendDefaultPii: false,
      // Enable console logging of SDK activities
      beforeSend(event) {
        console.log('Sending event to Sentry/GlitchTip from edge:', event);
        return event;
      },
    });
    
    console.log('Sentry edge SDK initialized');
  }
} 