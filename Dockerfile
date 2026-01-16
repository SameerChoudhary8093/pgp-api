# Use Node 18 Alpine as the base
FROM node:18-alpine

# Install OpenSSL 1.1.x and other dependencies for Prisma
# We use the community repository because openssl1.1-compat is there
RUN apk add --no-cache openssl1.1-compat

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client (This is the critical step)
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Expose the port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:prod"]