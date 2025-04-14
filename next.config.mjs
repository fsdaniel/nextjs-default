/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  output: 'standalone',
  env: {
    // Set this to your actual GlitchTip auth token or disable source map uploading
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Upload source maps to Sentry
  org: "biedmeer",
  project: "nextjs-default",
  
  // Disable source map uploading if no auth token is provided
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,

  // Auth tokens can be obtained from https://gt.bm.onlydaniel.me/settings/account/api/auth-tokens/
  authToken: process.env.SENTRY_AUTH_TOKEN,
}, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/

  // Automatically upload source maps to Sentry during build
  widenClientFileUpload: true,
  
  // Silence the Sentry CLI Logs
  silent: true,
  
  // Disable telemetry
  telemetry: false,
}); 