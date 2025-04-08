import { render, screen, fireEvent } from "@testing-library/react";

import TableSelector from "../selectors/TableSelector";
import TableComponent from "../elements/TableComponent";
import TableProperties from "../properties/TableProperties";
import { TableData } from "@/types/editor";

// Mock tableData for testing
const mockTableData: TableData = {
  rows: 3,
  columns: 4,
  cells: {
    "cell-0-0": { id: "cell-0-0", content: "Header 1" },
    "cell-0-1": { id: "cell-0-1", content: "Header 2" },
    "cell-0-2": { id: "cell-0-2", content: "Header 3" },
    "cell-0-3": { id: "cell-0-3", content: "Header 4" },
    "cell-1-0": { id: "cell-1-0", content: "Row 1" },
    "cell-1-1": { id: "cell-1-1", content: "Cell 1,1" },
    "cell-1-2": { id: "cell-1-2", content: "Cell 1,2" },
    "cell-1-3": { id: "cell-1-3", content: "Cell 1,3" },
    "cell-2-0": { id: "cell-2-0", content: "Row 2" },
    "cell-2-1": { id: "cell-2-1", content: "Cell 2,1" },
    "cell-2-2": { id: "cell-2-2", content: "Cell 2,2" },
    "cell-2-3": { id: "cell-2-3", content: "Cell 2,3" },
  },
  hasHeader: true,
  hasHeaderColumn: true,
  style: {
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderStyle: "solid",
    headerBackgroundColor: "#4F46E5",
    headerTextColor: "#FFFFFF",
  },
};

describe("Table Components", () => {
  describe("TableSelector", () => {
    test("should render table selector modal", () => {
      const onSelectMock = jest.fn();
      const onCloseMock = jest.fn();

      render(
        <TableSelector
          isOpen={true}
          onClose={onCloseMock}
          onSelect={onSelectMock}
        />,
      );

      // Check if basic elements are rendered
      expect(screen.getByText("Insert Table")).toBeInTheDocument();
      expect(screen.getByText("Templates")).toBeInTheDocument();
      expect(screen.getByText("Custom")).toBeInTheDocument();
    });

    test("should call onSelect when a table is created", () => {
      const onSelectMock = jest.fn();
      const onCloseMock = jest.fn();

      render(
        <TableSelector
          isOpen={true}
          onClose={onCloseMock}
          onSelect={onSelectMock}
        />,
      );

      // Find and click the insert button
      fireEvent.click(screen.getByText("Insert Table"));

      // Check if onSelect was called with appropriate options
      expect(onSelectMock).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: expect.any(Number),
          columns: expect.any(Number),
        }),
      );
    });
  });

  describe("TableComponent", () => {
    test("should render a table with the correct structure", () => {
      const onUpdateTableMock = jest.fn();
      const onSelectTableMock = jest.fn();

      render(
        <TableComponent
          tableData={mockTableData}
          onSelectTable={onSelectTableMock}
          onUpdateTable={onUpdateTableMock}
        />,
      );

      // Check if table cells are rendered
      expect(screen.getByText("Header 1")).toBeInTheDocument();
      expect(screen.getByText("Cell 1,2")).toBeInTheDocument();
      expect(screen.getByText("Row 2")).toBeInTheDocument();
    });

    test("should handle selection", () => {
      const onUpdateTableMock = jest.fn();
      const onSelectTableMock = jest.fn();

      render(
        <TableComponent
          tableData={mockTableData}
          onSelectTable={onSelectTableMock}
          onUpdateTable={onUpdateTableMock}
        />,
      );

      // Click on the table to select it
      fireEvent.click(screen.getByText("Header 1"));

      // Check if selection handler was called
      expect(onSelectTableMock).toHaveBeenCalled();
    });
  });

  describe("TableProperties", () => {
    test("should render table properties panel", () => {
      const onUpdateTableMock = jest.fn();

      render(
        <TableProperties
          tableData={mockTableData}
          onUpdateTable={onUpdateTableMock}
        />,
      );

      // Check if tabs and controls are rendered
      expect(screen.getByText("Style")).toBeInTheDocument();
      expect(screen.getByText("Layout")).toBeInTheDocument();
      expect(screen.getByText("Options")).toBeInTheDocument();
    });

    test("should update table properties when changed", () => {
      const onUpdateTableMock = jest.fn();

      render(
        <TableProperties
          tableData={mockTableData}
          onUpdateTable={onUpdateTableMock}
        />,
      );

      // Find and click style option
      fireEvent.click(screen.getByText("Style"));

      // Change border style
      fireEvent.click(screen.getByText("Border Style"));
      fireEvent.click(screen.getByText("Dashed"));

      // Check if update was called with the new style
      expect(onUpdateTableMock).toHaveBeenCalledWith(
        expect.objectContaining({
          style: expect.objectContaining({
            borderStyle: "dashed",
          }),
        }),
      );
    });
  });
});
