import * as Sentry from "@sentry/nextjs";

const GLITCHTIP_DSN = "https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1";

// Get release version from environment variable or package.json version
const RELEASE = process.env.SENTRY_RELEASE || process.env.npm_package_version || '0.0.0';

// Get commit SHA from environment variable
const COMMIT_SHA = process.env.SENTRY_GIT_COMMIT_SHA || 'unknown';

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