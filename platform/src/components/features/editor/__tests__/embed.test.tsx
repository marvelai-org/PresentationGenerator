import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import '@testing-library/jest-dom';
import EmbedSelector from '../EmbedSelector';
import EmbedComponent from '../EmbedComponent';
import EmbedProperties from '../EmbedProperties';
import { EmbedData } from '../../../types/editor';

// Mock data for testing
const mockEmbedData: EmbedData = {
  id: 'youtube-test123',
  type: 'youtube',
  url: 'https://www.youtube.com/watch?v=test123',
  title: 'Test YouTube Video',
  thumbnailUrl: 'https://img.youtube.com/vi/test123/maxresdefault.jpg',
  embedHtml:
    '<iframe width="560" height="315" src="https://www.youtube.com/embed/test123" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
  width: 560,
  height: 315,
  aspectRatio: '16:9',
};

// Mock functions
const mockOnSelect = jest.fn();
const mockOnClose = jest.fn();
const mockOnDelete = jest.fn();
const mockOnEdit = jest.fn();
const mockOnUpdateEmbed = jest.fn();

describe('Embed Components', () => {
  describe('EmbedSelector', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should render embed selector modal', () => {
      render(<EmbedSelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

      expect(screen.getByText('Add Embed')).toBeInTheDocument();
      expect(screen.getByText('YouTube')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Enter URL/i)).toBeInTheDocument();
    });

    test('should validate YouTube URL', async () => {
      render(<EmbedSelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/Enter URL/i);

      // Invalid URL
      fireEvent.change(input, {
        target: { value: 'https://youtube.com/invalid' },
      });
      const embedButton = screen.getByText('Embed Content');

      expect(embedButton).toBeDisabled();

      // Valid URL
      fireEvent.change(input, {
        target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      });
      await waitFor(() => {
        expect(embedButton).not.toBeDisabled();
      });
    });

    test('should call onSelect when embed is created', async () => {
      render(<EmbedSelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

      const input = screen.getByPlaceholderText(/Enter URL/i);

      fireEvent.change(input, {
        target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      });

      // Wait for preview to be generated
      await waitFor(() => {
        const embedButton = screen.getByText('Embed Content');

        expect(embedButton).not.toBeDisabled();
        fireEvent.click(embedButton);
      });

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        })
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('EmbedComponent', () => {
    test('should render YouTube embed correctly', () => {
      render(<EmbedComponent embedData={mockEmbedData} isEditing={false} isSelected={false} />);

      const iframe =
        screen.getByTitle(/youtube/i) || screen.getByTitle('') || document.querySelector('iframe');

      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/test123'));
    });

    test('should show controls when selected', () => {
      render(
        <EmbedComponent
          embedData={mockEmbedData}
          isEditing={true}
          isSelected={true}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      const editButton =
        screen.getByLabelText(/edit/i) ||
        screen.getByTitle(/edit/i) ||
        screen.getByRole('button', { name: /edit/i });
      const deleteButton =
        screen.getByLabelText(/delete/i) ||
        screen.getByTitle(/delete/i) ||
        screen.getByRole('button', { name: /delete/i });

      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();

      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalled();

      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalled();
    });
  });

  describe('EmbedProperties', () => {
    test('should render properties panel', () => {
      render(<EmbedProperties selectedEmbed={mockEmbedData} onUpdateEmbed={mockOnUpdateEmbed} />);

      expect(screen.getByText('Width')).toBeInTheDocument();
      expect(screen.getByText('Height')).toBeInTheDocument();
      expect(screen.getByText('Aspect Ratio')).toBeInTheDocument();
    });

    test('should update embed properties', () => {
      render(<EmbedProperties selectedEmbed={mockEmbedData} onUpdateEmbed={mockOnUpdateEmbed} />);

      const widthInput =
        screen.getByLabelText(/width/i) || screen.getByRole('spinbutton', { name: /width/i });

      fireEvent.change(widthInput, { target: { value: '640' } });

      expect(mockOnUpdateEmbed).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          width: 640,
        })
      );
    });
  });

  describe('Integration', () => {
    test('should handle the complete embed workflow', async () => {
      // First render embed selector
      const { unmount } = render(
        <EmbedSelector isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />
      );

      // Input a valid URL
      const input = screen.getByPlaceholderText(/Enter URL/i);

      fireEvent.change(input, {
        target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      });

      // Confirm embed creation
      await waitFor(() => {
        const embedButton = screen.getByText('Embed Content');

        expect(embedButton).not.toBeDisabled();
        fireEvent.click(embedButton);
      });

      // Verify onSelect was called with correct data
      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'youtube',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        })
      );

      // Cleanup first component
      unmount();

      // Assume the embed was selected, now render component with created data
      const embedData = mockOnSelect.mock.calls[0][0];

      render(
        <EmbedComponent
          embedData={embedData}
          isEditing={true}
          isSelected={true}
          onDelete={mockOnDelete}
          onEdit={mockOnEdit}
        />
      );

      // Verify component renders correctly
      const iframe =
        screen.getByTitle(/youtube/i) || screen.getByTitle('') || document.querySelector('iframe');

      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/'));
    });
  });
});
