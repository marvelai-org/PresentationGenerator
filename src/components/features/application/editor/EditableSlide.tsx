"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

import SlideEditor from "./SlideEditor";
import { TableComponent } from "./elements";
import EmbedComponent from "./elements/EmbedComponent";
import { EmbedData } from "./selectors/EmbedSelector";

import { TableData } from "@/types/editor";

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
    rotation?: number;
    borderWidth?: number;
    opacity?: number;
    zIndex?: number;
  };
  tableData?: TableData;
  embedData?: EmbedData;
}

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
  shapes?: SlideContentItem[];
}

interface EditableSlideProps {
  slide: Slide;
  onUpdateTitle: (title: string) => void;
  onUpdateContent: (contentId: string, value: string) => void;
  _onAddContent: () => void;
  onRemoveContent: (contentId: string) => void;
  onShapeSelect?: (shape: SlideContentItem | null) => void;
  onUpdateShape?: (
    shapeId: string,
    properties: Partial<SlideContentItem>,
  ) => void;
  onTableSelect?: (table: SlideContentItem | null) => void;
  onUpdateTable?: (tableId: string, tableData: TableData) => void;
  onEmbedSelect?: (embed: SlideContentItem | null) => void;
}

export default function EditableSlide({
  slide,
  onUpdateTitle,
  onUpdateContent,
  _onAddContent,
  onRemoveContent,
  onShapeSelect,
  onUpdateShape,
  onTableSelect,
  onUpdateTable,
  onEmbedSelect,
}: EditableSlideProps) {
  const [hoveredSection, setHoveredSection] = useState<null | "title" | string>(
    null,
  );
  const [activeSection, setActiveSection] = useState<null | "title" | string>(
    null,
  );
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<{
    id: string;
    handle: string;
  } | null>(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [rotating, setRotating] = useState<string | null>(null);
  const [rotateStart, setRotateStart] = useState(0);
  const [selectedEmbed, setSelectedEmbed] = useState<string | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);

  // Determine background styles
  const backgroundStyles: React.CSSProperties = {
    backgroundColor: slide.backgroundColor || "#000000",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  };

  if (slide.image) {
    backgroundStyles.backgroundImage = `url(${slide.image})`;
  }

  if (slide.gradient) {
    backgroundStyles.background = slide.gradient;
  }

  // Special styling for the first slide (title slide)
  const isTitleSlide = slide.id === 1;

  // Set up global mouse move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingElement) {
        handleDrag(e);
      } else if (resizing) {
        handleResize(e);
      } else if (rotating) {
        handleRotate(e);
      }
    };

    const handleMouseUp = () => {
      setDraggingElement(null);
      setResizing(null);
      setRotating(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingElement, resizing, rotating]);

  // Find shape by id
  const findShapeById = (id: string) => {
    return slide.content.find(
      (item) => item.id === id && item.type === "shape",
    );
  };

  // Find table by id
  const findTableById = (id: string) => {
    return slide.content.find(
      (item) => item.id === id && item.type === "table",
    );
  };

  // Find embed by id
  const findEmbedById = (id: string) => {
    return slide.content.find(
      (item) => item.id === id && item.type === "embed",
    );
  };

  // Handle shape element drag start
  const handleDragStart = (
    e: React.MouseEvent | React.KeyboardEvent,
    itemId: string,
    x: number,
    y: number,
  ) => {
    e.stopPropagation();
    setDraggingElement(itemId);
    setSelectedShape(itemId);
    
    // If this is a mouse event, set the drag offset
    if ('clientX' in e) {
      setDragOffset({
        x: e.clientX - (x || 0),
        y: e.clientY - (y || 0),
      });
    }

    // Call the parent's onShapeSelect if provided
    if (onShapeSelect) {
      const shape = findShapeById(itemId);

      if (shape) {
        onShapeSelect(shape);
      }
    }
  };

  // Handle shape element drag
  const handleDrag = (e: MouseEvent) => {
    if (!draggingElement) return;

    const shapeItem = findShapeById(draggingElement);

    if (!shapeItem) return;

    // Calculate new position
    const newX = Math.max(0, e.clientX - dragOffset.x);
    const newY = Math.max(0, e.clientY - dragOffset.y);

    // Update shape position
    updateShapeProperty(draggingElement, {
      x: newX,
      y: newY,
    });
  };

  // Handle shape element resize start
  const handleResizeStart = (
    e: React.MouseEvent | React.KeyboardEvent,
    itemId: string,
    handle: string,
  ) => {
    e.stopPropagation();
    const shapeItem = findShapeById(itemId);

    if (!shapeItem) return;

    setResizing({ id: itemId, handle });
    setSelectedShape(itemId);
    
    // If this is a mouse event, set the resize start position
    if ('clientX' in e) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: shapeItem.width || 100,
        height: shapeItem.height || 100,
      });
    }
  };

  // Handle shape element resize
  const handleResize = (e: MouseEvent) => {
    if (!resizing) return;

    const shapeItem = findShapeById(resizing.id);

    if (!shapeItem) return;

    // Calculate size changes
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    // Apply changes based on which handle is being dragged
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    let newX = shapeItem.x;
    let newY = shapeItem.y;

    switch (resizing.handle) {
      case "n":
        newHeight = Math.max(20, resizeStart.height - deltaY);
        newY = (shapeItem.y || 0) + deltaY;
        break;
      case "s":
        newHeight = Math.max(20, resizeStart.height + deltaY);
        break;
      case "e":
        newWidth = Math.max(20, resizeStart.width + deltaX);
        break;
      case "w":
        newWidth = Math.max(20, resizeStart.width - deltaX);
        newX = (shapeItem.x || 0) + deltaX;
        break;
      case "ne":
        newWidth = Math.max(20, resizeStart.width + deltaX);
        newHeight = Math.max(20, resizeStart.height - deltaY);
        newY = (shapeItem.y || 0) + deltaY;
        break;
      case "nw":
        newWidth = Math.max(20, resizeStart.width - deltaX);
        newHeight = Math.max(20, resizeStart.height - deltaY);
        newX = (shapeItem.x || 0) + deltaX;
        newY = (shapeItem.y || 0) + deltaY;
        break;
      case "se":
        newWidth = Math.max(20, resizeStart.width + deltaX);
        newHeight = Math.max(20, resizeStart.height + deltaY);
        break;
      case "sw":
        newWidth = Math.max(20, resizeStart.width - deltaX);
        newHeight = Math.max(20, resizeStart.height + deltaY);
        newX = (shapeItem.x || 0) + deltaX;
        break;
    }

    // Update shape properties
    updateShapeProperty(resizing.id, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY,
    });
  };

  // Handle shape element rotation start
  const handleRotateStart = (e: React.MouseEvent | React.KeyboardEvent, itemId: string) => {
    e.stopPropagation();
    const shapeItem = findShapeById(itemId);

    if (!shapeItem) return;

    setRotating(itemId);
    setSelectedShape(itemId);

    // Only set rotation if this is a mouse event
    if ('clientX' in e) {
      // Get the center point of the shape
      const shapeCenterX = (shapeItem.x || 0) + (shapeItem.width || 100) / 2;
      const shapeCenterY = (shapeItem.y || 0) + (shapeItem.height || 100) / 2;

      // Calculate the initial angle
      const initialAngle =
        Math.atan2(e.clientY - shapeCenterY, e.clientX - shapeCenterX) *
        (180 / Math.PI);

      setRotateStart(initialAngle - (shapeItem.style?.rotation || 0));
    }
  };

  // Handle shape element rotation
  const handleRotate = (e: MouseEvent) => {
    if (!rotating) return;

    const shapeItem = findShapeById(rotating);

    if (!shapeItem) return;

    // Get the center point of the shape
    const shapeCenterX = (shapeItem.x || 0) + (shapeItem.width || 100) / 2;
    const shapeCenterY = (shapeItem.y || 0) + (shapeItem.height || 100) / 2;

    // Calculate the current angle
    const currentAngle =
      Math.atan2(e.clientY - shapeCenterY, e.clientX - shapeCenterX) *
      (180 / Math.PI);

    // Calculate the new rotation
    let newRotation = Math.round(currentAngle - rotateStart);

    // Normalize the rotation to 0-360 degrees
    while (newRotation < 0) newRotation += 360;
    while (newRotation >= 360) newRotation -= 360;

    // Update shape rotation
    updateShapeProperty(rotating, {
      style: {
        ...(shapeItem.style || {}),
        rotation: newRotation,
      },
    });
  };

  // Update a shape's properties
  const updateShapeProperty = (
    shapeId: string,
    properties: Partial<SlideContentItem>,
  ) => {
    // Call the parent's onUpdateShape if provided
    if (onUpdateShape) {
      onUpdateShape(shapeId, properties);
    } else {
      // Fallback to just updating the DOM for demo purposes
      const shapeElement = document.getElementById(shapeId);

      if (shapeElement) {
        if (properties.x !== undefined)
          shapeElement.style.left = `${properties.x}px`;
        if (properties.y !== undefined)
          shapeElement.style.top = `${properties.y}px`;
        if (properties.width !== undefined)
          shapeElement.style.width = `${properties.width}px`;
        if (properties.height !== undefined)
          shapeElement.style.height = `${properties.height}px`;
        if (properties.style?.rotation !== undefined) {
          shapeElement.style.transform = `rotate(${properties.style.rotation}deg)`;
        }
      }
    }
  };

  // Bring shape to front
  const bringToFront = (shapeId: string) => {
    const shapeItem = findShapeById(shapeId);

    if (!shapeItem) return;

    // Find the highest z-index
    let maxZIndex = 1;

    slide.content.forEach((item) => {
      if (item.type === "shape" && item.style?.zIndex) {
        maxZIndex = Math.max(maxZIndex, item.style.zIndex);
      }
    });

    // Set this shape's z-index to highest + 1
    updateShapeProperty(shapeId, {
      style: {
        ...(shapeItem.style || {}),
        zIndex: maxZIndex + 1,
      },
    });
  };

  // Send shape to back
  const sendToBack = (shapeId: string) => {
    const shapeItem = findShapeById(shapeId);

    if (!shapeItem) return;

    // Find the lowest z-index
    let minZIndex = 1;

    slide.content.forEach((item) => {
      if (item.type === "shape" && item.style?.zIndex) {
        minZIndex = Math.min(minZIndex, item.style.zIndex);
      }
    });

    // Set this shape's z-index to lowest - 1
    updateShapeProperty(shapeId, {
      style: {
        ...(shapeItem.style || {}),
        zIndex: minZIndex - 1,
      },
    });
  };

  // Delete a shape
  const deleteShape = (shapeId: string) => {
    // If the parent component provides an onRemoveContent function, use that
    if (onRemoveContent) {
      onRemoveContent(shapeId);
    }

    // Clear the selection
    setSelectedShape(null);

    // Notify the parent component about selection change
    if (onShapeSelect) {
      onShapeSelect(null);
    }
  };

  // Update table data
  const updateTableData = (tableId: string, tableData: TableData) => {
    if (onUpdateTable) {
      onUpdateTable(tableId, tableData);
    }
  };

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);

    // Deselect any selected shape
    if (selectedShape) {
      setSelectedShape(null);
      if (onShapeSelect) {
        onShapeSelect(null);
      }
    }

    // Call the parent's onTableSelect if provided
    if (onTableSelect) {
      const table = findTableById(tableId);

      if (table) {
        onTableSelect(table);
      }
    }
  };

  // Handle embed element selection
  const handleEmbedSelect = (embedId: string) => {
    if (selectedEmbed === embedId) {
      setSelectedEmbed(null);
      if (onEmbedSelect) onEmbedSelect(null);
    } else {
      setSelectedEmbed(embedId);
      setSelectedShape(null);
      setSelectedTable(null);
      setActiveSection(null);

      // Call the parent's onEmbedSelect if provided
      if (onEmbedSelect) {
        const embed = findEmbedById(embedId);

        if (embed) {
          onEmbedSelect(embed);
        }
      }
    }
  };

  // Render resize handles
  const renderResizeHandles = (item: SlideContentItem) => {
    const handles = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

    return (
      <>
        {handles.map((handle) => {
          let cursorClass = "";

          switch (handle) {
            case "n":
            case "s":
              cursorClass = "cursor-ns-resize";
              break;
            case "e":
            case "w":
              cursorClass = "cursor-ew-resize";
              break;
            case "ne":
            case "sw":
              cursorClass = "cursor-nesw-resize";
              break;
            case "nw":
            case "se":
              cursorClass = "cursor-nwse-resize";
              break;
          }

          let positionClass = "";

          switch (handle) {
            case "n":
              positionClass =
                "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2";
              break;
            case "s":
              positionClass =
                "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2";
              break;
            case "e":
              positionClass =
                "right-0 top-1/2 translate-x-1/2 -translate-y-1/2";
              break;
            case "w":
              positionClass =
                "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2";
              break;
            case "ne":
              positionClass = "top-0 right-0 translate-x-1/2 -translate-y-1/2";
              break;
            case "nw":
              positionClass = "top-0 left-0 -translate-x-1/2 -translate-y-1/2";
              break;
            case "se":
              positionClass =
                "bottom-0 right-0 translate-x-1/2 translate-y-1/2";
              break;
            case "sw":
              positionClass =
                "bottom-0 left-0 -translate-x-1/2 translate-y-1/2";
              break;
          }

          return (
            <div
              key={handle}
              className={`absolute w-3 h-3 bg-white border border-gray-800 ${cursorClass} ${positionClass} z-10`}
              onMouseDown={(e) => handleResizeStart(e, item.id, handle)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleResizeStart(e, item.id, handle);
                }
              }}
              aria-label={`Resize handle ${handle}`}
            />
          );
        })}

        {/* Rotation handle */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 cursor-pointer"
          onMouseDown={(e) => handleRotateStart(e, item.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleRotateStart(e, item.id);
            }
          }}
          aria-label="Rotate shape"
        >
          <div className="w-0.5 h-6 bg-gray-400 mx-auto" />
          <Icon
            className="text-white bg-indigo-600 rounded-full p-0.5"
            icon="material-symbols:rotate-90"
            width={16}
          />
        </div>
      </>
    );
  };

  // Render a shape based on its type
  const renderShape = (item: SlideContentItem) => {
    const shapeType = item.value;
    const isSelected = selectedShape === item.id;

    const style: React.CSSProperties = {
      position: "absolute",
      left: `${item.x}px`,
      top: `${item.y}px`,
      width: `${item.width}px`,
      height: `${item.height}px`,
      backgroundColor: item.style?.backgroundColor || "transparent",
      borderColor: item.style?.borderColor || "transparent",
      borderWidth:
        item.style?.borderWidth ||
        (item.style?.borderStyle === "solid" ? 2 : 0),
      borderStyle: item.style?.borderStyle || "none",
      color: item.style?.color || "white",
      transform: item.style?.rotation
        ? `rotate(${item.style.rotation}deg)`
        : undefined,
      opacity: item.style?.opacity,
      cursor: "move",
      zIndex: item.style?.zIndex || 1,
    };

    // Create shape element based on type
    let ShapeElement: JSX.Element;

    // Add specific styles based on shape type
    if (shapeType.includes("square")) {
      // Square shape
      ShapeElement = (
        <div
          className={`${shapeType.includes("rounded") ? "rounded-lg" : ""} ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Square shape"
        />
      );
    } else if (shapeType.includes("circle")) {
      // Circle shape
      ShapeElement = (
        <div
          className={`rounded-full ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Circle shape"
        />
      );
    } else if (shapeType.includes("triangle")) {
      // Triangle shape
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={{
            ...style,
            width: "0",
            height: "0",
            backgroundColor: "transparent",
            borderLeft: `${(item.width || 100) / 2}px solid transparent`,
            borderRight: `${(item.width || 100) / 2}px solid transparent`,
            borderBottom: `${item.height || 100}px solid ${item.style?.backgroundColor || "#6366F1"}`,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Triangle shape"
        />
      );
    } else if (shapeType.includes("diamond")) {
      // Diamond shape
      ShapeElement = (
        <div
          className={`clip-diamond ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Diamond shape"
        />
      );
    } else if (shapeType.includes("star")) {
      // Star shape (simplified)
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Star shape"
        >
          <Icon
            icon="mdi:star"
            style={{
              width: "100%",
              height: "100%",
              color: item.style?.backgroundColor || "#6366F1",
            }}
          />
        </div>
      );
    } else if (shapeType.includes("process-arrow")) {
      // Process arrow shape
      ShapeElement = (
        <div
          className={`clip-arrow-right ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Process arrow shape"
        />
      );
    } else if (shapeType.includes("process-hexagon")) {
      // Process hexagon shape
      ShapeElement = (
        <div
          className={`clip-hexagon ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Process hexagon shape"
        />
      );
    } else if (shapeType.includes("process-diamond")) {
      // Process diamond shape
      ShapeElement = (
        <div
          className={`clip-diamond ${isSelected ? "ring-2 ring-indigo-600" : ""}`}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Process diamond shape"
        />
      );
    } else if (shapeType.includes("process-start")) {
      // Process start shape (rectangle)
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Process start shape"
        />
      );
    } else if (shapeType.includes("line")) {
      // Line shapes
      const lineStyle: React.CSSProperties = {
        ...style,
        height: "2px",
        backgroundColor: item.style?.backgroundColor || "#6366F1",
      };

      if (shapeType.includes("dashed")) {
        lineStyle.borderTop = "2px dashed";
        lineStyle.borderColor = item.style?.backgroundColor || "#6366F1";
        lineStyle.backgroundColor = "transparent";
      } else if (shapeType.includes("dotted")) {
        lineStyle.borderTop = "2px dotted";
        lineStyle.borderColor = item.style?.backgroundColor || "#6366F1";
        lineStyle.backgroundColor = "transparent";
      }

      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={lineStyle}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Line shape"
        />
      );
    } else if (shapeType.includes("rectangular-label")) {
      // Rectangular label
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Rectangular label"
        >
          <span>Label</span>
        </div>
      );
    } else if (shapeType.includes("rounded-label")) {
      // Rounded label
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "9999px",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Rounded label"
        >
          <span>Label</span>
        </div>
      );
    } else {
      // Default fallback
      ShapeElement = (
        <div
          className={isSelected ? "ring-2 ring-indigo-600" : ""}
          id={item.id}
          style={style}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) =>
            handleDragStart(e, item.id, item.x || 0, item.y || 0)
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              handleDragStart(e, item.id, item.x || 0, item.y || 0);
            }
          }}
          aria-label="Shape element"
        >
          {item.value}
        </div>
      );
    }

    return (
      <div key={item.id} className="relative">
        {ShapeElement}

        {/* Resize handles and toolbar for selected shape */}
        {isSelected && (
          <>
            {renderResizeHandles(item)}

            {/* Shape toolbar */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 rounded-md shadow-lg flex p-1 z-50">
              <Tooltip content="Bring to Front" placement="top">
                <Button
                  isIconOnly
                  className="text-white"
                  size="sm"
                  variant="flat"
                  onPress={() => bringToFront(item.id)}
                >
                  <Icon icon="material-symbols:flip-to-front" width={16} />
                </Button>
              </Tooltip>

              <Tooltip content="Send to Back" placement="top">
                <Button
                  isIconOnly
                  className="text-white"
                  size="sm"
                  variant="flat"
                  onPress={() => sendToBack(item.id)}
                >
                  <Icon icon="material-symbols:flip-to-back" width={16} />
                </Button>
              </Tooltip>

              <Tooltip content="Delete" placement="top">
                <Button
                  isIconOnly
                  className="text-white"
                  size="sm"
                  variant="flat"
                  onPress={() => deleteShape(item.id)}
                >
                  <Icon icon="material-symbols:delete" width={16} />
                </Button>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    );
  };

  // Add a renderTable method
  const renderTable = (item: SlideContentItem) => {
    if (!item.tableData) return null;

    const isSelected = selectedTable === item.id;

    return (
      <div
        key={item.id}
        style={{
          position: "absolute",
          left: `${item.x || 0}px`,
          top: `${item.y || 0}px`,
          width: `${item.width || 400}px`,
          height: "auto",
          cursor: "pointer",
          zIndex: item.style?.zIndex || 1,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTableSelect(item.id);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            handleTableSelect(item.id);
          }
        }}
        aria-label="Table element"
      >
        <TableComponent
          isEditing={isSelected}
          selected={isSelected}
          tableData={item.tableData}
          onSelectTable={() => handleTableSelect(item.id)}
          onUpdateTable={(updatedData) => updateTableData(item.id, updatedData)}
        />

        {isSelected && (
          <div className="absolute -top-6 right-0 flex items-center gap-1">
            <Tooltip content="Delete Table" placement="top">
              <Button
                isIconOnly
                className="bg-red-600 text-white"
                size="sm"
                variant="flat"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemoveContent) {
                    onRemoveContent(item.id);
                    setSelectedTable(null);
                    if (onTableSelect) onTableSelect(null);
                  }
                }}
              >
                <Icon icon="material-symbols:delete" width={16} />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  };

  // Render embed content
  const renderEmbed = (item: SlideContentItem) => {
    if (!item.embedData) return null;

    const isSelected = selectedEmbed === item.id;

    return (
      <EmbedComponent
        key={item.id}
        embedData={item.embedData}
        height={item.height}
        isEditing={true}
        isSelected={isSelected}
        position={{ x: item.x || 0, y: item.y || 0 }}
        width={item.width}
        onDelete={() => onRemoveContent(item.id)}
        onEdit={() => handleEmbedSelect(item.id)}
      />
    );
  };

  // Update the handleBackgroundClick method to clear table selection
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the background
    if (e.target === e.currentTarget) {
      setActiveSection(null);
      setSelectedShape(null);
      setSelectedTable(null);
      setSelectedEmbed(null);

      // Notify parent about deselection
      if (onShapeSelect) {
        onShapeSelect(null);
      }

      if (onTableSelect) {
        onTableSelect(null);
      }
    }
  };

  // Handle section click to set active section
  const handleSectionClick = (id: string) => {
    setActiveSection(id);
  };

  return (
    <div
      ref={slideRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={backgroundStyles}
      onClick={handleBackgroundClick}
      role="presentation"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          // Use Escape key to deselect
          setActiveSection(null);
          setSelectedShape(null);
          setSelectedTable(null);
          setSelectedEmbed(null);
          
          // Notify parent about deselection
          if (onShapeSelect) {
            onShapeSelect(null);
          }
          
          if (onTableSelect) {
            onTableSelect(null);
          }
        }
      }}
    >
      {/* Render content items based on type */}
      {slide.content.map((item) => {
        if (item.type === "shape") {
          return renderShape(item);
        } else if (item.type === "table") {
          return renderTable(item);
        } else if (item.type === "embed") {
          return renderEmbed(item);
        } else if (item.type === "text") {
          // Handle regular text content (existing code)
          const isHovered = hoveredSection === item.id;
          const isActive = activeSection === item.id;

          return (
            <div
              key={item.id}
              className={`relative group mb-4 ${isHovered ? "bg-white/5" : ""} ${isActive ? "bg-white/10" : ""} rounded-md p-1`}
              role="button"
              tabIndex={0}
              onClick={() => handleSectionClick(item.id)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSectionClick(item.id);
                }
              }}
              onMouseEnter={() => setHoveredSection(item.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              {isActive ? (
                <SlideEditor
                  content={item.value}
                  placeholder="Add content..."
                  onUpdate={(newValue) => onUpdateContent(item.id, newValue)}
                />
              ) : (
                <p className="text-xl text-white p-1">{item.value}</p>
              )}

              {isHovered && !isActive && (
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    isIconOnly
                    className="bg-black/50 text-white"
                    size="sm"
                    variant="flat"
                    onPress={() => onRemoveContent(item.id)}
                  >
                    <Icon icon="material-symbols:delete" width={16} />
                  </Button>
                </div>
              )}
            </div>
          );
        }

        return null;
      })}

      <div className="flex-1 h-full flex flex-col p-12 overflow-hidden">
        {/* Title Section */}
        <div
          className="relative mb-4 group"
          role="button"
          tabIndex={0}
          onClick={() => setActiveSection("title")}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              setActiveSection("title");
            }
          }}
          onMouseEnter={() => setHoveredSection("title")}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <SlideEditor
            content={slide.title}
            isTitle={true}
            placeholder="Add a title..."
            onUpdate={onUpdateTitle}
          />

          {hoveredSection === "title" && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip content="Edit title" placement="right">
                <Button
                  isIconOnly
                  className="bg-black/50 text-white"
                  size="sm"
                  variant="flat"
                >
                  <Icon icon="material-symbols:edit" width={16} />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Subtitle for title slide */}
        {isTitleSlide && slide.subtitle && (
          <div className="mb-8">
            <SlideEditor
              content={slide.subtitle}
              placeholder="Add a subtitle..."
              onUpdate={(_value) => {
                /* Handle subtitle update */
              }}
            />
          </div>
        )}

        {/* Content Sections (Text only) */}
        <div className="flex-1">
          {slide.content
            .filter((item) => item.type !== "shape")
            .map((contentItem) => (
              <div
                key={contentItem.id}
                className="relative mb-4 group"
                role="button"
                tabIndex={0}
                onClick={() => setActiveSection(contentItem.id)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveSection(contentItem.id);
                  }
                }}
                onMouseEnter={() => setHoveredSection(contentItem.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <SlideEditor
                  content={contentItem.value}
                  placeholder="Add content..."
                  onUpdate={(value) => onUpdateContent(contentItem.id, value)}
                />

                {hoveredSection === contentItem.id && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <Tooltip content="Edit content" placement="right">
                      <Button
                        isIconOnly
                        className="bg-black/50 text-white"
                        size="sm"
                        variant="flat"
                      >
                        <Icon icon="material-symbols:edit" width={16} />
                      </Button>
                    </Tooltip>

                    {slide.content.filter((item) => item.type !== "shape")
                      .length > 1 && (
                      <Tooltip content="Remove section" placement="right">
                        <Button
                          isIconOnly
                          className="bg-black/50 text-white"
                          size="sm"
                          variant="flat"
                          onPress={() => onRemoveContent(contentItem.id)}
                        >
                          <Icon icon="material-symbols:delete" width={16} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Author info for title slide */}
        {isTitleSlide && slide.author && (
          <div className="mt-auto flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              {slide.author.substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-4">
              <div className="text-white">by {slide.author}</div>
              {slide.editedTime && (
                <div className="text-gray-400 text-sm">
                  Last edited {slide.editedTime}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
