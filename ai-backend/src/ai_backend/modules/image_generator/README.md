# Image Generator Module

The Image Generator module creates visually appealing images for each slide in a presentation using AI image generation models.

## Features

- Creates professional-quality images for presentation slides
- Automatically generates appropriate image prompts based on slide content
- Handles storage and management of generated images
- Supports different output formats
- Includes fallback mechanisms for reliability

## Architecture

The module follows a clean, modular architecture:

1. `core.py` - Entry point and orchestration
2. `tools.py` - Image generation and storage utilities
3. `prompts/` - Prompt templates for image generation

## Flow

1. Analyzes slide content to determine image needs
2. Creates an appropriate prompt for each slide
3. Generates an image using Together.ai's FLUX model
4. Stores generated images in Supabase Storage
5. Returns URLs to the generated images

## Configuration

Set the following environment variables:

### Together.ai (FLUX model)

```
TOGETHER_API_KEY=your-together-api-key
TOGETHER_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell-Free
```

### Supabase Storage

```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
SUPABASE_STORAGE_BUCKET=slide-images
```

## Storage Strategy

The module uses a cascading storage strategy for reliability:

1. Primary: Supabase Storage
2. Fallback: Local storage (development only)
3. Ultimate fallback: placeholder images (in case of failure)

## Dependencies

- Together.ai Python client
- Supabase Python client
- Pillow (for fallback image generation)

## Error Handling

The module includes comprehensive error handling:
- Graceful degradation to placeholder images
- Detailed logging of failure points
- Multiple fallback mechanisms 