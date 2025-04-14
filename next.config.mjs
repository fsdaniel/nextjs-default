/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  output: 'standalone',
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Upload source maps to Sentry
  org: "biedmeer",
  project: "nextjs-default",

  // Auth tokens can be obtained from https://gt.bm.onlydaniel.me/settings/account/api/auth-tokens/
  authToken: process.env.SENTRY_AUTH_TOKEN,
}, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/

  // Automatically upload source maps to Sentry during build
  widenClientFileUpload: true,
  
  // Silence the Sentry CLI Logs
  silent: true,
}); 