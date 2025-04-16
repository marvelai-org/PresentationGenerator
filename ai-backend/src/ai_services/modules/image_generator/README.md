# Image Generator Module

## Purpose
This module is responsible for generating visual content (images) for presentation slides based on slide content and context.

## Features
- Converts slide content to appropriate image prompts
- Generates images using AI image generation models
- Optimizes images for presentation display
- Handles storage and retrieval of generated images

## Usage
The module is primarily used through the `/generate/images` API endpoint in the main application.

## Dependencies
- Together.ai API for image generation
- Supabase storage for image persistence

## Directory Structure
- `core.py`: Main executor function and business logic
- `prompt_templates/`: Templates for image generation prompts
- `utils.py`: Utility functions for image processing and manipulation

## Overview

The image generator module:
1. Takes slide content as input
2. Creates appropriate prompts for image generation using Gemini Pro
3. Generates images using Vertex AI's Imagen model
4. Stores generated images in either Supabase Storage or Google Cloud Storage
5. Returns public URLs for the stored images

## Storage Options

The module supports two storage options with a fallback mechanism:

1. **Primary: Supabase Storage**
   - Recommended for most deployments
   - Simple to set up and use
   - Cost-effective for smaller applications

2. **Fallback: Google Cloud Storage**
   - Used if Supabase is not configured or fails
   - Provides enterprise-grade scalability and reliability

3. **Last Resort: Mock URLs**
   - If both storage options fail, mock URLs are returned
   - The frontend will display placeholder images

## Configuration

### Environment Variables

#### Supabase Storage (Recommended)
```
# Required
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Optional (defaults to 'slide-images')
SUPABASE_STORAGE_BUCKET=slide-images
```

#### Google Cloud Storage (Fallback)
```
PROJECT_ID=your-google-cloud-project-id
SLIDE_IMAGES_BUCKET_NAME=your-gcs-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

### Setting Up Supabase Storage

1. Create a Supabase project at https://supabase.com
2. Create a storage bucket named 'slide-images' (or your preferred name)
3. Set the bucket's access policy to public
4. Get your project URL and service key from the Supabase dashboard
5. Add these credentials to your .env file

Example bucket policy (using Supabase Dashboard):
- Set "Public Bucket" to enabled
- Add a policy with the following SQL:
  ```sql
  (bucket_id = 'slide-images'::text)
  ```

## Error Handling

The storage system is designed to be fault-tolerant:

1. It attempts to use Supabase Storage first
2. If that fails, it falls back to Google Cloud Storage
3. If both fail, it returns mock image URLs
4. All errors are logged with appropriate context

## Logging

The module logs important events and errors. Set LOG_LEVEL=DEBUG in your .env file for more detailed logs. 