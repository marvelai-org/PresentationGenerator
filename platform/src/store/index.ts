import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createPersistMiddleware } from './middleware/persistence';
import { createEnhancedPersistMiddleware } from './middleware/enhanced-persistence';
import { PresentationsSlice, createPresentationsSlice } from './slices/presentations';
import { GenerationSlice, createGenerationSlice } from './slices/generation';
import { devtools } from 'zustand/middleware';

// Type definition for the complete store
export type StoreState = PresentationsSlice & GenerationSlice;

// Interface for the enhanced persisted store with version methods
export interface EnhancedStoreState extends StoreState {
  // Method to manually save a version
  saveVersion: (description: string) => Promise<boolean>;
  
  // Method to get version history
  getVersionHistory: (presentationId: string) => Promise<any[]>;
  
  // Method to restore a version
  restoreVersion: (versionId: string, presentationId: string) => Promise<boolean>;
  
  // Method to check for crash recovery
  checkForCrash: (presentationId: string) => Promise<any>;
}

// Create the store with middleware
export const useStore = create<StoreState>()(
  devtools(
    immer(
      (...params) => {
        // Combine all slices
        return {
          // Add the presentations slice
          ...createPresentationsSlice(...params),
          
          // Add the generation slice
          ...createGenerationSlice(...params),
          
          // Future slices will be added here
          // ...createSlidesSlice(...params),
          // ...createUISlice(...params),
        };
      }
    ),
    { name: 'presentation-generator' }
  )
);

// Create a persisted version of the store
export const usePersistedStore = create<EnhancedStoreState>()(
  devtools(
    immer(
      createEnhancedPersistMiddleware<EnhancedStoreState>({
        name: 'presentation-generator-storage',
        adapter: 'multi',
        partialize: (state) => ({
          // Only persist these parts of the state
          presentations: state.presentations,
          currentPresentationId: state.currentPresentationId,
          // Add generation state to persistence
          tasks: state.tasks,
          history: state.history,
          globalSettings: state.globalSettings,
        }),
        version: 1,
        throttleMs: 1000, // Save at most once per second
        enableVersioning: true,
        enableCrashRecovery: true,
        autoSaveInterval: 60000, // Auto-save every minute
        maxVersionsToKeep: 20, // Keep the last 20 versions
      })
    ),
    { name: 'persisted-presentation-generator' }
  )
);

// For backwards compatibility, maintain the old persistence middleware
export const useLegacyPersistedStore = create<StoreState>()(
  devtools(
    immer(
      createPersistMiddleware<StoreState>({
        name: 'presentation-generator-legacy-storage',
        adapter: 'localStorage',
        partialize: (state) => ({
          presentations: state.presentations,
          currentPresentationId: state.currentPresentationId,
        }),
        version: 1,
      })
    ),
    { name: 'legacy-persisted-presentation-generator' }
  )
);

// Export types
export * from './slices/presentations';
export * from './slices/generation';
// Future exports
// export * from './slices/slides';
// export * from './slices/ui'; 