import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";

import PresentationEditorPage from "../../../app/dashboard/create/editor/page";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the Icon component from @iconify/react
jest.mock("@iconify/react", () => ({
  Icon: ({ icon }: { icon: string }) => <span data-icon={icon}>IconMock</span>,
}));

// Mock DnD Kit
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
}));

jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  }),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: jest.fn(),
    },
  },
}));

jest.mock("@dnd-kit/modifiers", () => ({
  restrictToVerticalAxis: jest.fn(),
}));

// Mock components
jest.mock("../SlideStyles", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="slide-styles-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../MediaSelector", () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="media-selector-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../ShapeSelector", () => ({
  __esModule: true,
  default: ({
    isOpen,
    onSelect,
    onClose,
  }: {
    isOpen: boolean;
    onSelect: (shape: string) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="shape-selector-modal">
        <button
          onClick={() => {
            onSelect("square");
            onClose();
          }}
        >
          Select Square
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../TableSelector", () => ({
  __esModule: true,
  default: ({
    isOpen,
    onSelect,
    onClose,
  }: {
    isOpen: boolean;
    onSelect: (options: any) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="table-selector-modal">
        <button
          onClick={() => {
            onSelect({
              rows: 3,
              columns: 3,
              hasHeader: true,
            });
            onClose();
          }}
        >
          Create Table
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../EmbedSelector", () => ({
  __esModule: true,
  default: ({
    isOpen,
    onSelect,
    onClose,
  }: {
    isOpen: boolean;
    onSelect: (data: any) => void;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="embed-selector-modal">
        <button
          onClick={() => {
            onSelect({
              id: "youtube-123",
              type: "youtube",
              url: "https://www.youtube.com/watch?v=123",
              title: "Test Video",
              thumbnailUrl: "https://example.com/thumbnail.jpg",
              width: 560,
              height: 315,
              aspectRatio: "16:9",
            });
            onClose();
          }}
        >
          Embed YouTube
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../EditableSlide", () => ({
  __esModule: true,
  default: ({
    slide,
    onUpdateTitle,
    onUpdateContent,
    onAddContent,
    onRemoveContent,
    onShapeSelect,
    onTableSelect,
    onEmbedSelect,
  }: any) => (
    <div data-slide-id={slide.id} data-testid="editable-slide">
      <h3>{slide.title}</h3>
      <button onClick={() => onUpdateTitle("Updated Title")}>
        Update Title
      </button>
      <button onClick={() => onAddContent()}>Add Content</button>
      {slide.content.map((item: any) => (
        <div key={item.id} data-item-id={item.id} data-item-type={item.type}>
          <span>{item.value}</span>
          <button onClick={() => onRemoveContent(item.id)}>Remove</button>
          {item.type === "shape" && (
            <button onClick={() => onShapeSelect(item)}>Select Shape</button>
          )}
          {item.type === "table" && (
            <button onClick={() => onTableSelect(item)}>Select Table</button>
          )}
          {item.type === "embed" && (
            <button onClick={() => onEmbedSelect(item)}>Select Embed</button>
          )}
        </div>
      ))}
    </div>
  ),
}));

describe("PresentationEditorPage Integration", () => {
  beforeEach(() => {
    // Mock router implementation
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }));

    // Reset mocks
    jest.clearAllMocks();
  });

  test("should render the editor with initial slides", () => {
    render(<PresentationEditorPage />);

    // Check for basic elements
    expect(
      screen.getByText("Can We REALLY Stop Climate Change?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Present")).toBeInTheDocument();

    // Check for slide navigation
    const slideElements = screen.getAllByTestId("editable-slide");

    expect(slideElements.length).toBe(1); // Only the current slide should be rendered
  });

  test("should open and close shape selector", async () => {
    render(<PresentationEditorPage />);

    // Find and click the shape tab
    const shapeTab =
      screen.getByText(/Shape/i).closest("button") ||
      screen.getByText(/Shape/i);

    fireEvent.click(shapeTab);

    // Check that the shape selector opened
    await waitFor(() => {
      expect(screen.getByTestId("shape-selector-modal")).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByText("Close", { selector: "button" });

    fireEvent.click(closeButton);

    // Check that the modal closed
    await waitFor(() => {
      expect(
        screen.queryByTestId("shape-selector-modal"),
      ).not.toBeInTheDocument();
    });
  });

  test("should add a shape to the slide", async () => {
    render(<PresentationEditorPage />);

    // Get current content count
    const initialSlide = screen.getByTestId("editable-slide");
    const initialContentCount =
      initialSlide.querySelectorAll("[data-item-id]").length;

    // Open shape selector
    const shapeTab =
      screen.getByText(/Shape/i).closest("button") ||
      screen.getByText(/Shape/i);

    fireEvent.click(shapeTab);

    // Select a shape
    await waitFor(() => {
      const selectShapeButton = screen.getByText("Select Square");

      fireEvent.click(selectShapeButton);
    });

    // Check that a shape was added to the slide
    await waitFor(() => {
      const updatedSlide = screen.getByTestId("editable-slide");
      const newContentCount =
        updatedSlide.querySelectorAll("[data-item-id]").length;

      expect(newContentCount).toBe(initialContentCount + 1);

      // Find the new shape item
      const shapeItems = updatedSlide.querySelectorAll(
        '[data-item-type="shape"]',
      );

      expect(shapeItems.length).toBeGreaterThan(0);
    });
  });

  test("should add and remove content from a slide", () => {
    render(<PresentationEditorPage />);

    // Get initial content count
    const initialSlide = screen.getByTestId("editable-slide");
    const initialContentCount =
      initialSlide.querySelectorAll("[data-item-id]").length;

    // Add content
    const addContentButton = screen.getByText("Add Content");

    fireEvent.click(addContentButton);

    // Check content was added
    const updatedSlide = screen.getByTestId("editable-slide");
    const newContentCount =
      updatedSlide.querySelectorAll("[data-item-id]").length;

    expect(newContentCount).toBe(initialContentCount + 1);

    // Find the last added content and remove it
    const contentItems = updatedSlide.querySelectorAll("[data-item-id]");
    const lastContent = contentItems[contentItems.length - 1];
    const removeButton = lastContent.querySelector(
      "button:last-of-type",
    ) as HTMLButtonElement;

    fireEvent.click(removeButton);

    // Check content was removed
    const finalContentCount = screen
      .getByTestId("editable-slide")
      .querySelectorAll("[data-item-id]").length;

    expect(finalContentCount).toBe(initialContentCount);
  });

  test("should update slide title", () => {
    render(<PresentationEditorPage />);

    // Get initial title
    const initialTitle = screen
      .getByTestId("editable-slide")
      .querySelector("h3")?.textContent;

    // Update title
    const updateTitleButton = screen.getByText("Update Title");

    fireEvent.click(updateTitleButton);

    // Check title was updated
    const updatedTitle = screen
      .getByTestId("editable-slide")
      .querySelector("h3")?.textContent;

    expect(updatedTitle).toBe("Updated Title");
    expect(updatedTitle).not.toBe(initialTitle);
  });

  test("should navigate between slides", () => {
    render(<PresentationEditorPage />);

    // Get current slide ID
    const initialSlide = screen.getByTestId("editable-slide");
    const initialSlideId = initialSlide.dataset.slideId;

    // Find and click next slide button
    const nextButton = screen.getByText("arrow-forward", { exact: false });

    fireEvent.click(nextButton);

    // Check that slide changed
    const newSlide = screen.getByTestId("editable-slide");
    const newSlideId = newSlide.dataset.slideId;

    expect(newSlideId).not.toBe(initialSlideId);

    // Now go back
    const prevButton = screen.getByText("arrow-back", { exact: false });

    fireEvent.click(prevButton);

    // Check that we're back to the first slide
    const finalSlide = screen.getByTestId("editable-slide");
    const finalSlideId = finalSlide.dataset.slideId;

    expect(finalSlideId).toBe(initialSlideId);
  });

  test("should add a table to the slide", async () => {
    render(<PresentationEditorPage />);

    // Get current content count
    const initialSlide = screen.getByTestId("editable-slide");
    const initialContentCount =
      initialSlide.querySelectorAll("[data-item-id]").length;

    // Open table selector
    const tableTab =
      screen.getByText(/Table/i).closest("button") ||
      screen.getByText(/Table/i);

    fireEvent.click(tableTab);

    // Create a table
    await waitFor(() => {
      const createTableButton = screen.getByText("Create Table");

      fireEvent.click(createTableButton);
    });

    // Check that a table was added
    await waitFor(() => {
      const updatedSlide = screen.getByTestId("editable-slide");
      const newContentCount =
        updatedSlide.querySelectorAll("[data-item-id]").length;

      expect(newContentCount).toBe(initialContentCount + 1);

      // Find the table item
      const tableItems = updatedSlide.querySelectorAll(
        '[data-item-type="table"]',
      );

      expect(tableItems.length).toBe(1);
    });
  });

  test("should add an embed to the slide", async () => {
    render(<PresentationEditorPage />);

    // Get current content count
    const initialSlide = screen.getByTestId("editable-slide");
    const initialContentCount =
      initialSlide.querySelectorAll("[data-item-id]").length;

    // Open embed selector
    const embedTab =
      screen.getByText(/Embed/i).closest("button") ||
      screen.getByText(/Embed/i);

    fireEvent.click(embedTab);

    // Add an embed
    await waitFor(() => {
      const embedButton = screen.getByText("Embed YouTube");

      fireEvent.click(embedButton);
    });

    // Check that an embed was added
    await waitFor(() => {
      const updatedSlide = screen.getByTestId("editable-slide");
      const newContentCount =
        updatedSlide.querySelectorAll("[data-item-id]").length;

      expect(newContentCount).toBe(initialContentCount + 1);

      // Find the embed item
      const embedItems = updatedSlide.querySelectorAll(
        '[data-item-type="embed"]',
      );

      expect(embedItems.length).toBe(1);
    });
  });
});
