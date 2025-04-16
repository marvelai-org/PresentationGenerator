// src/components/features/editor/EditorContainer.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import EditorTopBar from './EditorTopBar';
import EditorSidebar from './EditorSidebar';
import EditableSlide from './EditableSlide';
import SortableSlide from './SortableSlide';
import RightToolbar from './RightToolbar';
import useSlideManagement from './hooks/useSlideManagement';
import useEditorModals from './hooks/useEditorModals';
import MediaSelector from './selectors/MediaSelector';
import ShapeSelector from './selectors/ShapeSelector';
import TableSelector from './selectors/TableSelector';
import EmbedSelector from './selectors/EmbedSelector';
import ShapeProperties from './properties/ShapeProperties';
import TableProperties from './properties/TableProperties';
import EmbedProperties from './properties/EmbedProperties';
import { sampleSlides } from './data/sampleSlides';

import { createClientSupabaseClient } from '@/lib/auth/supabase-client';

// Importing the sample slides data (now used as fallback)

// Define the slide content item interface
export interface SlideContentItem {
  id: string;
  type: 'text' | 'image' | 'shape' | 'chart' | 'table' | 'video';
  value: string;
  x: number;
  y: number;
  style?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
    width?: number;
    height?: number;
    [key: string]: any;
  };
}

// Define the slide interface
export interface Slide {
  id: number;
  title: string;
  backgroundColor: string;
  textColor: string;
  content: SlideContentItem[];
}

// Define local interface for editor modals hook
interface EditorModalsHookReturn {
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
  openMediaSelectorWithCallback?: (callback: (mediaUrl: string) => void) => void;
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
  handleTableSelect: (tableOptions: any) => void;
  handleEmbedSelect: (embedData: any) => void;
}

// Define local interface for slide management hook
interface SlideManagementHookReturn {
  currentSlideIndex: number;
  navigateToSlide: (index: number) => void;
  addNewSlide: () => void;
  addSlideFromTemplate: (templateType: any) => void;
  duplicateSlide: (index: number) => void;
  deleteSlide: (index: number) => void;
  moveSlideUp: (index: number) => void;
  moveSlideDown: (index: number) => void;
  handleDragEnd: (event: any) => void;
  updateSlideContent: (slideId: number, contentId: string, value: string) => void;
  updateSlideTitle: (slideId: number, title: string) => void;
  removeContent: (slideId: number, contentId: string) => void;
  handleAddContent: (slideId: number) => void;
  slideTemplates?: any;
}

interface EditorContainerProps {
  initialSlides?: Slide[];
}

