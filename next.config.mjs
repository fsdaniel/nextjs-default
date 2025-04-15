/** @type {import('next').NextConfig} */
import { withSentryConfig } from '@sentry/nextjs';

// Get release information from environment variables
const RELEASE = process.env.SENTRY_RELEASE || process.env.npm_package_version || '0.0.0';
const COMMIT_SHA = process.env.SENTRY_GIT_COMMIT_SHA || 'unknown';

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
  // Make environment variables available to the client
  env: {
    SENTRY_RELEASE: RELEASE,
    SENTRY_GIT_COMMIT_SHA: COMMIT_SHA
  }
};

// Define Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  org: "bm",
  project: "demo-helloworld",
  sentryUrl: "https://gt.bm.onlydaniel.me/",
  
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
};

// Define Sentry Next.js options
const sentryNextjsOptions = {
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  
  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

// Export the Next.js configuration with Sentry
export default withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions,
  sentryNextjsOptions
);