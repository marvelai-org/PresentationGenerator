/**
 * Default Content Library
 * Provides a collection of pre-defined content templates and placeholders
 * for various content types in presentations
 */

export type ContentCategory = 'business' | 'educational' | 'creative' | 'formal' | 'casual' | 'technical';
export type ContentType = 'text' | 'image' | 'list' | 'chart' | 'video' | 'shape';

// Interface for all library items
export interface ContentLibraryItem {
  id: string;
  name: string;
  type: ContentType;
  category: ContentCategory[];
  content: any;
  tags: string[];
  previewUrl?: string;
}

// Text content library
export const textContentLibrary: ContentLibraryItem[] = [
  {
    id: 'text-intro-formal',
    name: 'Formal Introduction',
    type: 'text',
    category: ['business', 'formal'],
    content: 'Welcome to this presentation. We will explore key concepts and discuss their implications.',
    tags: ['introduction', 'welcome', 'formal'],
  },
  {
    id: 'text-intro-casual',
    name: 'Casual Introduction',
    type: 'text',
    category: ['casual', 'creative'],
    content: 'Hey there! Thanks for joining us today as we dive into this exciting topic.',
    tags: ['introduction', 'welcome', 'casual'],
  },
  {
    id: 'text-conclusion-formal',
    name: 'Formal Conclusion',
    type: 'text',
    category: ['business', 'formal'],
    content: 'In conclusion, we have examined several important aspects and demonstrated their significance.',
    tags: ['conclusion', 'summary', 'formal'],
  },
  {
    id: 'text-conclusion-casual',
    name: 'Casual Conclusion',
    type: 'text',
    category: ['casual', 'creative'],
    content: 'That wraps things up! We hope you found this useful. Any questions?',
    tags: ['conclusion', 'summary', 'casual'],
  },
  {
    id: 'text-section-transition',
    name: 'Section Transition',
    type: 'text',
    category: ['business', 'educational', 'formal'],
    content: 'Now, let\'s move on to the next important aspect...',
    tags: ['transition', 'section'],
  },
  {
    id: 'text-quote-inspirational',
    name: 'Inspirational Quote',
    type: 'text',
    category: ['creative', 'casual'],
    content: '"The best way to predict the future is to create it." - Abraham Lincoln',
    tags: ['quote', 'inspiration'],
  },
  {
    id: 'text-technical-description',
    name: 'Technical Description',
    type: 'text',
    category: ['technical', 'educational'],
    content: 'The system architecture employs a microservice approach with containerized deployments, enabling scalability and resilience.',
    tags: ['technical', 'description', 'detailed'],
  }
];

// List content library
export const listContentLibrary: ContentLibraryItem[] = [
  {
    id: 'list-advantages',
    name: 'Advantages List',
    type: 'list',
    category: ['business', 'educational'],
    content: [
      'Improved efficiency and productivity',
      'Cost reduction and resource optimization',
      'Enhanced user experience and satisfaction',
      'Greater scalability and flexibility'
    ],
    tags: ['advantages', 'benefits', 'business'],
  },
  {
    id: 'list-steps',
    name: 'Process Steps',
    type: 'list',
    category: ['educational', 'technical'],
    content: [
      'Analyze requirements and constraints',
      'Develop a comprehensive strategy',
      'Implement the proposed solution',
      'Test and validate results',
      'Deploy and monitor performance'
    ],
    tags: ['process', 'steps', 'how-to'],
  },
  {
    id: 'list-features',
    name: 'Product Features',
    type: 'list',
    category: ['business', 'technical'],
    content: [
      'Intuitive user interface with customizable elements',
      'Powerful analytics dashboard with real-time insights',
      'Seamless integration with existing systems',
      'Enterprise-grade security and compliance',
      'Comprehensive documentation and support'
    ],
    tags: ['features', 'product', 'marketing'],
  },
  {
    id: 'list-timeline',
    name: 'Project Timeline',
    type: 'list',
    category: ['business', 'technical'],
    content: [
      'Phase 1: Research and Planning (2 weeks)',
      'Phase 2: Design and Development (6 weeks)',
      'Phase 3: Testing and Refinement (3 weeks)',
      'Phase 4: Deployment and Launch (1 week)',
      'Phase 5: Monitoring and Improvement (ongoing)'
    ],
    tags: ['timeline', 'project', 'planning'],
  }
];

