"""
Pytest configuration file for the AI services tests.

This file contains shared fixtures and configuration for the test suite.
"""

import os
import pytest
from dotenv import load_dotenv

# Load environment variables for tests
@pytest.fixture(scope="session", autouse=True)
def load_env():
    """Load environment variables from .env file before running tests."""
    load_dotenv()
    
    # Check required environment variables
    required_vars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_STORAGE_BUCKET']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        pytest.skip(f"Missing required environment variables: {', '.join(missing)}")
    
    return True 