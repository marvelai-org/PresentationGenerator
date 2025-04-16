# AI Services Overview Guide

## Introduction

The AI Services component of the Presentation Generator is a powerful backend system that provides AI-driven content generation capabilities. This service enables the automatic creation of professional presentations through a series of specialized AI modules working together.

## Core Functionality

The AI Services provide three primary functions:

1. **Outline Generation**: Creates structured presentation outlines from topics
   - Converts a single topic into a logical sequence of slide titles
   - Adapts to different instructional levels (beginner, intermediate, advanced)
   - Supports multiple languages for global use

2. **Slide Content Generation**: Produces detailed content for each slide
   - Transforms outline titles into comprehensive slide content
   - Generates appropriate bullet points, explanations, and key information
   - Maintains consistent tone and complexity across the presentation

3. **Image Generation**: Creates relevant visuals for each slide
   - Produces thematically appropriate images based on slide content
   - Optimizes images for presentation use
   - Stores generated images in cloud storage for easy access

## Integration with Main Application

The AI Services integrate with the main Presentation Generator application through:

1. **REST API Interface**: The frontend communicates with AI Services via RESTful API endpoints
   - `/generate/outline`: Creates presentation structure
   - `/generate/slides`: Builds content for each slide
   - `/generate/images`: Creates visual elements

2. **Shared Storage**: Both systems access the same Supabase storage
   - AI Services upload generated images to a Supabase storage bucket
   - Frontend displays and manages these images within the presentation editor
   - Images are publicly accessible through authenticated Supabase URLs

3. **Authentication Flow**: The frontend handles user authentication and passes tokens 
   - User authentication occurs in the Next.js frontend
   - API requests to AI Services include necessary authorization
   - Permissions are managed at the storage level through RLS policies

## Architecture

The AI Services are built with a modular architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                       │
└───────────────────────────────┬─────────────────────────────┘
                                │                                
                                ▼                                
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Service                         │
├─────────────┬─────────────────┬──────────────┬──────────────┤
│ Health Check│  Outline Gen    │  Slide Gen   │  Image Gen   │
│    API      │     API         │    API       │    API       │
└─────────────┴─────────────────┴──────────────┴──────────────┘
        │             │                │              │         
        └─────────────┼────────────────┼──────────────┘         
                      │                │                        
┌─────────────────────┼────────────────┼──────────────────────┐
│   ┌─────────────────▼─┐   ┌──────────▼───────┐  ┌──────────┐│
│   │ Outline Generator │   │ Slide Generator  │  │  Image   ││
│   │     Module        │   │     Module       │  │ Generator ││
│   └───────────────────┘   └──────────────────┘  │  Module  ││
│                                                 └──────────┘│
│                    Core AI Modules                          │
└─────────────────────────────────────────────────────────────┘
                      │                │              │         
┌─────────────────────┼────────────────┼──────────────┘         
│                     │                │                        
▼                     ▼                ▼                        
┌─────────────┐ ┌────────────┐ ┌─────────────────────────────┐
│ LLM Provider │ │ Supabase   │ │ Image Generation Service    │
│ (OpenAI/     │ │ Storage    │ │ (Google Vertex AI, OpenAI,  │
│  Google)     │ │            │ │  Together.ai, etc.)         │
└─────────────┘ └────────────┘ └─────────────────────────────┘
```

## Data Flow

1. **Outline Generation Flow**:
   - User provides a topic and parameters via the frontend
   - Request is sent to the `/generate/outline` endpoint
   - Outline Generator module processes the request using LLM
   - Generated outline is returned to the frontend
   - Frontend displays the outline for user review/editing

2. **Slide Generation Flow**:
   - User confirms outline (with possible edits)
   - Frontend sends titles to `/generate/slides` endpoint
   - Slide Generator module creates content for each title
   - Generated content is returned to the frontend
   - Frontend populates slides with the generated content

3. **Image Generation Flow**:
   - Frontend sends slide data to `/generate/images` endpoint
   - Image Generator module analyzes each slide
   - Appropriate images are generated or retrieved
   - Images are stored in Supabase storage
   - Image URLs are returned to the frontend
   - Frontend displays images in the presentation

## Technology Stack

- **FastAPI**: High-performance web framework for API endpoints
- **Pydantic**: Data validation and settings management
- **LangChain**: Framework for LLM-powered applications
- **Supabase**: Storage solution for generated assets
- **Docker**: Containerization for consistent deployment

## Next Steps

- See [Getting Started Guide](./getting-started.md) for setup instructions
- Check [API Documentation](./api-reference.md) for endpoint details
- Explore [Module Documentation](./modules/index.md) for specific AI module information 