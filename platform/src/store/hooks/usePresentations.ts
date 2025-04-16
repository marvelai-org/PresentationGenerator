import { useMemo, useCallback } from 'react';
import { usePersistedStore } from '../index';
import { PresentationMetadata, Theme, PresentationSettings } from '../slices/presentations';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { shallow } from 'zustand/shallow';

// Custom hook for accessing presentation data with optimized selectors
export function usePresentations() {
  // Use shallow comparison to prevent unnecessary re-renders
  const {
    presentations,
    currentPresentationId,
    isLoading,
    error,
    createPresentation,
    updatePresentation,
    deletePresentation,
    setCurrentPresentation,
    updateTheme,
    updateSettings,
    setLoading,
    setError,
    markAsSynced,
    markAsSyncing,
    markSyncError,
  } = usePersistedStore(
    (state) => ({
      presentations: state.presentations,
      currentPresentationId: state.currentPresentationId,
      isLoading: state.isLoading,
      error: state.error,
      createPresentation: state.createPresentation,
      updatePresentation: state.updatePresentation,
      deletePresentation: state.deletePresentation,
      setCurrentPresentation: state.setCurrentPresentation,
      updateTheme: state.updateTheme,
      updateSettings: state.updateSettings,
      setLoading: state.setLoading,
      setError: state.setError,
      markAsSynced: state.markAsSynced,
      markAsSyncing: state.markAsSyncing,
      markSyncError: state.markSyncError,
    }),
    shallow
  );

  // Memoized computed properties
  const presentationList = useMemo(
    () => Object.values(presentations).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [presentations]
  );

  const currentPresentation = useMemo(
    () => (currentPresentationId ? presentations[currentPresentationId] : null),
    [presentations, currentPresentationId]
  );

  // Enhanced create presentation with Supabase sync
  const createPresentationWithSync = useCallback(
    async (title: string, theme?: Theme): Promise<string> => {
      setLoading(true);
      try {
        // Create in local state first
        const id = createPresentation(title, theme);
        
        // Sync with Supabase if available
        try {
          markAsSyncing(id);
          const supabase = createClientSupabaseClient();
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user?.id) {
            const { data, error } = await supabase.from('presentations').insert({
              id,
              title,
              description: '',
              user_id: userData.user.id,
              theme: theme || {},
              settings: {
                textDensity: 'Medium',
                imageSource: 'AI',
                aiModel: 'Flux Fast',
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }).select();
            
            if (error) {
              console.error('Error syncing presentation to Supabase:', error);
              markSyncError(id, error.message);
            } else {
              markAsSynced(id);
              console.log('Presentation synced with Supabase:', data);
            }
          }
        } catch (syncError) {
          console.error('Error during Supabase sync:', syncError);
          markSyncError(id, 'Failed to sync with remote server');
        }
        
        return id;
      } catch (error) {
        console.error('Error creating presentation:', error);
        const message = error instanceof Error ? error.message : 'Failed to create presentation';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [createPresentation, markAsSyncing, markAsSynced, markSyncError, setLoading, setError]
  );

  // Enhanced delete presentation with Supabase sync
  const deletePresentationWithSync = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      try {
        // Delete from Supabase if available
        try {
          const supabase = createClientSupabaseClient();
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user?.id) {
            const { error } = await supabase
              .from('presentations')
              .delete()
              .eq('id', id)
              .eq('user_id', userData.user.id);
            
            if (error) {
              console.error('Error deleting presentation from Supabase:', error);
              // Still proceed with local deletion
            }
          }
        } catch (syncError) {
          console.error('Error during Supabase delete:', syncError);
          // Still proceed with local deletion
        }
        
        // Delete from local store
        deletePresentation(id);
      } catch (error) {
        console.error('Error deleting presentation:', error);
        const message = error instanceof Error ? error.message : 'Failed to delete presentation';
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [deletePresentation, setLoading, setError]
  );

  // Enhanced update presentation with Supabase sync
  const updatePresentationWithSync = useCallback(
    async (id: string, data: Partial<PresentationMetadata>): Promise<void> => {
      if (!presentations[id]) {
        setError(`Presentation with id ${id} not found`);
        return;
      }
      
      setLoading(true);
      try {
        // Update in local store first (optimistic update)
        updatePresentation(id, data);
        markAsSyncing(id);
        
        // Sync with Supabase if available
        try {
          const supabase = createClientSupabaseClient();
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData?.user?.id) {
            const { error } = await supabase
              .from('presentations')
              .update({
                ...data,
                updated_at: new Date().toISOString(),
              })
              .eq('id', id)
              .eq('user_id', userData.user.id);
            
            if (error) {
              console.error('Error updating presentation in Supabase:', error);
              markSyncError(id, error.message);
            } else {
              markAsSynced(id);
            }
          }
        } catch (syncError) {
          console.error('Error during Supabase update:', syncError);
          markSyncError(id, 'Failed to sync with remote server');
        }
      } catch (error) {
        console.error('Error updating presentation:', error);
        const message = error instanceof Error ? error.message : 'Failed to update presentation';
        setError(message);
        // Could implement a rollback mechanism here
      } finally {
        setLoading(false);
      }
    },
    [presentations, updatePresentation, markAsSyncing, markAsSynced, markSyncError, setLoading, setError]
  );

  // A function to load all presentations from Supabase
  const loadFromSupabase = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const supabase = createClientSupabaseClient();
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        console.warn('Cannot load presentations: No user logged in');
        return;
      }
      
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error loading presentations from Supabase:', error);
        setError(error.message);
        return;
      }
      
      if (data) {
        // Convert to the store format and update
        const presentationsMap: Record<string, PresentationMetadata> = {};
        
        data.forEach((item) => {
          presentationsMap[item.id] = {
            id: item.id,
            title: item.title || 'Untitled',
            description: item.description || '',
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            theme: item.theme || {},
            settings: item.settings || {
              textDensity: 'Medium',
              imageSource: 'AI',
              aiModel: 'Flux Fast',
            },
            syncStatus: 'synced',
          };
        });
        
        // Batch update local presentations
        for (const [id, presentation] of Object.entries(presentationsMap)) {
          updatePresentation(id, presentation);
          markAsSynced(id);
        }
      }
    } catch (error) {
      console.error('Error loading presentations:', error);
      const message = error instanceof Error ? error.message : 'Failed to load presentations';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [updatePresentation, markAsSynced, setLoading, setError]);

  return {
    // State
    presentations,
    presentationList,
    currentPresentation,
    currentPresentationId,
    isLoading,
    error,
    
    // Base actions
    setCurrentPresentation,
    updateTheme,
    updateSettings,
    setError,
    
    // Enhanced actions with sync
    createPresentation: createPresentationWithSync,
    updatePresentation: updatePresentationWithSync,
    deletePresentation: deletePresentationWithSync,
    loadFromSupabase,
  };
} 