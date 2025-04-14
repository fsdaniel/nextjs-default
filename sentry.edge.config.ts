import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1',
  // Adjust this value in production, or use tracesSampleRate for greater accuracy
  tracesSampleRate: 1.0,
  // Prevent the SDK from sending PII data like IP addresses
  sendDefaultPii: false,
}); 