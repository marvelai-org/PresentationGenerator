// src/components/features/application/editor/EditorContainer.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Tooltip, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import SlideEditor from "./SlideEditor";
import EditableSlide from "./EditableSlide";
import SortableSlide from "./SortableSlide";
import EditorTopBar from "./EditorTopBar";
import EditorSidebar from "./EditorSidebar";
import SlideNavigationControls from "./SlideNavigationControls";
import StyleControls from "./StyleControls";
import RightToolbar from "./RightToolbar";
import EditorModals from "./EditorModals";
import ShapeProperties from "./properties/ShapeProperties";
import TableProperties from "./properties/TableProperties";
import EmbedProperties from "./properties/EmbedProperties";
import useSlideManagement from "./hooks/useSlideManagement";
import useEditorSelections from "./hooks/useEditorSelections";
import useEditorModals from "./hooks/useEditorModals";
import { TableData } from "@/types/editor";
import { EmbedData } from "./selectors/EmbedSelector";

// Importing the sample slides data
import { sampleSlides } from "./data/sampleSlides";

export type SlideContentItem = {
  id: string;
  type: string;
  value: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  style?: {
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    borderStyle?: string;
    borderWidth?: number;
    rotation?: number;
    opacity?: number;
    zIndex?: number;
  };
  tableData?: TableData;
  embedData?: EmbedData;
};

export type Slide = {
  id: number;
  title: string;
  backgroundColor: string;
  content: SlideContentItem[];
  subtitle?: string;
  author?: string;
  editedTime?: string;
  image?: string;
  gradient?: string;
  textColor?: string;
  shapes?: SlideContentItem[];
};

