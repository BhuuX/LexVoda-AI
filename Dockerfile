# ==========================================
# STAGE 1: BUILD ENVIRONMENT
# ==========================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better cache utilization
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Allocate more memory to prevent Cloud Build from crashing during Vite build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copy the rest of the application source code
COPY . .

# Build the Vite application for production
RUN npm run build

# ==========================================
# STAGE 2: PRODUCTION SERVER (NGINX)
# ==========================================
FROM nginx:alpine

# Remove default NGINX static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom NGINX configuration (Cloud Run uses 8080 by default)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for Google Cloud Run
EXPOSE 8080

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
