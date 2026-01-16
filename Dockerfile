# Use Node 18 Debian Bookworm (Slim)
FROM node:18-bookworm-slim

# Install OpenSSL 3.0 and CA certificates
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Expose the port
EXPOSE 3002

# Start the application
CMD ["npm", "run", "start:prod"]