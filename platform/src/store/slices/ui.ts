import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// UI state types
export type EditorMode = 'edit' | 'preview' | 'present';
export type Theme = 'light' | 'dark' | 'system';
export type SidebarTab = 'slides' | 'outline' | 'templates' | 'media' | 'ai';
export type PanelName = 'slides' | 'properties' | 'outline' | 'media' | 'themes';

export interface ModalState {
  id: string;
  props?: Record<string, any>;
  isOpen: boolean;
}

// State definition
export interface UIState {
  editorMode: EditorMode;
  theme: Theme;
  sidebarOpen: boolean;
  sidebarWidth: number;
  activeSidebarTab: SidebarTab;
  activePanels: Record<PanelName, boolean>;
  activeModal: ModalState | null;
  zoomLevel: number;
  gridEnabled: boolean;
  snapToGridEnabled: boolean;
  showRulers: boolean;
  fullscreen: boolean;
  history: {
    undoStack: string[];
    redoStack: string[];
  };
  notifications: {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timeout?: number;
  }[];
}

// Actions definition
export interface UIActions {
  // Editor mode
  setEditorMode: (mode: EditorMode) => void;
  
  // Theme
  setTheme: (theme: Theme) => void;
  
  // Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setActiveSidebarTab: (tab: SidebarTab) => void;
  
  // Panels
  togglePanel: (panel: PanelName) => void;
  setPanelOpen: (panel: PanelName, isOpen: boolean) => void;
  
  // Modals
  openModal: (id: string, props?: Record<string, any>) => void;
  closeModal: () => void;
  
  // Zoom
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  
  // Grid and rulers
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  toggleRulers: () => void;
  
  // Fullscreen
  toggleFullscreen: () => void;
  setFullscreen: (isFullscreen: boolean) => void;
  
  // Undo/Redo history
  addToHistory: (action: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  clearHistory: () => void;
  
  // Notifications
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error', timeout?: number) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// Default values
const DEFAULT_ZOOM_LEVEL = 1;
const MIN_ZOOM_LEVEL = 0.25;
const MAX_ZOOM_LEVEL = 3;
const ZOOM_STEP = 0.1;
const DEFAULT_SIDEBAR_WIDTH = 240;

// Initial state
const initialState: UIState = {
  editorMode: 'edit',
  theme: 'system',
  sidebarOpen: true,
  sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
  activeSidebarTab: 'slides',
  activePanels: {
    slides: true,
    properties: false,
    outline: false,
    media: false,
    themes: false
  },
  activeModal: null,
  zoomLevel: DEFAULT_ZOOM_LEVEL,
  gridEnabled: false,
  snapToGridEnabled: true,
  showRulers: false,
  fullscreen: false,
  history: {
    undoStack: [],
    redoStack: []
  },
  notifications: []
};

// Type for the slice creator function
export type UISlice = UIState & UIActions;

// Create the UI slice
export const createUISlice: StateCreator<
  UISlice,
  [['zustand/immer', never]],
  [],
  UISlice
> = immer((set, get) => ({
  ...initialState,
  
  // Editor mode
  setEditorMode: (mode) => {
    set(state => {
      state.editorMode = mode;
    });
  },
  
  // Theme
  setTheme: (theme) => {
    set(state => {
      state.theme = theme;
    });
  },
  
  // Sidebar
  toggleSidebar: () => {
    set(state => {
      state.sidebarOpen = !state.sidebarOpen;
    });
  },
  
  setSidebarOpen: (isOpen) => {
    set(state => {
      state.sidebarOpen = isOpen;
    });
  },
  
  setSidebarWidth: (width) => {
    set(state => {
      state.sidebarWidth = Math.max(150, Math.min(500, width));
    });
  },
  
  setActiveSidebarTab: (tab) => {
    set(state => {
      state.activeSidebarTab = tab;
      state.sidebarOpen = true; // Ensure sidebar is open when switching tabs
    });
  },
  
  // Panels
  togglePanel: (panel) => {
    set(state => {
      state.activePanels[panel] = !state.activePanels[panel];
    });
  },
  
  setPanelOpen: (panel, isOpen) => {
    set(state => {
      state.activePanels[panel] = isOpen;
    });
  },
  
  // Modals
  openModal: (id, props = {}) => {
    set(state => {
      state.activeModal = {
        id,
        props,
        isOpen: true,
      };
    });
  },
  
  closeModal: () => {
    set(state => {
      if (state.activeModal) {
        state.activeModal.isOpen = false;
        state.activeModal = null;
      }
    });
  },
  
  // Zoom
  setZoomLevel: (level) => {
    set(state => {
      state.zoomLevel = Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, level));
    });
  },
  
  zoomIn: () => {
    set(state => {
      state.zoomLevel = Math.min(MAX_ZOOM_LEVEL, state.zoomLevel + ZOOM_STEP);
    });
  },
  
  zoomOut: () => {
    set(state => {
      state.zoomLevel = Math.max(MIN_ZOOM_LEVEL, state.zoomLevel - ZOOM_STEP);
    });
  },
  
  resetZoom: () => {
    set(state => {
      state.zoomLevel = DEFAULT_ZOOM_LEVEL;
    });
  },
  
  // Grid and rulers
  toggleGrid: () => {
    set(state => {
      state.gridEnabled = !state.gridEnabled;
    });
  },
  
  toggleSnapToGrid: () => {
    set(state => {
      state.snapToGridEnabled = !state.snapToGridEnabled;
    });
  },
  
  toggleRulers: () => {
    set(state => {
      state.showRulers = !state.showRulers;
    });
  },
  
  // Fullscreen
  toggleFullscreen: () => {
    set(state => {
      state.fullscreen = !state.fullscreen;
    });
  },
  
  setFullscreen: (isFullscreen) => {
    set(state => {
      state.fullscreen = isFullscreen;
    });
  },
  
  // Undo/Redo history
  addToHistory: (action) => {
    set(state => {
      // Add to undo stack
      state.history.undoStack.push(action);
      
      // Clear redo stack when a new action is performed
      state.history.redoStack = [];
      
      // Limit history size
      if (state.history.undoStack.length > 50) {
        state.history.undoStack.shift();
      }
    });
  },
  
  undo: () => {
    const state = get();
    if (state.history.undoStack.length === 0) {
      return null;
    }
    
    const action = state.history.undoStack[state.history.undoStack.length - 1];
    
    set(state => {
      // Move from undo stack to redo stack
      state.history.undoStack.pop();
      state.history.redoStack.push(action);
    });
    
    return action;
  },
  
  redo: () => {
    const state = get();
    if (state.history.redoStack.length === 0) {
      return null;
    }
    
    const action = state.history.redoStack[state.history.redoStack.length - 1];
    
    set(state => {
      // Move from redo stack to undo stack
      state.history.redoStack.pop();
      state.history.undoStack.push(action);
    });
    
    return action;
  },
  
  clearHistory: () => {
    set(state => {
      state.history.undoStack = [];
      state.history.redoStack = [];
    });
  },
  
  // Notifications
  addNotification: (message, type = 'info', timeout = 4000) => {
    const id = `notification-${Date.now()}`;
    
    set(state => {
      state.notifications.push({
        id,
        message,
        type,
        timeout
      });
    });
    
    // Auto-remove notification after timeout if specified
    if (timeout > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, timeout);
    }
    
    return id;
  },
  
  removeNotification: (id) => {
    set(state => {
      state.notifications = state.notifications.filter(notification => notification.id !== id);
    });
  },
  
  clearNotifications: () => {
    set(state => {
      state.notifications = [];
    });
  }
})); 