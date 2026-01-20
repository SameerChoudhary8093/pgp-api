## 1. Build Stage
FROM node:20-alpine AS builder

# Prisma's linux-musl engine on Alpine needs OpenSSL 1.1 compatibility libs
RUN apk add --no-cache openssl1.1-compat

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
FROM node:20-alpine

# Ensure OpenSSL 1.1 compatibility is available at runtime for Prisma
RUN apk add --no-cache openssl1.1-compat

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