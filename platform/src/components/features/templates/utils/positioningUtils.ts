/**
 * Utilities for calculating and managing content positioning
 * These functions help with layout alignment, spacing and responsive adjustments
 */

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositioningOptions {
  spacing?: number;
  padding?: number;
  alignment?: 'start' | 'center' | 'end';
  distribution?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
}

/**
 * Creates a grid layout of positions
 * @param containerWidth Width of the container
 * @param containerHeight Height of the container
 * @param columns Number of columns
 * @param rows Number of rows
 * @param options Positioning options
 * @returns Array of positions for each cell in the grid
 */
export const createGridPositions = (
  containerWidth: number,
  containerHeight: number,
  columns: number,
  rows: number,
  options: PositioningOptions = {}
): Position[] => {
  const {
    spacing = 10,
    padding = 20,
    alignment = 'center',
    distribution = 'space-between'
  } = options;

  const availableWidth = containerWidth - (padding * 2) - (spacing * (columns - 1));
  const availableHeight = containerHeight - (padding * 2) - (spacing * (rows - 1));

  const cellWidth = availableWidth / columns;
  const cellHeight = availableHeight / rows;

  const positions: Position[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = padding + col * (cellWidth + spacing);
      const y = padding + row * (cellHeight + spacing);

      positions.push({
        x,
        y,
        width: cellWidth,
        height: cellHeight
      });
    }
  }

  return positions;
};

/**
 * Positions elements in a horizontal row
 */
export const createRowPositions = (
  containerWidth: number,
  containerHeight: number,
  count: number,
  itemHeight: number,
  options: PositioningOptions = {}
): Position[] => {
  const {
    spacing = 10,
    padding = 20,
    alignment = 'center',
    distribution = 'space-between'
  } = options;

  const availableWidth = containerWidth - (padding * 2) - (spacing * (count - 1));
  const itemWidth = availableWidth / count;

  const positions: Position[] = [];

  // Calculate vertical position based on alignment
  let startY: number;
  switch (alignment) {
    case 'start':
      startY = padding;
      break;
    case 'end':
      startY = containerHeight - padding - itemHeight;
      break;
    case 'center':
    default:
      startY = (containerHeight - itemHeight) / 2;
      break;
  }

  for (let i = 0; i < count; i++) {
    const x = padding + i * (itemWidth + spacing);

    positions.push({
      x,
      y: startY,
      width: itemWidth,
      height: itemHeight
    });
  }

  return positions;
};

/**
 * Positions elements in a vertical column
 */
export const createColumnPositions = (
  containerWidth: number,
  containerHeight: number,
  count: number,
  itemWidth: number,
  options: PositioningOptions = {}
): Position[] => {
  const {
    spacing = 10,
    padding = 20,
    alignment = 'center',
    distribution = 'space-between'
  } = options;

  const availableHeight = containerHeight - (padding * 2) - (spacing * (count - 1));
  const itemHeight = availableHeight / count;

  const positions: Position[] = [];

  // Calculate horizontal position based on alignment
  let startX: number;
  switch (alignment) {
    case 'start':
      startX = padding;
      break;
    case 'end':
      startX = containerWidth - padding - itemWidth;
      break;
    case 'center':
    default:
      startX = (containerWidth - itemWidth) / 2;
      break;
  }

  for (let i = 0; i < count; i++) {
    const y = padding + i * (itemHeight + spacing);

    positions.push({
      x: startX,
      y,
      width: itemWidth,
      height: itemHeight
    });
  }

  return positions;
};

/**
 * Creates a layout with a title area and content area below
 */
export const createTitleContentLayout = (
  containerWidth: number,
  containerHeight: number,
  titleHeight: number,
  options: PositioningOptions = {}
): { title: Position; content: Position } => {
  const { padding = 20, spacing = 10 } = options;

  const contentHeight = containerHeight - titleHeight - padding * 2 - spacing;

  return {
    title: {
      x: padding,
      y: padding,
      width: containerWidth - padding * 2,
      height: titleHeight
    },
    content: {
      x: padding,
      y: padding + titleHeight + spacing,
      width: containerWidth - padding * 2,
      height: contentHeight
    }
  };
};

/**
 * Creates a side-by-side layout with optional title
 */
export const createSideBySideLayout = (
  containerWidth: number,
  containerHeight: number,
  leftRatio: number = 0.5, // 0.5 means 50/50 split
  titleHeight: number = 0,
  options: PositioningOptions = {}
): { title?: Position; left: Position; right: Position } => {
  const { padding = 20, spacing = 10 } = options;

  const availableWidth = containerWidth - padding * 2 - spacing;
  const leftWidth = availableWidth * leftRatio;
  const rightWidth = availableWidth - leftWidth;

  const contentY = titleHeight > 0 ? padding + titleHeight + spacing : padding;
  const contentHeight = containerHeight - contentY - padding;

  const result: { title?: Position; left: Position; right: Position } = {
    left: {
      x: padding,
      y: contentY,
      width: leftWidth,
      height: contentHeight
    },
    right: {
      x: padding + leftWidth + spacing,
      y: contentY,
      width: rightWidth,
      height: contentHeight
    }
  };

  if (titleHeight > 0) {
    result.title = {
      x: padding,
      y: padding,
      width: containerWidth - padding * 2,
      height: titleHeight
    };
  }

  return result;
};

/**
 * Creates responsive positions for different screen sizes
 */
export const createResponsivePositions = (
  position: Position,
  containerWidth: number,
  containerHeight: number
): Record<string, Position> => {
  // Calculate responsive positions for different screen sizes
  // These are percentage-based to be more flexible
  const xPercent = position.x / containerWidth;
  const yPercent = position.y / containerHeight;
  const widthPercent = position.width / containerWidth;
  const heightPercent = position.height / containerHeight;

  return {
    default: position,
    sm: {
      // For small screens (< 640px)
      x: Math.round(320 * xPercent),
      y: Math.round(480 * yPercent),
      width: Math.round(320 * widthPercent),
      height: Math.round(480 * heightPercent),
    },
    md: {
      // For medium screens (< 768px)
      x: Math.round(640 * xPercent),
      y: Math.round(480 * yPercent),
      width: Math.round(640 * widthPercent),
      height: Math.round(480 * heightPercent),
    },
    lg: {
      // For large screens (< 1024px)
      x: Math.round(800 * xPercent),
      y: Math.round(600 * yPercent),
      width: Math.round(800 * widthPercent),
      height: Math.round(600 * heightPercent),
    }
  };
};

/**
 * Generates a slot definition with responsive positions
 */
export const createResponsiveSlot = (
  id: string,
  name: string,
  type: 'text' | 'image' | 'chart' | 'video' | 'shape' | 'list',
  basePosition: Position,
  containerWidth: number,
  containerHeight: number,
  required: boolean = false,
  defaultContent?: any,
  adaptiveRules?: any
): any => {
  const responsivePositions = createResponsivePositions(
    basePosition,
    containerWidth,
    containerHeight
  );

  return {
    id,
    name,
    type,
    required,
    position: basePosition,
    defaultContent,
    adaptiveRules: {
      ...adaptiveRules,
      responsivePositions
    }
  };
}; 