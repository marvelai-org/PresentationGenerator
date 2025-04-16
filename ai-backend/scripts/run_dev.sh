#!/bin/bash
# Development script to run the AI service with Poetry

set -e

# Change to the ai-backend directory
cd "$(dirname "$0")/.." || exit

# Load environment variables
if [ -f .env ]; then
  echo "Loading environment variables from .env"
  export $(grep -v '^#' .env | xargs)
fi

# Check for required API keys
echo "Checking environment setup..."

if [ -z "$OPENROUTER_API_KEY" ] && [ -z "$GOOGLE_API_KEY" ]; then
  echo "ERROR: No API keys found for LLM providers."
  echo "Please set OPENROUTER_API_KEY or GOOGLE_API_KEY environment variables."
  echo "You can do this by:"
  echo "1. Ensuring the .env file contains the keys"
  echo "2. Sourcing the .env file: source .env"
  echo "3. Or setting them manually: export OPENROUTER_API_KEY=your_key"
  exit 1
fi

# If we made it here, we have required keys
echo "Environment checks passed. Starting development server..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
  source venv/bin/activate
fi

# Run the application with hot reloading
echo "Starting AI service in development mode..."
poetry run uvicorn app:app --host ${HOST:-127.0.0.1} --port ${PORT:-8000} --reload 