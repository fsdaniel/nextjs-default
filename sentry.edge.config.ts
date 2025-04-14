// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Get release version from environment variable or package.json version
const RELEASE = process.env.SENTRY_RELEASE || process.env.npm_package_version || '0.0.0';

// Get commit SHA from environment variable
const COMMIT_SHA = process.env.SENTRY_GIT_COMMIT_SHA || 'unknown';

Sentry.init({
  dsn: "https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1",

  // Set release information for source maps
  release: RELEASE,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Add repo information for commit tracking
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
