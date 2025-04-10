// src/components/features/application/editor/hooks/useEditorModals.tsx
import { useState, useCallback } from "react";
import { useDisclosure } from "@heroui/react";

import { EmbedData } from "../selectors/EmbedSelector";
import { TableOptions } from "../selectors/TableSelector";

export default function useEditorModals() {
  // Modals state using useDisclosure from HeroUI
  const {
    isOpen: isStylesOpen,
    onOpen: onStylesOpen,
    onClose: onStylesClose,
  } = useDisclosure();
  
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

  // Handler functions for different selectors
  const handleStyleSelect = useCallback((style: string) => {
    // Handle style selection logic here
    onStylesClose();
  }, [onStylesClose]);

  const handleMediaSelect = useCallback((mediaUrl: string) => {
    // Handle media selection logic here
    closeMediaSelector();
  }, [closeMediaSelector]);

  const handleShapeSelect = useCallback((shape: string) => {
    // This function is meant to be used with a callback from the parent component
    // Just closing the modal here
    closeShapeSelector();
  }, [closeShapeSelector]);

  const handleTableSelect = useCallback((tableOptions: TableOptions) => {
    // This function is meant to be used with a callback from the parent component
    // Just closing the modal here
    closeTableSelector();
  }, [closeTableSelector]);

  const handleEmbedSelect = useCallback((embedData: EmbedData) => {
    // This function is meant to be used with a callback from the parent component
    // Just closing the modal here
    closeEmbedSelector();
  }, [closeEmbedSelector]);

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