const EditorContainer = () => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(true);
  const [activeTab, setActiveTab] = useState("edit");
  const [presentationTitle, setPresentationTitle] = useState(
    "Can We REALLY Stop Climate Change?"
  );

  // Initialize with sample slides
  const [slides, setSlides] = useState<Slide[]>(sampleSlides);
  
  // Custom hooks for editor functionality
  const { 
    currentSlideIndex, 
    navigateToSlide,
    addNewSlide,
    addSlideFromTemplate,
    duplicateSlide,
    deleteSlide,
    moveSlideUp,
    moveSlideDown,
    handleDragEnd,
    updateSlideContent,
    updateSlideTitle,
    removeContent,
    handleAddContent,
  } = useSlideManagement(slides, setSlides);
  
  const {
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
  } = useEditorSelections();
  
  const {
    isStylesOpen,
    isMediaSelectorOpen,
    isShapeSelectorOpen,
    isTableSelectorOpen, 
    isEmbedSelectorOpen,
    showTemplateModal,
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
    handleStyleSelect,
    handleMediaSelect,
    handleShapeSelect,
    handleTableSelect,
    handleEmbedSelect,
  } = useEditorModals();

  // Initialize DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle escape key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Close any open modals
        if (isStylesOpen) onStylesClose();
        if (isMediaSelectorOpen) closeMediaSelector();
        if (isShapeSelectorOpen) closeShapeSelector();
        if (isTableSelectorOpen) closeTableSelector();
        if (isEmbedSelectorOpen) closeEmbedSelector();
        if (showTemplateModal) setShowTemplateModal(false);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        navigateToSlide(Math.min(currentSlideIndex + 1, slides.length - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        navigateToSlide(Math.max(currentSlideIndex - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentSlideIndex,
    slides.length,
    isStylesOpen,
    isMediaSelectorOpen,
    isShapeSelectorOpen,
    isTableSelectorOpen,
    isEmbedSelectorOpen,
    showTemplateModal,
    onStylesClose,
    closeMediaSelector,
    closeShapeSelector,
    closeTableSelector,
    closeEmbedSelector,
    setShowTemplateModal,
    navigateToSlide,
  ]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (editorRef.current?.requestFullscreen) {
        editorRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePresent = () => {
    router.push("/dashboard/create/generate/editor/present");
  };

  const currentSlide = slides[currentSlideIndex];

  // Handle shape selection from EditableSlide
  const handleShapeSelectionChange = (shapeItem: SlideContentItem | null) => {
    setSelectedShape(shapeItem);
    setShowPropertiesPanel(!!shapeItem);
  };

  // Handle table selection from EditableSlide
  const handleTableSelectionChange = (tableItem: SlideContentItem | null) => {
    setSelectedTable(tableItem);
    setShowTablePropertiesPanel(!!tableItem);
  };

  // Handle embed selection from EditableSlide
  const handleEmbedSelectionChange = (embedItem: SlideContentItem | null) => {
    setSelectedEmbed(embedItem);
    setShowEmbedPropertiesPanel(!!embedItem);
  };

  return (
    <div
      ref={editorRef}
      className="flex flex-col h-screen bg-black overflow-hidden"
    >
      {/* Top Navigation Bar */}
      <EditorTopBar 
        presentationTitle={presentationTitle}
        setPresentationTitle={setPresentationTitle}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openMediaSelector={openMediaSelector}
        openShapeSelector={openShapeSelector}
        openTableSelector={openTableSelector}
        openEmbedSelector={openEmbedSelector}
        handlePresent={handlePresent}
      />

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide Thumbnails Panel */}
        {showSlidePanel && (
          <EditorSidebar
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            addNewSlide={addNewSlide}
            setShowTemplateModal={setShowTemplateModal}
          >
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((slide) => slide.id)}
                strategy={verticalListSortingStrategy}
              >
                {slides.map((slide, index) => (
                  <SortableSlide
                    key={slide.id}
                    currentIndex={currentSlideIndex}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === slides.length - 1}
                    slide={slide}
                    onDelete={deleteSlide}
                    onDuplicate={duplicateSlide}
                    onMoveDown={moveSlideDown}
                    onMoveUp={moveSlideUp}
                    onSelect={navigateToSlide}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </EditorSidebar>
        )}

        {/* Main Slide Preview */}
        <div className="flex-1 bg-[#101010] relative flex justify-center items-center">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              isIconOnly
              className="text-gray-400 bg-gray-900/80"
              size="sm"
              variant="flat"
              onPress={() => setShowSlidePanel(!showSlidePanel)}
            >
              {showSlidePanel ? (
                <Icon icon="material-symbols:chevron-left" width={20} />
              ) : (
                <Icon icon="material-symbols:chevron-right" width={20} />
              )}
            </Button>
          </div>

          <div className="w-full max-w-5xl aspect-[16/9] rounded-lg overflow-hidden shadow-2xl">
            <EditableSlide
              slide={currentSlide}
              onUpdateTitle={(title: string) =>
                updateSlideTitle(currentSlide.id, title)
              }
              onUpdateContent={(contentId: string, value: string) =>
                updateSlideContent(currentSlide.id, contentId, value)
              }
              _onAddContent={() => handleAddContent(currentSlide.id)}
              onRemoveContent={(contentId: string) =>
                removeContent(currentSlide.id, contentId)
              }
              onShapeSelect={handleShapeSelectionChange}
              onUpdateShape={updateShapeProperties}
              onTableSelect={handleTableSelectionChange}
              onUpdateTable={(tableId: string, tableData: TableData) => 
                updateTableProperties(tableId, tableData)
              }
              onEmbedSelect={handleEmbedSelectionChange}
            />
          </div>

          {/* Slide Navigation Controls */}
          <SlideNavigationControls 
            currentSlideIndex={currentSlideIndex}
            totalSlides={slides.length}
            navigateToSlide={navigateToSlide}
          />

          {/* Style Controls at Bottom */}
          <StyleControls 
            onStylesOpen={onStylesOpen}
            openMediaSelector={openMediaSelector}
          />

          {/* Right Toolbar */}
          <RightToolbar 
            showPropertiesPanel={showPropertiesPanel}
            setShowPropertiesPanel={setShowPropertiesPanel}
          />
        </div>

        {/* Property Panels */}
        {showPropertiesPanel && selectedShape && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-3 flex justify-between items-center border-b border-gray-800">
              <h3 className="text-white font-medium">Shape Properties</h3>
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
                onPress={() => setShowPropertiesPanel(false)}
              >
                <Icon icon="material-symbols:close" width={16} />
              </Button>
            </div>
            <div className="p-4">
              <ShapeProperties
                selectedShape={selectedShape}
                onUpdateShape={updateShapeProperties}
              />
            </div>
          </div>
        )}

        {/* Table Properties Panel */}
        {showTablePropertiesPanel && selectedTable?.tableData && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-3 flex justify-between items-center border-b border-gray-800">
              <h3 className="text-white font-medium">Table Properties</h3>
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
                onPress={() => setShowTablePropertiesPanel(false)}
              >
                <Icon icon="material-symbols:close" width={16} />
              </Button>
            </div>
            <div className="p-4">
              <TableProperties
                tableData={selectedTable.tableData}
                onUpdateTable={(updatedData: TableData) => {
                  if (selectedTable) {
                    updateTableProperties(selectedTable.id, updatedData);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Embed Properties Panel */}
        {showEmbedPropertiesPanel && selectedEmbed?.embedData && (
          <div className="w-72 bg-gray-900 border-l border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-3 flex justify-between items-center border-b border-gray-800">
              <h3 className="text-white font-medium">Embed Properties</h3>
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
                onPress={() => setShowEmbedPropertiesPanel(false)}
              >
                <Icon icon="material-symbols:close" width={16} />
              </Button>
            </div>
            <div className="p-4">
              <EmbedProperties
                selectedEmbed={selectedEmbed.embedData}
                onUpdateEmbed={(embedId: string, properties: Partial<EmbedData>) =>
                  updateEmbedProperties(embedId, properties)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditorModals 
        isStylesOpen={isStylesOpen}
        isMediaSelectorOpen={isMediaSelectorOpen}
        isShapeSelectorOpen={isShapeSelectorOpen}
        isTableSelectorOpen={isTableSelectorOpen}
        isEmbedSelectorOpen={isEmbedSelectorOpen}
        showTemplateModal={showTemplateModal}
        onStylesClose={onStylesClose}
        closeMediaSelector={closeMediaSelector}
        closeShapeSelector={closeShapeSelector}
        closeTableSelector={closeTableSelector}
        closeEmbedSelector={closeEmbedSelector}
        setShowTemplateModal={setShowTemplateModal}
        handleStyleSelect={handleStyleSelect}
        handleMediaSelect={handleMediaSelect}
        handleShapeSelect={handleShapeSelect}
        handleTableSelect={handleTableSelect}
        handleEmbedSelect={handleEmbedSelect}
        addSlideFromTemplate={addSlideFromTemplate}
      />
    </div>
  );
};

export default EditorContainer;