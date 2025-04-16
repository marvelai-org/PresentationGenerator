#!/bin/bash
# Setup script for Supabase storage integration

# Change to the ai-backend directory
cd "$(dirname "$0")/../.." || exit

# Set error handling
set -e

echo "🚀 Setting up Supabase Storage integration for AI Presentation Generator"
echo "=============================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed. Please install pip3 and try again."
    exit 1
fi

# Install required packages
echo "📦 Installing required Python packages..."
pip3 install -r requirements.txt

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create an .env file with Supabase credentials."
    exit 1
fi

# Source environment variables (for bash)
export $(grep -v '^#' .env | xargs)

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Missing required environment variables in .env file."
    echo "   Please make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set."
    exit 1
fi

echo "📋 Checking Supabase bucket setup..."
echo "NOTE: You may see 'Available buckets: []' if using the anon key - this is normal"
python3 -c "import os; from dotenv import load_dotenv; load_dotenv(); from supabase import create_client; supabase_client = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY')); print('Available buckets:', [bucket['name'] for bucket in supabase_client.storage.list_buckets()]);"

echo ""
echo "🧪 Running test upload to verify storage permissions..."
python3 -m tests.integration.test_supabase_upload

echo ""
echo "🔬 Testing full image generation and storage integration..."
python3 -m tests.integration.test_integration

echo ""
echo "✅ Supabase Storage integration setup is complete!"
echo ""
echo "🔍 NEXT STEPS:"
echo "1. If you saw any permission errors, follow the instructions in docs/supabase/storage-setup.md"
echo "2. Make sure to set up RLS policies as described in docs/supabase/rls-policies.sql"
echo "3. Restart your API service to apply all changes"
echo ""
echo "📝 For troubleshooting, refer to the docs/supabase directory" 