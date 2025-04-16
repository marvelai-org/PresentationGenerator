# Supabase Storage Setup for Presentation Generator

This guide explains how to set up Supabase storage for the AI Presentation Generator application to store slide images.

> **Note:** For easier setup, use the automated setup script:
> ```bash
> # From project root
> npm run ai:setup-supabase
> ```
> This script handles bucket creation and testing automatically.

## Prerequisites

- Supabase project "AI Presentation Generator" is already created
- You have access to the Supabase dashboard

## Step 1: Create the Storage Bucket

1. Go to the Supabase Dashboard: https://app.supabase.com
2. Select your "AI Presentation Generator" project
3. In the left sidebar, click on "Storage"
4. Click "Create bucket"
5. Enter the bucket name: `slide-images`
6. Enable "Public bucket" option
7. Click "Create bucket"

## Step 2: Configure Bucket Permissions (IMPORTANT)

The bucket needs proper Row Level Security (RLS) policies to allow uploads:

### Method 1: Using the SQL Editor (Recommended)

1. Go to the SQL Editor in your Supabase Dashboard
2. Copy the content of the `supabase_rls_policy.sql` file provided
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL commands

### Method 2: Using the Dashboard UI

1. After creating the bucket, click on the "slide-images" bucket
2. Go to the "Policies" tab
3. Make sure "Public bucket" is enabled (toggle should be ON)
4. Click "New Policy"
5. Choose "Create a policy from scratch"
6. Set the following:
   - Policy name: "Allow all operations"
   - Allowed operations: SELECT, INSERT, UPDATE, DELETE
   - Policy definition: `bucket_id = 'slide-images'`
7. Click "Save Policy"

## Step 3: Update Environment Variables

For the service to use Supabase, your `.env` file needs the correct configuration:

```
SUPABASE_URL=https://nblhtcglmcubzeyjbpkh.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibGh0Y2dsbWN1YnpleWpicGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTg5NDEsImV4cCI6MjA1OTYzNDk0MX0.aFf7Hvm1yFL2Gc1Bl3W1lJFYiWqjpg5fOnskEW9V0uM
SUPABASE_STORAGE_BUCKET=slide-images
```

## Step 4: Restart the API Service

After updating the environment variables and setting up the bucket, restart your API service:

```bash
# If running directly
cd ai-backend
python app.py

# If running in Docker
docker-compose restart ai-service
```

## Troubleshooting

### RLS Permission Issues

If you see errors like:
```
new row violates row-level security policy
```

This means the RLS policies aren't set up correctly. Go back to Step 2 and make sure:
1. The "Public bucket" option is enabled
2. The SQL policies have been applied
3. You're using the correct key in your environment variables

### Testing Uploads

To test if your RLS policies are working correctly, run:

```bash
cd ai-backend
python3 test_supabase_upload.py
```

If successful, you should see:
```
Upload successful!
Public URL: https://nblhtcglmcubzeyjbpkh.supabase.co/storage/v1/object/public/slide-images/test.png
```

### Service Role Key vs Anon Key

For the image upload service to work properly with Supabase, you need:

1. Proper RLS policies that allow anonymous uploads (configured in Step 2)
2. OR use the service role key instead of the anon key (less recommended for production)

If uploads are still failing after setting RLS policies, you can temporarily switch to the service role key by:
1. Go to Project Settings > API in Supabase
2. Copy the "service_role" key
3. Update your .env file to use this key instead
4. Note: Using service_role bypasses RLS, so only use for testing 