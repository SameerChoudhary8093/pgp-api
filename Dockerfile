## 1. Build Stage
FROM node:20-alpine AS builder

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