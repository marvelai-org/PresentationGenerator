# AI Backend Scripts

This directory contains utility scripts for the AI backend service.

## Main Scripts

- `run.sh` - Runs the AI backend service in production mode
- `run_dev.sh` - Runs the AI backend service in development mode with hot reloading
- `fix_images.sh` - Fixes image generation issues and restarts the service

## Setup Scripts

The `setup` directory contains scripts for setting up the AI backend:

- `setup_credentials.sh` - Interactive script to set up API keys and credentials
- `setup_supabase.sh` - Sets up Supabase storage integration
- `create_supabase_bucket.py` - Creates and configures Supabase storage buckets

## Usage

To run the AI backend service:

```bash
# Production mode
./scripts/run.sh

# Development mode with hot reloading
./scripts/run_dev.sh
```

To set up credentials:

```bash
# From the ai-backend directory
./scripts/setup/setup_credentials.sh
```

To set up Supabase storage:

```bash
# From the ai-backend directory
./scripts/setup/setup_supabase.sh
``` 