#!/usr/bin/env python3
"""
Test script to upload a sample image to Supabase storage.
"""

import os
import tempfile
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

# Get Supabase URL and key from environment
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
bucket_name = os.getenv('SUPABASE_STORAGE_BUCKET', 'slide-images')

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)

# Create a temporary test image
with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
    # Write a simple PNG image (just some bytes for testing)
    temp_file.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')
    temp_file.flush()
    temp_file_path = temp_file.name

try:
    # Try to upload the file
    print(f"Uploading test file to bucket '{bucket_name}'...")
    
    # Get the filename only from the path
    filename = os.path.basename(temp_file_path)
    
    # Upload the file to Supabase storage
    result = supabase.storage.from_(bucket_name).upload(
        path="test.png",
        file=temp_file_path,
        file_options={"content-type": "image/png"}
    )
    
    print("Upload successful!")
    
    # Get the public URL
    public_url = supabase.storage.from_(bucket_name).get_public_url("test.png")
    print(f"Public URL: {public_url}")
    
except Exception as e:
    print(f"Error uploading file: {str(e)}")
finally:
    # Clean up the temporary file
    if os.path.exists(temp_file_path):
        os.unlink(temp_file_path) 