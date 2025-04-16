'use client';

import { useState, useCallback } from 'react';

import { SlideContentItem } from '../types';

interface UseEditorSelectionsReturn {
  selectedShape: SlideContentItem | null;
  selectedTable: SlideContentItem | null;
  selectedEmbed: SlideContentItem | null;
  selectedElement: SlideContentItem | null;

  selectShape: (shape: SlideContentItem | null) => void;
  selectTable: (table: SlideContentItem | null) => void;
  selectEmbed: (embed: SlideContentItem | null) => void;

  clearSelections: () => void;
  isElementSelected: (elementId: string) => boolean;
}

const useEditorSelections = (): UseEditorSelectionsReturn => {
  const [selectedShape, setSelectedShape] = useState<SlideContentItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<SlideContentItem | null>(null);
  const [selectedEmbed, setSelectedEmbed] = useState<SlideContentItem | null>(null);

  // Combined selected element (whichever is currently active)
  const selectedElement = selectedShape || selectedTable || selectedEmbed;

  const selectShape = useCallback((shape: SlideContentItem | null) => {
    setSelectedShape(shape);
    setSelectedTable(null);
    setSelectedEmbed(null);
  }, []);

  const selectTable = useCallback((table: SlideContentItem | null) => {
    setSelectedTable(table);
    setSelectedShape(null);
    setSelectedEmbed(null);
  }, []);

  const selectEmbed = useCallback((embed: SlideContentItem | null) => {
    setSelectedEmbed(embed);
    setSelectedShape(null);
    setSelectedTable(null);
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedShape(null);
    setSelectedTable(null);
    setSelectedEmbed(null);
  }, []);

  const isElementSelected = useCallback(
    (elementId: string) => {
      if (!elementId) return false;

      return !!(
        (selectedShape && selectedShape.id === elementId) ||
        (selectedTable && selectedTable.id === elementId) ||
        (selectedEmbed && selectedEmbed.id === elementId)
      );
    },
    [selectedShape, selectedTable, selectedEmbed]
  );

  return {
    selectedShape,
    selectedTable,
    selectedEmbed,
    selectedElement,
    selectShape,
    selectTable,
    selectEmbed,
    clearSelections,
    isElementSelected,
  };
};

export default useEditorSelections;
