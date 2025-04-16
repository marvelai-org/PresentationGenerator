import { Constraints, ConstraintElement } from './index';

export interface LayoutPreset {
  name: string;
  description: string;
  elements: ConstraintElement[];
}

export const LAYOUT_PRESETS: Record<string, LayoutPreset> = {
  // Title + Content layout
  titleAndContent: {
    name: 'Title and Content',
    description: 'A title at the top with content below',
    elements: [
      {
        id: 'title',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 10 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 60,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'content',
        type: 'content',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: { percentage: 70 },
          },
          margin: 20,
          zIndex: 5
        }
      }
    ]
  },
  
  // Title + Two Columns layout
  twoColumns: {
    name: 'Two Columns',
    description: 'Title at the top with two columns below',
    elements: [
      {
        id: 'title',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 10 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 60,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'leftColumn',
        type: 'content',
        constraints: {
          position: {
            x: { percentage: 25 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: { percentage: 45 },
            height: { percentage: 70 },
          },
          margin: 15,
          zIndex: 5
        }
      },
      {
        id: 'rightColumn',
        type: 'content',
        constraints: {
          position: {
            x: { percentage: 75 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: { percentage: 45 },
            height: { percentage: 70 },
          },
          margin: 15,
          zIndex: 5
        }
      }
    ]
  },
  
  // Big Picture layout
  bigPicture: {
    name: 'Big Picture',
    description: 'A large image with a title overlay',
    elements: [
      {
        id: 'image',
        type: 'image',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 50 },
            align: 'center'
          },
          size: {
            width: { percentage: 100 },
            height: { percentage: 100 },
          },
          zIndex: 1
        }
      },
      {
        id: 'titleOverlay',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 85 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 70,
          },
          margin: 10,
          zIndex: 10
        }
      }
    ]
  },
  
  // Chart focused layout
  chartFocused: {
    name: 'Chart Focus',
    description: 'A layout focused on presenting a chart with supporting text',
    elements: [
      {
        id: 'title',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 8 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 50,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'chart',
        type: 'chart',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 50 },
            align: 'center'
          },
          size: {
            width: { percentage: 80 },
            height: { percentage: 60 },
          },
          margin: 15,
          zIndex: 5
        }
      },
      {
        id: 'description',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 90 },
            align: 'center'
          },
          size: {
            width: { percentage: 80 },
            height: 60,
          },
          margin: 10,
          zIndex: 10
        }
      }
    ]
  },
  
  // Quote layout
  quote: {
    name: 'Quote',
    description: 'A centered quote with an optional attribution',
    elements: [
      {
        id: 'quoteBackground',
        type: 'shape',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 50 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: { percentage: 80 },
          },
          zIndex: 1
        }
      },
      {
        id: 'quoteText',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 45 },
            align: 'center'
          },
          size: {
            width: { percentage: 80 },
            height: { percentage: 60 },
          },
          margin: 20,
          zIndex: 10
        }
      },
      {
        id: 'attribution',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 75 },
            y: { percentage: 80 },
            align: 'end'
          },
          size: {
            width: { percentage: 50 },
            height: 40,
          },
          margin: 10,
          zIndex: 10
        }
      }
    ]
  },
  
  // Comparison layout
  comparison: {
    name: 'Comparison',
    description: 'Compare two items side by side with a divider',
    elements: [
      {
        id: 'title',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 10 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 60,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'leftItem',
        type: 'content',
        constraints: {
          position: {
            x: { percentage: 25 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: { percentage: 45 },
            height: { percentage: 70 },
          },
          margin: 15,
          zIndex: 5
        }
      },
      {
        id: 'divider',
        type: 'shape',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: 2,
            height: { percentage: 70 },
          },
          zIndex: 2
        }
      },
      {
        id: 'rightItem',
        type: 'content',
        constraints: {
          position: {
            x: { percentage: 75 },
            y: { percentage: 55 },
            align: 'center'
          },
          size: {
            width: { percentage: 45 },
            height: { percentage: 70 },
          },
          margin: 15,
          zIndex: 5
        }
      }
    ]
  },
  
  // Bullet Points layout
  bulletPoints: {
    name: 'Bullet Points',
    description: 'Title with bullet points below',
    elements: [
      {
        id: 'title',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 15 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 70,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'bulletPoints',
        type: 'list',
        constraints: {
          position: {
            x: { percentage: 10 },
            y: { percentage: 30 },
            align: 'start'
          },
          size: {
            width: { percentage: 80 },
            height: { percentage: 60 },
          },
          margin: {
            left: 40,
            right: 20,
            top: 20,
            bottom: 20
          },
          zIndex: 5
        }
      }
    ]
  },
  
  // Section Header layout
  sectionHeader: {
    name: 'Section Header',
    description: 'A bold section header with subtitle',
    elements: [
      {
        id: 'background',
        type: 'shape',
        constraints: {
          position: {
            x: { percentage: 0 },
            y: { percentage: 0 },
            align: 'start'
          },
          size: {
            width: { percentage: 100 },
            height: { percentage: 100 },
          },
          zIndex: 1
        }
      },
      {
        id: 'mainTitle',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 40 },
            align: 'center'
          },
          size: {
            width: { percentage: 90 },
            height: 80,
          },
          margin: 10,
          zIndex: 10
        }
      },
      {
        id: 'subtitle',
        type: 'text',
        constraints: {
          position: {
            x: { percentage: 50 },
            y: { percentage: 65 },
            align: 'center'
          },
          size: {
            width: { percentage: 70 },
            height: 50,
          },
          margin: 10,
          zIndex: 10
        }
      }
    ]
  }
}; 