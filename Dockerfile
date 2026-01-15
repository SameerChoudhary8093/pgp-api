# apps/api/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (Crucial for your DB!)
RUN npx prisma generate

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3002

# Start the app
CMD ["npm", "run", "start:prod"]