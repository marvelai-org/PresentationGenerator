import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

// Core types
export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  colorScheme: string[];
}

export interface PresentationSettings {
  textDensity: 'Low' | 'Medium' | 'High';
  imageSource: 'AI' | 'Unsplash' | 'None';
  aiModel: string;
}

export interface PresentationMetadata {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  theme: Theme;
  settings: PresentationSettings;
  syncStatus?: 'synced' | 'local' | 'syncing' | 'error';
}

// State definition
export interface PresentationsState {
  presentations: Record<string, PresentationMetadata>;
  currentPresentationId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Actions definition
export interface PresentationsActions {
  // Create a new presentation
  createPresentation: (title: string, theme?: Theme) => string;
  
  // Update an existing presentation
  updatePresentation: (id: string, data: Partial<PresentationMetadata>) => void;
  
  // Delete a presentation
  deletePresentation: (id: string) => void;
  
  // Set the current active presentation
  setCurrentPresentation: (id: string) => void;
  
  // Update the theme of a presentation
  updateTheme: (id: string, theme: Theme) => void;
  
  // Update presentation settings
  updateSettings: (id: string, settings: Partial<PresentationSettings>) => void;
  
  // Loading & error state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Sync status management
  markAsSynced: (id: string) => void;
  markAsSyncing: (id: string) => void;
  markSyncError: (id: string, error?: string) => void;
}

// Default theme
export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  fontFamily: 'Arial, sans-serif',
  colorScheme: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6'],
};

// Default settings
export const defaultSettings: PresentationSettings = {
  textDensity: 'Medium',
  imageSource: 'AI',
  aiModel: 'Flux Fast',
};

// Initial state
const initialState: PresentationsState = {
  presentations: {},
  currentPresentationId: null,
  isLoading: false,
  error: null,
};

// Type for the slice creator function
export type PresentationsSlice = PresentationsState & PresentationsActions;

// Create the presentations slice
export const createPresentationsSlice: StateCreator<
  PresentationsSlice,
  [['zustand/immer', never]],
  [],
  PresentationsSlice
> = immer((set, get) => ({
  ...initialState,

  createPresentation: (title, theme = defaultTheme) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    set(state => {
      state.presentations[id] = {
        id,
        title,
        description: '',
        createdAt: now,
        updatedAt: now,
        theme: { ...theme },
        settings: { ...defaultSettings },
        syncStatus: 'local'
      };
      state.currentPresentationId = id;
    });
    
    return id;
  },

  updatePresentation: (id, data) => {
    set(state => {
      if (state.presentations[id]) {
        Object.assign(state.presentations[id], {
          ...data,
          updatedAt: new Date().toISOString(),
          syncStatus: 'local'
        });
      }
    });
  },

  deletePresentation: (id) => {
    set(state => {
      if (state.presentations[id]) {
        delete state.presentations[id];
        
        // If we deleted the current presentation, set to null
        if (state.currentPresentationId === id) {
          state.currentPresentationId = null;
        }
      }
    });
  },

  setCurrentPresentation: (id) => {
    set(state => {
      if (state.presentations[id] || id === null) {
        state.currentPresentationId = id;
      }
    });
  },

  updateTheme: (id, theme) => {
    set(state => {
      if (state.presentations[id]) {
        state.presentations[id].theme = { ...theme };
        state.presentations[id].updatedAt = new Date().toISOString();
        state.presentations[id].syncStatus = 'local';
      }
    });
  },

  updateSettings: (id, settings) => {
    set(state => {
      if (state.presentations[id]) {
        state.presentations[id].settings = {
          ...state.presentations[id].settings,
          ...settings
        };
        state.presentations[id].updatedAt = new Date().toISOString();
        state.presentations[id].syncStatus = 'local';
      }
    });
  },

  setLoading: (isLoading) => {
    set(state => {
      state.isLoading = isLoading;
    });
  },

  setError: (error) => {
    set(state => {
      state.error = error;
    });
  },

  markAsSynced: (id) => {
    set(state => {
      if (state.presentations[id]) {
        state.presentations[id].syncStatus = 'synced';
      }
    });
  },

  markAsSyncing: (id) => {
    set(state => {
      if (state.presentations[id]) {
        state.presentations[id].syncStatus = 'syncing';
      }
    });
  },

  markSyncError: (id, error) => {
    set(state => {
      if (state.presentations[id]) {
        state.presentations[id].syncStatus = 'error';
        if (error) {
          state.error = error;
        }
      }
    });
  }
})); 