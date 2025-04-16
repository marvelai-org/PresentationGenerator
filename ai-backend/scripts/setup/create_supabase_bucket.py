#!/usr/bin/env python3
"""
Script to create and configure Supabase storage buckets for Presentation Generator
"""

import os
import sys
from pathlib import Path

# Change to ai-backend directory
script_dir = Path(__file__).resolve().parent
ai_backend_dir = script_dir.parent.parent
os.chdir(ai_backend_dir)
sys.path.insert(0, str(ai_backend_dir))

import dotenv
from supabase import create_client

# Load environment variables
dotenv.load_dotenv()

# Get Supabase credentials
supabase_url = os.getenv("SUPABASE_URL")
supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_service_key:
    print("❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file")
    sys.exit(1)

# Initialize Supabase client
print("🔗 Connecting to Supabase...")
supabase = create_client(supabase_url, supabase_service_key)

# Bucket name for storing presentation assets
BUCKET_NAME = "presentations"

def create_bucket_if_not_exists(bucket_name):
    """Create a bucket if it doesn't already exist"""
    try:
        existing_buckets = supabase.storage.list_buckets()
        bucket_exists = any(bucket["name"] == bucket_name for bucket in existing_buckets)
        
        if bucket_exists:
            print(f"✅ Bucket '{bucket_name}' already exists")
        else:
            result = supabase.storage.create_bucket(bucket_name, {"public": True})
            print(f"✅ Created bucket '{bucket_name}'")
            
        return True
    except Exception as e:
        print(f"❌ Error creating/checking bucket: {str(e)}")
        return False

# Create the presentations bucket
if create_bucket_if_not_exists(BUCKET_NAME):
    print("✅ Supabase storage bucket setup complete!")
    print("")
    print("🔍 NEXT STEPS:")
    print("1. Make sure RLS policies are set up (see supabase_rls_policy.sql)")
    print("2. Test the storage by running test_supabase_upload.py")
else:
    print("❌ Failed to set up Supabase storage buckets") 