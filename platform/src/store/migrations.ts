import { v4 as uuidv4 } from 'uuid';
import { PresentationMetadata, Theme, PresentationSettings, defaultTheme, defaultSettings } from './slices/presentations';
import { usePersistedStore, useLegacyPersistedStore } from './index';

// Types from the old storage format
interface OldSlideContent {
  id: number;
  title?: string;
  bullets?: string[];
  content?: string;
}

interface OldPresentationSettings {
  outline: OldSlideContent[];
  theme: any;
  textDensity: string;
  imageSource: string;
  aiModel: string;
}

/**
 * Migrates old localStorage data to the new format and saves it in the store
 * This can be run once during app initialization to ensure a smooth transition
 */
export function migrateLocalStorageData(): void {
  try {
    // Get the store actions
    const { createPresentation, updatePresentation, updateTheme, updateSettings } = usePersistedStore.getState();
    
    // Try to load the old presentation settings from localStorage
    const oldSettingsString = localStorage.getItem('presentationSettings');
    if (!oldSettingsString) {
      console.log('No old presentation settings found');
      return;
    }
    
    // Parse the old settings
    const oldSettings: OldPresentationSettings = JSON.parse(oldSettingsString);
    
    // Create a new presentation
    const id = createPresentation('Migrated Presentation');
    
    // Set the theme if it exists
    if (oldSettings.theme && Object.keys(oldSettings.theme).length > 0) {
      const theme: Theme = {
        id: 'migrated',
        name: 'Migrated Theme',
        backgroundColor: oldSettings.theme.backgroundColor || '#ffffff',
        textColor: oldSettings.theme.textColor || '#000000',
        fontFamily: oldSettings.theme.fontFamily || 'Arial, sans-serif',
        colorScheme: oldSettings.theme.colorScheme || defaultTheme.colorScheme,
      };
      
      updateTheme(id, theme);
    }
    
    // Set settings if they exist
    const settings: Partial<PresentationSettings> = {
      textDensity: (oldSettings.textDensity as any) || defaultSettings.textDensity,
      imageSource: (oldSettings.imageSource as any) || defaultSettings.imageSource,
      aiModel: oldSettings.aiModel || defaultSettings.aiModel,
    };
    
    updateSettings(id, settings);
    
    // Update metadata
    updatePresentation(id, {
      title: 'Migrated Presentation',
      description: 'Migrated from your previous presentation',
      updatedAt: new Date().toISOString(),
    });
    
    console.log('Successfully migrated old presentation data to new format');
    
    // Mark old data as migrated but don't delete it yet
    localStorage.setItem('presentationSettings_migrated', 'true');
  } catch (error) {
    console.error('Error migrating localStorage data:', error);
  }
}

/**
 * A more comprehensive migration that could be run to migrate multiple presentations
 * and their associated slide data
 */
export async function migrateAllData(): Promise<void> {
  try {
    // Step 1: Migrate localStorage presentations
    migrateLocalStorageData();
    
    // Step 2: Could add logic here to migrate data from other sources
    // For example, from older database tables, JSON files, etc.
    
    // Step 3: Check localStorage for other presentation-related data
    const editorSlides = localStorage.getItem('editor_slides');
    const generatedSlides = localStorage.getItem('generatedSlides');
    
    if (editorSlides || generatedSlides) {
      // Handle additional slide data if needed
      console.log('Found additional slide data to migrate');
      
      // Implementation would depend on how slides are stored in the new system
    }
    
    console.log('Migration of all data completed successfully');
  } catch (error) {
    console.error('Error in full data migration:', error);
    throw error;
  }
}

/**
 * Helper function to clear old data after successful migration
 * Should only be called after verifying the migration was successful
 */
export function cleanupOldData(): void {
  try {
    // Only remove data if it's been marked as migrated
    if (localStorage.getItem('presentationSettings_migrated') === 'true') {
      localStorage.removeItem('presentationSettings');
      localStorage.removeItem('presentationOutline');
      localStorage.removeItem('editor_slides');
      localStorage.removeItem('generatedSlides');
      
      console.log('Old data cleaned up successfully');
    } else {
      console.warn('Cannot clean up old data: migration has not been performed');
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
}

/**
 * Migrates data from the legacy persistence store to the enhanced persistence store
 */
export function migrateLegacyStoreToEnhanced(): void {
  try {
    // Get legacy and enhanced store states
    const legacyState = useLegacyPersistedStore.getState();
    const enhancedStore = usePersistedStore.getState();
    
    // Check if there's any data to migrate
    if (!legacyState.presentations || Object.keys(legacyState.presentations).length === 0) {
      console.log('No legacy store data to migrate');
      return;
    }
    
    // Migrate current presentation ID
    if (legacyState.currentPresentationId) {
      enhancedStore.setCurrentPresentation(legacyState.currentPresentationId);
    }
    
    // Migrate each presentation
    Object.values(legacyState.presentations).forEach(presentation => {
      // Check if this presentation already exists in the enhanced store
      const enhancedState = enhancedStore;
      const presentationExists = enhancedState.presentations[presentation.id];
      
      if (!presentationExists) {
        // Create a new presentation from the legacy data
        enhancedStore.createPresentation(presentation.title, presentation.theme);
        
        // Update other properties
        enhancedStore.updatePresentation(presentation.id, {
          ...presentation,
          syncStatus: 'local', // Assume this is a local version
        });
        
        console.log(`Migrated presentation "${presentation.title}" to enhanced store`);
      } else {
        // If it exists, check if we need to update it (if it's older)
        const existingTimestamp = new Date(presentationExists.updatedAt).getTime();
        const legacyTimestamp = new Date(presentation.updatedAt).getTime();
        
        if (legacyTimestamp > existingTimestamp) {
          // Legacy is newer, update the enhanced store
          enhancedStore.updatePresentation(presentation.id, {
            ...presentation,
            syncStatus: 'local',
          });
          console.log(`Updated presentation "${presentation.title}" in enhanced store from legacy data`);
        }
      }
    });
    
    // Create a version point for the migrated data
    if (legacyState.currentPresentationId) {
      enhancedStore.saveVersion('Migrated from legacy storage');
    }
    
    console.log('Successfully migrated from legacy store to enhanced store');
  } catch (error) {
    console.error('Error migrating from legacy store to enhanced store:', error);
  }
} 