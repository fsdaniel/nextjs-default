// This file is used by Next.js for client-side instrumentation
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';
import { browserTracingIntegration, replayIntegration, httpClientIntegration } from '@sentry/nextjs';

// Export hook for router transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

export function register() {
  if (typeof window !== 'undefined') {
    // Get DSN from environment variable
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1';
    console.log('Initializing Sentry client SDK with DSN:', dsn);
    
    // Get release and commit information
    const release = process.env.SENTRY_RELEASE || process.env.npm_package_version || '0.0.0';
    const commitSha = process.env.SENTRY_GIT_COMMIT_SHA || 'unknown';
    
    Sentry.init({
      dsn,
      release,
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
        
        // Add commit information
        if (event.exception && commitSha !== 'unknown') {
          if (!event.tags) event.tags = {};
          event.tags.commit = commitSha;
        }
        
        return event;
      },
    });
    
    // Log a test event to check if initialization was successful
    const testEventId = Sentry.captureMessage('Sentry client SDK initialized', { 
      level: 'debug',
      tags: {
        release,
        commit: commitSha !== 'unknown' ? commitSha : undefined
      }
    });
    console.log('Sentry client test event ID:', testEventId);
    
    // Add an error event listener to the window to capture uncaught errors
    window.addEventListener('error', (event) => {
      console.log('Window error event captured:', event);
    });
  }
}