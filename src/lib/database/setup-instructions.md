# Supabase Database Setup Instructions

This document contains the SQL scripts needed to set up the database tables for the Presentation Generator application in Supabase.

## Initial Setup

To set up your database, follow these steps:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the following SQL scripts
5. Execute the scripts in order

## User Profiles Table

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  bio TEXT,
  website TEXT
);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profiles
CREATE POLICY "Users can view their own profiles"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own profiles
CREATE POLICY "Users can update their own profiles"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can insert their own profiles
CREATE POLICY "Users can insert their own profiles"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

## Presentations Table

```sql
-- Create presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thumbnail_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_template BOOLEAN NOT NULL DEFAULT false,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS presentations_user_id_idx ON presentations (user_id);
CREATE INDEX IF NOT EXISTS presentations_is_public_idx ON presentations (is_public);
CREATE INDEX IF NOT EXISTS presentations_is_template_idx ON presentations (is_template);

-- Enable Row-Level Security
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own presentations
CREATE POLICY "Users can view their own presentations"
ON presentations FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Anyone can view public presentations
CREATE POLICY "Anyone can view public presentations"
ON presentations FOR SELECT
USING (is_public = true);

-- Policy: Users can insert their own presentations
CREATE POLICY "Users can insert their own presentations"
ON presentations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own presentations
CREATE POLICY "Users can update their own presentations"
ON presentations FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own presentations
CREATE POLICY "Users can delete their own presentations"
ON presentations FOR DELETE
USING (auth.uid() = user_id);
```

## Slides Table

```sql
-- Create slides table
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  transition TEXT,
  background TEXT,
  notes TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS slides_presentation_id_idx ON slides (presentation_id);
CREATE INDEX IF NOT EXISTS slides_order_idx ON slides (order_index);

-- Enable Row-Level Security
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Policy: Users can select slides from presentations they own
CREATE POLICY "Users can select slides from presentations they own"
ON slides FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.user_id = auth.uid()
  )
);

-- Policy: Users can select slides from public presentations
CREATE POLICY "Users can select slides from public presentations"
ON slides FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.is_public = true
  )
);

-- Policy: Users can insert slides in their own presentations
CREATE POLICY "Users can insert slides in their own presentations"
ON slides FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.user_id = auth.uid()
  )
);

-- Policy: Users can update slides in their own presentations
CREATE POLICY "Users can update slides in their own presentations"
ON slides FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.user_id = auth.uid()
  )
);

-- Policy: Users can delete slides in their own presentations
CREATE POLICY "Users can delete slides in their own presentations"
ON slides FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM presentations
    WHERE presentations.id = slides.presentation_id
    AND presentations.user_id = auth.uid()
  )
);
```

## Templates Table

```sql
-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS templates_category_idx ON templates (category);
CREATE INDEX IF NOT EXISTS templates_is_public_idx ON templates (is_public);
CREATE INDEX IF NOT EXISTS templates_user_id_idx ON templates (user_id);

-- Enable Row-Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view public templates
CREATE POLICY "Anyone can view public templates"
ON templates FOR SELECT
USING (is_public = true);

-- Policy: Users can view their own templates
CREATE POLICY "Users can view their own templates"
ON templates FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own templates
CREATE POLICY "Users can insert their own templates"
ON templates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own templates
CREATE POLICY "Users can update their own templates"
ON templates FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own templates
CREATE POLICY "Users can delete their own templates"
ON templates FOR DELETE
USING (auth.uid() = user_id);
```

## Function to Create Default Templates (Optional)

```sql
-- Function to create default templates for new users
CREATE OR REPLACE FUNCTION create_default_templates()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO templates (name, description, category, content, is_public)
  VALUES 
    ('Basic Presentation', 'A simple, clean presentation template', 'Basic', 
     '{
       "theme": "light",
       "font": "Arial",
       "colors": {
         "primary": "#3498db",
         "secondary": "#2ecc71",
         "background": "#ffffff",
         "text": "#333333"
       },
       "slideLayouts": {
         "title": { "elements": ["title", "subtitle"] },
         "content": { "elements": ["title", "bullets"] },
         "twoColumn": { "elements": ["title", "leftColumn", "rightColumn"] },
         "image": { "elements": ["title", "image", "caption"] }
       }
     }'::jsonb, 
     true),
    ('Dark Mode', 'A modern dark theme presentation', 'Modern', 
     '{
       "theme": "dark",
       "font": "Roboto",
       "colors": {
         "primary": "#3498db",
         "secondary": "#2ecc71",
         "background": "#222222",
         "text": "#ffffff"
       },
       "slideLayouts": {
         "title": { "elements": ["title", "subtitle"] },
         "content": { "elements": ["title", "bullets"] },
         "twoColumn": { "elements": ["title", "leftColumn", "rightColumn"] },
         "image": { "elements": ["title", "image", "caption"] }
       }
     }'::jsonb, 
     true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add default templates when database is created
CREATE OR REPLACE TRIGGER create_default_templates_trigger
AFTER INSERT ON pg_catalog.pg_class
FOR EACH ROW
WHEN (NEW.relname = 'templates')
EXECUTE FUNCTION create_default_templates();
```

## Testing Your Setup

After executing these scripts, you can test your setup by:

1. Going to the API Explorer in your Supabase dashboard
2. Running a test query on each table
3. Verifying that the Row-Level Security policies work as expected

If you encounter any issues, make sure that:
- All scripts executed without errors
- The references between tables are correct
- The RLS policies are properly configured

## Notes on Database Migrations

When making changes to your database schema:

1. Always back up your data first
2. Test changes in a development environment
3. Document all changes for future reference
4. Use Supabase's migration capabilities for production deployments

## Troubleshooting

If you encounter errors during setup:

- Check for syntax errors in your SQL
- Verify that the referenced tables exist before creating foreign keys
- Ensure that RLS policies don't conflict with each other
- Check that the user executing the queries has appropriate permissions 