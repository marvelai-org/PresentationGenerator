// src/components/features/application/editor/hooks/useSlideManagement.tsx
import { useState, useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";

import { Slide, SlideContentItem } from "../EditorContainer";

// Define slide templates for quick creation
type TemplateType = "title" | "textAndImage" | "bulletList";

interface SlideTemplates {
  [key: string]: Partial<Slide>;
}

// Define a simplified version of slide templates
const slideTemplates: SlideTemplates = {
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

export default function useSlideManagement(
  slides: Slide[],
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>
) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Navigate to specific slide by index
  const navigateToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  // Add a new blank slide
  const addNewSlide = useCallback(() => {
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
  }, [slides, setSlides, navigateToSlide]);

  // Add a slide from a template
  const addSlideFromTemplate = useCallback(
    (templateType: TemplateType) => {
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
    },
    [slides, setSlides, navigateToSlide]
  );

  // Duplicate an existing slide
  const duplicateSlide = useCallback(
    (index: number) => {
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
    },
    [slides, setSlides, navigateToSlide]
  );

  // Delete a slide
  const deleteSlide = useCallback(
    (index: number) => {
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
    },
    [slides, currentSlideIndex, setSlides, navigateToSlide]
  );

  // Move a slide up in the order
  const moveSlideUp = useCallback(
    (index: number) => {
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
    },
    [slides, setSlides, navigateToSlide]
  );

  // Move a slide down in the order
  const moveSlideDown = useCallback(
    (index: number) => {
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
    },
    [slides, setSlides, navigateToSlide]
  );

  // Handle drag and drop reordering
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
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
            oldIndex < newIndex
              ? currentSlideIndex - 1
              : currentSlideIndex + 1
          );
        }
      }
    },
    [slides, currentSlideIndex, setSlides, navigateToSlide]
  );

  // Update a slide's content
  const updateSlideContent = useCallback(
    (slideId: number, contentId: string, value: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

      if (slideIndex !== -1) {
        const contentIndex = slidesCopy[slideIndex].content.findIndex(
          (item) => item.id === contentId
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
    },
    [slides, setSlides]
  );

  // Update a slide's title
  const updateSlideTitle = useCallback(
    (slideId: number, title: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

      if (slideIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          title,
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides]
  );

  // Remove content from a slide
  const removeContent = useCallback(
    (slideId: number, contentId: string) => {
      const slidesCopy = [...slides];
      const slideIndex = slidesCopy.findIndex((s) => s.id === slideId);

      if (slideIndex !== -1) {
        slidesCopy[slideIndex] = {
          ...slidesCopy[slideIndex],
          content: slidesCopy[slideIndex].content.filter(
            (item) => item.id !== contentId
          ),
        };

        setSlides(slidesCopy);
      }
    },
    [slides, setSlides]
  );

  // Add content to a slide
  const handleAddContent = useCallback(
    (slideId: number) => {
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
    },
    [slides, setSlides]
  );

  return {
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
  };
}