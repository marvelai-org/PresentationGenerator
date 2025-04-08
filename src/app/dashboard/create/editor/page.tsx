"use client";

import { useState, useRef, useEffect } from "react";
import {
  Button,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Tab,
  Tabs,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";

import SlideStyles from "@/components/features/application/editor/styles/SlideStyles";
import MediaSelector from "@/components/features/application/editor/selectors/MediaSelector";
import ShapeSelector from "@/components/features/application/editor/selectors/ShapeSelector";
import ShapeProperties from "@/components/features/application/editor/properties/ShapeProperties";
import EditableSlide from "@/components/features/application/editor/EditableSlide";
import TableSelector, {
  TableOptions,
} from "@/components/features/application/editor/selectors/TableSelector";
import TableProperties from "@/components/features/application/editor/properties/TableProperties";
import { TableData } from "@/types/editor";
import EmbedSelector, {
  EmbedData,
} from "@/components/features/application/editor/selectors/EmbedSelector";
import EmbedProperties from "@/components/features/application/editor/properties/EmbedProperties";

// Define interfaces for slide content
interface SlideContentItem {
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
  tableData?: TableData; // Add tableData property for table content
  embedData?: EmbedData; // Add embedData property for embed content
}

// Define the full slide interface
interface Slide {
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
  shapes?: SlideContentItem[]; // Array of shape elements
}

// Sample slide data
const sampleSlides: Slide[] = [
  {
    id: 1,
    title: "Can We REALLY Stop Climate Change?",
    subtitle:
      "The future of our planet is at stake. Let's explore the science, the impacts, and the potential solutions to climate change.",
    author: "Talha Sabri",
    editedTime: "about 1 month ago",
    image: "/climate-earth.jpg",
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
    textColor: "#FFFFFF",
    content: [],
  },
  {
    id: 2,
    title: "The Science: Understanding the Greenhouse Effect",
    content: [
      {
        id: "content-1",
        type: "text",
        value:
          "Greenhouse gases like carbon dioxide trap heat in our atmosphere",
      },
      {
        id: "content-2",
        type: "text",
        value:
          "Human activities, particularly burning fossil fuels, increase these gases",
      },
      {
        id: "content-3",
        type: "text",
        value: "This warming effect is causing global temperature rise",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 3,
    title: "Current Impacts: What We're Already Seeing",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Rising sea levels threatening coastal communities",
      },
      {
        id: "content-2",
        type: "text",
        value: "More frequent and intense extreme weather events",
      },
      {
        id: "content-3",
        type: "text",
        value: "Disruption of ecosystems and biodiversity loss",
      },
      {
        id: "content-4",
        type: "text",
        value: "Agricultural challenges and food security risks",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 4,
    title: "Projections: Scenarios and Their Implications",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Best case: Limiting warming to 1.5°C requires immediate action",
      },
      {
        id: "content-2",
        type: "text",
        value:
          "Business as usual: 3-4°C warming with catastrophic consequences",
      },
      {
        id: "content-3",
        type: "text",
        value: "Tipping points could trigger irreversible changes",
      },
      {
        id: "content-4",
        type: "text",
        value: "Economic costs increase dramatically with delay",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 5,
    title: "Solutions: Addressing the Challenge",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Transition to renewable energy sources",
      },
      {
        id: "content-2",
        type: "text",
        value: "Improve energy efficiency across sectors",
      },
      {
        id: "content-3",
        type: "text",
        value: "Develop carbon capture technologies",
      },
      {
        id: "content-4",
        type: "text",
        value: "Protect and restore natural carbon sinks",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 6,
    title: "Policy Approaches: Government Action",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Carbon pricing mechanisms",
      },
      {
        id: "content-2",
        type: "text",
        value: "Regulatory standards for emissions",
      },
      {
        id: "content-3",
        type: "text",
        value: "Investment in clean technology research",
      },
      {
        id: "content-4",
        type: "text",
        value: "International cooperation and climate agreements",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 7,
    title: "Individual Impact: What Can We Do?",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Reduce personal carbon footprint",
      },
      {
        id: "content-2",
        type: "text",
        value: "Advocate for climate policies",
      },
      {
        id: "content-3",
        type: "text",
        value: "Support sustainable businesses",
      },
      {
        id: "content-4",
        type: "text",
        value: "Community engagement and education",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
  {
    id: 8,
    title: "Path Forward: Challenges and Opportunities",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Balancing economic development with environmental protection",
      },
      {
        id: "content-2",
        type: "text",
        value: "Ensuring just transition for vulnerable communities",
      },
      {
        id: "content-3",
        type: "text",
        value: "Technological innovation as both challenge and opportunity",
      },
      {
        id: "content-4",
        type: "text",
        value: "Building resilience while pursuing mitigation",
      },
    ],
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
  },
];

// Templates data for template picker
const _templates = [
  { id: 1, name: "Minimal Dark", thumbnail: "/templates/minimal-dark.jpg" },
  { id: 2, name: "Corporate Blue", thumbnail: "/templates/corporate-blue.jpg" },
  { id: 3, name: "Creative Red", thumbnail: "/templates/creative-red.jpg" },
  { id: 4, name: "Academic", thumbnail: "/templates/academic.jpg" },
  { id: 5, name: "Pitch Deck", thumbnail: "/templates/pitch-deck.jpg" },
];

// Define slide templates for quick creation
type TemplateType = "title" | "textAndImage" | "bulletList";

const slideTemplates: Record<TemplateType, Partial<Slide>> = {
  title: {
    title: "Presentation Title",
    subtitle: "Your subtitle goes here",
    author: "Your Name",
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
    textColor: "#FFFFFF",
    content: [],
  },
  textAndImage: {
    title: "Text & Image",
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
    textColor: "#FFFFFF",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "Main point goes here",
      },
      {
        id: "content-2",
        type: "text",
        value: "Supporting detail goes here",
      },
      {
        id: "content-3",
        type: "image",
        value: "/placeholder-image.jpg",
      },
    ],
  },
  bulletList: {
    title: "Bullet Points",
    backgroundColor: "#000000",
    gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
    textColor: "#FFFFFF",
    content: [
      {
        id: "content-1",
        type: "text",
        value: "First bullet point",
      },
      {
        id: "content-2",
        type: "text",
        value: "Second bullet point",
      },
      {
        id: "content-3",
        type: "text",
        value: "Third bullet point",
      },
      {
        id: "content-4",
        type: "text",
        value: "Fourth bullet point",
      },
    ],
  },
};

