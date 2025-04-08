import { render, screen, fireEvent } from "@testing-library/react";

import "@testing-library/jest-dom";
import ShapeSelector from "../ShapeSelector";
import ShapeProperties from "../ShapeProperties";
import { SlideContentItem } from "../../../types/editor";

// Mock functions
const mockOnSelect = jest.fn();
const mockOnClose = jest.fn();
const mockOnUpdateShape = jest.fn();

// Mock shape data for testing
const mockShape: SlideContentItem = {
  id: "shape-test123",
  type: "shape",
  value: "square",
  x: 100,
  y: 100,
  width: 200,
  height: 200,
  style: {
    color: "#FFFFFF",
    backgroundColor: "#6366F1",
    borderColor: "#4F46E5",
    borderStyle: "solid",
    borderWidth: 2,
    opacity: 1,
    zIndex: 1,
    rotation: 0,
  },
};

describe("Shape Components", () => {
  describe("ShapeSelector", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should render shape selector modal", () => {
      render(
        <ShapeSelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
        />,
      );

      expect(screen.getByText("Select a Shape")).toBeInTheDocument();
      expect(screen.getByText("Basic Shapes")).toBeInTheDocument();
    });

    test("should select a shape", () => {
      render(
        <ShapeSelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
        />,
      );

      // Find and click on a shape button
      const squareButton =
        screen.getByLabelText(/square/i) ||
        screen.getByTitle(/square/i) ||
        screen.getAllByRole("button")[1];

      fireEvent.click(squareButton);

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.stringContaining("square"),
      );
      expect(mockOnClose).toHaveBeenCalled();
    });

    test("should categorize shapes correctly", () => {
      render(
        <ShapeSelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
        />,
      );

      expect(screen.getByText("Basic Shapes")).toBeInTheDocument();
      expect(screen.getByText("Lines & Arrows")).toBeInTheDocument();
      expect(screen.getByText("Process Shapes")).toBeInTheDocument();
      expect(screen.getByText("Labels")).toBeInTheDocument();
    });
  });

  describe("ShapeProperties", () => {
    test("should render properties panel", () => {
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      expect(screen.getByText("Fill Color")).toBeInTheDocument();
      expect(screen.getByText("Border")).toBeInTheDocument();
      expect(screen.getByText("Position & Size")).toBeInTheDocument();
    });

    test("should update shape properties", () => {
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      // Find and interact with position inputs
      const xInput =
        screen.getByLabelText(/x position/i) ||
        screen.getByRole("spinbutton", { name: /x/i });

      fireEvent.change(xInput, { target: { value: "150" } });

      expect(mockOnUpdateShape).toHaveBeenCalledWith(
        mockShape.id,
        expect.objectContaining({
          x: 150,
        }),
      );
    });

    test("should update shape style", () => {
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      // Find and interact with color inputs
      const colorInput =
        screen.getByLabelText(/fill color/i) ||
        screen.getAllByRole("textbox")[0];

      fireEvent.change(colorInput, { target: { value: "#FF0000" } });

      expect(mockOnUpdateShape).toHaveBeenCalledWith(
        mockShape.id,
        expect.objectContaining({
          style: expect.objectContaining({
            backgroundColor: "#FF0000",
          }),
        }),
      );
    });

    test("should update border properties", () => {
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      // Find and interact with border inputs
      const borderWidthInput =
        screen.getByLabelText(/border width/i) ||
        screen.getByRole("spinbutton", { name: /border width/i });

      fireEvent.change(borderWidthInput, { target: { value: "3" } });

      expect(mockOnUpdateShape).toHaveBeenCalledWith(
        mockShape.id,
        expect.objectContaining({
          style: expect.objectContaining({
            borderWidth: 3,
          }),
        }),
      );
    });

    test("should update rotation", () => {
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      // Find and interact with rotation input
      const rotationInput =
        screen.getByLabelText(/rotation/i) ||
        screen.getByRole("spinbutton", { name: /rotation/i });

      fireEvent.change(rotationInput, { target: { value: "45" } });

      expect(mockOnUpdateShape).toHaveBeenCalledWith(
        mockShape.id,
        expect.objectContaining({
          style: expect.objectContaining({
            rotation: 45,
          }),
        }),
      );
    });
  });

  describe("Integration", () => {
    test("should handle the complete shape workflow", () => {
      // First render shape selector
      const { unmount } = render(
        <ShapeSelector
          isOpen={true}
          onClose={mockOnClose}
          onSelect={mockOnSelect}
        />,
      );

      // Select a shape
      const squareButton =
        screen.getByLabelText(/square/i) ||
        screen.getByTitle(/square/i) ||
        screen.getAllByRole("button")[1];

      fireEvent.click(squareButton);

      // Verify onSelect was called
      expect(mockOnSelect).toHaveBeenCalled();
      unmount();

      // Now simulate that a shape was added to the slide and selected
      render(
        <ShapeProperties
          selectedShape={mockShape}
          onUpdateShape={mockOnUpdateShape}
        />,
      );

      // Modify the shape
      const widthInput =
        screen.getByLabelText(/width/i) ||
        screen.getByRole("spinbutton", { name: /width/i });

      fireEvent.change(widthInput, { target: { value: "300" } });

      // Verify shape was updated
      expect(mockOnUpdateShape).toHaveBeenCalledWith(
        mockShape.id,
        expect.objectContaining({
          width: 300,
        }),
      );
    });
  });
});