// Image content library (placeholder URLs for demo purposes)
export const imageContentLibrary: ContentLibraryItem[] = [
  {
    id: 'image-abstract-1',
    name: 'Abstract Pattern',
    type: 'image',
    category: ['creative', 'business'],
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDA4OUY0O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzVDNkJDMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnMSkiLz48cGF0aCBkPSJNMCwxNTAgUTEwMCwxMDAgMjAwLDE1MCBUNDAwLDE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTAsMjAwIFExMDAsMjUwIDIwMCwyMDAgVDQwMCwyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==',
    tags: ['abstract', 'pattern', 'background'],
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNDA4OUY0O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzVDNkJDMDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnMSkiLz48cGF0aCBkPSJNMCwxNTAgUTEwMCwxMDAgMjAwLDE1MCBUNDAwLDE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTAsMjAwIFExMDAsMjUwIDIwMCwyMDAgVDQwMCwyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPjwvc3ZnPg=='
  },
  {
    id: 'image-data-visualization',
    name: 'Data Visualization',
    type: 'image',
    category: ['business', 'technical', 'educational'],
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjxyZWN0IHg9IjUwIiB5PSIyMDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzRDQUY1MCIvPjxyZWN0IHg9IjEyMCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTMwIiBmaWxsPSIjMjE5NkYzIi8+PHJlY3QgeD0iMTkwIiB5PSI4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGQzEwNyIvPjxyZWN0IHg9IjI2MCIgeT0iMTgwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjQ0MzM2Ii8+PHJlY3QgeD0iMzMwIiB5PSIxMDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiM5QzI3QjAiLz48bGluZSB4MT0iMzAiIHkxPSI2MCIgeDI9IjM3MCIgeTI9IjYwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSwyIiAvPjxsaW5lIHgxPSIzMCIgeTE9IjI4MCIgeDI9IjM3MCIgeTI9IjI4MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIC8+PC9zdmc+',
    tags: ['data', 'chart', 'graph', 'visualization'],
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y4ZjlmYSIvPjxyZWN0IHg9IjUwIiB5PSIyMDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzRDQUY1MCIvPjxyZWN0IHg9IjEyMCIgeT0iMTUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTMwIiBmaWxsPSIjMjE5NkYzIi8+PHJlY3QgeD0iMTkwIiB5PSI4MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGQzEwNyIvPjxyZWN0IHg9IjI2MCIgeT0iMTgwIiB3aWR0aD0iNDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjQ0MzM2Ii8+PHJlY3QgeD0iMzMwIiB5PSIxMDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiM5QzI3QjAiLz48bGluZSB4MT0iMzAiIHkxPSI2MCIgeDI9IjM3MCIgeTI9IjYwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNSwyIiAvPjxsaW5lIHgxPSIzMCIgeTE9IjI4MCIgeDI9IjM3MCIgeTI9IjI4MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIC8+PC9zdmc+'
  },
  {
    id: 'image-business-concept',
    name: 'Business Concept',
    type: 'image',
    category: ['business', 'formal'],
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERUVGMiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzFENEVEOCIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwYXRoIGQ9Ik0xNzAsMTIwIEwxODAsMTMwIEwxOTAsMTIwIE0xODAsMTMwIEwxODAsMTcwIiBzdHJva2U9IiMxRDRFRDgiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMjEwLDEyMCBMMjIwLDEzMCBMMjMwLDEyMCBNMjIwLDEzMCBMMjIwLDE3MCIgc3Ryb2tlPSIjMUQ0RUQ4IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIC8+PHBhdGggZD0iTTE2MCwxNzAgTDI0MCwxNzAgTDI0MCwxODAgTDE2MCwxODAgWiIgZmlsbD0iIzFENEVEOCIgLz48L3N2Zz4=',
    tags: ['business', 'concept', 'diagram'],
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI0VERUVGMiIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzFENEVEOCIgc3Ryb2tlLXdpZHRoPSIyIiAvPjxwYXRoIGQ9Ik0xNzAsMTIwIEwxODAsMTMwIEwxOTAsMTIwIE0xODAsMTMwIEwxODAsMTcwIiBzdHJva2U9IiMxRDRFRDgiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMjEwLDEyMCBMMjIwLDEzMCBMMjMwLDEyMCBNMjIwLDEzMCBMMjIwLDE3MCIgc3Ryb2tlPSIjMUQ0RUQ4IiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIC8+PHBhdGggZD0iTTE2MCwxNzAgTDI0MCwxNzAgTDI0MCwxODAgTDE2MCwxODAgWiIgZmlsbD0iIzFENEVEOCIgLz48L3N2Zz4='
  },
  {
    id: 'image-tech-concept',
    name: 'Technology Concept',
    type: 'image',
    category: ['technical', 'educational'],
    content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzI4MmMzNCIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM2MUFGRUYiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI0M2NzhERCIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSIyODAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjRDJCNjZBIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjxsaW5lIHgxPSIxMjAiIHkxPSIxNTAiIHgyPSIyMDAiIHkyPSIxNTAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgLz48bGluZSB4MT0iMjAwIiB5MT0iMTUwIiB4Mj0iMjgwIiB5Mj0iMTUwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+PHRleHQgeD0iMTIwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkRhdGE8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlByb2Nlc3M8L3RleHQ+PHRleHQgeD0iMjgwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPk91dHB1dDwvdGV4dD48L3N2Zz4=',
    tags: ['technology', 'process', 'flow', 'diagram'],
    previewUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzI4MmMzNCIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM2MUFGRUYiIGZpbGwtb3BhY2l0eT0iMC43Ii8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iI0M2NzhERCIgZmlsbC1vcGFjaXR5PSIwLjciLz48Y2lyY2xlIGN4PSIyODAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjRDJCNjZBIiBmaWxsLW9wYWNpdHk9IjAuNyIvPjxsaW5lIHgxPSIxMjAiIHkxPSIxNTAiIHgyPSIyMDAiIHkyPSIxNTAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgLz48bGluZSB4MT0iMjAwIiB5MT0iMTUwIiB4Mj0iMjgwIiB5Mj0iMTUwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+PHRleHQgeD0iMTIwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPkRhdGE8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPlByb2Nlc3M8L3RleHQ+PHRleHQgeD0iMjgwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPk91dHB1dDwvdGV4dD48L3N2Zz4='
  }
];

