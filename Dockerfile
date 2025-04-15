# Stage 1: Build the application
# Declare build argument for version (with default)
ARG VERSION=unknown
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Redeclare ARG in this stage WITHOUT default value (to preserve passed-in value)
ARG VERSION

# Install dependencies only when needed
FROM base AS deps

# Set environment variables to optimize Node
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add necessary build tools
RUN apk add --no-cache libc6-compat curl

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --omit=dev

# Add development dependencies for Sentry
FROM deps AS builder

# Sentry release and commit information
ARG SENTRY_RELEASE=0.0.0
ARG SENTRY_GIT_COMMIT_SHA=unknown

# Set environment variables for Sentry
ENV SENTRY_RELEASE=${SENTRY_RELEASE}
ENV SENTRY_GIT_COMMIT_SHA=${SENTRY_GIT_COMMIT_SHA}

# Copy all project files
COPY . .

# Install all dependencies, including dev dependencies for the build process
RUN npm ci

# Install missing packages specifically if needed
RUN npm install --save tailwindcss@^3.4.1 postcss@^8.4.35 autoprefixer@^10.4.17

# Build the application
RUN npm run build

# Stage 2: Production image
FROM base AS runner

WORKDIR /app

# Redeclare ARG in this stage WITHOUT default value (to preserve passed-in value)
ARG VERSION

# Debug: Show the VERSION value
RUN echo "VERSION in runner stage: $VERSION"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permissions
RUN mkdir -p /app/.next/standalone /app/.next/static /app/public \
    && chown -R nextjs:nodejs /app

# Sentry release and commit information
ARG SENTRY_RELEASE=0.0.0
ARG SENTRY_GIT_COMMIT_SHA=unknown

# Set environment variables for Sentry
ENV SENTRY_RELEASE=${SENTRY_RELEASE}
ENV SENTRY_GIT_COMMIT_SHA=${SENTRY_GIT_COMMIT_SHA}

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/version.txt ./version.txt

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Default port, can be overridden by PORT env var in Kubernetes
ENV PORT=3000
# Set the app version environment variable from the build argument
ENV NEXT_PUBLIC_APP_VERSION=$VERSION

# Expose the port the app runs on
EXPOSE 3000

# Change ownership to non-root user
USER nextjs

# Start the application
CMD ["node", "server.js"] 