// This file is used by Next.js for server-side and edge runtime instrumentation
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    Sentry.init({
      dsn: 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1',
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
    });
  } else if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    Sentry.init({
      dsn: 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1',
      // Enable performance monitoring
      tracesSampleRate: 1.0,
      // Prevent the SDK from sending PII data
      sendDefaultPii: false,
    });
  }
} 