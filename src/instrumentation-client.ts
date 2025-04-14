// This file is used by Next.js for client-side instrumentation
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';
import { browserTracingIntegration, replayIntegration, httpClientIntegration } from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1',
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
  });
} 