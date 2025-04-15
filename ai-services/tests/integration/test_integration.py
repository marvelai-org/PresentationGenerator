#!/usr/bin/env python3
"""
Test script to verify Supabase storage integration with the AI service.
This script generates and uploads a test image using the SlideImageGenerator.
"""

import os
import sys
import logging
from pathlib import Path
from dotenv import load_dotenv
from ai_services.modules.image_generator.tools import SlideImageGenerator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the project root to the Python path
project_root = str(Path(__file__).parent.parent.parent)
if project_root not in sys.path:
    sys.path.append(project_root)

def main():
    # Load environment variables
    load_dotenv()
    
    # Check if required env vars are set
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_STORAGE_BUCKET']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        logger.error(f"Missing required environment variables: {', '.join(missing)}")
        sys.exit(1)
    
    # Create a test slide
    test_slide = {
        "title": "Test Slide for Supabase Integration",
        "content": ["This is a test slide to verify Supabase storage integration."],
        "template": "modern"
    }
    
    # Initialize the SlideImageGenerator
    logger.info("Initializing SlideImageGenerator...")
    generator = SlideImageGenerator(slides=[test_slide], verbose=True)
    
    # Check which storage providers are available
    storage_info = []
    if generator.use_supabase:
        storage_info.append("Supabase Storage (Primary)")
    if generator.use_google_cloud:
        storage_info.append("Google Cloud Storage (Fallback)")
    
    if not storage_info:
        logger.error("No storage providers are available!")
        sys.exit(1)
    
    logger.info(f"Available storage providers: {', '.join(storage_info)}")
    
    # Process the test slide
    logger.info("Processing test slide...")
    result = generator.process_slide(test_slide, 0)
    
    # Check the result
    if result.get("image_url"):
        logger.info(f"SUCCESS! Image uploaded and accessible at: {result['image_url']}")
        logger.info(f"Image status: {result.get('image_status', 'unknown')}")
        return True
    else:
        logger.error("Failed to generate or upload image.")
        logger.error(f"Error: {result.get('error', 'unknown error')}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 