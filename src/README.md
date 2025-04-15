# Presentation Generator - Codebase Structure

## Overview

This project follows Next.js App Router best practices for folder structure and organization. This document outlines key directories and their purposes.

## Directory Structure

- **`/app`**: Next.js App Router pages and layouts
  - Routes are defined through directory structure
  - Each route directory typically contains `page.tsx`, `layout.tsx`, and other route-specific files

- **`/components`**: Reusable UI components
  - `/ui`: Low-level UI components (buttons, inputs, etc.)
  - `/features`: Feature-specific components
  - `/layout`: Layout components like headers, footers, etc.
  - Tests are co-located with components in `__tests__` directories

- **`/hooks`**: Custom React hooks
  - Centralized location for all app hooks

- **`/lib`**: Utility functions and libraries
  - `/auth`: Authentication utilities
  - `/utils`: Generic utility functions
  - `/storage`: Storage-related utilities
  - `/build`: Build-time utilities

- **`/providers`**: React context providers

- **`/services`**: External service integrations
  - API clients and service adapters

- **`/types`**: TypeScript type definitions

- **`/data`**: Static data and constants

- **`/validations`**: Form validation schemas and utilities

- **`/config`**: Configuration files and constants

- **`/styles`**: Global CSS and style utilities

- **`/debug`**: Development and debugging utilities
  - Not accessible in production

## Best Practices

1. **Co-located Testing**: Tests should be placed next to the components they test in `__tests__` directories.

2. **Feature Organization**: Related components, hooks, and utilities should be grouped together when possible.

3. **Development Tools**: Debugging tools should be placed in the `/debug` directory and restricted in production.

4. **Type Safety**: Make extensive use of TypeScript types and interfaces from the `/types` directory.

5. **Component Hierarchy**: Maintain clear separation between UI primitives, composite components, and page components.

## Production Considerations

- Debug routes (`/debug/*` and `/theme-test`) are automatically blocked in production environments via middleware.
- Static analysis and tree-shaking should remove unused code in production builds. 