// Define props for the SortableSlide component
interface SortableSlideProps {
  slide: Slide;
  index: number;
  currentIndex: number;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onDuplicate: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

// Sortable slide thumbnail component
const SortableSlide: React.FC<SortableSlideProps> = ({
  slide,
  index,
  currentIndex,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className="group relative" style={style}>
      <button
        className={`rounded-md overflow-hidden cursor-pointer relative w-full text-left transition-all ${currentIndex === index ? "ring-2 ring-indigo-600" : "hover:ring-1 hover:ring-gray-500"}`}
        onClick={() => onSelect(index)}
      >
        <div className="absolute top-1 left-2 text-xs text-white bg-black/50 px-1 rounded-sm">
          {index + 1}
        </div>

        <div
          className="h-28 bg-black p-2 text-center flex flex-col justify-center"
          style={{
            background: slide.gradient || slide.backgroundColor || "black",
          }}
        >
          {index === 0 ? (
            <>
              <div className="text-white text-xs font-bold truncate">
                {slide.title}
              </div>
              <div className="text-white text-[8px] mt-1 truncate">
                {slide.subtitle}
              </div>
            </>
          ) : (
            <>
              <div className="text-white text-xs font-bold truncate">
                {slide.title}
              </div>
              <div className="text-white text-[8px] mt-1">
                <ul className="list-disc list-inside">
                  {slide.content?.slice(0, 2).map((item, i) => (
                    <li key={i} className="truncate">
                      {item.value}
                    </li>
                  ))}
                  {(slide.content?.length || 0) > 2 && <li>...</li>}
                </ul>
              </div>
            </>
          )}
        </div>
      </button>

      {/* Slide actions overlay */}
      <div className="absolute top-0 right-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip content="Drag to reorder" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            {...attributes}
            {...listeners}
          >
            <Icon icon="material-symbols:drag-indicator" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Move up" placement="right">
          <button
            className={`p-1 bg-black/70 text-gray-300 hover:text-white ${isFirst ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isFirst}
            onClick={() => !isFirst && onMoveUp(index)}
          >
            <Icon icon="material-symbols:arrow-upward" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Move down" placement="right">
          <button
            className={`p-1 bg-black/70 text-gray-300 hover:text-white ${isLast ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLast}
            onClick={() => !isLast && onMoveDown(index)}
          >
            <Icon icon="material-symbols:arrow-downward" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Duplicate slide" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            onClick={() => onDuplicate(index)}
          >
            <Icon icon="material-symbols:content-copy" width={16} />
          </button>
        </Tooltip>

        <Tooltip content="Delete slide" placement="right">
          <button
            className="p-1 bg-black/70 text-gray-300 hover:text-white"
            onClick={() => onDelete(index)}
          >
            <Icon icon="material-symbols:delete" width={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

// EditableSlide component props type
interface _EditableSlideProps {
  slide: Slide;
  _onAddContent: (slideId: number) => void;
  onRemoveContent: (contentId: string) => void;
  onUpdateContent: (contentId: string, value: string) => void;
  onUpdateTitle: (title: string) => void;
  onShapeSelect: (shape: SlideContentItem | null) => void;
  onTableSelect: (table: SlideContentItem | null) => void;
  onEmbedSelect: (embed: SlideContentItem | null) => void;
  onUpdateShape: (
    shapeId: string,
    properties: Partial<SlideContentItem["style"]>,
  ) => void;
  onUpdateTable: (tableId: string, properties: Partial<TableData>) => void;
}

// Update the EmbedSelector component type
interface _EmbedSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (embedData: EmbedData) => void;
}

// Define a ShapeContentItem type alias to match what ShapeProperties expects
type ShapeContentItem = Omit<SlideContentItem, "style"> & {
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
};

export default function PresentationEditorPage() {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSlidePanel, setShowSlidePanel] = useState(true);
  const [activeTab, setActiveTab] = useState("edit");
  const [presentationTitle, setPresentationTitle] = useState(
    "Can We REALLY Stop Climate Change?",
  );
  const [slides, setSlides] = useState<Slide[]>(sampleSlides);
  const editorRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: _isOpen,
    onOpen: _onOpen,
    onClose: _onClose,
  } = useDisclosure();
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
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedShape, setSelectedShape] = useState<SlideContentItem | null>(
    null,
  );
  const [selectedTable, setSelectedTable] = useState<SlideContentItem | null>(
    null,
  );
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [showTablePropertiesPanel, setShowTablePropertiesPanel] =
    useState(false);
  const [selectedEmbed, setSelectedEmbed] = useState<SlideContentItem | null>(
    null,
  );
  const [showEmbedPropertiesPanel, setShowEmbedPropertiesPanel] =
    useState(false);

  const _currentSlide = slides[currentSlideIndex];

  // Initialize DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // Add a useEffect for handling escape key to close modals
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
  ]);

  const navigateToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const _toggleFullscreen = () => {
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

  const addNewSlide = () => {
    // Create a basic blank slide
    const newSlide: Slide = {
      id: Date.now(), // Generate unique ID
      title: "New Slide",
      backgroundColor: "#000000",
      gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
      textColor: "#FFFFFF",
      content: [],
    };

    const updatedSlides = [...slides, newSlide];

    setSlides(updatedSlides);
    // Navigate to the new slide
    navigateToSlide(updatedSlides.length - 1);
  };

  const addSlideFromTemplate = (templateType: TemplateType) => {
    const template = slideTemplates[templateType];

    if (!template) return;

    // Create a new slide with required fields and template values
    const newSlide: Slide = {
      id: Date.now(),
      title: template.title || "New Slide",
      backgroundColor: template.backgroundColor || "#1a0e2e",
      content: template.content || [],
      subtitle: template.subtitle,
      author: template.author,
      editedTime: template.editedTime,
      image: template.image,
      gradient: template.gradient,
      textColor: template.textColor,
      shapes: template.shapes,
    };

    const updatedSlides = [...slides, newSlide];

    setSlides(updatedSlides);
    navigateToSlide(updatedSlides.length - 1);
    setShowTemplateModal(false);
  };

  const duplicateSlide = (index: number) => {
    const slideToClone = slides[index];

    // Deep clone the slide
    const clonedSlide: Slide = {
      ...JSON.parse(JSON.stringify(slideToClone)),
      id: Date.now(), // Give the cloned slide a new ID
      title: `${slideToClone.title} (Copy)`,
    };

    // Insert the cloned slide after the original
    const updatedSlides = [...slides];

    updatedSlides.splice(index + 1, 0, clonedSlide);

    setSlides(updatedSlides);
    // Navigate to the cloned slide
    navigateToSlide(index + 1);
  };

  const deleteSlide = (index: number) => {
    if (slides.length <= 1) {
      // Don't allow deleting the last slide
      return;
    }

    // Create a copy without the slide to delete
    const updatedSlides = slides.filter((_, i) => i !== index);

    setSlides(updatedSlides);

    // Adjust current slide index if needed
    if (currentSlideIndex >= updatedSlides.length) {
      navigateToSlide(updatedSlides.length - 1);
    } else if (currentSlideIndex === index) {
      // If the deleted slide was the current one, stay at the same index (which is now a different slide)
      // or go to the previous one if this was the last slide
      navigateToSlide(Math.min(currentSlideIndex, updatedSlides.length - 1));
    }
  };

  const moveSlideUp = (index: number) => {
    if (index <= 0) return; // Can't move the first slide up

    const updatedSlides = [...slides];

    // Swap the slide with the one above it
    [updatedSlides[index - 1], updatedSlides[index]] = [
      updatedSlides[index],
      updatedSlides[index - 1],
    ];

    setSlides(updatedSlides);

    // Keep focus on the moved slide
    navigateToSlide(index - 1);
  };

  const moveSlideDown = (index: number) => {
    if (index >= slides.length - 1) return; // Can't move the last slide down

    const updatedSlides = [...slides];

    // Swap the slide with the one below it
    [updatedSlides[index], updatedSlides[index + 1]] = [
      updatedSlides[index + 1],
      updatedSlides[index],
    ];

    setSlides(updatedSlides);

    // Keep focus on the moved slide
    navigateToSlide(index + 1);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Find the indices of the slides
      const oldIndex = slides.findIndex((slide) => slide.id === active.id);
      const newIndex = slides.findIndex((slide) => slide.id === over.id);

      // Reorder the slides
      const updatedSlides = [...slides];
      const [movedSlide] = updatedSlides.splice(oldIndex, 1);

      updatedSlides.splice(newIndex, 0, movedSlide);

      setSlides(updatedSlides);

      // Update current slide index to follow the moved slide
      if (currentSlideIndex === oldIndex) {
        navigateToSlide(newIndex);
      } else if (
        // If the current slide was between the old and new positions
        (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) ||
        (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex)
      ) {
        // Adjust the current slide index to account for the shift
        navigateToSlide(
          oldIndex < newIndex ? currentSlideIndex - 1 : currentSlideIndex + 1,
        );
      }
    }
  };

  const handleStyleSelect = (_style: string) => {
    // Logic to apply the selected style
    onStylesClose();
  };

  const handleMediaSelect = (_mediaUrl: string) => {
    // Logic to add the selected media
    closeMediaSelector();
  };

  const handleShapeSelect = (shape: string) => {
    // Create a new shape content item
    const newShape: SlideContentItem = {
      id: `shape-${Date.now()}`,
      type: "shape",
      value: shape,
      x: 200, // Default position
      y: 200,
      width: 100, // Default size
      height: 100,
      style: {
        color: "#FFFFFF",
        backgroundColor: "#6366F1", // Indigo color
        borderColor: "#4F46E5",
        borderStyle: shape.includes("outline") ? "solid" : "none",
        borderWidth: 2,
        opacity: 1,
        zIndex: 1,
      },
    };

    // Add shape to the current slide
    const updatedSlides = [...slides];
    const currentSlide = updatedSlides[currentSlideIndex];

    currentSlide.content.push(newShape);
    setSlides(updatedSlides);

    // Select the new shape and show properties panel
    setSelectedShape(newShape);
    setShowPropertiesPanel(true);

    closeShapeSelector();
  };

  const handleShapeSelectionChange = (shapeItem: SlideContentItem | null) => {
    setSelectedShape(shapeItem);
    setShowPropertiesPanel(!!shapeItem);
  };

  const handleTableSelect = (tableOptions: TableOptions) => {
    // Create a new table content item
    const tableData: TableData = {
      rows: tableOptions.rows,
      columns: tableOptions.columns,
      hasHeader: tableOptions.hasHeader,
      hasFooter: tableOptions.hasFooter,
      hasHeaderColumn: tableOptions.hasHeaderColumn,
      alternatingRows: tableOptions.alternatingRows,
      cells: {},
      style: {
        borderColor: tableOptions.borderColor || "#E5E7EB",
        borderWidth: tableOptions.borderWidth || 1,
        borderStyle: tableOptions.borderStyle || "solid",
        headerBackgroundColor: tableOptions.headerBackgroundColor || "#4F46E5",
        headerTextColor: tableOptions.headerTextColor || "#FFFFFF",
        bodyBackgroundColor: tableOptions.bodyBackgroundColor || "#FFFFFF",
        bodyTextColor: tableOptions.bodyTextColor || "#000000",
        footerBackgroundColor: tableOptions.footerBackgroundColor || "#F3F4F6",
        footerTextColor: tableOptions.footerTextColor || "#000000",
        width: "100%",
      },
    };

    // Initialize cells with default content
    for (let rowIndex = 0; rowIndex < tableOptions.rows; rowIndex++) {
      for (let colIndex = 0; colIndex < tableOptions.columns; colIndex++) {
        const cellId = `cell-${rowIndex}-${colIndex}`;
        let content = "";

        // Set default content based on cell position
        if (tableOptions.hasHeader && rowIndex === 0) {
          content = `Header ${colIndex + 1}`;
        } else if (
          tableOptions.hasHeaderColumn &&
          colIndex === 0 &&
          rowIndex !== 0
        ) {
          content = `Row ${rowIndex}`;
        } else if (
          tableOptions.hasFooter &&
          rowIndex === tableOptions.rows - 1
        ) {
          content = `Footer ${colIndex + 1}`;
        } else {
          content = `Cell ${rowIndex},${colIndex}`;
        }

        tableData.cells[cellId] = {
          id: cellId,
          content,
          style: {},
        };
      }
    }

    // Create new table content item
    const newTableItem: SlideContentItem = {
      id: `table-${Date.now()}`,
      type: "table",
      value: "table",
      x: 100, // Default position
      y: 100,
      width: 500, // Default size
      height: 300,
      tableData,
    };

    // Add table to the current slide
    const updatedSlides = [...slides];
    const currentSlide = updatedSlides[currentSlideIndex];

    currentSlide.content.push(newTableItem);
    setSlides(updatedSlides);

    // Select the new table and show properties panel
    setSelectedTable(newTableItem);
    setShowTablePropertiesPanel(true);

    closeTableSelector();
  };

  const handleTableSelectionChange = (tableItem: SlideContentItem | null) => {
    setSelectedTable(tableItem);
    setShowTablePropertiesPanel(!!tableItem);
  };

  // Add this function to update embed properties
  const updateEmbedProperties = (
    embedId: string,
    properties: Partial<EmbedData>,
  ) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === _currentSlide.id);

    if (slideIndex !== -1) {
      const slide = slidesCopy[slideIndex];
      const contentIndex = slide.content.findIndex(
        (item) => item.id === embedId,
      );

      if (contentIndex !== -1 && slide.content[contentIndex].embedData) {
        slidesCopy[slideIndex] = {
          ...slide,
          content: [...slide.content],
        };

        slidesCopy[slideIndex].content[contentIndex] = {
          ...slide.content[contentIndex],
          embedData: {
            ...slide.content[contentIndex].embedData,
            ...properties,
          },
        };

        setSlides(slidesCopy);
      }
    }
  };

  // Add this function to update table properties
  const updateTableProperties = (
    tableId: string,
    updatedData: Partial<TableData>,
  ) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === _currentSlide.id);

    if (slideIndex !== -1) {
      const slide = slidesCopy[slideIndex];
      const contentIndex = slide.content.findIndex(
        (item) => item.id === tableId,
      );

      if (contentIndex !== -1 && slide.content[contentIndex].tableData) {
        slidesCopy[slideIndex] = {
          ...slide,
          content: [...slide.content],
        };

        slidesCopy[slideIndex].content[contentIndex] = {
          ...slide.content[contentIndex],
          tableData: {
            ...slide.content[contentIndex].tableData,
            ...updatedData,
          },
        };

        setSlides(slidesCopy);
      }
    }
  };

  // Define a helper function to convert EmbedData to SlideContentItem
  const createEmbedItem = (embedData: EmbedData): SlideContentItem => {
    return {
      id: `embed-${Date.now()}`,
      type: "embed",
      value: embedData.url,
      x: 200, // Default position
      y: 200,
      width: embedData.width || 560,
      height: embedData.height || 315,
      embedData,
    };
  };

  // Handle embed selection from the selector modal
  const handleEmbedSelect = (embedData: EmbedData) => {
    // Create a new embed content item
    const newEmbed = createEmbedItem(embedData);

    // Add embed to the current slide
    const updatedSlides = [...slides];
    const currentSlide = updatedSlides[currentSlideIndex];

    currentSlide.content.push(newEmbed);
    setSlides(updatedSlides);

    // Select the new embed and show properties panel
    setSelectedEmbed(newEmbed);
    setShowEmbedPropertiesPanel(true);

    closeEmbedSelector();
  };

  const _findEmbedById = (id: string) => {
    return slides[currentSlideIndex].content.find(
      (item) => item.id === id && item.type === "embed",
    );
  };

  // Add new content to slide
  const handleAddContent = (slideId: number) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

    if (slideIndex !== -1) {
      const newContentItem: SlideContentItem = {
        id: `content-${Date.now()}`,
        type: "text",
        value: "New content",
      };

      slidesCopy[slideIndex] = {
        ...slidesCopy[slideIndex],
        content: [...slidesCopy[slideIndex].content, newContentItem],
      };

      setSlides(slidesCopy);
    }
  };

  // Remove content from slide
  const handleRemoveContent = (slideId: number, contentId: string) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

    if (slideIndex !== -1) {
      slidesCopy[slideIndex] = {
        ...slidesCopy[slideIndex],
        content: slidesCopy[slideIndex].content.filter(
          (item) => item.id !== contentId,
        ),
      };

      setSlides(slidesCopy);
    }
  };

  // Update slide content
  const updateSlideContent = (
    slideId: number,
    contentId: string,
    value: string,
  ) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

    if (slideIndex !== -1) {
      const contentIndex = slidesCopy[slideIndex].content.findIndex(
        (item) => item.id === contentId,
      );

      if (contentIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: [...slidesCopy[slideIndex].content],
        };

        slidesCopy[slideIndex].content[contentIndex] = {
          ...slidesCopy[slideIndex].content[contentIndex],
          value,
        };

        setSlides(slidesCopy);
      }
    }
  };

  // Update slide title
  const updateSlideTitle = (slideId: number, title: string) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

    if (slideIndex !== -1) {
      slidesCopy[slideIndex] = {
        ...slidesCopy[slideIndex],
        title,
      };

      setSlides(slidesCopy);
    }
  };

  // Update shape properties
  const updateShapeProperties = (
    shapeId: string,
    properties: Partial<ShapeContentItem>,
  ) => {
    const slidesCopy = [...slides];
    const slideIndex = slidesCopy.findIndex((s) => s.id === _currentSlide.id);

    if (slideIndex !== -1) {
      const slide = slidesCopy[slideIndex];
      const shapeIndex = slide.content.findIndex((item) => item.id === shapeId);

      if (shapeIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slide,
          content: [...slide.content],
        };

        // Update the shape with new properties
        slidesCopy[slideIndex].content[shapeIndex] = {
          ...slide.content[shapeIndex],
          ...properties,
        };

        setSlides(slidesCopy);
      }
    }
  };

  // Handle selection of an embed element from the slide
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
      <div className="flex items-center p-2 bg-black border-b border-gray-800">
        <div className="flex items-center mr-4">
          <Link className="flex items-center" href="/dashboard">
            <Icon
              className="text-indigo-500 mr-2"
              icon="material-symbols:presentation"
              width={24}
            />
            <span className="font-semibold text-white">Pitch</span>
          </Link>
        </div>

        <div className="border-l border-gray-700 h-6 mx-3" />

        <div className="flex items-center">
          <input
            className="bg-transparent text-gray-200 text-sm focus:outline-none focus:border-indigo-500 border-b border-transparent px-2 py-1 max-w-xs"
            type="text"
            value={presentationTitle}
            onChange={(e) => setPresentationTitle(e.target.value)}
          />
          <div className="text-gray-500 text-xs ml-2">Private</div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Tabs
            aria-label="Editor Tabs"
            classNames={{
              tabList: "bg-black",
              cursor: "bg-indigo-500",
              tab: "text-gray-400 data-[selected=true]:text-white",
            }}
            selectedKey={activeTab}
            onSelectionChange={setActiveTab as any}
          >
            <Tab
              key="edit"
              title={
                <div className="flex items-center gap-1">
                  <Icon icon="material-symbols:edit-document" width={20} />
                  <span>Text</span>
                </div>
              }
            />
            <Tab
              key="media"
              title={
                <div
                  className="flex items-center gap-1"
                  role="button"
                  tabIndex={0}
                  onClick={() => openMediaSelector()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openMediaSelector();
                    }
                  }}
                >
                  <Icon icon="material-symbols:image" width={20} />
                  <span>Media</span>
                </div>
              }
            />
            <Tab
              key="shape"
              title={
                <div
                  className="flex items-center gap-1"
                  role="button"
                  tabIndex={0}
                  onClick={() => openShapeSelector()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openShapeSelector();
                    }
                  }}
                >
                  <Icon icon="material-symbols:shapes" width={20} />
                  <span>Shape</span>
                </div>
              }
            />
            <Tab
              key="sticker"
              title={
                <div className="flex items-center gap-1">
                  <Icon icon="material-symbols:sticker" width={20} />
                  <span>Sticker</span>
                </div>
              }
            />
            <Tab
              key="chart"
              title={
                <div className="flex items-center gap-1">
                  <Icon icon="material-symbols:bar-chart" width={20} />
                  <span>Chart</span>
                </div>
              }
            />
            <Tab
              key="table"
              title={
                <div
                  className="flex items-center gap-1"
                  role="button"
                  tabIndex={0}
                  onClick={() => openTableSelector()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      openTableSelector();
                    }
                  }}
                >
                  <Icon icon="material-symbols:table" width={20} />
                  <span>Table</span>
                </div>
              }
            />
            <Tab
              key="embed"
              title={
                <div
                  className="flex items-center gap-1"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openEmbedSelector();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      openEmbedSelector();
                    }
                  }}
                >
                  <Icon icon="material-symbols:code" width={20} />
                  <span>Embed</span>
                </div>
              }
            />
            <Tab
              key="record"
              title={
                <div className="flex items-center gap-1">
                  <Icon icon="material-symbols:mic" width={20} />
                  <span>Record</span>
                </div>
              }
            />
          </Tabs>

          <div className="flex items-center gap-2 ml-2">
            <Tooltip content="Undo" placement="bottom">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:undo" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Redo" placement="bottom">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:redo" width={20} />
              </Button>
            </Tooltip>

            <Avatar
              className="ml-2"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />

            <Button
              className="bg-indigo-600 text-white"
              color="primary"
              endContent={
                <Icon icon="material-symbols:play-arrow" width={20} />
              }
              variant="solid"
              onPress={handlePresent}
            >
              Present
            </Button>

            <Button className="text-white" color="primary" variant="flat">
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide Thumbnails Panel */}
        {showSlidePanel && (
          <div className="w-48 bg-black border-r border-gray-800 overflow-y-auto flex-shrink-0">
            <div className="p-3 flex justify-between items-center border-b border-gray-800">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="text-white"
                    endContent={
                      <Icon
                        icon="material-symbols:arrow-drop-down"
                        width={18}
                      />
                    }
                    size="sm"
                    startContent={
                      <Icon icon="material-symbols:add" width={18} />
                    }
                    variant="flat"
                  >
                    Add slide
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Slide Templates">
                  <DropdownItem key="blank" onPress={addNewSlide}>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:add-box-outline"
                        width={18}
                      />
                      <span>Blank Slide</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="title"
                    onPress={() => addSlideFromTemplate("title")}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:title" width={18} />
                      <span>Title Slide</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="textAndImage"
                    onPress={() => addSlideFromTemplate("textAndImage")}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:image-text" width={18} />
                      <span>Text & Image</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="bulletList"
                    onPress={() => addSlideFromTemplate("bulletList")}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:format-list-bulleted"
                        width={18}
                      />
                      <span>Bullet List</span>
                    </div>
                  </DropdownItem>
                  <DropdownItem
                    key="more"
                    onPress={() => setShowTemplateModal(true)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="material-symbols:dashboard" width={18} />
                      <span>More Templates...</span>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="p-2 space-y-2">
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
            </div>
          </div>
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
              slide={_currentSlide}
              _onAddContent={() => handleAddContent(_currentSlide.id)}
              onEmbedSelect={handleEmbedSelectionChange}
              onRemoveContent={(contentId: string) =>
                handleRemoveContent(_currentSlide.id, contentId)
              }
              onShapeSelect={handleShapeSelectionChange}
              onTableSelect={handleTableSelectionChange}
              onUpdateContent={(contentId: string, value: string) =>
                updateSlideContent(_currentSlide.id, contentId, value)
              }
              onUpdateShape={updateShapeProperties}
              onUpdateTable={updateTableProperties}
              onUpdateTitle={(title: string) =>
                updateSlideTitle(_currentSlide.id, title)
              }
            />
          </div>

          {/* Slide Navigation Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/60 rounded-full px-4 py-1">
            <Button
              isIconOnly
              className="text-gray-400"
              isDisabled={currentSlideIndex === 0}
              size="sm"
              variant="light"
              onPress={() =>
                navigateToSlide(Math.max(0, currentSlideIndex - 1))
              }
            >
              <Icon icon="material-symbols:arrow-back" width={20} />
            </Button>

            <span className="text-gray-300 text-sm">
              {currentSlideIndex + 1} / {slides.length}
            </span>

            <Button
              isIconOnly
              className="text-gray-400"
              isDisabled={currentSlideIndex === slides.length - 1}
              size="sm"
              variant="light"
              onPress={() =>
                navigateToSlide(
                  Math.min(slides.length - 1, currentSlideIndex + 1),
                )
              }
            >
              <Icon icon="material-symbols:arrow-forward" width={20} />
            </Button>
          </div>

          {/* Style Controls at Bottom */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 rounded-full px-4 py-1">
            <Button
              className="text-gray-300 flex items-center gap-1"
              size="sm"
              startContent={<Icon icon="material-symbols:style" width={18} />}
              variant="light"
              onPress={onStylesOpen}
            >
              Slide style
            </Button>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="text-gray-300 flex items-center gap-1"
                  size="sm"
                  startContent={
                    <Icon icon="material-symbols:palette" width={18} />
                  }
                  variant="light"
                >
                  Slide color
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Color Options">
                <DropdownItem
                  key="black"
                  startContent={
                    <div className="bg-black rounded-full w-4 h-4" />
                  }
                >
                  Black
                </DropdownItem>
                <DropdownItem
                  key="gray"
                  startContent={
                    <div className="bg-gray-500 rounded-full w-4 h-4" />
                  }
                >
                  Gray
                </DropdownItem>
                <DropdownItem
                  key="mint"
                  startContent={
                    <div className="bg-green-400 rounded-full w-4 h-4" />
                  }
                >
                  Mint
                </DropdownItem>
                <DropdownItem
                  key="darkgray"
                  startContent={
                    <div className="bg-gray-800 rounded-full w-4 h-4" />
                  }
                >
                  Dark Gray
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              className="text-gray-300 flex items-center gap-1"
              size="sm"
              startContent={<Icon icon="material-symbols:image" width={18} />}
              variant="light"
              onPress={openMediaSelector}
            >
              Background image
            </Button>
          </div>

          {/* Right Toolbar */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-black/40 p-1 rounded-lg">
            <Tooltip content="Edit" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:edit" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Shapes" placement="left">
              <Button
                isIconOnly
                className={`${showPropertiesPanel ? "text-indigo-400" : "text-gray-400"}`}
                size="sm"
                variant="light"
                onPress={() => setShowPropertiesPanel(!showPropertiesPanel)}
              >
                <Icon icon="material-symbols:shapes" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Comments" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:comment" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="Layout" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:dashboard" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="History" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:history" width={20} />
              </Button>
            </Tooltip>

            <Tooltip content="User" placement="left">
              <Button
                isIconOnly
                className="text-gray-400"
                size="sm"
                variant="light"
              >
                <Icon icon="material-symbols:person" width={20} />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Shape Properties Panel */}
        {showPropertiesPanel && (
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
                onUpdateTable={(updatedData) =>
                  updateTableProperties(selectedTable.id, updatedData)
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SlideStyles
        isOpen={isStylesOpen}
        onClose={onStylesClose}
        onSelect={handleStyleSelect}
      />

      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={closeMediaSelector}
        onSelect={handleMediaSelect}
      />

      <ShapeSelector
        isOpen={isShapeSelectorOpen}
        onClose={closeShapeSelector}
        onSelect={handleShapeSelect}
      />

      <TableSelector
        isOpen={isTableSelectorOpen}
        onClose={closeTableSelector}
        onSelect={handleTableSelect}
      />

      {/* Slide Templates Modal */}
      <Modal
        className="bg-gray-900"
        isOpen={showTemplateModal}
        size="3xl"
        onClose={() => setShowTemplateModal(false)}
      >
        <ModalContent>
          <ModalHeader className="border-b border-gray-800">
            <h2 className="text-white">Choose a Slide Template</h2>
          </ModalHeader>
          <ModalBody className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div
                className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                role="button"
                tabIndex={0}
                onClick={() => addSlideFromTemplate("title")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    addSlideFromTemplate("title");
                  }
                }}
              >
                <div
                  className="bg-black h-32 rounded flex flex-col items-center justify-center p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #111111 0%, #333333 100%)",
                  }}
                >
                  <div className="text-white text-xs font-bold">
                    Presentation Title
                  </div>
                  <div className="text-white text-[8px] mt-1">
                    Your subtitle goes here
                  </div>
                </div>
                <div className="text-white text-sm mt-2 text-center">
                  Title Slide
                </div>
              </div>

              <div
                className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                role="button"
                tabIndex={0}
                onClick={() => addSlideFromTemplate("textAndImage")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    addSlideFromTemplate("textAndImage");
                  }
                }}
              >
                <div
                  className="bg-black h-32 rounded flex flex-col p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #111111 0%, #333333 100%)",
                  }}
                >
                  <div className="text-white text-xs font-bold mb-2">
                    Text & Image
                  </div>
                  <div className="flex h-full">
                    <div className="w-1/2 pr-1">
                      <div className="text-white text-[8px]">
                        Main point goes here
                      </div>
                      <div className="text-white text-[8px] mt-1">
                        Supporting detail goes here
                      </div>
                    </div>
                    <div className="w-1/2 bg-gray-600 rounded" />
                  </div>
                </div>
                <div className="text-white text-sm mt-2 text-center">
                  Text & Image
                </div>
              </div>

              <div
                className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                role="button"
                tabIndex={0}
                onClick={() => addSlideFromTemplate("bulletList")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    addSlideFromTemplate("bulletList");
                  }
                }}
              >
                <div
                  className="bg-black h-32 rounded flex flex-col p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #111111 0%, #333333 100%)",
                  }}
                >
                  <div className="text-white text-xs font-bold mb-2">
                    Bullet Points
                  </div>
                  <div className="text-white text-[8px]">
                    <ul className="list-disc list-inside">
                      <li>First bullet point</li>
                      <li>Second bullet point</li>
                      <li>Third bullet point</li>
                      <li>Fourth bullet point</li>
                    </ul>
                  </div>
                </div>
                <div className="text-white text-sm mt-2 text-center">
                  Bullet List
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-800">
            <Button
              color="primary"
              variant="flat"
              onPress={() => setShowTemplateModal(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <EmbedSelector
        isOpen={isEmbedSelectorOpen}
        onClose={closeEmbedSelector}
        onSelect={handleEmbedSelect}
      />

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
              onUpdateEmbed={(embedId, properties) =>
                updateEmbedProperties(embedId, properties)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
