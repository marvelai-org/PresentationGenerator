import type { SlideContent } from '../types/slide';

export interface OutlineState {
  slides: SlideContent[];
  activeId: number | null;
  recentlyDroppedId: number | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OutlineState = {
  slides: [],
  activeId: null,
  recentlyDroppedId: null,
  isLoading: false,
  error: null,
};

export type OutlineAction =
  | { type: 'SET_SLIDES'; slides: SlideContent[] }
  | { type: 'ADD_SLIDE' }
  | { type: 'ADD_SLIDE_AT'; index: number }
  | { type: 'DELETE_SLIDE'; id: number }
  | { type: 'UPDATE_SLIDE'; id: number; title: string; bullets: string[] }
  | { type: 'REORDER_SLIDES'; activeId: number; overId: number }
  | { type: 'SET_ACTIVE_ID'; id: number | null }
  | { type: 'SET_RECENTLY_DROPPED_ID'; id: number | null }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'CLEAR_RECENTLY_DROPPED_ID' };

/**
 * Updates the slide numbers to be sequential (1, 2, 3, etc.)
 */
const updateSlideNumbers = (slides: SlideContent[]): SlideContent[] => {
  return slides.map((slide, index) => ({
    ...slide,
    id: index + 1,
  }));
};

export function outlineReducer(state: OutlineState, action: OutlineAction): OutlineState {
  switch (action.type) {
    case 'SET_SLIDES':
      return {
        ...state,
        slides: action.slides,
      };

    case 'ADD_SLIDE':
      const newSlide: SlideContent = {
        id: state.slides.length + 1,
        title: 'New Slide',
        bullets: ['Add your content here'],
      };

      return {
        ...state,
        slides: [...state.slides, newSlide],
      };

    case 'ADD_SLIDE_AT': {
      const newSlides = [...state.slides];

      newSlides.splice(action.index, 0, {
        id: 0, // Temporary ID that will be updated
        title: 'New Slide',
        bullets: ['Add your content here'],
      });

      return {
        ...state,
        slides: updateSlideNumbers(newSlides),
      };
    }

    case 'DELETE_SLIDE': {
      const updatedSlides = state.slides.filter(slide => slide.id !== action.id);

      return {
        ...state,
        slides: updateSlideNumbers(updatedSlides),
      };
    }

    case 'UPDATE_SLIDE':
      return {
        ...state,
        slides: state.slides.map(slide =>
          slide.id === action.id
            ? { ...slide, title: action.title, bullets: action.bullets }
            : slide
        ),
      };

    case 'REORDER_SLIDES': {
      const oldIndex = state.slides.findIndex(slide => slide.id === action.activeId);
      const newIndex = state.slides.findIndex(slide => slide.id === action.overId);

      if (oldIndex === -1 || newIndex === -1) {
        return state;
      }

      // Create a copy and move the element
      const slides = [...state.slides];
      const [removed] = slides.splice(oldIndex, 1);

      slides.splice(newIndex, 0, removed);

      // Update slide numbers
      const updatedSlides = updateSlideNumbers(slides);

      // Find the moved slide to highlight it
      const movedSlide = updatedSlides.find(slide => slide.title === removed.title);

      return {
        ...state,
        slides: updatedSlides,
        recentlyDroppedId: movedSlide?.id || null,
      };
    }

    case 'SET_ACTIVE_ID':
      return {
        ...state,
        activeId: action.id,
      };

    case 'SET_RECENTLY_DROPPED_ID':
      return {
        ...state,
        recentlyDroppedId: action.id,
      };

    case 'CLEAR_RECENTLY_DROPPED_ID':
      return {
        ...state,
        recentlyDroppedId: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };

    default:
      return state;
  }
}
