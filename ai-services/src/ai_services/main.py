"""
FastAPI application for Presentation Generator AI Services.
"""

import logging
import os
from typing import Any
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).resolve().parent.parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from ai_services.modules.image_generator.core import executor as image_executor
from ai_services.modules.outline_generator.core import executor as outline_executor
from ai_services.modules.slide_generator.core import executor as slide_executor
from ai_services.utils.error_handler import api_error_handler

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Presentation Generator AI Service",
    description="AI service for generating presentation content",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-production-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class OutlineRequest(BaseModel):
    topic: str
    n_slides: int
    instructional_level: str = "intermediate"
    file_url: str | None = None
    file_type: str | None = None
    lang: str = "en"
    
    class Config:
        schema_extra = {
            "example": {
                "topic": "Introduction to Artificial Intelligence",
                "n_slides": 8,
                "instructional_level": "intermediate",
                "lang": "en"
            }
        }

class SlideRequest(BaseModel):
    slides_titles: list[str]
    topic: str
    instructional_level: str = "intermediate"
    lang: str = "en"
    
    class Config:
        schema_extra = {
            "example": {
                "slides_titles": ["What is AI?", "History of AI", "Machine Learning Basics"],
                "topic": "Introduction to Artificial Intelligence",
                "instructional_level": "intermediate",
                "lang": "en"
            }
        }

class ImageRequest(BaseModel):
    slides: list[dict[str, Any]]
    
    class Config:
        schema_extra = {
            "example": {
                "slides": [
                    {
                        "title": "What is AI?",
                        "content": "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence..."
                    }
                ]
            }
        }

# Response models
class OutlineResponse(BaseModel):
    outlines: list[str]

class SlideResponse(BaseModel):
    slides: list[dict[str, Any]]

class ImageResponse(BaseModel):
    status: str
    slides: list[dict[str, Any]]

@app.get("/")
async def root():
    """
    Health check endpoint for the Presentation Generator AI Service.
    
    Returns:
        dict: A status message indicating the service is running
    """
    return {"status": "ok", "message": "Presentation Generator AI Service is running"}

@app.post("/generate/outline", response_model=OutlineResponse)
@api_error_handler
async def generate_outline(request: OutlineRequest):
    """
    Generate a presentation outline based on a topic and parameters.
    
    This endpoint creates a structured outline with appropriate slide titles based on the
    requested topic. The number of slides, instructional level, and language can all be 
    specified to customize the outline.
    
    Parameters:
        request (OutlineRequest): The request object containing:
            - topic: The main subject of the presentation
            - n_slides: Target number of slides in the presentation
            - instructional_level: Complexity level (beginner, intermediate, advanced)
            - file_url: Optional URL to a reference document
            - file_type: Type of reference document (pdf, pptx, etc.)
            - lang: Language code for the output
            
    Returns:
        OutlineResponse: A response containing the generated outline titles
        
    Raises:
        HTTPException: If the request fails or contains invalid parameters
    """
    logger.info(f"Generating outline for topic: {request.topic}")
    result = outline_executor(
        n_slides=request.n_slides,
        topic=request.topic,
        instructional_level=request.instructional_level,
        file_url=request.file_url,
        file_type=request.file_type,
        lang=request.lang,
        verbose=True
    )
    return result

@app.post("/generate/slides", response_model=SlideResponse)
@api_error_handler
async def generate_slides(request: SlideRequest):
    """
    Generate detailed slide content based on outline titles.
    
    This endpoint takes a list of slide titles from an outline and creates comprehensive
    content for each slide, including text, bullet points, and additional context.
    
    Parameters:
        request (SlideRequest): The request object containing:
            - slides_titles: List of titles for each slide
            - topic: The main subject of the presentation
            - instructional_level: Complexity level (beginner, intermediate, advanced)
            - lang: Language code for the output
            
    Returns:
        SlideResponse: A response containing the generated slides with content
        
    Raises:
        HTTPException: If the request fails or contains invalid parameters
    """
    logger.info(f"Generating slides for topic: {request.topic}")
    result = slide_executor(
        slides_titles=request.slides_titles,
        topic=request.topic,
        instructional_level=request.instructional_level,
        lang=request.lang,
        verbose=True
    )
    return result

@app.post("/generate/images", response_model=ImageResponse)
@api_error_handler
async def generate_images(request: ImageRequest, background_tasks: BackgroundTasks):
    """
    Generate images for presentation slides based on their content.
    
    This endpoint creates visual elements for each slide in the presentation,
    using AI image generation models to produce relevant images based on the
    slide's title and content.
    
    Parameters:
        request (ImageRequest): The request object containing:
            - slides: A list of slides with title and content
        background_tasks (BackgroundTasks): FastAPI background tasks to handle
            asynchronous image generation
            
    Returns:
        ImageResponse: A response containing URLs to the generated images and updated slides
        
    Raises:
        HTTPException: If the request fails or image generation encounters errors
    """
    logger.info(f"Generating images for {len(request.slides)} slides")
    result = image_executor(
        slides=request.slides,
        verbose=True
    )
    return result

def create_app():
    """Create and configure the FastAPI application."""
    return app

def start():
    """Entry point for running the application."""
    # Use environment variables or defaults
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    
    # Use 0.0.0.0 in production/container environments
    if os.getenv("ENVIRONMENT") == "production":
        host = "0.0.0.0"
    
    uvicorn.run("ai_services.main:app", host=host, port=port, reload=True) 