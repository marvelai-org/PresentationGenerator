'use client';

import { useState, useCallback } from 'react';

import { EditorModalState } from '../types';

interface UseEditorModalsReturn {
  modalState: EditorModalState;
  openModal: (modalName: keyof EditorModalState) => void;
  closeModal: (modalName: keyof EditorModalState) => void;
  toggleModal: (modalName: keyof EditorModalState) => void;
  closeAllModals: () => void;
}

const useEditorModals = (): UseEditorModalsReturn => {
  const [modalState, setModalState] = useState<EditorModalState>({
    isMediaSelectorOpen: false,
    isShapeSelectorOpen: false,
    isTableSelectorOpen: false,
    isEmbedSelectorOpen: false,
    isCommandMenuOpen: false,
  });

  const openModal = useCallback((modalName: keyof EditorModalState) => {
    // Close all other modals when opening a new one
    const newState = {
      isMediaSelectorOpen: false,
      isShapeSelectorOpen: false,
      isTableSelectorOpen: false,
      isEmbedSelectorOpen: false,
      isCommandMenuOpen: false,
    };

    setModalState({
      ...newState,
      [modalName]: true,
    });
  }, []);

  const closeModal = useCallback((modalName: keyof EditorModalState) => {
    setModalState(prev => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const toggleModal = useCallback((modalName: keyof EditorModalState) => {
    setModalState(prev => {
      // If we're opening this modal, close all others first
      if (!prev[modalName]) {
        const newState = {
          isMediaSelectorOpen: false,
          isShapeSelectorOpen: false,
          isTableSelectorOpen: false,
          isEmbedSelectorOpen: false,
          isCommandMenuOpen: false,
        };

        return {
          ...newState,
          [modalName]: true,
        };
      }

      // Otherwise just toggle the state
      return {
        ...prev,
        [modalName]: !prev[modalName],
      };
    });
  }, []);

  const closeAllModals = useCallback(() => {
    setModalState({
      isMediaSelectorOpen: false,
      isShapeSelectorOpen: false,
      isTableSelectorOpen: false,
      isEmbedSelectorOpen: false,
      isCommandMenuOpen: false,
    });
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
  };
};

export default useEditorModals;
