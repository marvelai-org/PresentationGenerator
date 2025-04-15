'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

import { Slide, SlideContentItem, EditorModalState } from '../types';

interface EditorContextType {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
  currentSlideIndex: number;
  setCurrentSlideIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedElement: SlideContentItem | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<SlideContentItem | null>>;
  modalState: EditorModalState;
  openModal: (modalName: keyof EditorModalState) => void;
  closeModal: (modalName: keyof EditorModalState) => void;
  addSlide: () => void;
  removeSlide: (slideId: number) => void;
  duplicateSlide: (slideId: number) => void;
  updateSlide: (slideId: number, updates: Partial<Slide>) => void;
  moveSlide: (fromIndex: number, toIndex: number) => void;
  presentationTitle: string;
  setPresentationTitle: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<SlideContentItem | null>(null);
  const [presentationTitle, setPresentationTitle] = useState('New Presentation');
  const [isLoading, setIsLoading] = useState(true);

  const [modalState, setModalState] = useState<EditorModalState>({
    isMediaSelectorOpen: false,
    isShapeSelectorOpen: false,
    isTableSelectorOpen: false,
    isEmbedSelectorOpen: false,
    isCommandMenuOpen: false,
  });

  const openModal = useCallback((modalName: keyof EditorModalState) => {
    setModalState(prev => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName: keyof EditorModalState) => {
    setModalState(prev => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const addSlide = useCallback(() => {
    setSlides(prev => {
      // Create a new empty slide
      const newSlideId = Math.max(0, ...prev.map(s => s.id)) + 1;
      const newSlide: Slide = {
        id: newSlideId,
        title: 'New Slide',
        backgroundColor: '#ffffff',
        content: [],
        textColor: '#000000',
      };

      return [...prev, newSlide];
    });
  }, []);

  const removeSlide = useCallback(
    (slideId: number) => {
      setSlides(prev => prev.filter(slide => slide.id !== slideId));
      // Adjust current slide index if needed
      setCurrentSlideIndex(prev => {
        const newSlidesLength = slides.length - 1;

        if (prev >= newSlidesLength) {
          return Math.max(0, newSlidesLength - 1);
        }

        return prev;
      });
    },
    [slides.length]
  );

  const duplicateSlide = useCallback((slideId: number) => {
    setSlides(prev => {
      const slideIndex = prev.findIndex(slide => slide.id === slideId);

      if (slideIndex === -1) return prev;

      const slideToDuplicate = prev[slideIndex];
      const newSlideId = Math.max(0, ...prev.map(s => s.id)) + 1;

      // Create deep copy of the slide
      const newSlide: Slide = {
        ...JSON.parse(JSON.stringify(slideToDuplicate)),
        id: newSlideId,
        title: `${slideToDuplicate.title} (Copy)`,
      };

      // Insert the new slide after the original
      const newSlides = [...prev];

      newSlides.splice(slideIndex + 1, 0, newSlide);

      return newSlides;
    });
  }, []);

  const updateSlide = useCallback((slideId: number, updates: Partial<Slide>) => {
    setSlides(prev => prev.map(slide => (slide.id === slideId ? { ...slide, ...updates } : slide)));
  }, []);

  const moveSlide = useCallback((fromIndex: number, toIndex: number) => {
    setSlides(prev => {
      const newSlides = [...prev];
      const [movedSlide] = newSlides.splice(fromIndex, 1);

      newSlides.splice(toIndex, 0, movedSlide);

      return newSlides;
    });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        slides,
        setSlides,
        currentSlideIndex,
        setCurrentSlideIndex,
        selectedElement,
        setSelectedElement,
        modalState,
        openModal,
        closeModal,
        addSlide,
        removeSlide,
        duplicateSlide,
        updateSlide,
        moveSlide,
        presentationTitle,
        setPresentationTitle,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);

  if (context === undefined) {
    throw new Error('useEditorContext must be used within an EditorProvider');
  }

  return context;
};
