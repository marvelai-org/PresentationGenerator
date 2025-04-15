"""
Simple wrapper script to run the AI services application.
This allows running the app from the root directory while maintaining proper package structure.

Note: For development and production deployment, please use the scripts in the
project root's scripts/ directory:
- npm run ai:dev     # Development mode
- npm run ai:start   # Production mode

Documentation:
- Supabase setup: docs/supabase/storage-setup.md
- RLS policies: docs/supabase/rls-policies.sql
"""

import os
import sys

# Add the src directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

from ai_services.main import app, start

if __name__ == "__main__":
    # Use environment variables or defaults
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    
    # Call the start function from the main module
    start()