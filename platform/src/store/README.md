# Presentation Generator State Management

## Overview

This module implements a centralized state management system for the AI Presentation Generator using Zustand. It provides a structured, typesafe approach to managing application state with features like persistence, selective updates, and backend synchronization.

## Architecture

The state management system is organized into the following structure:

```
/store
  /index.ts          # Main store export
  /slices            # Domain-specific state slices
    /presentations.ts  # Metadata, themes, overall settings
    # Future slices will include:
    # /slides.ts       # Slide content, layouts, media
    # /generation.ts   # AI generation status, progress
    # /ui.ts           # Editor state, selections, view modes
  /hooks             # Custom hooks for components
    /index.ts        # Export for all hooks
    /usePresentations.ts # Presentation-specific hooks
  /middleware        # Custom middleware
    /persistence.ts  # Storage adapters (localStorage, IndexedDB, Supabase)
  /adapters          # Compatibility with existing code
    /outlineAdapter.ts # Backward compatibility with OutlineContext
  /examples          # Example components using the store
    /PresentationList.tsx # Example of presentation list component 
  /migrations.ts     # Data migration utilities
```

## Features

### Slices

The store is divided into logical slices that group related state:

- **Presentations**: Manages presentation metadata, themes, and overall settings
- **Slides** (future): Will manage slide content, layouts, and media
- **Generation** (future): Will manage AI generation status, progress, and history
- **UI** (future): Will manage editor state, selections, and view modes

### Storage Adapters

The persistence middleware supports multiple storage backends:

- **LocalStorage**: Fast, simple browser storage
- **IndexedDB**: For larger amounts of data
- **Supabase**: For remote synchronization and sharing
- **Multi-adapter**: Combines multiple adapters with fallback behavior

### Synchronization

Each state-modifying operation includes backend synchronization with:

- Optimistic updates for smooth UI experience
- Error handling with clear recovery paths
- Sync status tracking (synced, local, syncing, error)

### Performance Optimizations

- **Selective updates** to prevent unnecessary re-renders
- **Memoized selectors** for derived state
- **Shallow equality checking** for subscription updates

## Migration Strategy

For backward compatibility, the system includes:

- **Adapters** that mimic existing context APIs (OutlineContext)
- **Migration utilities** to convert existing data to the new format
- **Cleanup helpers** to remove old data after successful migration

## Usage Examples

### Basic State Access

```tsx
import { useStore } from '@/store';

function MyComponent() {
  const presentations = useStore(state => state.presentations);
  const createPresentation = useStore(state => state.createPresentation);
  
  // Use the state and actions...
}
```

### Using Custom Hooks (Recommended)

```tsx
import { usePresentations } from '@/store/hooks';

function MyComponent() {
  const { 
    presentationList, 
    createPresentation, 
    updatePresentation 
  } = usePresentations();
  
  // Use the state and actions with enhanced capabilities...
}
```

### Backward Compatibility

```tsx
import { useOutlineAdapter } from '@/store/adapters';

function LegacyComponent() {
  const {
    slides,
    addSlide,
    deleteSlide,
    // ... other methods from the old context
  } = useOutlineAdapter();
  
  // Use the adapter just like the old context...
}
```

## Getting Started

1. Import the appropriate hook for your component's needs
2. Use the hook to access state and actions
3. For existing components, use the adapters to minimize changes

## Future Improvements

- Add additional slices for slides, generation, and UI state
- Implement error recovery with automatic retry logic
- Add conflict resolution for multi-user scenarios
- Enhance performance with worker-based persistence 