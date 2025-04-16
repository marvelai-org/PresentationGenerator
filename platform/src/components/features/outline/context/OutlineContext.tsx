'use client';

import type { SlideContent } from '../types/slide';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

import { outlineReducer, initialState, OutlineState } from './OutlineReducer';

interface OutlineContextType extends OutlineState {
  // Slide operations
  setSlides: (slides: SlideContent[]) => void;
  addSlide: () => void;
  addSlideAt: (index: number) => void;
  deleteSlide: (id: number) => void;
  updateSlide: (id: number, title: string, bullets: string[]) => void;
  reorderSlides: (activeId: number, overId: number) => void;

  // Drag state
  setActiveId: (id: number | null) => void;
  setRecentlyDroppedId: (id: number | null) => void;

  // Loading state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Save slides to localStorage
  saveToLocalStorage: () => void;

  // Generate presentation
  generatePresentation: () => void;
}

const OutlineContext = createContext<OutlineContextType | undefined>(undefined);

interface OutlineProviderProps {
  children: React.ReactNode;
}

export function OutlineProvider({ children }: OutlineProviderProps) {
  const [state, dispatch] = useReducer(outlineReducer, initialState);

  // Load slides from localStorage on initial mount
  useEffect(() => {
    const savedOutline = localStorage.getItem('presentationOutline');

    if (savedOutline) {
      try {
        const parsedOutline = JSON.parse(savedOutline);

        if (Array.isArray(parsedOutline)) {
          dispatch({ type: 'SET_SLIDES', slides: parsedOutline });
        }
      } catch (error) {
        console.error('Error loading slides from localStorage:', error);
      }
    }
  }, []);

  // Clear recently dropped ID after timeout
  useEffect(() => {
    if (state.recentlyDroppedId !== null) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'CLEAR_RECENTLY_DROPPED_ID' });
      }, 10000); // 10 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [state.recentlyDroppedId]);

  // Slide operations
  const setSlides = useCallback((slides: SlideContent[]) => {
    dispatch({ type: 'SET_SLIDES', slides });
  }, []);

  const addSlide = useCallback(() => {
    dispatch({ type: 'ADD_SLIDE' });
  }, []);

  const addSlideAt = useCallback((index: number) => {
    dispatch({ type: 'ADD_SLIDE_AT', index });
  }, []);

  const deleteSlide = useCallback((id: number) => {
    dispatch({ type: 'DELETE_SLIDE', id });
  }, []);

  const updateSlide = useCallback((id: number, title: string, bullets: string[]) => {
    dispatch({ type: 'UPDATE_SLIDE', id, title, bullets });
  }, []);

  const reorderSlides = useCallback((activeId: number, overId: number) => {
    dispatch({ type: 'REORDER_SLIDES', activeId, overId });
  }, []);

  // Drag state
  const setActiveId = useCallback((id: number | null) => {
    dispatch({ type: 'SET_ACTIVE_ID', id });
  }, []);

  const setRecentlyDroppedId = useCallback((id: number | null) => {
    dispatch({ type: 'SET_RECENTLY_DROPPED_ID', id });
  }, []);

  // Loading state
  const setLoading = useCallback((isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING', isLoading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', error });
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback(() => {
    try {
      // Save the outline separately for backward compatibility
      localStorage.setItem('presentationOutline', JSON.stringify(state.slides));

      // Save the complete settings object
      const settings = {
        outline: state.slides,
        theme: {}, // This will be set in the editor
        textDensity: 'Medium',
        imageSource: 'AI images',
        aiModel: 'Flux Fast',
      };

      localStorage.setItem('presentationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving presentation data to localStorage:', error);
    }
  }, [state.slides]);

  // Generate presentation (navigate to editor)
  const generatePresentation = useCallback(() => {
    // Save all presentation data to localStorage
    saveToLocalStorage();

    // This would typically include navigation to the editor page
    // In a real implementation, we'd use router.push or similar
    window.location.href = '/dashboard/create/editor';
  }, [saveToLocalStorage]);

  const value = {
    ...state,
    setSlides,
    addSlide,
    addSlideAt,
    deleteSlide,
    updateSlide,
    reorderSlides,
    setActiveId,
    setRecentlyDroppedId,
    setLoading,
    setError,
    saveToLocalStorage,
    generatePresentation,
  };

  return <OutlineContext.Provider value={value}>{children}</OutlineContext.Provider>;
}

export function useOutline() {
  const context = useContext(OutlineContext);

  if (context === undefined) {
    throw new Error('useOutline must be used within an OutlineProvider');
  }

  return context;
}
