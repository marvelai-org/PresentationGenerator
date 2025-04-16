-- SQL script to configure Row Level Security policies for the slide-images bucket
-- Run this SQL in the Supabase SQL Editor

-- Allow public access to all objects in the slide-images bucket
CREATE POLICY "Public Access" ON storage.objects
FOR ALL
USING (bucket_id = 'slide-images');

-- Optional: If you need authenticated users to upload files
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'slide-images');

-- Optional: If you need to allow anonymous uploads (less secure)
CREATE POLICY "Allow anonymous uploads" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'slide-images');

-- Optional: Allow users to update their own objects
CREATE POLICY "Allow updates" ON storage.objects
FOR UPDATE
USING (bucket_id = 'slide-images');

-- Optional: Allow users to delete their own objects
CREATE POLICY "Allow deletes" ON storage.objects
FOR DELETE
USING (bucket_id = 'slide-images');

-- Important: You need to run this from the Supabase Dashboard SQL Editor
-- Go to: https://app.supabase.com/project/nblhtcglmcubzeyjbpkh/sql
-- Paste this SQL and run it 