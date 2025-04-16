import React, { useState, useEffect, useRef } from 'react';
import { AdaptiveRules } from '../TemplateRegistry';
import { 
  willContentOverflow, 
  adaptContentToFit, 
  autoFormatContent
} from '../../../../utils/contentAdaptation';
import { 
  cascadingFallback 
} from '../../../../utils/enhancedFallbacks';
import { getRandomPlaceholder } from '../../../../utils/defaultContentLibrary';
import ContentPlaceholder from '../../../ui/ContentPlaceholder';

interface ContentSlotProps {
  id: string;
  type: 'text' | 'image' | 'chart' | 'video' | 'shape' | 'list';
  content: any;
  position: { x: number, y: number, width: number, height: number };
  style?: React.CSSProperties;
  editable?: boolean;
  adaptiveRules?: AdaptiveRules;
  onChange?: (content: any) => void;
  placeholder?: string;
  context?: string;
  showPlaceholderWhenEmpty?: boolean;
  tags?: string[];
}

const ContentSlot: React.FC<ContentSlotProps> = ({
  id,
  type,
  content,
  position,
  style = {},
  editable = false,
  adaptiveRules,
  onChange,
  placeholder,
  context,
  showPlaceholderWhenEmpty = false,
  tags = []
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [computedStyle, setComputedStyle] = useState<React.CSSProperties>(style);
  const [adaptedContent, setAdaptedContent] = useState<any>(content);
  const [responsivePosition, setResponsivePosition] = useState(position);
  const [isPlaceholderVisible, setIsPlaceholderVisible] = useState(
    showPlaceholderWhenEmpty && (content === null || content === undefined || content === '')
  );
  const slotRef = useRef<HTMLDivElement>(null);
  
  // Handle content selection from placeholder
  const handlePlaceholderSelect = (selectedContent: any) => {
    setIsPlaceholderVisible(false);
    if (onChange) {
      onChange(selectedContent);
    } else {
      setAdaptedContent(selectedContent);
    }
  };
  
  // Transform content based on slot type and responsive criteria
  useEffect(() => {
    // If showing a placeholder, don't process content
    if (isPlaceholderVisible) {
      return;
    }
    
    // Check if content is empty or undefined
    if (content === null || content === undefined || content === '') {
      // Use placeholder content if provided, otherwise show placeholder component
      if (placeholder) {
        setAdaptedContent(placeholder);
      } else if (showPlaceholderWhenEmpty) {
        setIsPlaceholderVisible(true);
        return;
      } else {
        // Get random placeholder from default library
        setAdaptedContent(getRandomPlaceholder(type));
      }
      return;
    }
    
    // Step 1: Convert content to the right format for the slot type
    let formatted = autoFormatContent(content, type);
    
    // Step 2: Create fallback content if types don't match
    if (formatted === content) {
      formatted = cascadingFallback(type, formatted, context, tags);
    }
    
    // Step 3: Handle responsive adaptations
    const slotDimensions = { type, position, style, adaptiveRules };
    
    // Step 4: Adapt for overflow if needed
    if (willContentOverflow(formatted, slotDimensions)) {
      const fittedContent = adaptContentToFit(
        formatted,
        slotDimensions,
        { addEllipsis: adaptiveRules?.overflowBehavior === 'truncate' }
      );
      setAdaptedContent(fittedContent);
      setIsOverflowing(true);
    } else {
      setAdaptedContent(formatted);
      setIsOverflowing(false);
    }
  }, [content, type, position, style, adaptiveRules, placeholder, context, tags, showPlaceholderWhenEmpty, isPlaceholderVisible]);
  
  // Apply responsive positioning based on viewport
  useEffect(() => {
    if (!adaptiveRules?.responsivePositions) return;
    
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const breakpoints = Object.keys(adaptiveRules.responsivePositions)
        .filter(key => !isNaN(Number(key)))
        .sort((a, b) => Number(b) - Number(a)); // Sort from largest to smallest
      
      let newPosition = { ...position };
      
      // Find first breakpoint that matches current viewport width
      for (const breakpoint of breakpoints) {
        if (viewportWidth <= Number(breakpoint)) {
          newPosition = adaptiveRules.responsivePositions[breakpoint];
        }
      }
      
      // Apply default position if no breakpoints matched or if viewport is larger than all breakpoints
      if (adaptiveRules.responsivePositions.default) {
        const defaultBreakpoints = Object.keys(adaptiveRules.responsivePositions)
          .filter(key => !isNaN(Number(key)));
        
        if (defaultBreakpoints.length === 0 || 
            viewportWidth > Math.max(...defaultBreakpoints.map(Number))) {
          newPosition = adaptiveRules.responsivePositions.default;
        }
      }
      
      setResponsivePosition(newPosition);
      
      // Re-evaluate content adaptation for new position
      if (JSON.stringify(newPosition) !== JSON.stringify(position)) {
        const slotDimensions = { 
          type, 
          position: newPosition, 
          style, 
          adaptiveRules 
        };
        
        if (willContentOverflow(adaptedContent, slotDimensions)) {
          const fittedContent = adaptContentToFit(
            adaptedContent,
            slotDimensions,
            { addEllipsis: adaptiveRules?.overflowBehavior === 'truncate' }
          );
          setAdaptedContent(fittedContent);
          setIsOverflowing(true);
        }
      }
    };
    
    // Initial position update
    updatePosition();
    
    // Add resize listener for responsive layouts
    window.addEventListener('resize', updatePosition);
    
    // Cleanup
    return () => window.removeEventListener('resize', updatePosition);
  }, [position, adaptiveRules, adaptedContent, type, style]);
  
  // Handle font scaling for better readability
  useEffect(() => {
    if (!slotRef.current || !adaptiveRules?.autoScale || type !== 'text') return;
    
    const element = slotRef.current;
    if (isOverflowing && adaptiveRules.autoScale) {
      const newStyle = { ...style };
      let currentSize = parseInt(window.getComputedStyle(element).fontSize);
      const minSize = adaptiveRules.minFontSize || 8;
      
      // Try reducing font size until content fits or minimum font size is reached
      while (
        currentSize > minSize && 
        (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth)
      ) {
        currentSize -= 1;
        newStyle.fontSize = `${currentSize}px`;
        element.style.fontSize = `${currentSize}px`;
      }
      
      setComputedStyle({ ...computedStyle, ...newStyle });
    }
  }, [adaptedContent, isOverflowing, adaptiveRules, type, style, computedStyle]);
  
  // Determine overflow behavior styles
  const getOverflowStyles = (): React.CSSProperties => {
    if (!adaptiveRules || !isOverflowing) return {};
    
    switch (adaptiveRules.overflowBehavior) {
      case 'truncate':
        return { 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        };
      case 'scroll':
        return { overflow: 'auto' };
      case 'expand':
        return { height: 'auto', maxHeight: 'none' };
      case 'shrink':
      default:
        return {}; // Using font scaling handled above
    }
  };
  
  // If placeholder is visible, show the placeholder component
  if (isPlaceholderVisible) {
    return (
      <div
        className="content-slot"
        data-slot-id={id}
        data-content-type={type}
        style={{
          position: 'absolute',
          left: `${responsivePosition.x}px`,
          top: `${responsivePosition.y}px`,
          width: `${responsivePosition.width}px`,
          height: `${responsivePosition.height}px`,
          ...computedStyle
        }}
      >
        <ContentPlaceholder
          type={type}
          width="100%"
          height="100%"
          onSelect={handlePlaceholderSelect}
          placeholder={placeholder}
          filterTags={tags}
        />
      </div>
    );
  }
  
  // Render appropriate content based on type
  const renderContent = () => {
    switch (type) {
      case 'text':
        return editable ? (
          <div
            contentEditable
            className="outline-none w-full h-full focus:ring-2 focus:ring-blue-500"
            onBlur={e => onChange?.(e.currentTarget.textContent)}
            dangerouslySetInnerHTML={{ __html: adaptedContent || placeholder || '' }}
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: adaptedContent || placeholder || '' }} />
        );
        
      case 'image':
        return adaptedContent ? (
          <img src={adaptedContent} alt="Slide content" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            {placeholder || 'Image placeholder'}
          </div>
        );
        
      case 'list':
        if (editable) {
          // Editable list implementation
          return (
            <div
              contentEditable
              className="outline-none w-full h-full focus:ring-2 focus:ring-blue-500 list-disc pl-5"
              onBlur={e => onChange?.(e.currentTarget.textContent)}
              dangerouslySetInnerHTML={{ __html: 
                Array.isArray(adaptedContent) 
                  ? adaptedContent.map(item => `<li>${item}</li>`).join('') 
                  : adaptedContent || placeholder || ''
              }}
            />
          );
        }
        
        // Display list
        return (
          <ul className="list-disc pl-5">
            {Array.isArray(adaptedContent) ? (
              adaptedContent.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              typeof adaptedContent === 'string' ? 
                adaptedContent.split('\n').map((item, index) => <li key={index}>{item}</li>) : 
                <li>{placeholder || 'List item'}</li>
            )}
          </ul>
        );
        
      case 'shape':
        return (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: computedStyle.backgroundColor || '#E0E0E0',
              borderRadius: adaptedContent === 'circle' ? '50%' : adaptedContent === 'rounded' ? '12px' : '0',
            }}
          />
        );
      
      case 'chart':
        // Basic chart placeholder
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            Chart: {adaptedContent?.type || adaptedContent || placeholder || 'Chart placeholder'}
          </div>
        );
        
      case 'video':
        return adaptedContent ? (
          <div className="w-full h-full">
            <iframe 
              src={adaptedContent} 
              className="w-full h-full" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            {placeholder || 'Video placeholder'}
          </div>
        );
        
      default:
        return <div>Unknown content type</div>;
    }
  };
  
  return (
    <div
      ref={slotRef}
      className="content-slot"
      data-slot-id={id}
      data-content-type={type}
      style={{
        position: 'absolute',
        left: `${responsivePosition.x}px`,
        top: `${responsivePosition.y}px`,
        width: `${responsivePosition.width}px`,
        height: `${responsivePosition.height}px`,
        ...computedStyle,
        ...getOverflowStyles()
      }}
    >
      {renderContent()}
      
      {isOverflowing && adaptiveRules?.debugMode && (
        <div className="absolute right-1 bottom-1 bg-yellow-500 text-xs p-1 rounded opacity-70">
          Content overflow
        </div>
      )}
      
      {editable && (
        <button 
          className="absolute right-2 top-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-100"
          onClick={() => setIsPlaceholderVisible(true)}
          title="Change content"
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ContentSlot; 