const EditorContainer: React.FC<EditorContainerProps> = ({ initialSlides = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presentationId = searchParams.get('id');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');
  const [showSlidePanel, setShowSlidePanel] = useState(true);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [showTablePropertiesPanel, setShowTablePropertiesPanel] = useState(false);
  const [showEmbedPropertiesPanel, setShowEmbedPropertiesPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [presentationTitle, setPresentationTitle] = useState('New Presentation');
  const [selectedShape, setSelectedShape] = useState<SlideContentItem | null>(null);
  const [selectedTable, setSelectedTable] = useState<SlideContentItem | null>(null);
  const [selectedEmbed, setSelectedEmbed] = useState<SlideContentItem | null>(null);

  // Initialize with empty slides, not sample data
  const [slides, setSlides] = useState<Slide[]>(() => {
    // Try to load slides from localStorage
    try {
      const savedSlides = localStorage.getItem('editor_slides');

      if (savedSlides) {
        return JSON.parse(savedSlides);
      }
    } catch (e) {
      console.error('Error loading slides from localStorage:', e);
    }

    return initialSlides;
  });

  // Load slides from Supabase if presentationId exists, otherwise from localStorage
  useEffect(() => {
    async function loadSlides() {
      setIsLoading(true);
      try {
        // If we have a presentation ID, try to load from Supabase first
        if (presentationId) {
          console.log(`Attempting to load presentation ${presentationId} from Supabase`);
          const supabase = createClientSupabaseClient();

          // Get presentation details for the title
          const { data: presentation, error: presentationError } = await supabase
            .from('presentations')
            .select('*')
            .eq('id', presentationId)
            .single();

          if (presentationError) {
            console.error('Error loading presentation details:', presentationError);
          } else if (presentation) {
            setPresentationTitle(presentation.title || 'Untitled Presentation');
          }

          // Fetch presentation slides from Supabase
          const { data: dbSlides, error } = await supabase
            .from('slides')
            .select('*')
            .eq('presentation_id', presentationId)
            .order('order', { ascending: true });

          if (error) {
            console.error('Error loading slides from Supabase:', error);
            throw new Error(`Failed to load slides: ${error.message}`);
          }

          if (dbSlides && dbSlides.length > 0) {
            console.log(`Loaded ${dbSlides.length} slides from Supabase`);

            // Transform slides to match expected format if necessary
            const formattedSlides = dbSlides.map(slide => {
              // Ensure content is parsed if stored as JSON string
              let slideContent;

              try {
                slideContent =
                  typeof slide.content === 'string' ? JSON.parse(slide.content) : slide.content;
              } catch (e) {
                // If parsing fails, use content as is
                slideContent = slide.content;
              }

              return {
                id: slide.id,
                title: slideContent.title || '',
                content: slideContent.content || [],
                backgroundColor: slideContent.backgroundColor || '#000000',
                gradient:
                  slideContent.gradient || 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                textColor: slideContent.textColor || '#FFFFFF',
                image: slideContent.image,
                // Add any other properties needed
              };
            });

            setSlides(formattedSlides);
            setIsLoading(false);

            return; // Exit early since we found slides
          } else {
            console.warn('No slides found for presentation ID:', presentationId);
          }
        }

        // If no presentation ID or no slides found, try localStorage
        const generatedSlides = localStorage.getItem('generatedSlides');
        const savedEditorSlides = localStorage.getItem('editor_slides');

        if (generatedSlides) {
          console.log('Loading generated slides from localStorage');
          const parsedSlides = JSON.parse(generatedSlides);

          setSlides(parsedSlides);

          // After loading generated slides, also save them to editor_slides for consistency
          localStorage.setItem('editor_slides', generatedSlides);

          // Clear the generatedSlides key to prevent reloading the same slides again
          // This ensures any edits are properly saved under editor_slides
          localStorage.removeItem('generatedSlides');
        } else if (savedEditorSlides) {
          console.log('Loading editor slides from localStorage');
          setSlides(JSON.parse(savedEditorSlides));
        } else {
          console.log('No saved slides found, using sample slides as fallback');
          setSlides(sampleSlides);
        }
      } catch (error) {
        console.error('Error loading slides:', error);
        // Fall back to sample slides if everything else fails
        setSlides(sampleSlides);
      } finally {
        setIsLoading(false);
      }
    }

    loadSlides();
  }, [presentationId]);

  // Custom implementation of media select handler
  const [customMediaSelectHandler, setCustomMediaSelectHandler] = useState<
    ((url: string) => void) | null
  >(null);

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
  } = useSlideManagement(slides, setSlides) as any;

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
    handleMediaSelect: baseMediaSelect,
    handleShapeSelect,
    handleTableSelect,
    handleEmbedSelect,
  } = useEditorModals() as any;

  // Create a handler that can be overridden
  const handleMediaSelect = useCallback(
    (mediaUrl: string) => {
      if (customMediaSelectHandler) {
        customMediaSelectHandler(mediaUrl);
        setCustomMediaSelectHandler(null);
      } else {
        baseMediaSelect(mediaUrl);
      }
    },
    [baseMediaSelect, customMediaSelectHandler]
  );

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
      if (e.key === 'Escape') {
        // Close any open modals
        if (isStylesOpen) onStylesClose();
        if (isMediaSelectorOpen) closeMediaSelector();
        if (isShapeSelectorOpen) closeShapeSelector();
        if (isTableSelectorOpen) closeTableSelector();
        if (isEmbedSelectorOpen) closeEmbedSelector();
        if (showTemplateModal) setShowTemplateModal(false);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateToSlide(Math.min(currentSlideIndex + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateToSlide(Math.max(currentSlideIndex - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
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
    // Save the slides to localStorage before navigating
    try {
      localStorage.setItem('editor_slides', JSON.stringify(slides));
    } catch (error) {
      console.error('Error saving slides to localStorage:', error);
    }
    router.push('/dashboard/create/editor/present');
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

  // Add an image content item to the slide
  const addImageContentItem = useCallback(
    (imageUrl: string) => {
      const slidesCopy = [...slides];
      const slideIndex = currentSlideIndex;

      if (slideIndex !== -1) {
        // Create a new image content item
        const newImageItem: SlideContentItem = {
          id: `image-${Date.now()}`,
          type: 'image',
          value: imageUrl,
          x: 400, // Position on the right side of the slide
          y: 150, // Position in the middle vertically
          width: 300,
          height: 200,
          style: {
            opacity: 1,
            zIndex: slidesCopy[slideIndex].content.length + 1,
          },
        };

        // Add the image to the current slide
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: [...slidesCopy[slideIndex].content, newImageItem],
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides, currentSlideIndex]
  );

  // Handle adding a side-by-side text and image layout
  const addTextImageLayout = useCallback(() => {
    // Define what will happen when the media is selected
    const handleImageSelect = (imageUrl: string) => {
      const slidesCopy = [...slides];
      const slideIndex = currentSlideIndex;

      if (slideIndex !== -1) {
        // Create a new text content item for the left side
        const newTextItem: SlideContentItem = {
          id: `content-${Date.now()}`,
          type: 'text',
          value: 'Add text content here...',
          x: 50, // Position on the left side
          y: 150, // Position in the middle vertically
          width: 300,
        };

        // Create a new image content item for the right side
        const newImageItem: SlideContentItem = {
          id: `image-${Date.now() + 1}`,
          type: 'image',
          value: imageUrl,
          x: 400, // Position on the right side
          y: 150, // Position in the middle vertically
          width: 300,
          height: 200,
          style: {
            opacity: 1,
            zIndex: slidesCopy[slideIndex].content.length + 1,
          },
        };

        // Add both content items to the current slide
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: [...slidesCopy[slideIndex].content, newTextItem, newImageItem],
        };

        setSlides(slidesCopy);
      }
    };

    // Set the custom handler and open the selector
    setCustomMediaSelectHandler(() => handleImageSelect);
    openMediaSelector();
  }, [slides, setSlides, currentSlideIndex, openMediaSelector]);

  // Function to save slides to localStorage
  const saveSlides = useCallback((slidesToSave: Slide[]) => {
    try {
      localStorage.setItem('editor_slides', JSON.stringify(slidesToSave));
    } catch (e) {
      console.error('Error saving slides to localStorage:', e);
    }
  }, []);

  // Update slides and save to localStorage
  const updateSlides = useCallback(
    (newSlides: Slide[]) => {
      setSlides(newSlides);
      saveSlides(newSlides);
    },
    [saveSlides]
  );

  return (
    <div ref={editorRef} className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Top Navigation Bar */}
      <EditorTopBar
        activeTab={activeTab}
        addTextImageLayout={addTextImageLayout}
        handlePresent={handlePresent}
        openEmbedSelector={openEmbedSelector}
        openMediaSelector={openMediaSelector}
        openShapeSelector={openShapeSelector}
        openTableSelector={openTableSelector}
        presentationTitle={presentationTitle}
        setActiveTab={setActiveTab}
        setPresentationTitle={setPresentationTitle}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div
              aria-label="loading"
              className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-white text-lg">Loading your presentation...</p>
          </div>
        </div>
      ) : (
        /* Main Editor Area */
        <div className="flex flex-1 overflow-hidden">
          {/* Slide Thumbnails Panel */}
          {showSlidePanel && (
            <EditorSidebar
              addNewSlide={addNewSlide}
              currentSlideIndex={currentSlideIndex}
              setShowTemplateModal={setShowTemplateModal}
              slides={slides}
            >
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                sensors={sensors}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={slides.map(slide => slide.id)}
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
                _onAddContent={() => handleAddContent(currentSlide.id)}
                slide={currentSlide}
                onEmbedSelect={handleEmbedSelectionChange}
                onRemoveContent={(contentId: string) => removeContent(currentSlide.id, contentId)}
                onShapeSelect={handleShapeSelectionChange}
                onTableSelect={handleTableSelectionChange}
                onUpdateContent={(contentId: string, value: string) =>
                  updateSlideContent(currentSlide.id, contentId, value)
                }
                onUpdateShape={(shapeId: string, properties: Partial<SlideContentItem>) => {
                  const slidesCopy = [...slides];
                  const slideIndex = slidesCopy.findIndex(s => s.id === currentSlide.id);

                  if (slideIndex !== -1) {
                    const contentIndex = slidesCopy[slideIndex].content.findIndex(
                      c => c.id === shapeId
                    );

                    if (contentIndex !== -1) {
                      slidesCopy[slideIndex].content[contentIndex] = {
                        ...slidesCopy[slideIndex].content[contentIndex],
                        ...properties,
                      };

                      setSlides(slidesCopy);
                    }
                  }
                }}
                onUpdateTable={(tableId, tableData) => {
                  const slidesCopy = [...slides];
                  const slideIndex = slidesCopy.findIndex(s => s.id === currentSlide.id);

                  if (slideIndex !== -1) {
                    const contentIndex = slidesCopy[slideIndex].content.findIndex(
                      c => c.id === tableId
                    );

                    if (contentIndex !== -1) {
                      slidesCopy[slideIndex].content[contentIndex] = {
                        ...slidesCopy[slideIndex].content[contentIndex],
                        tableData,
                      };

                      setSlides(slidesCopy);
                    }
                  }
                }}
                onUpdateTitle={(title: string) => updateSlideTitle(currentSlide.id, title)}
              />
            </div>

            {/* Right Side Properties Panel */}
            <RightToolbar
              setShowPropertiesPanel={show => {
                setShowPropertiesPanel(show);
                if (!show) {
                  setSelectedShape(null);
                  setSelectedTable(null);
                  setSelectedEmbed(null);
                  setShowTablePropertiesPanel(false);
                  setShowEmbedPropertiesPanel(false);
                }
              }}
              showPropertiesPanel={
                showPropertiesPanel || showTablePropertiesPanel || showEmbedPropertiesPanel
              }
            />

            {/* Properties Panels */}
            {showPropertiesPanel && selectedShape && (
              <ShapeProperties
                selectedShape={selectedShape}
                onUpdateShape={(shapeId, properties) => {
                  const slidesCopy = [...slides];
                  const slideIndex = slidesCopy.findIndex(s => s.id === currentSlide.id);

                  if (slideIndex !== -1) {
                    const contentIndex = slidesCopy[slideIndex].content.findIndex(
                      c => c.id === shapeId
                    );

                    if (contentIndex !== -1) {
                      slidesCopy[slideIndex].content[contentIndex] = {
                        ...slidesCopy[slideIndex].content[contentIndex],
                        ...properties,
                      };

                      setSlides(slidesCopy);
                    }
                  }
                }}
              />
            )}

            {showTablePropertiesPanel && selectedTable && selectedTable.tableData && (
              <TableProperties
                tableData={selectedTable.tableData}
                onUpdateTable={updatedData => {
                  const slidesCopy = [...slides];
                  const slideIndex = slidesCopy.findIndex(s => s.id === currentSlide.id);

                  if (slideIndex !== -1 && selectedTable) {
                    const contentIndex = slidesCopy[slideIndex].content.findIndex(
                      c => c.id === selectedTable.id
                    );

                    if (contentIndex !== -1) {
                      slidesCopy[slideIndex].content[contentIndex] = {
                        ...slidesCopy[slideIndex].content[contentIndex],
                        tableData: updatedData,
                      };

                      setSlides(slidesCopy);
                    }
                  }
                }}
              />
            )}

            {showEmbedPropertiesPanel && selectedEmbed && selectedEmbed.embedData && (
              <EmbedProperties
                selectedEmbed={selectedEmbed.embedData}
                onUpdateEmbed={(embedId, properties) => {
                  const slidesCopy = [...slides];
                  const slideIndex = slidesCopy.findIndex(s => s.id === currentSlide.id);

                  if (slideIndex !== -1) {
                    const contentIndex = slidesCopy[slideIndex].content.findIndex(
                      c => c.id === embedId
                    );

                    if (
                      contentIndex !== -1 &&
                      slidesCopy[slideIndex].content[contentIndex].embedData
                    ) {
                      slidesCopy[slideIndex].content[contentIndex] = {
                        ...slidesCopy[slideIndex].content[contentIndex],
                        embedData: {
                          ...slidesCopy[slideIndex].content[contentIndex].embedData!,
                          ...properties,
                        },
                      };

                      setSlides(slidesCopy);
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={closeMediaSelector}
        onSelect={handleMediaSelect}
      />

      <ShapeSelector
        isOpen={isShapeSelectorOpen}
        onClose={closeShapeSelector}
        onSelect={shapeType => {
          // Add a new shape to the current slide
          const slidesCopy = [...slides];
          const slideIndex = currentSlideIndex;

          if (slideIndex !== -1) {
            const newShapeItem: SlideContentItem = {
              id: `shape-${Date.now()}`,
              type: 'shape',
              value: shapeType,
              x: 100,
              y: 100,
              width: 100,
              height: 100,
              style: {
                backgroundColor: '#6366f1',
                borderColor: '#4338ca',
                borderWidth: 2,
                opacity: 1,
                zIndex: slidesCopy[slideIndex].content.length + 1,
              },
            };

            slidesCopy[slideIndex].content.push(newShapeItem);
            setSlides(slidesCopy);
          }
        }}
      />

      <TableSelector
        isOpen={isTableSelectorOpen}
        onClose={closeTableSelector}
        onSelect={tableOptions => {
          // Add a new table to the current slide
          const slidesCopy = [...slides];
          const slideIndex = currentSlideIndex;

          if (slideIndex !== -1) {
            // Create empty cells object with proper keys
            const cells: Record<string, { id: string; content: string }> = {};

            for (let r = 0; r < tableOptions.rows; r++) {
              for (let c = 0; c < tableOptions.columns; c++) {
                cells[`${r}:${c}`] = {
                  id: `cell-${r}-${c}-${Date.now()}`,
                  content: '',
                };
              }
            }

            const newTableItem: SlideContentItem = {
              id: `table-${Date.now()}`,
              type: 'table',
              value: 'table',
              x: 50,
              y: 50,
              width: 400,
              height: 200,
              tableData: {
                rows: tableOptions.rows,
                columns: tableOptions.columns,
                cells: cells,
                hasHeader: tableOptions.hasHeader,
                style: {
                  headerTextColor: '#ffffff',
                  bodyTextColor: '#000000',
                  borderColor: '#d1d5db',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  headerBackgroundColor: '#6366f1',
                  bodyBackgroundColor: '#ffffff',
                },
              },
              style: {
                zIndex: slidesCopy[slideIndex].content.length + 1,
              },
            };

            slidesCopy[slideIndex].content.push(newTableItem);
            setSlides(slidesCopy);
          }
        }}
      />

      <EmbedSelector
        isOpen={isEmbedSelectorOpen}
        onClose={closeEmbedSelector}
        onSelect={embedData => {
          // Add a new embed to the current slide
          const slidesCopy = [...slides];
          const slideIndex = currentSlideIndex;

          if (slideIndex !== -1) {
            const newEmbedItem: SlideContentItem = {
              id: `embed-${Date.now()}`,
              type: 'embed',
              value: embedData.type,
              x: 50,
              y: 100,
              width: 500,
              height: 300,
              embedData: embedData,
              style: {
                zIndex: slidesCopy[slideIndex].content.length + 1,
              },
            };

            slidesCopy[slideIndex].content.push(newEmbedItem);
            setSlides(slidesCopy);
          }
        }}
      />
    </div>
  );
};

export default EditorContainer;
