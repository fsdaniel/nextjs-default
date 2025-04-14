# Stage 1: Build the application
# Declare build argument for version (with default)
ARG VERSION=unknown
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Redeclare ARG in this stage WITHOUT default value (to preserve passed-in value)
ARG VERSION

# Install dependencies
# Copy package.json and lock file
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Use the appropriate install command based on your lock file
# Assumes npm if no lock file found
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  else npm i; \
  fi

# Copy application code
COPY . .

# Set NEXT_TELEMETRY_DISABLED to avoid telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Debug: Show the VERSION value
RUN echo "VERSION in builder stage: $VERSION"

# Create the version file *before* the build
RUN echo "$VERSION" > /app/version.txt
RUN echo "Version file contents:"
RUN cat /app/version.txt

# Build the Next.js application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm run build; \
  else npm run build; \
  fi

# Stage 2: Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Redeclare ARG in this stage WITHOUT default value (to preserve passed-in value)
ARG VERSION

# Debug: Show the VERSION value
RUN echo "VERSION in runner stage: $VERSION"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
# Explicitly copy the version file created during the build
COPY --from=builder --chown=nextjs:nodejs /app/version.txt ./version.txt
# Show the contents of the version file after copying
RUN echo "Version file contents after copy:"
RUN cat /app/version.txt
# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
# Default port, can be overridden by PORT env var in Kubernetes
ENV PORT 3000
# Set the app version environment variable from the build argument
ENV NEXT_PUBLIC_APP_VERSION=$VERSION

# Expose the port the app runs on
EXPOSE 3000

# Change ownership to non-root user
USER nextjs

# Start the application
CMD ["node", "server.js"] 