import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

// Types
export type SlideLayout = 
  | 'title' 
  | 'content' 
  | 'title-content' 
  | 'image' 
  | 'title-image' 
  | 'image-content' 
  | 'content-image'
  | 'two-columns'
  | 'quote'
  | 'blank';

export type SlideElement = {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'video' | 'code';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: Record<string, any>;
  properties: Record<string, any>;
  zIndex: number;
  isLocked: boolean;
  isVisible: boolean;
};

export interface Slide {
  id: string;
  title: string;
  layout: SlideLayout;
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;
  };
  elements: SlideElement[];
  notes: string;
  tags: string[];
  isHidden: boolean;
}

// State definition
export interface SlidesState {
  slides: Record<string, Slide>;
  slideOrder: string[];
  activeSlideId: string | null;
  selectedElementIds: string[];
  clipboard: {
    slides?: Slide[];
    elements?: SlideElement[];
  };
  history: {
    states: Record<string, SlidesState>[];
    currentIndex: number;
  };
}

// Actions definition
export interface SlidesActions {
  // Slide management
  createSlide: (layout?: SlideLayout, position?: number) => string;
  deleteSlide: (id: string) => void;
  duplicateSlide: (id: string) => string;
  reorderSlide: (id: string, newPosition: number) => void;
  updateSlide: (id: string, updates: Partial<Omit<Slide, 'id'>>) => void;
  setActiveSlide: (id: string | null) => void;
  setSlideBackground: (id: string, background: Slide['background']) => void;
  
  // Element management
  createElement: (slideId: string, element: Omit<SlideElement, 'id'>) => string;
  updateElement: (slideId: string, elementId: string, updates: Partial<Omit<SlideElement, 'id'>>) => void;
  deleteElement: (slideId: string, elementId: string) => void;
  selectElement: (elementId: string) => void;
  selectElements: (elementIds: string[]) => void;
  clearSelection: () => void;
  
  // Element transformations
  moveElement: (slideId: string, elementId: string, x: number, y: number) => void;
  resizeElement: (slideId: string, elementId: string, width: number, height: number) => void;
  rotateElement: (slideId: string, elementId: string, rotation: number) => void;
  setElementZIndex: (slideId: string, elementId: string, zIndex: number) => void;
  bringElementForward: (slideId: string, elementId: string) => void;
  sendElementBackward: (slideId: string, elementId: string) => void;
  bringElementToFront: (slideId: string, elementId: string) => void;
  sendElementToBack: (slideId: string, elementId: string) => void;
  
  // Clipboard operations
  copySlide: (id: string) => void;
  cutSlide: (id: string) => void;
  copyElements: (elementIds: string[]) => void;
  cutElements: (slideId: string, elementIds: string[]) => void;
  paste: () => void;
  
