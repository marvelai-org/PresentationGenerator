# Integrations Documentation

This section contains documentation for external services integrated with the AI Backend.

## Contents

- [Supabase](./supabase) - Documentation for Supabase integration for storage

## Integrated Services

The AI Backend integrates with several external services:

1. **Supabase** - For storing generated images and other assets
2. **OpenRouter** - For accessing LLM models for text generation
3. **Together.ai** - For image generation

## Adding New Integrations

To add a new integration:

1. Create a utility module in `src/ai_backend/utils/`
2. Add appropriate configuration options to `.env.example`
3. Update the documentation in this directory

Follow the patterns established in existing integrations, such as the Supabase integration.

## Integration Configuration

For information on configuring specific integrations, refer to the documentation for each integration:

- [Supabase Configuration](./supabase/README.md) - Storage bucket setup and authentication 