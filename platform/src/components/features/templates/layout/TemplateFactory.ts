import { TemplateSlot } from '../TemplateRegistry';
import {
  Position,
  createGridPositions,
  createRowPositions,
  createColumnPositions,
  createTitleContentLayout,
  createSideBySideLayout,
  createResponsivePositions,
  createResponsiveSlot
} from '../utils/positioningUtils';

// Standard slide dimensions
const SLIDE_WIDTH = 800;
const SLIDE_HEIGHT = 450;

/**
 * Factory class for generating template definitions
 * Provides methods to create common template layouts with proper positioning
 */
export class TemplateFactory {
  private width: number;
  private height: number;

  constructor(width: number = SLIDE_WIDTH, height: number = SLIDE_HEIGHT) {
    this.width = width;
    this.height = height;
  }

  /**
   * Creates a title slide template with title and subtitle
   */
  createTitleTemplate(): TemplateSlot[] {
    const titleHeight = 120;
    const subtitleHeight = 60;
    
    const titlePosition: Position = {
      x: 120,
      y: 180,
      width: 600,
      height: titleHeight
    };
    
    const subtitlePosition: Position = {
      x: 160,
      y: 320,
      width: 520,
      height: subtitleHeight
    };
    
    return [
      createResponsiveSlot(
        'title',
        'Title',
        'text',
        titlePosition,
        this.width,
        this.height,
        true,
        'Presentation Title',
        {
          minFontSize: 32,
          maxFontSize: 64,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'subtitle',
        'Subtitle',
        'text',
        subtitlePosition,
        this.width,
        this.height,
        false,
        'Subtitle or Author',
        {
          minFontSize: 18,
          maxFontSize: 32,
          overflowBehavior: 'truncate',
        }
      )
    ];
  }

  /**
   * Creates a content slide template with title and text content
   */
  createContentTemplate(): TemplateSlot[] {
    const layout = createTitleContentLayout(
      this.width,
      this.height,
      80 // Title height
    );
    
    return [
      createResponsiveSlot(
        'title',
        'Title',
        'text',
        layout.title,
        this.width,
        this.height,
        true,
        'Slide Title',
        {
          minFontSize: 24,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'content',
        'Content',
        'text',
        layout.content,
        this.width,
        this.height,
        true,
        'Content goes here...',
        {
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }
      )
    ];
  }

  /**
   * Creates a bullet list template with title and bullet points
   */
  createBulletListTemplate(): TemplateSlot[] {
    const layout = createTitleContentLayout(
      this.width,
      this.height,
      80 // Title height
    );
    
    return [
      createResponsiveSlot(
        'title',
        'Title',
        'text',
        layout.title,
        this.width,
        this.height,
        true,
        'Slide Title',
        {
          minFontSize: 24,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'bulletPoints',
        'Bullet Points',
        'list',
        layout.content,
        this.width,
        this.height,
        true,
        ['First bullet point', 'Second bullet point', 'Third bullet point'],
        {
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }
      )
    ];
  }

  /**
   * Creates an image and content template
   */
  createImageContentTemplate(): TemplateSlot[] {
    const layout = createSideBySideLayout(
      this.width,
      this.height,
      0.4, // Left side takes 40% of width
      60   // Title height
    );
    
    const slots: TemplateSlot[] = [
      createResponsiveSlot(
        'title',
        'Title',
        'text',
        layout.title!,
        this.width,
        this.height,
        true,
        'Slide Title',
        {
          minFontSize: 24,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'image',
        'Image',
        'image',
        layout.left,
        this.width,
        this.height,
        false,
        '',
        {}
      ),
      createResponsiveSlot(
        'content',
        'Content',
        'text',
        layout.right,
        this.width,
        this.height,
        true,
        'Content next to image',
        {
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }
      )
    ];
    
    return slots;
  }

  /**
   * Creates a two column template
   */
  createTwoColumnTemplate(): TemplateSlot[] {
    const layout = createSideBySideLayout(
      this.width,
      this.height,
      0.5, // 50/50 split
      60   // Title height
    );
    
    const slots: TemplateSlot[] = [
      createResponsiveSlot(
        'title',
        'Title',
        'text',
        layout.title!,
        this.width,
        this.height,
        true,
        'Slide Title',
        {
          minFontSize: 24,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'leftColumn',
        'Left Column',
        'text',
        layout.left,
        this.width,
        this.height,
        true,
        'Left column content',
        {
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }
      ),
      createResponsiveSlot(
        'rightColumn',
        'Right Column',
        'text',
        layout.right,
        this.width,
        this.height,
        true,
        'Right column content',
        {
          minFontSize: 16,
          maxFontSize: 28,
          overflowBehavior: 'scroll',
        }
      )
    ];
    
    return slots;
  }

  /**
   * Creates a grid layout template
   */
  createGridTemplate(
    columns: number = 2,
    rows: number = 2,
    withTitle: boolean = true
  ): TemplateSlot[] {
    const titleHeight = withTitle ? 60 : 0;
    const contentY = withTitle ? 80 : 0;
    const contentHeight = this.height - contentY;
    
    const gridPositions = createGridPositions(
      this.width,
      contentHeight,
      columns,
      rows,
      { padding: 20, spacing: 20 }
    ).map(pos => ({
      ...pos,
      y: pos.y + contentY
    }));
    
    const slots: TemplateSlot[] = [];
    
    if (withTitle) {
      slots.push(
        createResponsiveSlot(
          'title',
          'Title',
          'text',
          {
            x: 20,
            y: 20,
            width: this.width - 40,
            height: titleHeight
          },
          this.width,
          this.height,
          true,
          'Grid Layout',
          {
            minFontSize: 24,
            maxFontSize: 42,
            autoScale: true,
            overflowBehavior: 'shrink',
          }
        )
      );
    }
    
    // Add grid cells
    gridPositions.forEach((position, index) => {
      slots.push(
        createResponsiveSlot(
          `cell${index + 1}`,
          `Cell ${index + 1}`,
          'text',
          position,
          this.width,
          this.height,
          false,
          `Content ${index + 1}`,
          {
            minFontSize: 14,
            maxFontSize: 24,
            overflowBehavior: 'scroll',
          }
        )
      );
    });
    
    return slots;
  }

  /**
   * Creates an image gallery template
   */
  createImageGalleryTemplate(
    imageCount: number = 4,
    withTitle: boolean = true
  ): TemplateSlot[] {
    const titleHeight = withTitle ? 60 : 0;
    const contentY = withTitle ? 80 : 0;
    const contentHeight = this.height - contentY;
    
    // Determine grid dimensions based on image count
    let columns = 2;
    let rows = 2;
    
    if (imageCount <= 2) {
      columns = imageCount;
      rows = 1;
    } else if (imageCount <= 4) {
      columns = 2;
      rows = Math.ceil(imageCount / 2);
    } else if (imageCount <= 6) {
      columns = 3;
      rows = Math.ceil(imageCount / 3);
    } else {
      columns = 4;
      rows = Math.ceil(imageCount / 4);
    }
    
    const gridPositions = createGridPositions(
      this.width,
      contentHeight,
      columns,
      rows,
      { padding: 20, spacing: 10 }
    ).map(pos => ({
      ...pos,
      y: pos.y + contentY
    }));
    
    const slots: TemplateSlot[] = [];
    
    if (withTitle) {
      slots.push(
        createResponsiveSlot(
          'title',
          'Title',
          'text',
          {
            x: 20,
            y: 20,
            width: this.width - 40,
            height: titleHeight
          },
          this.width,
          this.height,
          true,
          'Image Gallery',
          {
            minFontSize: 24,
            maxFontSize: 42,
            autoScale: true,
            overflowBehavior: 'shrink',
          }
        )
      );
    }
    
    // Add image cells
    for (let i = 0; i < Math.min(imageCount, gridPositions.length); i++) {
      slots.push(
        createResponsiveSlot(
          `image${i + 1}`,
          `Image ${i + 1}`,
          'image',
          gridPositions[i],
          this.width,
          this.height,
          false,
          '',
          {}
        )
      );
    }
    
    return slots;
  }
  
  /**
   * Creates a quote slide template
   */
  createQuoteTemplate(): TemplateSlot[] {
    return [
      createResponsiveSlot(
        'quoteText',
        'Quote Text',
        'text',
        {
          x: 100,
          y: 180,
          width: 600,
          height: 160
        },
        this.width,
        this.height,
        true,
        '"Your inspiring quote goes here."',
        {
          minFontSize: 28,
          maxFontSize: 42,
          autoScale: true,
          overflowBehavior: 'shrink',
        }
      ),
      createResponsiveSlot(
        'author',
        'Author',
        'text',
        {
          x: 400,
          y: 360,
          width: 300,
          height: 40
        },
        this.width,
        this.height,
        false,
        '- Author',
        {
          minFontSize: 16,
          maxFontSize: 24,
          overflowBehavior: 'truncate',
        }
      )
    ];
  }
  
  /**
   * Creates a dynamic layout based on content requirements
   */
  createDynamicTemplate(
    contentRequirements: {
      hasTitle?: boolean;
      hasImages?: boolean;
      imageCount?: number;
      textLength?: 'short' | 'medium' | 'long';
      contentType?: 'text' | 'bullets' | 'mixed';
    }
  ): TemplateSlot[] {
    const {
      hasTitle = true,
      hasImages = false,
      imageCount = 0,
      textLength = 'medium',
      contentType = 'text'
    } = contentRequirements;
    
    // Decide on template based on content requirements
    if (!hasTitle && !hasImages && textLength === 'short') {
      // Minimal content - use simple centered text
      return [
        createResponsiveSlot(
          'content',
          'Content',
          'text',
          {
            x: 150,
            y: 175,
            width: 500,
            height: 100
          },
          this.width,
          this.height,
          true,
          'Simple content',
          {
            minFontSize: 24,
            maxFontSize: 42,
            autoScale: true,
            overflowBehavior: 'shrink',
          }
        )
      ];
    } else if (hasTitle && !hasImages && textLength === 'short') {
      // Title only slide
      return this.createTitleTemplate();
    } else if (contentType === 'bullets') {
      // Bullet list
      return this.createBulletListTemplate();
    } else if (hasImages && imageCount && imageCount > 2) {
      // Multiple images - gallery
      return this.createImageGalleryTemplate(imageCount);
    } else if (hasImages && imageCount === 1) {
      // One image with content
      return this.createImageContentTemplate();
    } else if (textLength === 'long') {
      // Lots of text
      return this.createContentTemplate();
    } else {
      // Default to two column layout
      return this.createTwoColumnTemplate();
    }
  }
}

export default new TemplateFactory(); 