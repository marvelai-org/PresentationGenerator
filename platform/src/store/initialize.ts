import { migrateLocalStorageData, migrateLegacyStoreToEnhanced } from './migrations';
import { usePersistedStore } from './index';

/**
 * Initialize the persistence system.
 * This should be called during app initialization to ensure:
 * 1. Legacy data is migrated
 * 2. Storage adapters are properly initialized
 * 3. Any pending migrations are performed
 */
export async function initializePersistence(): Promise<void> {
  try {
    console.log('Initializing persistence middleware...');
    
    // Step 1: Migrate any very old localStorage data to the store format
    migrateLocalStorageData();
    
    // Step 2: Migrate from legacy store to enhanced store
    migrateLegacyStoreToEnhanced();
    
    // Step 3: Ensure recovery points for the active presentation
    const { currentPresentationId, saveVersion } = usePersistedStore.getState();
    if (currentPresentationId) {
      // Create a recovery point at startup if a presentation is already active
      await saveVersion('Application startup');
    }
    
    console.log('Persistence middleware initialized successfully');
  } catch (error) {
    console.error('Error initializing persistence middleware:', error);
  }
}

/**
 * Create a recovery point before a complex operation
 * This is a utility function that can be called before any operation
 * that might fail and corrupt the state.
 */
export async function createRecoveryPoint(
  description: string = 'Pre-operation recovery point'
): Promise<boolean> {
  try {
    const { saveVersion } = usePersistedStore.getState();
    return await saveVersion(description);
  } catch (error) {
    console.error('Error creating recovery point:', error);
    return false;
  }
} 