// src/components/features/application/editor/hooks/useEditorModals.tsx
import { useState, useCallback } from 'react';
import { useDisclosure } from '@heroui/react';

import { EmbedData } from '../selectors/EmbedSelector';
import { TableOptions } from '../selectors/TableSelector';

export interface UseEditorModalsReturn {
  isStylesOpen: boolean;
  isMediaSelectorOpen: boolean;
  isShapeSelectorOpen: boolean;
  isTableSelectorOpen: boolean;
  isEmbedSelectorOpen: boolean;
  showTemplateModal: boolean;
  onStylesOpen: () => void;
  onStylesClose: () => void;
  openMediaSelector: () => void;
  closeMediaSelector: () => void;
  openMediaSelectorWithCallback: (callback: (mediaUrl: string) => void) => void;
  openShapeSelector: () => void;
  closeShapeSelector: () => void;
  openTableSelector: () => void;
  closeTableSelector: () => void;
  openEmbedSelector: () => void;
  closeEmbedSelector: () => void;
  setShowTemplateModal: (show: boolean) => void;
  handleStyleSelect: (style: string) => void;
  handleMediaSelect: (mediaUrl: string) => void;
  handleShapeSelect: (shape: string) => void;
  handleTableSelect: (tableOptions: TableOptions) => void;
  handleEmbedSelect: (embedData: EmbedData) => void;
}

export default function useEditorModals(): UseEditorModalsReturn {
  // Modals state using useDisclosure from HeroUI
  const { isOpen: isStylesOpen, onOpen: onStylesOpen, onClose: onStylesClose } = useDisclosure();

  const {
    isOpen: isMediaSelectorOpen,
    onOpen: openMediaSelector,
    onClose: closeMediaSelector,
  } = useDisclosure();

  const {
    isOpen: isShapeSelectorOpen,
    onOpen: openShapeSelector,
    onClose: closeShapeSelector,
  } = useDisclosure();

  const {
    isOpen: isTableSelectorOpen,
    onOpen: openTableSelector,
    onClose: closeTableSelector,
  } = useDisclosure();

  const {
    isOpen: isEmbedSelectorOpen,
    onOpen: openEmbedSelector,
    onClose: closeEmbedSelector,
  } = useDisclosure();

  // Template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Store the media select callback
  const [mediaSelectCallback, setMediaSelectCallback] = useState<
    ((mediaUrl: string) => void) | null
  >(null);

  // Handler functions for different selectors
  const handleStyleSelect = useCallback(
    (style: string) => {
      // Handle style selection logic here
      onStylesClose();
    },
    [onStylesClose]
  );

  const handleMediaSelect = useCallback(
    (mediaUrl: string) => {
      // Call the stored callback if it exists
      if (mediaSelectCallback) {
        mediaSelectCallback(mediaUrl);
      }
      closeMediaSelector();
    },
    [closeMediaSelector, mediaSelectCallback]
  );

  // Function to open media selector with a callback
  const openMediaSelectorWithCallback = useCallback(
    (callback: (mediaUrl: string) => void) => {
      setMediaSelectCallback(() => callback);
      openMediaSelector();
    },
    [openMediaSelector]
  );

  const handleShapeSelect = useCallback(
    (shape: string) => {
      // This function is meant to be used with a callback from the parent component
      // Just closing the modal here
      closeShapeSelector();
    },
    [closeShapeSelector]
  );

  const handleTableSelect = useCallback(
    (tableOptions: TableOptions) => {
      // This function is meant to be used with a callback from the parent component
      // Just closing the modal here
      closeTableSelector();
    },
    [closeTableSelector]
  );

  const handleEmbedSelect = useCallback(
    (embedData: EmbedData) => {
      // This function is meant to be used with a callback from the parent component
      // Just closing the modal here
      closeEmbedSelector();
    },
    [closeEmbedSelector]
  );

  return {
    // Modal states
    isStylesOpen,
    isMediaSelectorOpen,
    isShapeSelectorOpen,
    isTableSelectorOpen,
    isEmbedSelectorOpen,
    showTemplateModal,

    // Open/close functions
    onStylesOpen,
    onStylesClose,
    openMediaSelector,
    closeMediaSelector,
    openMediaSelectorWithCallback,
    openShapeSelector,
    closeShapeSelector,
    openTableSelector,
    closeTableSelector,
    openEmbedSelector,
    closeEmbedSelector,
    setShowTemplateModal,

    // Selection handlers
    handleStyleSelect,
    handleMediaSelect,
    handleShapeSelect,
    handleTableSelect,
    handleEmbedSelect,
  };
}
