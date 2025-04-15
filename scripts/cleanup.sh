#!/bin/bash

# This script removes files that have been moved to better locations
# Run this after confirming the new structure works correctly

echo "Cleaning up files that have been moved to improved locations..."

# Remove duplicate hooks
if [ -d "src/app/hooks" ]; then
  echo "Removing src/app/hooks directory..."
  rm -rf src/app/hooks
fi

# Remove debug files from app directory
if [ -f "src/app/supabase-test.tsx" ]; then
  echo "Removing src/app/supabase-test.tsx..."
  rm src/app/supabase-test.tsx
fi

if [ -f "src/app/supabase-debug.tsx" ]; then
  echo "Removing src/app/supabase-debug.tsx..."
  rm src/app/supabase-debug.tsx
fi

# Remove theme-test from app directory (it should be moved to debug)
if [ -d "src/app/theme-test" ]; then
  echo "Removing src/app/theme-test directory..."
  rm -rf src/app/theme-test
fi

echo "Cleanup complete!"
echo "Check that everything is working correctly before committing these changes." 