# Persistence Middleware Documentation

This document provides an overview of the persistence middleware implemented for the Presentation Generator application.

## Overview

The persistence middleware provides a reliable storage system with the following features:

1. **Automatic state persistence** to local and remote storage
2. **Version history** for presentations
3. **Crash recovery** with automatic recovery points
4. **Data integrity validation**
5. **Migration utilities** for handling schema changes

## Architecture

The persistence system consists of several key components:

- **Storage Adapters**: Pluggable backends for storing data (LocalStorage, IndexedDB, Supabase)
- **Enhanced Persistence Middleware**: Core middleware that manages versioning and recovery
- **Hooks**: React hooks for interacting with the persistence system
- **UI Components**: Components for viewing and managing versions
- **Recovery Utilities**: Functions for creating recovery points during operations

## Storage Adapters

The system supports multiple storage adapters:

- **LocalStorageAdapter**: Uses browser's localStorage for persistence
- **IndexedDBAdapter**: Uses IndexedDB for larger storage capacity
- **SupabaseAdapter**: Uses Supabase for remote storage and synchronization
- **MultiStorageAdapter**: Combines multiple adapters for redundancy

## Using the Persistence System

### Basic Usage

The enhanced persistence is automatically applied to the Zustand store. You can simply use the store as normal:

```tsx
import { usePersistedStore } from '@/store';

function MyComponent() {
  const presentations = usePersistedStore(state => state.presentations);
  // Use presentations...
}
```

### Working with Versions

To work with presentation versions, use the `usePresentationVersions` hook:

```tsx
import { usePresentationVersions } from '@/store/hooks/usePresentationVersions';

function VersionsComponent({ presentationId }) {
  const { versions, createVersion, restore } = usePresentationVersions(presentationId);
  
  // Create a version
  const handleSave = () => createVersion('My custom save point');
  
  // Restore a version
  const handleRestore = (versionId) => restore(versionId);
  
  return (
    <div>
      <button onClick={handleSave}>Save Version</button>
      {/* Render versions list */}
    </div>
  );
}
```

### Displaying Version History

To display the version history in a dialog:

```tsx
import { useVersionHistoryDialog } from '@/components/dialogs/VersionHistoryDialog';

function MyComponent() {
  const { dialog, openVersionHistory } = useVersionHistoryDialog();
  const presentationId = '123';
  
  return (
    <div>
      <button onClick={() => openVersionHistory(presentationId)}>
        View History
      </button>
      
      {/* Render the dialog anywhere in your component */}
      {dialog}
    </div>
  );
}
```

### Automatic Recovery Points

The system includes utilities for automatically creating recovery points during complex operations:

```tsx
import { useAutoRecovery } from '@/hooks/useAutoRecovery';

function GenerationComponent() {
  const autoRecovery = useAutoRecovery();
  
  // Method 1: Wrap a function with recovery points
  const generateWithRecovery = autoRecovery.withRecovery(
    generatePresentation,
    'presentation generation'
  );
  
  // Method 2: Manually create recovery points
  const handleComplexOperation = async () => {
    try {
      autoRecovery.startOperation('complex operation');
      
      // Do step 1
      await doStep1();
      await autoRecovery.createRecoveryPoint('After step 1');
      
      // Do step 2
      await doStep2();
      await autoRecovery.createRecoveryPoint('After step 2');
      
      autoRecovery.endOperation(true);
    } catch (error) {
      autoRecovery.endOperation(false);
      throw error;
    }
  };
  
  return (
    <button onClick={generateWithRecovery}>
      Generate
    </button>
  );
}
```

## Crash Recovery

The system automatically detects crashes and offers recovery options. The `CrashRecoveryAlert` component is included in the app layout and will appear when a crash is detected.

## Migrations

When the data schema changes, migrations can be implemented in the `migrations.ts` file:

```tsx
// In src/store/migrations.ts
export function migrateFromV1ToV2(v1State) {
  // Transform the state from v1 to v2 format
  return transformedState;
}
```

## Configuration

The persistence system is configured in `src/store/index.ts`. Key configuration options include:

- **throttleMs**: Throttle time for state updates (default: 1000ms)
- **maxVersionsToKeep**: Maximum number of versions to keep per presentation (default: 20)
- **enableVersioning**: Whether to enable versioning (default: true)
- **enableCrashRecovery**: Whether to enable crash recovery (default: true)
- **autoSaveInterval**: Time between auto-saves in ms (default: 60000ms)
- **integrityCheck**: Whether to validate data integrity (default: true)

## Implementation Details

### Storage Format

Data is stored with the following structure:

- **Main state**: Stored with version metadata and checksum
- **Version history**: Stored separately for each presentation
- **Recovery points**: Stored for each presentation during complex operations

### Security

- User data is associated with the user's ID in remote storage
- Local data is stored in the browser's protected storage mechanisms
- Data integrity is validated with checksums

## Integration with Existing Code

The persistence system is designed to work seamlessly with the existing code. It integrates with:

1. The state management system (Zustand)
2. The app's React component hierarchy
3. The authentication system for user-specific data

## Troubleshooting

If you encounter issues with the persistence system:

1. Check the console for error messages
2. Verify that storage permissions are granted
3. Check that the user is authenticated for remote storage
4. Try clearing the cache and reloading the application 