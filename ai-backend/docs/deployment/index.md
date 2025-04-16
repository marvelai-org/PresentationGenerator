# AI Backend Deployment Guide

This guide provides instructions for deploying the AI Backend component in production environments.

## Docker Deployment

The project includes a ready-to-use Dockerfile for containerized deployment.

### Building the Docker Image

To build the Docker image:

```bash
cd ai-backend
docker build -t ai-presentation-generator .
```

### Running the Container

Run the container with appropriate environment variables:

```bash
docker run -p 8000:8000 \
  -e ENVIRONMENT=production \
  -e HOST=0.0.0.0 \
  -e PORT=8000 \
  -e OPENROUTER_API_KEY=your-openrouter-key \
  -e OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free \
  -e TOGETHER_API_KEY=your-together-key \
  -e SUPABASE_URL=your-supabase-url \
  -e SUPABASE_SERVICE_KEY=your-supabase-key \
  -e SUPABASE_STORAGE_BUCKET=slide-images \
  -e ALLOWED_ORIGINS=https://your-frontend-domain.com \
  ai-presentation-generator
```

### Docker Compose (Optional)

For easier deployment, you can use a docker-compose.yml file:

```yaml
version: '3.8'

services:
  ai-service:
    build:
      context: ./ai-backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - HOST=0.0.0.0
      - PORT=8000
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free
      - TOGETHER_API_KEY=${TOGETHER_API_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - SUPABASE_STORAGE_BUCKET=slide-images
      - ALLOWED_ORIGINS=https://your-frontend-domain.com
    restart: unless-stopped
```

Then run with:

```bash
docker-compose up -d
```

## Cloud Deployment Options

The AI Backend component can be deployed to various cloud providers. Here are instructions for the most common options.

