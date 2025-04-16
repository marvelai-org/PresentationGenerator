import { StateCreator } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import debounce from 'lodash/debounce';
import { v4 as uuidv4 } from 'uuid';
import { StorageAdapter, MultiStorageAdapter, LocalStorageAdapter, IndexedDBAdapter, SupabaseAdapter } from './persistence';

// Enhanced storage interfaces with versioning
export interface VersionedData<T> {
  data: T;
  version: number;
  timestamp: string;
  checksum: string; // Used for integrity validation
  id: string;
}

export interface PresentationVersion {
  id: string;
  presentationId: string;
  data: any;
  version: number;
  timestamp: string;
  description: string;
  isAutosave: boolean;
  isRecoveryPoint: boolean;
}

// Storage options with enhanced features
export interface EnhancedStorageOptions<T> {
  name: string;
  partialize?: (state: T) => object;
  adapter?: StorageAdapter | 'localStorage' | 'indexedDB' | 'supabase' | 'multi';
  version?: number;
  throttleMs?: number; // Time in ms to throttle storage updates
  maxVersionsToKeep?: number; // Number of versions to keep per presentation
  enableVersioning?: boolean;
  enableCrashRecovery?: boolean;
  autoSaveInterval?: number; // Time in ms between auto-saves (0 to disable)
  integrityCheck?: boolean; // Whether to validate data integrity
}

// Generate a simple checksum for data validation
function generateChecksum(data: any): string {
  try {
    // Simple hash function for validation purposes
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  } catch (e) {
    console.error('Error generating checksum:', e);
    return '';
  }
}

// Validate the integrity of stored data
function validateDataIntegrity<T>(versionedData: VersionedData<T>): boolean {
  try {
    const { data, checksum } = versionedData;
    const calculatedChecksum = generateChecksum(data);
    return checksum === calculatedChecksum;
  } catch (e) {
    console.error('Error validating data integrity:', e);
    return false;
  }
}

