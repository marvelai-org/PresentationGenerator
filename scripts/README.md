# Scripts Directory

This directory contains various utility scripts for setting up and running the Presentation Generator.

## Directory Structure

- `ai-service/`: Scripts related to running and managing the AI service
  - `run.sh`: Production script to run the AI service
  - `run_dev.sh`: Development script to run the AI service with hot reloading
  - `fix_images.sh`: Script to fix image generation issues and restart the service

- `setup/`: Setup and configuration scripts
  - `setup_credentials.sh`: Interactive script to set up API keys and configurations
  - `setup_supabase.sh`: Script to configure Supabase storage integration
  - `create_supabase_bucket.py`: Python script to create and configure Supabase storage buckets

- `ci/`: Continuous Integration scripts
- `mock/`: Mock data and testing scripts

## Usage

All scripts are executable. You can run them from the project root:

```bash
# Run the AI service
./scripts/ai-service/run.sh

# Run the AI service in development mode
./scripts/ai-service/run_dev.sh

# Set up credentials interactively
./scripts/setup/setup_credentials.sh
``` 