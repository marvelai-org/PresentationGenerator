#!/bin/bash
# Script to set up secure credentials for the Presentation Generator AI Service

# Change to the ai-backend directory
cd "$(dirname "$0")/../../ai-backend" || exit

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${GREEN}Presentation Generator AI Service - Secure Setup${NC}"
echo -e "${BLUE}===================================================${NC}\n"

# Check if .env file exists already
if [ -f .env ]; then
  echo -e "${YELLOW}WARNING: .env file already exists.${NC}"
  read -p "Do you want to create a new one? This will overwrite your existing file. (y/n): " overwrite
  if [[ $overwrite != "y" && $overwrite != "Y" ]]; then
    echo -e "${GREEN}Setup cancelled. Your existing .env file has been preserved.${NC}"
    exit 0
  fi
fi

# Create .env file from example
echo -e "\n${BLUE}Creating .env file from template...${NC}"
cp .env.example .env
echo -e "${GREEN}Created .env file.${NC}"

echo -e "\n${BLUE}Please provide your API keys and configuration:${NC}"
echo -e "${YELLOW}(Leave blank to keep the placeholder values for now)${NC}\n"

# Google API Key
read -p "Google (Gemini) API Key: " google_api_key
if [ ! -z "$google_api_key" ]; then
  sed -i '' "s/your-gemini-api-key/$google_api_key/g" .env 2>/dev/null || sed -i "s/your-gemini-api-key/$google_api_key/g" .env
fi

# Google Project ID
read -p "Google Cloud Project ID: " project_id
if [ ! -z "$project_id" ]; then
  sed -i '' "s/your-google-cloud-project-id/$project_id/g" .env 2>/dev/null || sed -i "s/your-google-cloud-project-id/$project_id/g" .env
fi

# Google Service Account File
read -p "Path to Google service account credentials file: " credentials_path
if [ ! -z "$credentials_path" ]; then
  if [ -f "$credentials_path" ]; then
    # Create credentials directory if it doesn't exist
    mkdir -p credentials
    
    # Generate a unique filename
    filename=$(basename "$credentials_path")
    dest_file="credentials/$filename"
    
    # Copy the file
    cp "$credentials_path" "$dest_file"
    sed -i '' "s|path/to/your/credentials.json|$dest_file|g" .env 2>/dev/null || sed -i "s|path/to/your/credentials.json|$dest_file|g" .env
    
    echo -e "${GREEN}Credentials file copied to $dest_file${NC}"
    echo -e "${YELLOW}NOTE: This file is excluded from git. Never commit credential files to version control.${NC}"
  else
    echo -e "${RED}Error: File not found. Please provide a valid path.${NC}"
    echo -e "${YELLOW}You'll need to update the GOOGLE_APPLICATION_CREDENTIALS in .env manually.${NC}"
  fi
fi

# Together API Key
read -p "Together.ai API Key: " together_api_key
if [ ! -z "$together_api_key" ]; then
  sed -i '' "s/your-together-api-key/$together_api_key/g" .env 2>/dev/null || sed -i "s/your-together-api-key/$together_api_key/g" .env
fi

# OpenRouter API Key
read -p "OpenRouter.ai API Key: " openrouter_api_key
if [ ! -z "$openrouter_api_key" ]; then
  sed -i '' "s/your-openrouter-api-key/$openrouter_api_key/g" .env 2>/dev/null || sed -i "s/your-openrouter-api-key/$openrouter_api_key/g" .env
fi

# Supabase URL and Keys
read -p "Supabase URL: " supabase_url
if [ ! -z "$supabase_url" ]; then
  sed -i '' "s|https://your-project-id.supabase.co|$supabase_url|g" .env 2>/dev/null || sed -i "s|https://your-project-id.supabase.co|$supabase_url|g" .env
fi

read -p "Supabase Service Key: " supabase_key
if [ ! -z "$supabase_key" ]; then
  sed -i '' "s/your-supabase-service-key/$supabase_key/g" .env 2>/dev/null || sed -i "s/your-supabase-service-key/$supabase_key/g" .env
fi

echo -e "\n${BLUE}===================================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${BLUE}===================================================${NC}\n"

echo -e "Your environment is now configured. To test it, run:"
echo -e "${YELLOW}cd ai-backend && python app.py${NC}"
echo -e "\nRemember to add any sensitive files to your .gitignore to prevent them from being committed."

# Make the file executable
chmod +x setup_credentials.sh 