  // History management
  saveState: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

// Template slide layouts
const slideLayouts: Record<SlideLayout, Partial<SlideElement>[]> = {
  'title': [
    {
      type: 'text',
      content: 'Presentation Title',
      x: 120,
      y: 180,
      width: 600,
      height: 120,
      style: { fontSize: 56, fontWeight: 'bold', textAlign: 'center' },
    },
    {
      type: 'text',
      content: 'Subtitle or Author',
      x: 160,
      y: 320,
      width: 520,
      height: 60,
      style: { fontSize: 24, textAlign: 'center' },
    }
  ],
  'content': [
    {
      type: 'text',
      content: 'Content goes here...',
      x: 60,
      y: 60,
      width: 680,
      height: 400,
      style: { fontSize: 24 },
    }
  ],
  'title-content': [
    {
      type: 'text',
      content: 'Slide Title',
      x: 60,
      y: 40,
      width: 680,
      height: 80,
      style: { fontSize: 36, fontWeight: 'bold' },
    },
    {
      type: 'text',
      content: 'Content goes here...',
      x: 60,
      y: 140,
      width: 680,
      height: 340,
      style: { fontSize: 24 },
    }
  ],
  'image': [
    {
      type: 'image',
      content: '',
      x: 100,
      y: 100,
      width: 600,
      height: 400,
      style: {},
      properties: { alt: 'Image' },
    }
  ],
  'title-image': [
    {
      type: 'text',
      content: 'Slide Title',
      x: 60,
      y: 40,
      width: 680,
      height: 80,
      style: { fontSize: 36, fontWeight: 'bold' },
    },
    {
      type: 'image',
      content: '',
      x: 150,
      y: 140,
      width: 500,
      height: 340,
      style: {},
      properties: { alt: 'Image' },
    }
  ],
  'image-content': [
    {
      type: 'image',
      content: '',
      x: 60,
      y: 100,
      width: 300,
      height: 300,
      style: {},
      properties: { alt: 'Image' },
    },
    {
      type: 'text',
      content: 'Content next to image',
      x: 400,
      y: 100,
      width: 340,
      height: 300,
      style: { fontSize: 24 },
    }
  ],
  'content-image': [
    {
      type: 'text',
      content: 'Content next to image',
      x: 60,
      y: 100,
      width: 340,
      height: 300,
      style: { fontSize: 24 },
    },
    {
      type: 'image',
      content: '',
      x: 440,
      y: 100,
      width: 300,
      height: 300,
      style: {},
      properties: { alt: 'Image' },
    }
  ],
  'two-columns': [
    {
      type: 'text',
      content: 'Left column content',
      x: 60,
      y: 80,
      width: 320,
      height: 360,
      style: { fontSize: 24 },
    },
    {
      type: 'text',
      content: 'Right column content',
      x: 420,
      y: 80,
      width: 320,
      height: 360,
      style: { fontSize: 24 },
    }
  ],
  'quote': [
    {
      type: 'text',
      content: '"Your inspiring quote goes here."',
      x: 100,
      y: 180,
      width: 600,
      height: 160,
      style: { fontSize: 36, fontStyle: 'italic', textAlign: 'center' },
    },
    {
      type: 'text',
      content: '- Author',
      x: 400,
      y: 360,
      width: 300,
      height: 40,
      style: { fontSize: 24, textAlign: 'right' },
    }
  ],
  'blank': []
};

// Create a default slide with elements based on layout
const createDefaultSlide = (layout: SlideLayout = 'blank'): Slide => {
  const elements: SlideElement[] = slideLayouts[layout].map(templateElement => ({
    id: uuidv4(),
    type: templateElement.type || 'text',
    x: templateElement.x || 0,
    y: templateElement.y || 0,
    width: templateElement.width || 100,
    height: templateElement.height || 100,
    rotation: templateElement.rotation || 0,
    content: templateElement.content || '',
    style: templateElement.style || {},
    properties: templateElement.properties || {},
    zIndex: templateElement.zIndex || 0,
    isLocked: false,
    isVisible: true,
  }));

  return {
    id: uuidv4(),
    title: 'New Slide',
    layout,
    background: {
      type: 'color',
      value: '#ffffff',
    },
    elements,
    notes: '',
    tags: [],
    isHidden: false,
  };
};

// Initial state
const initialState: SlidesState = {
  slides: {},
  slideOrder: [],
  activeSlideId: null,
  selectedElementIds: [],
  clipboard: {},
  history: {
    states: [],
    currentIndex: -1,
  },
};

// Type for the slice creator function
export type SlidesSlice = SlidesState & SlidesActions;

// Create the slides slice
export const createSlidesSlice: StateCreator<
  SlidesSlice,
  [['zustand/immer', never]],
  [],
  SlidesSlice
> = immer((set, get) => ({
  ...initialState,
  
  // Slide management
  createSlide: (layout = 'blank', position) => {
    const newSlide = createDefaultSlide(layout);
    const slideId = newSlide.id;
    
    set(state => {
      // Add the new slide to the slides object
      state.slides[slideId] = newSlide;
      
      // Insert the slide at the specified position or at the end
      if (position !== undefined && position >= 0 && position <= state.slideOrder.length) {
        state.slideOrder.splice(position, 0, slideId);
      } else {
        state.slideOrder.push(slideId);
      }
      
      // Set the new slide as active
      state.activeSlideId = slideId;
    });
    
    // Save the state for undo/redo
    get().saveState();
    
    return slideId;
  },
  
  deleteSlide: (id) => {
    const { slides, slideOrder, activeSlideId } = get();
    
    // Don't delete if it's the only slide
    if (slideOrder.length <= 1) {
      return;
    }
    
    set(state => {
      // Remove the slide from slides object
      delete state.slides[id];
      
      // Remove from slideOrder
      const index = state.slideOrder.indexOf(id);
      if (index !== -1) {
        state.slideOrder.splice(index, 1);
      }
      
      // Update active slide if needed
      if (state.activeSlideId === id) {
        // Select the next slide, or the previous one if it was the last slide
        const newIndex = Math.min(index, state.slideOrder.length - 1);
        state.activeSlideId = state.slideOrder[newIndex] || null;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  duplicateSlide: (id) => {
    const { slides } = get();
    const sourceSlide = slides[id];
    
    if (!sourceSlide) {
      return '';
    }
    
    // Create a new slide by cloning the source slide
    const newSlide: Slide = {
      ...JSON.parse(JSON.stringify(sourceSlide)),
      id: uuidv4(),
      title: `${sourceSlide.title} (Copy)`,
      elements: sourceSlide.elements.map(element => ({
        ...element,
        id: uuidv4(),
      })),
    };
    
    const newSlideId = newSlide.id;
    
    set(state => {
      // Add the new slide
      state.slides[newSlideId] = newSlide;
      
      // Add it after the source slide
      const sourceIndex = state.slideOrder.indexOf(id);
      state.slideOrder.splice(sourceIndex + 1, 0, newSlideId);
      
      // Set as active slide
      state.activeSlideId = newSlideId;
    });
    
    // Save the state for undo/redo
    get().saveState();
    
    return newSlideId;
  },
  
  reorderSlide: (id, newPosition) => {
    const { slideOrder } = get();
    
    if (newPosition < 0 || newPosition >= slideOrder.length) {
      return;
    }
    
    set(state => {
      // Find current position
      const currentIndex = state.slideOrder.indexOf(id);
      if (currentIndex === -1) return;
      
      // Remove from current position
      state.slideOrder.splice(currentIndex, 1);
      
      // Insert at new position
      state.slideOrder.splice(newPosition, 0, id);
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  updateSlide: (id, updates) => {
    set(state => {
      if (state.slides[id]) {
        state.slides[id] = {
          ...state.slides[id],
          ...updates,
        };
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  setActiveSlide: (id) => {
    set(state => {
      if (id === null || state.slides[id]) {
        state.activeSlideId = id;
        // Clear selected elements when changing slides
        state.selectedElementIds = [];
      }
    });
  },
  
  setSlideBackground: (id, background) => {
    set(state => {
      if (state.slides[id]) {
        state.slides[id].background = background;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  // Element management
  createElement: (slideId, element) => {
    const newElement: SlideElement = {
      id: uuidv4(),
      rotation: 0,
      zIndex: 0,
      isLocked: false,
      isVisible: true,
      ...element,
    };
    
    const elementId = newElement.id;
    
    set(state => {
      if (state.slides[slideId]) {
        // Add element to the slide
        state.slides[slideId].elements.push(newElement);
        
        // Select the new element
        state.selectedElementIds = [elementId];
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
    
    return elementId;
  },
  
  updateElement: (slideId, elementId, updates) => {
    set(state => {
      if (state.slides[slideId]) {
        const elementIndex = state.slides[slideId].elements.findIndex(e => e.id === elementId);
        if (elementIndex !== -1) {
          state.slides[slideId].elements[elementIndex] = {
            ...state.slides[slideId].elements[elementIndex],
            ...updates,
          };
        }
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  deleteElement: (slideId, elementId) => {
    set(state => {
      if (state.slides[slideId]) {
        // Remove element from the slide
        state.slides[slideId].elements = state.slides[slideId].elements.filter(
          element => element.id !== elementId
        );
        
        // Remove from selection if selected
        state.selectedElementIds = state.selectedElementIds.filter(id => id !== elementId);
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  selectElement: (elementId) => {
    set(state => {
      state.selectedElementIds = [elementId];
    });
  },
  
  selectElements: (elementIds) => {
    set(state => {
      state.selectedElementIds = elementIds;
    });
  },
  
  clearSelection: () => {
    set(state => {
      state.selectedElementIds = [];
    });
  },
  
  // Element transformations
  moveElement: (slideId, elementId, x, y) => {
    set(state => {
      if (state.slides[slideId]) {
        const elementIndex = state.slides[slideId].elements.findIndex(e => e.id === elementId);
        if (elementIndex !== -1) {
          state.slides[slideId].elements[elementIndex].x = x;
          state.slides[slideId].elements[elementIndex].y = y;
        }
      }
    });
  },
  
  resizeElement: (slideId, elementId, width, height) => {
    set(state => {
      if (state.slides[slideId]) {
        const elementIndex = state.slides[slideId].elements.findIndex(e => e.id === elementId);
        if (elementIndex !== -1) {
          state.slides[slideId].elements[elementIndex].width = width;
          state.slides[slideId].elements[elementIndex].height = height;
        }
      }
    });
  },
  
  rotateElement: (slideId, elementId, rotation) => {
    set(state => {
      if (state.slides[slideId]) {
        const elementIndex = state.slides[slideId].elements.findIndex(e => e.id === elementId);
        if (elementIndex !== -1) {
          state.slides[slideId].elements[elementIndex].rotation = rotation;
        }
      }
    });
  },
  
  setElementZIndex: (slideId, elementId, zIndex) => {
    set(state => {
      if (state.slides[slideId]) {
        const elementIndex = state.slides[slideId].elements.findIndex(e => e.id === elementId);
        if (elementIndex !== -1) {
          state.slides[slideId].elements[elementIndex].zIndex = zIndex;
        }
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  bringElementForward: (slideId, elementId) => {
    const { slides } = get();
    const slide = slides[slideId];
    
    if (!slide) return;
    
    // Sort elements by z-index
    const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
    
    // Find the target element
    const elementIndex = sortedElements.findIndex(e => e.id === elementId);
    if (elementIndex === -1 || elementIndex === sortedElements.length - 1) return;
    
    // Swap z-indices with the next element
    const currentZIndex = sortedElements[elementIndex].zIndex;
    const nextZIndex = sortedElements[elementIndex + 1].zIndex;
    
    set(state => {
      const targetElement = state.slides[slideId].elements.find(e => e.id === elementId);
      const nextElement = state.slides[slideId].elements.find(e => e.zIndex === nextZIndex);
      
      if (targetElement && nextElement) {
        targetElement.zIndex = nextZIndex;
        nextElement.zIndex = currentZIndex;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  sendElementBackward: (slideId, elementId) => {
    const { slides } = get();
    const slide = slides[slideId];
    
    if (!slide) return;
    
    // Sort elements by z-index
    const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
    
    // Find the target element
    const elementIndex = sortedElements.findIndex(e => e.id === elementId);
    if (elementIndex <= 0) return;
    
    // Swap z-indices with the previous element
    const currentZIndex = sortedElements[elementIndex].zIndex;
    const prevZIndex = sortedElements[elementIndex - 1].zIndex;
    
    set(state => {
      const targetElement = state.slides[slideId].elements.find(e => e.id === elementId);
      const prevElement = state.slides[slideId].elements.find(e => e.zIndex === prevZIndex);
      
      if (targetElement && prevElement) {
        targetElement.zIndex = prevZIndex;
        prevElement.zIndex = currentZIndex;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  bringElementToFront: (slideId, elementId) => {
    const { slides } = get();
    const slide = slides[slideId];
    
    if (!slide) return;
    
    // Find the highest z-index
    const highestZIndex = Math.max(...slide.elements.map(e => e.zIndex), 0);
    
    set(state => {
      const targetElement = state.slides[slideId].elements.find(e => e.id === elementId);
      
      if (targetElement) {
        targetElement.zIndex = highestZIndex + 1;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  sendElementToBack: (slideId, elementId) => {
    const { slides } = get();
    const slide = slides[slideId];
    
    if (!slide) return;
    
    // Find the lowest z-index
    const lowestZIndex = Math.min(...slide.elements.map(e => e.zIndex), 0);
    
    set(state => {
      const targetElement = state.slides[slideId].elements.find(e => e.id === elementId);
      
      if (targetElement) {
        targetElement.zIndex = lowestZIndex - 1;
      }
    });
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  // Clipboard operations
  copySlide: (id) => {
    const { slides } = get();
    const slide = slides[id];
    
    if (slide) {
      set(state => {
        state.clipboard = {
          slides: [JSON.parse(JSON.stringify(slide))],
          elements: undefined,
        };
      });
    }
  },
  
  cutSlide: (id) => {
    // First copy, then delete
    get().copySlide(id);
    get().deleteSlide(id);
  },
  
  copyElements: (elementIds) => {
    const { slides, activeSlideId } = get();
    
    if (!activeSlideId) return;
    
    const currentSlide = slides[activeSlideId];
    if (!currentSlide) return;
    
    // Get elements to copy
    const elementsToCopy = currentSlide.elements.filter(
      element => elementIds.includes(element.id)
    );
    
    if (elementsToCopy.length > 0) {
      set(state => {
        state.clipboard = {
          slides: undefined,
          elements: JSON.parse(JSON.stringify(elementsToCopy)),
        };
      });
    }
  },
  
  cutElements: (slideId, elementIds) => {
    // First copy, then delete
    get().copyElements(elementIds);
    
    // Delete the elements
    elementIds.forEach(elementId => {
      get().deleteElement(slideId, elementId);
    });
  },
  
  paste: () => {
    const { clipboard, activeSlideId, slides } = get();
    
    if (!activeSlideId) return;
    
    // Paste slides
    if (clipboard.slides && clipboard.slides.length > 0) {
      clipboard.slides.forEach(slide => {
        // Create new IDs for the slide and its elements
        const newSlide: Slide = {
          ...slide,
          id: uuidv4(),
          title: `${slide.title} (Copy)`,
          elements: slide.elements.map(element => ({
            ...element,
            id: uuidv4(),
          })),
        };
        
        set(state => {
          // Add the new slide
          state.slides[newSlide.id] = newSlide;
          
          // Add it after the current active slide
          const activeIndex = state.slideOrder.indexOf(activeSlideId);
          state.slideOrder.splice(activeIndex + 1, 0, newSlide.id);
        });
      });
    }
    
    // Paste elements
    if (clipboard.elements && clipboard.elements.length > 0) {
      const currentSlide = slides[activeSlideId];
      
      if (currentSlide) {
        const newElementIds: string[] = [];
        
        set(state => {
          // Add elements to the current slide with slight offset
          clipboard.elements!.forEach(element => {
            const newId = uuidv4();
            newElementIds.push(newId);
            
            state.slides[activeSlideId].elements.push({
              ...element,
              id: newId,
              x: element.x + 20, // Add slight offset
              y: element.y + 20,
            });
          });
          
          // Select the newly pasted elements
          state.selectedElementIds = newElementIds;
        });
      }
    }
    
    // Save the state for undo/redo
    get().saveState();
  },
  
  // History management
  saveState: () => {
    set(state => {
      // Create a deep copy of the current state
      const currentState = JSON.parse(JSON.stringify({
        slides: state.slides,
        slideOrder: state.slideOrder,
        activeSlideId: state.activeSlideId,
      }));
      
      // If we're not at the end of the history, discard future states
      if (state.history.currentIndex < state.history.states.length - 1) {
        state.history.states = state.history.states.slice(0, state.history.currentIndex + 1);
      }
      
      // Add the new state to history
      state.history.states.push(currentState);
      state.history.currentIndex++;
      
      // Limit history size
      if (state.history.states.length > 50) {
        state.history.states.shift();
        state.history.currentIndex--;
      }
    });
  },
  
  undo: () => {
    const { history } = get();
    
    if (history.currentIndex <= 0) {
      return; // Nothing to undo
    }
    
    set(state => {
      // Move one state back
      state.history.currentIndex--;
      
      // Restore that state
      const prevState = state.history.states[state.history.currentIndex];
      state.slides = prevState.slides;
      state.slideOrder = prevState.slideOrder;
      state.activeSlideId = prevState.activeSlideId;
      state.selectedElementIds = [];
    });
  },
  
  redo: () => {
    const { history } = get();
    
    if (history.currentIndex >= history.states.length - 1) {
      return; // Nothing to redo
    }
    
    set(state => {
      // Move one state forward
      state.history.currentIndex++;
      
      // Restore that state
      const nextState = state.history.states[state.history.currentIndex];
      state.slides = nextState.slides;
      state.slideOrder = nextState.slideOrder;
      state.activeSlideId = nextState.activeSlideId;
      state.selectedElementIds = [];
    });
  },
  
  clearHistory: () => {
    const currentState = get();
    
    set(state => {
      // Reset history but keep the current state
      state.history = {
        states: [
          {
            slides: currentState.slides,
            slideOrder: currentState.slideOrder,
            activeSlideId: currentState.activeSlideId,
          }
        ],
        currentIndex: 0,
      };
    });
  },
})); 