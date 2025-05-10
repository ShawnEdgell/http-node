# Stage 1: Builder - Install dependencies and compile TypeScript
# Use an Alpine-based Node.js image for a specific LTS version (e.g., Node 20 or 22)
FROM node:20-alpine AS builder
# You can choose a different Node.js version like node:22-alpine if your project needs it.

WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package.json package-lock.json* ./
# The * after package-lock.json handles both package-lock.json and npm-shrinkwrap.json

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of your application source code
COPY . .

# Build/compile TypeScript to JavaScript
# This assumes you have a "build" script in your package.json like "tsc -p ."
RUN npm run build

# Prune development dependencies after build (optional, but good for smaller node_modules to copy)
RUN npm prune --production

# Stage 2: Runtime - Create a minimal final image to run the compiled app
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production for runtime optimizations
ENV NODE_ENV=production

# Copy necessary files from the builder stage:
# 1. The compiled JavaScript code from the 'dist' folder
COPY --from=builder /app/dist ./dist
# 2. The production node_modules
COPY --from=builder /app/node_modules ./node_modules
# 3. The package.json (might be needed by your app or for 'npm start')
COPY --from=builder /app/package.json ./package.json


# Expose the port your Node.js/Fastify app listens on (e.g., 3001)
EXPOSE 3001

# Command to run the application
# This assumes your package.json has a "start" script like "node dist/server.js"
# Or you can directly use: CMD ["node", "dist/server.js"]
CMD ["npm", "run", "start"]