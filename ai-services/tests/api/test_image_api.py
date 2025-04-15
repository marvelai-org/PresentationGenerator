#!/usr/bin/env python3
"""
Test script to verify the image generation API is working correctly.
This makes a direct call to the /generate/images endpoint with test data.
"""

import requests
import json
import sys
import os
from pprint import pprint

# API endpoint
API_URL = "http://localhost:8000"

# Test data - a simple slide
test_slides = [
    {
        "title": "Test Slide for API Check",
        "content": ["This is a test slide to verify the image generation API is working."],
        "template": "modern"
    }
]

def main():
    print("🧪 Testing image generation API...")
    
    try:
        # Make the API request
        response = requests.post(
            f"{API_URL}/generate/images",
            json={"slides": test_slides},
            headers={"Content-Type": "application/json"}
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Parse the JSON response
        result = response.json()
        
        # Print the result
        print("\n✅ API Response:")
        print(f"Status: {result.get('status')}")
        
        # Check if the response includes images
        if "slides" in result and len(result["slides"]) > 0:
            slide = result["slides"][0]
            print(f"Image URL: {slide.get('image_url')}")
            print(f"Image Status: {slide.get('image_status')}")
            
            # If there's an error, print it
            if "error" in slide:
                print(f"Error: {slide.get('error')}")
            
            # Check if the image URL is a mock or fallback
            image_url = slide.get('image_url', '')
            if "example.com" in image_url:
                print("\n❌ WARNING: Using a mock image URL - this indicates the backend failed to generate a real image")
            elif "picsum.photos" in image_url:
                print("\n⚠️ WARNING: Using a fallback image URL - this indicates the API is working but cloud storage failed")
            else:
                print("\n✅ SUCCESS: Real image generated and stored successfully!")
                
                # Try to access the image
                print(f"\nVerifying image access at: {image_url}")
                img_response = requests.head(image_url)
                if img_response.status_code == 200:
                    print("✅ Image is accessible!")
                else:
                    print(f"❌ Image access failed with status code: {img_response.status_code}")
        else:
            print("\n❌ No slides in response!")
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ API request failed: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 