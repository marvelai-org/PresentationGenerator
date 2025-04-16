# Configuration Guide

This document explains how to configure the AI Backend service for deployment.

## Environment Variables

The AI Backend service is configured using environment variables. These can be set in an `.env` file or directly in your deployment environment.

### Core Configuration

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `HOST` | Host to bind the server to | `127.0.0.1` | No |
| `PORT` | Port to run the server on | `8000` | No |
| `ENVIRONMENT` | Environment type (development, production, testing) | `development` | Yes |
| `DEBUG` | Enable debug mode | `false` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000` | Yes |

### LLM Provider Configuration

#### OpenRouter

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | API key for OpenRouter | Yes for OpenRouter |
| `OPENROUTER_TEXT_MODEL` | Model to use (e.g., meta-llama/llama-4-maverick:free) | No |

#### Together.ai

| Variable | Description | Required |
|----------|-------------|----------|
| `TOGETHER_API_KEY` | API key for Together.ai | Yes for image generation |

#### Other LLM Providers

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | API key for OpenAI (alternative provider) | No |

### Storage Configuration

#### Supabase

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | URL for your Supabase instance | Yes for image storage |
| `SUPABASE_SERVICE_KEY` | Service key for Supabase access | Yes for image storage |
| `SUPABASE_STORAGE_BUCKET` | Storage bucket name for slide images | Yes for image storage |

## Example Configurations

### Development Environment

```dotenv
# Core Configuration
HOST=127.0.0.1
PORT=8000
ENVIRONMENT=development
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000

# LLM Provider
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free

# Image Generation
TOGETHER_API_KEY=your_together_api_key

# Storage
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_STORAGE_BUCKET=slide-images
```

### Production Environment

```dotenv
# Core Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production
DEBUG=false
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_OUTLINE=10
RATE_LIMIT_SLIDES=10
RATE_LIMIT_IMAGES=5

# LLM Provider
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_TEXT_MODEL=meta-llama/llama-4-maverick:free

# Image Generation
TOGETHER_API_KEY=your_together_api_key

# Storage
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_key
SUPABASE_STORAGE_BUCKET=slide-images
```

## Configuration File Location

The service looks for a `.env` file in the root directory of the project. In a Docker container, environment variables should be passed using the `-e` flag or an environment file.

For example:

```bash
docker run -p 8000:8000 --env-file .env.production ai-presentation-generator
```

## Security Considerations

- Never commit your `.env` file to version control
- Use secret management services in production environments
- Rotate API keys regularly
- Restrict CORS to only the domains that need access
- Disable debug mode in production 