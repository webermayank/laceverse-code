FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/fe/package*.json ./apps/fe/

RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build --workspace=fe

FROM nginx:alpine AS runner

# Copy built assets from builder stage
COPY --from=builder /app/apps/fe/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
