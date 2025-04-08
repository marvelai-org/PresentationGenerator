/**
 * TableComponent
 *
 * Renders an interactive table in the presentation editor.
 * Supports cell editing, selection, and manipulation.
 */

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Icon } from "@iconify/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import ErrorBoundary from "../ErrorBoundary";

import { TableData } from "@/types/editor";

interface TableComponentProps {
  /** Table data structure containing rows, columns, cells, and styling */
  tableData: TableData;
  /** Whether the table is in editing mode */
  isEditing?: boolean;
  /** Callback function to update the table data */
  onUpdateTable?: (updatedData: TableData) => void;
  /** Callback function when the table is selected */
  onSelectTable?: () => void;
  /** Whether the table is currently selected */
  selected?: boolean;
}

/**
 * TableComponent renders an interactive table with editable cells
 * and provides functionality for cell editing, selection, and manipulation.
 */
const TableComponent = ({
  tableData,
  isEditing = false,
  onUpdateTable,
  onSelectTable,
  selected = false,
}: TableComponentProps) => {
  // State for cell interactions
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [cellContent, setCellContent] = useState("");

  // State for context menu
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  // State for selection range (for multi-cell operations)
  const [selectionRange, setSelectionRange] = useState<{
    startCell: string;
    endCell: string;
  } | null>(null);

  // References for DOM elements
  const cellRefs = useRef<Record<string, HTMLTableCellElement | null>>({});
  const tableRef = useRef<HTMLTableElement>(null);

  /**
   * Set up editing mode for a cell
   * @param cellId - The ID of the cell to edit
   */
  const startEditing = useCallback(
    (cellId: string) => {
      const cell = tableData.cells[cellId];

      if (cell) {
        setEditingCell(cellId);
        setCellContent(cell.content);
      }
    },
    [tableData.cells],
  );

  /**
   * Save cell content after editing
   */
  const saveCell = useCallback(() => {
    if (editingCell && onUpdateTable) {
      try {
        const updatedData = { ...tableData };

        updatedData.cells = { ...updatedData.cells };
        updatedData.cells[editingCell] = {
          ...updatedData.cells[editingCell],
          content: cellContent,
        };
        onUpdateTable(updatedData);
      } catch (error) {
        console.error("Error saving cell content:", error);
      } finally {
        setEditingCell(null);
      }
    }
  }, [editingCell, cellContent, onUpdateTable, tableData]);

  /**
   * Handle table click to select it
   */
  const handleTableClick = useCallback(
    (e: React.MouseEvent) => {
      if (onSelectTable) {
        onSelectTable();
      }
    },
    [onSelectTable],
  );

  /**
   * Handle cell click
   * @param e - Mouse event
   * @param cellId - The ID of the clicked cell
   */
  const handleCellClick = useCallback(
    (e: React.MouseEvent, cellId: string) => {
      e.stopPropagation();
      if (isEditing) {
        setSelectedCell(cellId);
        if (e.detail === 2) {
          // Double click
          startEditing(cellId);
        }
      }
    },
    [isEditing, startEditing],
  );

  /**
   * Show context menu on right click
   * @param e - Mouse event
   * @param cellId - The ID of the right-clicked cell
   */
  const handleCellContextMenu = useCallback(
    (e: React.MouseEvent, cellId: string) => {
      e.preventDefault();
      setSelectedCell(cellId);
      setShowContextMenu(true);
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
    },
    [],
  );

  /**
   * Handle key presses while editing
   * @param e - Keyboard event
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (editingCell) {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          saveCell();
        } else if (e.key === "Escape") {
          setEditingCell(null);
        }
      } else if (selectedCell) {
        // Navigation with arrow keys
        if (
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
          e.preventDefault();
          navigateWithArrowKeys(e.key, selectedCell);
        } else if (e.key === "Enter" || e.key === "F2") {
          e.preventDefault();
          startEditing(selectedCell);
        }
      }
    },
    [editingCell, saveCell, selectedCell, startEditing],
  );

  /**
   * Navigate between cells with arrow keys
   * @param key - The arrow key pressed
   * @param currentCellId - The ID of the current cell
   */
  const navigateWithArrowKeys = useCallback(
    (key: string, currentCellId: string) => {
      const [rowStr, colStr] = currentCellId.split("-").slice(1);
      const currentRow = parseInt(rowStr);
      const currentCol = parseInt(colStr);

      let nextRow = currentRow;
      let nextCol = currentCol;

      switch (key) {
        case "ArrowUp":
          nextRow = Math.max(0, currentRow - 1);
          break;
        case "ArrowDown":
          nextRow = Math.min(tableData.rows - 1, currentRow + 1);
          break;
        case "ArrowLeft":
          nextCol = Math.max(0, currentCol - 1);
          break;
        case "ArrowRight":
          nextCol = Math.min(tableData.columns - 1, currentCol + 1);
          break;
      }

      const nextCellId = `cell-${nextRow}-${nextCol}`;

      if (tableData.cells[nextCellId]) {
        setSelectedCell(nextCellId);
        // Focus the cell element
        if (cellRefs.current[nextCellId]) {
          cellRefs.current[nextCellId]?.focus();
        }
      }
    },
    [tableData.rows, tableData.columns, tableData.cells],
  );

  /**
   * Add a new row to the table
   * @param position - Whether to add the row before or after the selected row
   */
  const addRow = useCallback(
    (position: "before" | "after") => {
      if (!selectedCell || !onUpdateTable) return;

      try {
        const [, rowStr] = selectedCell.split("-");
        const selectedRow = parseInt(rowStr);
        const newRowIndex =
          position === "before" ? selectedRow : selectedRow + 1;

        // Create updated table data with new row
        const updatedData: TableData = {
          ...tableData,
          rows: tableData.rows + 1,
          cells: { ...tableData.cells },
        };

        // Move existing rows down if needed
        for (let row = tableData.rows - 1; row >= newRowIndex; row--) {
          for (let col = 0; col < tableData.columns; col++) {
            const oldCellId = `cell-${row}-${col}`;
            const newCellId = `cell-${row + 1}-${col}`;

            if (updatedData.cells[oldCellId]) {
              updatedData.cells[newCellId] = {
                ...updatedData.cells[oldCellId],
              };
            }
          }
        }

        // Add empty cells for the new row
        for (let col = 0; col < tableData.columns; col++) {
          updatedData.cells[`cell-${newRowIndex}-${col}`] = {
            id: `cell-${newRowIndex}-${col}`,
            content: "",
            style: {},
          };
        }

        onUpdateTable(updatedData);
      } catch (error) {
        console.error("Error adding row:", error);
      }
    },
    [selectedCell, onUpdateTable, tableData],
  );

  /**
   * Add a new column to the table
   * @param position - Whether to add the column before or after the selected column
   */
  const addColumn = useCallback(
    (position: "before" | "after") => {
      if (!selectedCell || !onUpdateTable) return;

      try {
        const [, , colStr] = selectedCell.split("-");
        const selectedCol = parseInt(colStr);
        const newColIndex =
          position === "before" ? selectedCol : selectedCol + 1;

        // Create updated table data with new column
        const updatedData: TableData = {
          ...tableData,
          columns: tableData.columns + 1,
          cells: { ...tableData.cells },
        };

        // Move existing columns right if needed
        for (let row = 0; row < tableData.rows; row++) {
          for (let col = tableData.columns - 1; col >= newColIndex; col--) {
            const oldCellId = `cell-${row}-${col}`;
            const newCellId = `cell-${row}-${col + 1}`;

            if (updatedData.cells[oldCellId]) {
              updatedData.cells[newCellId] = {
                ...updatedData.cells[oldCellId],
              };
            }
          }
        }

        // Add empty cells for the new column
        for (let row = 0; row < tableData.rows; row++) {
          updatedData.cells[`cell-${row}-${newColIndex}`] = {
            id: `cell-${row}-${newColIndex}`,
            content: "",
            style: {},
          };
        }

        onUpdateTable(updatedData);
      } catch (error) {
        console.error("Error adding column:", error);
      }
    },
    [selectedCell, onUpdateTable, tableData],
  );

  /**
   * Delete a row from the table
   */
  const deleteRow = useCallback(() => {
    if (!selectedCell || !onUpdateTable) return;

    try {
      const [, rowStr] = selectedCell.split("-");
      const selectedRow = parseInt(rowStr);

      // Prevent deleting if there's only one row left
      if (tableData.rows <= 1) {
        console.warn("Cannot delete the only remaining row");

        return;
      }

      // Create updated table data with row removed
      const updatedData: TableData = {
        ...tableData,
        rows: tableData.rows - 1,
        cells: { ...tableData.cells },
      };

      // Remove the selected row and shift rows up
      for (let row = selectedRow; row < tableData.rows - 1; row++) {
        for (let col = 0; col < tableData.columns; col++) {
          const nextRowCellId = `cell-${row + 1}-${col}`;

          updatedData.cells[`cell-${row}-${col}`] = {
            ...updatedData.cells[nextRowCellId],
          };
        }
      }

      // Remove the last row's cells
      for (let col = 0; col < tableData.columns; col++) {
        delete updatedData.cells[`cell-${tableData.rows - 1}-${col}`];
      }

      onUpdateTable(updatedData);

      // Update selected cell if needed
      if (selectedRow >= updatedData.rows) {
        setSelectedCell(`cell-${updatedData.rows - 1}-0`);
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  }, [selectedCell, onUpdateTable, tableData]);

  /**
   * Delete a column from the table
   */
  const deleteColumn = useCallback(() => {
    if (!selectedCell || !onUpdateTable) return;

    try {
      const [, , colStr] = selectedCell.split("-");
      const selectedCol = parseInt(colStr);

      // Prevent deleting if there's only one column left
      if (tableData.columns <= 1) {
        console.warn("Cannot delete the only remaining column");

        return;
      }

      // Create updated table data with column removed
      const updatedData: TableData = {
        ...tableData,
        columns: tableData.columns - 1,
        cells: { ...tableData.cells },
      };

      // Remove the selected column and shift columns left
      for (let row = 0; row < tableData.rows; row++) {
        for (let col = selectedCol; col < tableData.columns - 1; col++) {
          const nextColCellId = `cell-${row}-${col + 1}`;

          updatedData.cells[`cell-${row}-${col}`] = {
            ...updatedData.cells[nextColCellId],
          };
        }
        // Remove the last column's cell
        delete updatedData.cells[`cell-${row}-${tableData.columns - 1}`];
      }

      onUpdateTable(updatedData);

      // Update selected cell if needed
      if (selectedCol >= updatedData.columns) {
        setSelectedCell(`cell-0-${updatedData.columns - 1}`);
      }
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  }, [selectedCell, onUpdateTable, tableData]);

  /**
   * Generate CSS classes for a cell based on its position and properties
   * @param rowIndex - The row index
   * @param colIndex - The column index
   * @returns CSS class string
   */
  const getCellClassName = useCallback(
    (rowIndex: number, colIndex: number): string => {
      const isHeader = tableData.hasHeader && rowIndex === 0;
      const isFooter = tableData.hasFooter && rowIndex === tableData.rows - 1;
      const isHeaderColumn = tableData.hasHeaderColumn && colIndex === 0;
      const isAlternating = tableData.alternatingRows && rowIndex % 2 === 1;

      let classNames = "p-2 border ";

      if (isHeader) {
        classNames += "font-semibold ";
        classNames += `bg-[${tableData.style?.headerBackgroundColor || "#4F46E5"}] `;
        classNames += `text-[${tableData.style?.headerTextColor || "#FFFFFF"}] `;
      } else if (isFooter) {
        classNames += "font-medium ";
        classNames += `bg-[${tableData.style?.footerBackgroundColor || "#F3F4F6"}] `;
        classNames += `text-[${tableData.style?.footerTextColor || "#000000"}] `;
      } else if (isHeaderColumn && !isHeader && !isFooter) {
        classNames += "font-medium ";
        classNames += "bg-opacity-80 ";
        classNames += `bg-[${tableData.style?.headerBackgroundColor || "#4F46E5"}] `;
        classNames += `text-[${tableData.style?.headerTextColor || "#FFFFFF"}] `;
      } else if (
        isAlternating &&
        !isHeader &&
        !isFooter &&
        !(isHeaderColumn && tableData.hasHeaderColumn)
      ) {
        classNames += "bg-gray-50 ";
      } else {
        classNames += `bg-[${tableData.style?.bodyBackgroundColor || "#FFFFFF"}] `;
        classNames += `text-[${tableData.style?.bodyTextColor || "#000000"}] `;
      }

      classNames += `border-[${tableData.style?.borderColor || "#E5E7EB"}] `;
      classNames += `border-[${tableData.style?.borderWidth || 1}px] `;
      classNames += `border-${tableData.style?.borderStyle || "solid"} `;

      return classNames;
    },
    [tableData],
  );

  /**
   * Render the content of a cell
   * @param cellId - The ID of the cell
   * @returns JSX for the cell content
   */
  const renderCellContent = useCallback(
    (cellId: string) => {
      const cell = tableData.cells[cellId];

      if (!cell) {
        return <span className="text-red-500">Error: Cell not found</span>;
      }

      if (editingCell === cellId) {
        return (
          <textarea
            className="w-full h-full min-h-[40px] bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
            value={cellContent}
            onBlur={saveCell}
            onChange={(e) => setCellContent(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        );
      }

      return (
        <div
          className="w-full h-full"
          style={{
            textAlign: cell.style?.textAlign || "left",
            fontWeight: cell.style?.fontWeight || "normal",
            fontStyle: cell.style?.fontStyle || "normal",
            textDecoration: cell.style?.textDecoration || "none",
            backgroundColor: cell.style?.backgroundColor,
            color: cell.style?.color,
          }}
        >
          {cell.content}
        </div>
      );
    },
    [tableData.cells, editingCell, cellContent, saveCell],
  );

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showContextMenu]);

  // Save cell content when editing cell changes
  useEffect(() => {
    if (editingCell === null && selectedCell) {
      // Focus the selected cell when not editing
      cellRefs.current[selectedCell]?.focus();
    }
  }, [editingCell, selectedCell]);

  // Calculate table style based on props
  const tableStyle: React.CSSProperties = {
    width: tableData.style?.width || "100%",
    borderCollapse: "collapse",
    borderSpacing: 0,
    tableLayout: "fixed",
    borderWidth: tableData.style?.borderWidth || 1,
    borderStyle: tableData.style?.borderStyle || "solid",
    borderColor: tableData.style?.borderColor || "#E5E7EB",
  };

  return (
    <ErrorBoundary id="table-component">
      <div
        className={`relative ${selected ? "ring-2 ring-indigo-600" : ""}`}
        role="button"
        tabIndex={0}
        onClick={handleTableClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTableClick(e);
          }
        }}
      >
        <table
          ref={tableRef}
          className="w-full"
          style={tableStyle}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          <tbody>
            {Array.from({ length: tableData.rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: tableData.columns }).map(
                  (_, colIndex) => {
                    const cellId = `cell-${rowIndex}-${colIndex}`;
                    const cell = tableData.cells[cellId];

                    if (!cell) {
                      return (
                        <td
                          key={cellId}
                          className="border border-red-500 p-2 bg-red-100"
                          id={cellId}
                        >
                          <span className="text-red-500">
                            Error: Cell data missing
                          </span>
                        </td>
                      );
                    }

                    const isHovered = hoveredCell === cellId;
                    const isSelected = selectedCell === cellId;

                    return (
                      <td
                        key={cellId}
                        ref={(el) => (cellRefs.current[cellId] = el)}
                        className={`
                        relative
                        ${getCellClassName(rowIndex, colIndex)}
                        ${isSelected ? "ring-2 ring-inset ring-indigo-600" : ""}
                        ${isEditing ? "cursor-pointer" : ""}
                      `}
                        colSpan={cell.colspan}
                        data-cell-id={cellId}
                        id={cellId}
                        rowSpan={cell.rowspan}
                        tabIndex={isEditing ? 0 : -1}
                        onClick={(e) => handleCellClick(e, cellId)}
                        onContextMenu={(e) => handleCellContextMenu(e, cellId)}
                        onMouseEnter={() => setHoveredCell(cellId)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {renderCellContent(cellId)}
                      </td>
                    );
                  },
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Controls for table when selected */}
        {selected && isEditing && (
          <div className="absolute -top-10 right-0 flex items-center gap-1">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-gray-800 text-white"
                  size="sm"
                  variant="flat"
                >
                  <Icon
                    className="mr-1"
                    icon="material-symbols:table-rows"
                    width={16}
                  />
                  Rows
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Row Options">
                <DropdownItem onClick={() => addRow("before")}>
                  Add Row Above
                </DropdownItem>
                <DropdownItem onClick={() => addRow("after")}>
                  Add Row Below
                </DropdownItem>
                <DropdownItem onClick={deleteRow}>Delete Row</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-gray-800 text-white"
                  size="sm"
                  variant="flat"
                >
                  <Icon
                    className="mr-1"
                    icon="material-symbols:table-columns"
                    width={16}
                  />
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Column Options">
                <DropdownItem onClick={() => addColumn("before")}>
                  Add Column Left
                </DropdownItem>
                <DropdownItem onClick={() => addColumn("after")}>
                  Add Column Right
                </DropdownItem>
                <DropdownItem onClick={deleteColumn}>
                  Delete Column
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        {/* Context Menu */}
        {showContextMenu && selectedCell && (
          <div
            className="fixed z-50 bg-white shadow-lg rounded-md overflow-hidden border border-gray-200"
            style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          >
            <div className="p-2">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  startEditing(selectedCell);
                  setShowContextMenu(false);
                }}
              >
                Edit Cell
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  addRow("before");
                  setShowContextMenu(false);
                }}
              >
                Add Row Above
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  addRow("after");
                  setShowContextMenu(false);
                }}
              >
                Add Row Below
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  addColumn("before");
                  setShowContextMenu(false);
                }}
              >
                Add Column Left
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  addColumn("after");
                  setShowContextMenu(false);
                }}
              >
                Add Column Right
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  deleteRow();
                  setShowContextMenu(false);
                }}
              >
                Delete Row
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => {
                  deleteColumn();
                  setShowContextMenu(false);
                }}
              >
                Delete Column
              </button>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TableComponent);
