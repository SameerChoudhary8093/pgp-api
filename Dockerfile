## 1. Build Stage
FROM node:20-bookworm-slim AS builder

# Install OpenSSL and CA certificates (needed by Prisma and HTTPS clients)
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (clean, reproducible install)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

## 2. Production Stage
FROM node:20-bookworm-slim

# Install OpenSSL and CA certificates for runtime
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only what we need for runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Railway provides PORT; default to 3000
ENV PORT=3000
EXPOSE 3000

# Start the NestJS app
CMD ["npm", "run", "start:prod"]