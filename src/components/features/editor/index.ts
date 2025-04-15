// src/components/features/editor/index.ts

// Main components
export { default as EditorContainer } from './EditorContainer';
export { default as EditableSlide } from './EditableSlide';
export { default as SlideEditor } from './core/SlideEditor';
export { default as SortableSlide } from './SortableSlide';
export { default as EditorTopBar } from './EditorTopBar';
export { default as EditorSidebar } from './EditorSidebar';
export { default as SlideNavigationControls } from './SlideNavigationControls';
export { default as StyleControls } from './StyleControls';
export { default as RightToolbar } from './RightToolbar';
export { default as EditorModals } from './EditorModals';
export { default as CommandMenuModal } from './CommandMenuModal';
export { default as ErrorBoundary } from './ErrorBoundary';

// Hooks
export { default as useSlideManagement } from './hooks/useSlideManagement';
export { default as useEditorSelections } from './hooks/useEditorSelections';
export { default as useEditorModals } from './hooks/useEditorModals';

// Data
export { sampleSlides } from './data/sampleSlides';

// Re-export sub-directories
export * from './elements';
export * from './properties';
export * from './selectors';
export * from './styles';
