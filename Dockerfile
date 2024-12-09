# FROM node:18-alpine AS base
FROM node:lts-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json*  ./
# Omit --production flag for TypeScript devDependencies
RUN  npm ci


COPY src ./src
# COPY public ./public

COPY next.config.ts .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.mjs .


# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030



# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js based on the preferred package manager
RUN npm run build


# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs


COPY --from=builder /app/next.config.ts .
COPY --from=builder /app/package.json .

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./apps/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./apps/public



# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Environment variables must be redefined at run time


# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us





# CMD ["npm", "run", "start"]
CMD ["node", "server.js"]
