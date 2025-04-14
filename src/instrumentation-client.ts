// This file is used by Next.js for client-side instrumentation
// https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client

import * as Sentry from '@sentry/nextjs';
import { browserTracingIntegration, replayIntegration, httpClientIntegration } from '@sentry/nextjs';

// The official way to configure Sentry for client-side
// Previously in sentry.client.config.js (now deprecated)
const GLITCHTIP_DSN = "https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1";

// Get release version from environment variable or package.json version
const RELEASE = process.env.SENTRY_RELEASE || process.env.npm_package_version || '0.0.0';

// Get commit SHA from environment variable
const COMMIT_SHA = process.env.SENTRY_GIT_COMMIT_SHA || 'unknown';

// Initialize Sentry for client
Sentry.init({
  dsn: GLITCHTIP_DSN,
  
  // Set release information for source maps
  release: RELEASE,
  
  // Performance monitoring
  tracesSampleRate: 1.0, // Adjust in production
  
  // Additional options
  environment: process.env.NODE_ENV,
  
  // Enable debug mode to see what's happening
  debug: true,
  
  // Add repo information for commit tracking
  // This associates errors with specific code changes
  beforeSend: (event) => {
    if (event.exception && COMMIT_SHA !== 'unknown') {
      // Set release version and git commit
      if (!event.release) event.release = RELEASE;
      if (!event.tags) event.tags = {};
      event.tags.commit = COMMIT_SHA;
    }
    return event;
  }
});

// Export hook for router transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

// Additional instrumentation - will run when the page is loaded in the browser
export function register() {
  if (typeof window !== 'undefined') {
    console.log('Additional Sentry client instrumentation', {
      release: RELEASE,
      commitSha: COMMIT_SHA
    });
    
    // Add additional integrations
    Sentry.addIntegration(browserTracingIntegration());
    Sentry.addIntegration(replayIntegration());
    Sentry.addIntegration(httpClientIntegration());
    
    // Log a test event to check if initialization was successful
    const testEventId = Sentry.captureMessage('Sentry client SDK initialized', { 
      level: 'debug',
      tags: {
        release: RELEASE,
        commit: COMMIT_SHA !== 'unknown' ? COMMIT_SHA : undefined
      }
    });
    console.log('Sentry client test event ID:', testEventId);
    
    // Add an error event listener to the window to capture uncaught errors
    window.addEventListener('error', (event) => {
      console.log('Window error event captured:', event);
    });
  }
}