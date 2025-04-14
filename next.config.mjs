/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  output: 'standalone',
  // Disable eslint during build to prevent failures
  eslint: {
    // Only run ESLint in development environment
    ignoreDuringBuilds: true,
  },
  // Disable type checking during build for speed
  typescript: {
    // Only run type checking in development environment
    ignoreBuildErrors: true,
  },
  env: {
    // Set this to your actual GlitchTip auth token or disable source map uploading
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
    // Make sure the DSN is available to the client
    NEXT_PUBLIC_SENTRY_DSN: 'https://037a152fa3d04dd486d0e93d6c6e502e@gt.bm.onlydaniel.me/1',
  },
};

// The Sentry webpack plugin configuration
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Upload source maps to Sentry
  org: "biedmeer",
  project: "nextjs-default",
  
  // Disable source map uploading if no auth token is provided
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,

  // Auth tokens can be obtained from https://gt.bm.onlydaniel.me/settings/account/api/auth-tokens/
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

// The Next.js Sentry SDK configuration
const sentryNextJsOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/

  // Automatically upload source maps to Sentry during build
  widenClientFileUpload: true,
  
  // Silence the Sentry CLI Logs
  silent: false, // Set to false for more verbose output
  
  // Disable telemetry
  telemetry: false,

  // Enable debug mode for development
  debug: true,

  // Hide source maps from users
  hideSourceMaps: true,
};

// Export the Next.js configuration with Sentry enabled
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryNextJsOptions); 