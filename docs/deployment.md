# Self-Hosting Deployment Guide

This document provides instructions for self-hosting the application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your server
- Git (to clone the repository)

## Deployment Steps

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd [repository-name]
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
# Add other environment variables as needed
```

### 3. Build and Start with Docker Compose

```bash
docker-compose up -d
```

This will build the Docker image and start the application in detached mode. The application will be available at `http://localhost:3000`.

### 4. View Logs

```bash
docker-compose logs -f app
```

### 5. Stop the Application

```bash
docker-compose down
```

## Manual Build without Docker

If you prefer to run the application without Docker:

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Additional Configuration

### Reverse Proxy with Nginx

For production deployments, it's recommended to use Nginx as a reverse proxy. Here's a basic configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using SSL with Let's Encrypt

To secure your application with SSL:

1. Install Certbot
2. Run Certbot with Nginx plugin:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

This will automatically configure Nginx to use HTTPS. 