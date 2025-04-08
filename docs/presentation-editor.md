# Presentation Editor Documentation

## Overview

The Presentation Editor is a comprehensive web-based tool for creating, editing, and presenting slide-based presentations. It features a modular architecture with dedicated components for slide management, content editing, and specialized content types like tables, shapes, and embedded media.

## Architecture

The editor follows a component-based architecture with a focus on modular design and clear separation of concerns. Key architectural principles include:

1. **Component Hierarchy**: Core components are organized from high-level containers down to specific content editors
2. **State Management**: Each component manages its own state where appropriate, with parent components coordinating shared state
3. **Type Safety**: TypeScript interfaces ensure consistency across components
4. **Error Boundaries**: Components are wrapped in error boundaries to prevent cascading failures

## Directory Structure

```
src/
├── components/
│   └── editor/           # Editor-specific components
│       ├── ErrorBoundary.tsx
│       ├── TableComponent.tsx
│       ├── TableProperties.tsx
│       ├── TableSelector.tsx
│       ├── ShapeSelector.tsx
│       ├── ShapeProperties.tsx
│       ├── EmbedComponent.tsx
│       ├── EmbedSelector.tsx
│       ├── EmbedProperties.tsx
│       ├── SlideStyles.tsx
│       ├── EditableSlide.tsx
│       ├── MediaSelector.tsx
│       └── ...
│
├── types/
│   └── editor/           # Editor-specific type definitions
│       └── index.ts      # Common interfaces (Slide, SlideContentItem, etc.)
│
└── app/
    └── dashboard/
        └── create/
            └── editor/   # Editor page components
                ├── page.tsx     # Main editor page
                └── present/     # Presentation mode
                    └── page.tsx # Presentation display
```

## Core Components

### Slide Management

- **EditableSlide**: Main component for rendering and editing slides
- **SlideStyles**: Component for configuring slide appearance and transitions

### Table Module

The Table module allows users to create, edit, and style tables within slides.

#### Components:

1. **TableSelector**
   - Purpose: Creates new tables with customizable options
   - Features: 
     - Template selection
     - Custom table dimensions
     - Header/footer configuration

2. **TableComponent**
   - Purpose: Renders and enables interaction with tables
   - Features:
     - Cell editing
     - Row/column management
     - Selection and navigation

3. **TableProperties**
   - Purpose: Controls for styling and configuring tables
   - Features:
     - Border styling
     - Color management
     - Cell formatting

#### Usage Example:

```jsx
// Creating a table
<TableSelector
  isOpen={isTableSelectorOpen}
  onClose={closeTableSelector}
  onSelect={handleTableSelect}
/>

// Rendering a table
<TableComponent
  tableData={selectedTable.tableData}
  isEditing={true}
  onUpdateTable={updateTableData}
  onSelectTable={handleTableSelect}
  selected={isSelected}
/>

// Editing table properties
<TableProperties
  tableData={selectedTable.tableData}
  onUpdateTable={(updatedData) => updateTableProperties(selectedTable.id, updatedData)}
/>
```

### Embed Module

The Embed module enables users to embed external content, such as videos, music, or other web content.

#### Components:

1. **EmbedSelector**
   - Purpose: Interface for selecting and configuring embedded content
   - Features:
     - URL validation
     - Platform detection (YouTube, Vimeo, etc.)
     - Preview generation

2. **EmbedComponent**
   - Purpose: Renders embedded content
   - Features:
     - Responsive sizing
     - Platform-specific rendering
     - Error handling

3. **EmbedProperties**
   - Purpose: Controls for customizing embedded content
   - Features:
     - Size adjustment
     - Aspect ratio control
     - Additional settings per platform

#### Supported Platforms:

- YouTube
- Vimeo
- Loom
- Spotify
- Figma
- Custom embeds (general iframe)

#### Usage Example:

```jsx
// Selecting content to embed
<EmbedSelector
  isOpen={isEmbedSelectorOpen}
  onSelect={handleEmbedSelect}
  onClose={closeEmbedSelector}
/>

// Rendering embedded content
<EmbedComponent
  embedData={selectedEmbed.embedData}
  isEditing={true}
  isSelected={isSelected}
  width={item.width}
  height={item.height}
  position={{ x: item.x || 0, y: item.y || 0 }}
  onDelete={() => onRemoveContent(item.id)}
  onEdit={() => handleEmbedSelect(item.id)}
/>

// Customizing embed properties
<EmbedProperties
  selectedEmbed={selectedEmbed.embedData}
  onUpdateEmbed={(embedId, properties) => updateEmbedProperties(selectedEmbed.id, properties)}
/>
```

## Error Handling

The editor implements a comprehensive error handling strategy:

1. **Component-Level Error Boundaries**: Critical components are wrapped in error boundaries
2. **Input Validation**: User inputs are validated before processing
3. **Fallback UIs**: Graceful degradation when components fail
4. **Error Reporting**: Errors are logged for debugging

### Using Error Boundaries:

```jsx
<ErrorBoundary id="table-component">
  <TableComponent {...props} />
</ErrorBoundary>
```

## Extending the Editor

### Adding New Content Types

To add a new content type (e.g., charts, code blocks):

1. Define type interfaces in `src/types/editor/index.ts`
2. Create selector, component, and properties components
3. Update `EditableSlide.tsx` to render the new content type
4. Add the new content type to the editor toolbar

### Extending Existing Components

#### Tables

To extend table functionality:

1. Add new properties to the `TableData` interface
2. Implement rendering in `TableComponent.tsx`
3. Add UI controls in `TableProperties.tsx`

#### Embeds

To add support for a new embed platform:

1. Add platform detection in `EmbedSelector.tsx`
2. Implement rendering in `EmbedComponent.tsx`
3. Add platform-specific controls in `EmbedProperties.tsx`

## Testing

The editor components include comprehensive tests:

- Unit tests for individual components
- Integration tests for component interactions
- End-to-end tests for complete workflows

Test files are located alongside their respective components in `__tests__` directories.

## Performance Considerations

- Large presentations may require virtualization
- Complex slides with many elements should be optimized
- Consider memoization for expensive rendering operations

---

## Troubleshooting

### Common Issues

1. **Table editing not working**:
   - Check that the table is selected
   - Verify that cell IDs follow the expected format

2. **Embeds not displaying**:
   - Confirm URL validity
   - Check network access to embedded content
   - Verify platform support

### Debugging

Set `localStorage.debug = 'editor:*'` in the browser console to enable debug logging.

---

For additional assistance, please contact the development team. 