// Chart content library
export const chartContentLibrary: ContentLibraryItem[] = [
  {
    id: 'chart-bar-basic',
    name: 'Basic Bar Chart',
    type: 'chart',
    category: ['business', 'educational'],
    content: {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [12, 19, 15, 22],
          backgroundColor: '#4C6FFF'
        }]
      }
    },
    tags: ['bar chart', 'data', 'quarterly']
  },
  {
    id: 'chart-line-trend',
    name: 'Trend Line Chart',
    type: 'chart',
    category: ['business', 'technical'],
    content: {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Growth',
          data: [5, 10, 15, 12, 18, 20],
          borderColor: '#00C48C',
          fill: false
        }]
      }
    },
    tags: ['line chart', 'trend', 'growth']
  },
  {
    id: 'chart-pie-breakdown',
    name: 'Category Breakdown',
    type: 'chart',
    category: ['business', 'educational'],
    content: {
      type: 'pie',
      data: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D'],
        datasets: [{
          data: [35, 25, 20, 20],
          backgroundColor: ['#4C6FFF', '#00C48C', '#FFB800', '#FF5A5A']
        }]
      }
    },
    tags: ['pie chart', 'distribution', 'breakdown']
  }
];

// Shape content library
export const shapeContentLibrary: ContentLibraryItem[] = [
  {
    id: 'shape-rectangle',
    name: 'Rectangle',
    type: 'shape',
    category: ['business', 'educational', 'creative'],
    content: 'rectangle',
    tags: ['rectangle', 'shape', 'basic']
  },
  {
    id: 'shape-circle',
    name: 'Circle',
    type: 'shape',
    category: ['business', 'educational', 'creative'],
    content: 'circle',
    tags: ['circle', 'shape', 'basic']
  },
  {
    id: 'shape-rounded',
    name: 'Rounded Rectangle',
    type: 'shape',
    category: ['business', 'educational', 'creative'],
    content: 'rounded',
    tags: ['rounded', 'rectangle', 'shape']
  }
];

// Video content library (placeholder URLs for demo purposes)
export const videoContentLibrary: ContentLibraryItem[] = [
  {
    id: 'video-product-demo',
    name: 'Product Demo',
    type: 'video',
    category: ['business', 'technical'],
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['product', 'demo', 'tutorial']
  },
  {
    id: 'video-explainer',
    name: 'Concept Explainer',
    type: 'video',
    category: ['educational', 'technical'],
    content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tags: ['explainer', 'concept', 'educational']
  }
];

/**
 * Get all content items for a specific type
 */
export const getContentByType = (type: ContentType): ContentLibraryItem[] => {
  switch (type) {
    case 'text':
      return textContentLibrary;
    case 'list':
      return listContentLibrary;
    case 'image':
      return imageContentLibrary;
    case 'chart':
      return chartContentLibrary;
    case 'shape':
      return shapeContentLibrary;
    case 'video':
      return videoContentLibrary;
    default:
      return [];
  }
};

/**
 * Get content items by category
 */
export const getContentByCategory = (category: ContentCategory): ContentLibraryItem[] => {
  return [
    ...textContentLibrary.filter(item => item.category.includes(category)),
    ...listContentLibrary.filter(item => item.category.includes(category)),
    ...imageContentLibrary.filter(item => item.category.includes(category)),
    ...chartContentLibrary.filter(item => item.category.includes(category)),
    ...shapeContentLibrary.filter(item => item.category.includes(category)),
    ...videoContentLibrary.filter(item => item.category.includes(category))
  ];
};

/**
 * Get a random placeholder content for a given type
 */
export const getRandomPlaceholder = (type: ContentType): any => {
  const items = getContentByType(type);
  if (items.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex].content;
};

/**
 * Get content by tags
 */
export const getContentByTags = (tags: string[], type?: ContentType): ContentLibraryItem[] => {
  let allContent: ContentLibraryItem[] = [];
  
  if (type) {
    allContent = getContentByType(type);
  } else {
    allContent = [
      ...textContentLibrary,
      ...listContentLibrary,
      ...imageContentLibrary,
      ...chartContentLibrary,
      ...shapeContentLibrary,
      ...videoContentLibrary
    ];
  }
  
  return allContent.filter(item => 
    tags.some(tag => item.tags.includes(tag.toLowerCase()))
  );
};

export default {
  getContentByType,
  getContentByCategory,
  getRandomPlaceholder,
  getContentByTags
}; 