import { useCallback, useEffect, useState } from 'react';
import { usePersistedStore } from '../index';
import { PresentationVersion } from '../middleware/enhanced-persistence';

/**
 * Hook for working with presentation versions
 */
export function usePresentationVersions(presentationId?: string) {
  const [versions, setVersions] = useState<PresentationVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currentPresentationId = usePersistedStore(state => state.currentPresentationId);
  const getVersionHistory = usePersistedStore(state => state.getVersionHistory);
  const restoreVersion = usePersistedStore(state => state.restoreVersion);
  const saveVersion = usePersistedStore(state => state.saveVersion);
  const checkForCrash = usePersistedStore(state => state.checkForCrash);
  
  // Use provided presentation ID or fallback to current one
  const activeId = presentationId || currentPresentationId;
  
  // Load versions when presentationId changes
  useEffect(() => {
    if (!activeId) return;
    
    const fetchVersions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const history = await getVersionHistory(activeId);
        setVersions(history || []);
      } catch (err) {
        setError('Failed to load version history');
        console.error('Error loading versions:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVersions();
  }, [activeId, getVersionHistory]);
  
  // Create a new version
  const createVersion = useCallback(async (description: string) => {
    if (!activeId) return false;
    
    try {
      setError(null);
      const success = await saveVersion(description);
      
      // Refresh versions list if successful
      if (success) {
        const history = await getVersionHistory(activeId);
        setVersions(history || []);
      }
      
      return success;
    } catch (err) {
      setError('Failed to create version');
      console.error('Error creating version:', err);
      return false;
    }
  }, [activeId, saveVersion, getVersionHistory]);
  
  // Restore a specific version
  const restore = useCallback(async (versionId: string) => {
    if (!activeId) return false;
    
    try {
      setError(null);
      return await restoreVersion(versionId, activeId);
    } catch (err) {
      setError('Failed to restore version');
      console.error('Error restoring version:', err);
      return false;
    }
  }, [activeId, restoreVersion]);
  
  // Check for crash recovery data
  const checkRecovery = useCallback(async () => {
    if (!activeId) return null;
    
    try {
      setError(null);
      return await checkForCrash(activeId);
    } catch (err) {
      setError('Failed to check for recovery data');
      console.error('Error checking for recovery:', err);
      return null;
    }
  }, [activeId, checkForCrash]);
  
  return {
    versions,
    isLoading,
    error,
    createVersion,
    restore,
    checkRecovery
  };
} 