// src/components/features/application/editor/hooks/useEditorSelections.tsx
import { useState, useCallback } from 'react';

import { SlideContentItem } from '../EditorContainer';
import { EmbedData } from '../selectors/EmbedSelector';

import { TableData } from '@/types/editor';

export default function useEditorSelections() {
  // Selection states
  const [selectedShape, setSelectedShape] = useState<SlideContentItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<SlideContentItem | null>(null);
  const [selectedEmbed, setSelectedEmbed] = useState<SlideContentItem | null>(null);

  // Panel visibility states
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [showTablePropertiesPanel, setShowTablePropertiesPanel] = useState(false);
  const [showEmbedPropertiesPanel, setShowEmbedPropertiesPanel] = useState(false);

  // Update shape properties
  const updateShapeProperties = useCallback(
    (shapeId: string, properties: Partial<SlideContentItem>) => {
      // This function is meant to be used with a state update from the parent component
      // It just returns the properties to update in the parent state
      return { shapeId, properties };
    },
    []
  );

  // Update table properties
  const updateTableProperties = useCallback((tableId: string, tableData: TableData) => {
    // This function is meant to be used with a state update from the parent component
    return { tableId, tableData };
  }, []);

  // Update embed properties
  const updateEmbedProperties = useCallback((embedId: string, properties: Partial<EmbedData>) => {
    // This function is meant to be used with a state update from the parent component
    return { embedId, properties };
  }, []);

  return {
    selectedShape,
    selectedTable,
    selectedEmbed,
    setSelectedShape,
    setSelectedTable,
    setSelectedEmbed,
    showPropertiesPanel,
    showTablePropertiesPanel,
    showEmbedPropertiesPanel,
    setShowPropertiesPanel,
    setShowTablePropertiesPanel,
    setShowEmbedPropertiesPanel,
    updateShapeProperties,
    updateTableProperties,
    updateEmbedProperties,
  };
}
