# Editor Component Structure

This directory contains the components and functionality for the presentation editor.

## Directory Structure

- **root**: Contains main editor components and integration

  - `EditableSlide.tsx`: Main slide editing component
  - `SlideEditor.tsx`: Text and content editor component
  - `CommandMenuModal.tsx`: Command palette for editor actions
  - `ErrorBoundary.tsx`: Error handling component

- **elements/**: UI elements for slides

  - `TableComponent.tsx`: Interactive table component
  - `EmbedComponent.tsx`: Embed media component

- **properties/**: Property panels for editing elements

  - `TableProperties.tsx`: Table property editing
  - `ShapeProperties.tsx`: Shape property editing
  - `EmbedProperties.tsx`: Embed property editing

- **selectors/**: Component selectors and pickers

  - `TableSelector.tsx`: Table selector and creation
  - `ShapeSelector.tsx`: Shape selector and styling
  - `MediaSelector.tsx`: Media selector for images and media
  - `EmbedSelector.tsx`: Embed selector for external content

- **styles/**: Styling components

  - `SlideStyles.tsx`: Style components for slides

- ****tests**/**: Unit and integration tests
  - Tests for core editor functionality

## Coding Standards

1. **File Organization**:

   - Each component should be in its appropriate subdirectory
   - Keep related components together
   - Use index.ts files to export components

2. **Styling**:

   - Use CSS Modules for component styles (\*.module.css)
   - Maintain consistent naming conventions for classes

3. **Component Design**:

   - Break large components into smaller, reusable pieces
   - Use TypeScript interfaces for props
   - Document complex component behavior

4. **Import Standards**:
   - Use relative imports for local components
   - Use absolute imports (@/) for application-wide imports

## Usage Examples

```tsx
// Import components using the index exports
import { TableComponent, EmbedComponent } from "./elements";
import { ShapeSelector, MediaSelector } from "./selectors";
```

## Contributing

When adding new components, follow these guidelines:

1. Place components in the appropriate directory
2. Create comprehensive tests in **tests**
3. Update the relevant index.ts files
4. Document complex behavior