export function createEnhancedPersistMiddleware<T>(
  options: EnhancedStorageOptions<T>
): StateCreator<T, [['zustand/persist', unknown]], [], T> {
  let adapter: StorageAdapter;

  // Create the appropriate adapter
  switch (options.adapter) {
    case 'localStorage':
      adapter = new LocalStorageAdapter();
      break;
    case 'indexedDB':
      adapter = new IndexedDBAdapter();
      break;
    case 'supabase':
      adapter = new SupabaseAdapter();
      break;
    case 'multi':
      adapter = new MultiStorageAdapter([
        new LocalStorageAdapter(),
        new IndexedDBAdapter(),
        new SupabaseAdapter()
      ]);
      break;
    default:
      adapter = options.adapter || new LocalStorageAdapter();
  }

  // Default options
  const throttleMs = options.throttleMs || 1000;
  const maxVersionsToKeep = options.maxVersionsToKeep || 10;
  const enableVersioning = options.enableVersioning ?? true;
  const enableCrashRecovery = options.enableCrashRecovery ?? true;
  const autoSaveInterval = options.autoSaveInterval || 30000; // 30 seconds by default
  const integrityCheck = options.integrityCheck ?? true;

  // The base storage to use with Zustand's persist middleware
  const storage = createJSONStorage<T>(() => adapter);

  // Keep track of version history in memory
  let versionHistory: Record<string, PresentationVersion[]> = {};
  let lastSavedState: any = null;
  let isRecoveryMode = false;
  let autoSaveTimerId: NodeJS.Timeout | null = null;
  
  // Throttled state updater
  const throttledSaveState = debounce(async (state: any, presentationId?: string) => {
    try {
      if (!presentationId && state.currentPresentationId) {
        presentationId = state.currentPresentationId;
      }
      
      // Skip if there's no active presentation
      if (!presentationId) return;
      
      // Create versioned data
      const versionedData: VersionedData<any> = {
        data: state,
        version: options.version || 1,
        timestamp: new Date().toISOString(),
        checksum: generateChecksum(state),
        id: uuidv4()
      };
      
      // Store the main state
      await adapter.setItem(options.name, JSON.stringify(versionedData));
      
      // Add to version history if versioning is enabled
      if (enableVersioning && presentationId) {
        const version: PresentationVersion = {
          id: versionedData.id,
          presentationId,
          data: options.partialize ? options.partialize(state) : state,
          version: versionedData.version,
          timestamp: versionedData.timestamp,
          description: `Auto-saved version`,
          isAutosave: true,
          isRecoveryPoint: false
        };
        
        // Initialize version history for this presentation if it doesn't exist
        if (!versionHistory[presentationId]) {
          versionHistory[presentationId] = [];
        }
        
        // Add to version history
        versionHistory[presentationId].push(version);
        
        // Prune old versions if we exceed the limit
        if (versionHistory[presentationId].length > maxVersionsToKeep) {
          versionHistory[presentationId] = versionHistory[presentationId]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, maxVersionsToKeep);
        }
        
        // Store version history in storage
        await adapter.setItem(
          `${options.name}_versions_${presentationId}`,
          JSON.stringify(versionHistory[presentationId])
        );
      }
      
      // Update last saved state
      lastSavedState = state;
      
      console.log('State successfully persisted');
    } catch (error) {
      console.error('Error persisting state:', error);
    }
  }, throttleMs);

  // Function to create a recovery point
  const createRecoveryPoint = async (state: any, presentationId: string, description: string) => {
    try {
      if (!enableCrashRecovery) return;
      
      const versionedData: VersionedData<any> = {
        data: options.partialize ? options.partialize(state) : state,
        version: options.version || 1,
        timestamp: new Date().toISOString(),
        checksum: generateChecksum(state),
        id: uuidv4()
      };
      
      // Store recovery point
      await adapter.setItem(
        `${options.name}_recovery_${presentationId}`,
        JSON.stringify(versionedData)
      );
      
      // Also add to version history
      if (enableVersioning) {
        const version: PresentationVersion = {
          id: versionedData.id,
          presentationId,
          data: versionedData.data,
          version: versionedData.version,
          timestamp: versionedData.timestamp,
          description: description || 'Recovery point',
          isAutosave: false,
          isRecoveryPoint: true
        };
        
        // Initialize version history for this presentation if it doesn't exist
        if (!versionHistory[presentationId]) {
          versionHistory[presentationId] = [];
        }
        
        // Add to version history
        versionHistory[presentationId].push(version);
        
        // Store version history
        await adapter.setItem(
          `${options.name}_versions_${presentationId}`,
          JSON.stringify(versionHistory[presentationId])
        );
      }
      
      console.log('Recovery point created:', description);
    } catch (error) {
      console.error('Error creating recovery point:', error);
    }
  };

  // Setup auto-save timer
  const setupAutoSave = (get: () => T) => {
    // Clear existing auto-save timer
    if (autoSaveTimerId) {
      clearInterval(autoSaveTimerId);
    }
    
    // Setup new auto-save timer if enabled
    if (autoSaveInterval > 0) {
      autoSaveTimerId = setInterval(() => {
        const state = get();
        const presentationId = (state as any).currentPresentationId;
        if (presentationId) {
          throttledSaveState(state, presentationId);
        }
      }, autoSaveInterval);
    }
  };
  
  // Function to load version history
  const loadVersionHistory = async (presentationId: string) => {
    try {
      const versionsJson = await adapter.getItem(`${options.name}_versions_${presentationId}`);
      if (versionsJson) {
        versionHistory[presentationId] = JSON.parse(versionsJson) as PresentationVersion[];
      } else {
        versionHistory[presentationId] = [];
      }
      return versionHistory[presentationId];
    } catch (error) {
      console.error('Error loading version history:', error);
      return [];
    }
  };
  
  // Function to restore a specific version
  const restoreVersion = async (versionId: string, presentationId: string): Promise<any> => {
    try {
      // Load version history if it's not already loaded
      if (!versionHistory[presentationId]) {
        await loadVersionHistory(presentationId);
      }
      
      // Find the requested version
      const version = versionHistory[presentationId]?.find(v => v.id === versionId);
      if (!version) {
        throw new Error(`Version ${versionId} not found`);
      }
      
      // Create a recovery point before restoring (just in case)
      const state = await adapter.getItem(options.name);
      if (state) {
        await createRecoveryPoint(JSON.parse(state), presentationId, 'Pre-restore backup');
      }
      
      return version.data;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  };
  
  // Check for a crash and try to recover if needed
  const checkForCrash = async (presentationId: string): Promise<any> => {
    try {
      if (!enableCrashRecovery) return null;
      
      // Load the recovery point if it exists
      const recoveryJson = await adapter.getItem(`${options.name}_recovery_${presentationId}`);
      if (!recoveryJson) return null;
      
      const recovery = JSON.parse(recoveryJson) as VersionedData<any>;
      
      // Validate the data integrity if enabled
      if (integrityCheck && !validateDataIntegrity(recovery)) {
        console.error('Recovery data failed integrity check');
        return null;
      }
      
      console.log('Found recovery data for presentation:', presentationId);
      isRecoveryMode = true;
      return recovery.data;
    } catch (error) {
      console.error('Error checking for crash:', error);
      return null;
    }
  };

  // Return the persist middleware with our enhanced functionality
  return persist<T>(
    (set, get, api) => {
      // Setup auto-save
      setupAutoSave(get);

      // Define method implementations that get attached to the store
      const saveVersion = async (description: string) => {
        const state = get();
        const presentationId = (state as any).currentPresentationId;
        if (presentationId) {
          await createRecoveryPoint(state, presentationId, description);
          return true;
        }
        return false;
      };
      
      const getVersionHistory = async (presentationId: string) => {
        return await loadVersionHistory(presentationId);
      };
      
      const restoreVersionFn = async (versionId: string, presentationId: string) => {
        const data = await restoreVersion(versionId, presentationId);
        if (data) {
          // Only update the presentation data, not the entire state
          set((state: any) => ({
            ...state,
            presentations: {
              ...state.presentations,
              [presentationId]: data
            }
          }));
          return true;
        }
        return false;
      };
      
      const checkForCrashFn = async (presentationId: string) => {
        const recoveryData = await checkForCrash(presentationId);
        if (recoveryData) {
          // Clean up recovery data after successful recovery
          adapter.removeItem(`${options.name}_recovery_${presentationId}`);
          return recoveryData;
        }
        return null;
      };
      
      // Create a base object with our methods
      const baseState = {
        saveVersion,
        getVersionHistory,
        restoreVersion: restoreVersionFn,
        checkForCrash: checkForCrashFn
      };
      
      // Return the base state
      return baseState as unknown as T;
    },
    {
      name: options.name,
      storage,
      partialize: options.partialize,
      version: options.version,
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating store:', error);
          } else {
            console.log('Store rehydrated successfully');
            
            // Initialize version history for the current presentation
            const presentationId = (rehydratedState as any)?.currentPresentationId;
            if (presentationId) {
              loadVersionHistory(presentationId).catch(console.error);
              
              // Check for crash recovery data
              if (enableCrashRecovery) {
                checkForCrash(presentationId).catch(console.error);
              }
            }
          }
        };
      },
      migrate: (persistedState, version) => {
        // Handle any migrations here
        return persistedState as any;
      },
    }
  );
} 