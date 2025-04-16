# Supabase Documentation

This directory contains documentation related to Supabase integration for the AI backend of the Presentation Generator.

## Contents

- [General Setup](../../platform/docs/supabase-setup.md) - General Supabase integration for the Next.js application
- [Storage Setup](./storage-setup.md) - Setting up Supabase storage for the AI service
- [RLS Policies](./rls-policies.sql) - SQL for Row Level Security policies

## Quick Start

For the Next.js application:
```bash
# Set up environment variables
cp platform/.env.local.example platform/.env.local
# Edit platform/.env.local with your Supabase credentials
```

For the AI service:
```bash
# From project root
npm run ai:setup-supabase
``` 