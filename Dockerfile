# Use Node.js as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies using pnpm
RUN pnpm install

# Install NestJS CLI globally
RUN npm i -g @nestjs/cli

# Copy the rest of the application code to the container
COPY . .

# Build both NestJS applications
RUN nest build auth
RUN nest build users
RUN nest build api-gateway