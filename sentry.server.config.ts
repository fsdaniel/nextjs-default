import * as Sentry from '@sentry/nextjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

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