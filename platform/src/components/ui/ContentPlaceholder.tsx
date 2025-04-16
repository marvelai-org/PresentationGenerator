import React, { useState } from 'react';
import { ContentType, getRandomPlaceholder } from '../../utils/defaultContentLibrary';
import PlaceholderSelector from './PlaceholderSelector';

export interface ContentPlaceholderProps {
  type: ContentType;
  width?: number | string;
  height?: number | string;
  onSelect?: (content: any) => void;
  onClick?: () => void;
  className?: string;
  showSelector?: boolean;
  placeholder?: string;
  filterTags?: string[];
}

/**
 * Visual placeholder component for various content types
 * Displays appropriate visual cues based on content type
 */
const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  type,
  width = '100%',
  height = '100%',
  onSelect,
  onClick,
  className = '',
  showSelector = false,
  placeholder,
  filterTags = []
}) => {
  const [isSelectingContent, setIsSelectingContent] = useState(showSelector);
  
  // Handle content selection from the library
  const handleContentSelect = (content: any) => {
    if (onSelect) {
      onSelect(content);
    }
    setIsSelectingContent(false);
  };
  
  // Handle click on the placeholder
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsSelectingContent(true);
    }
  };
  
  // Generate a random placeholder if user requests one
  const handleRandomPlaceholder = () => {
    const content = getRandomPlaceholder(type);
    if (content && onSelect) {
      onSelect(content);
    }
  };
  
  // Render appropriate placeholder based on content type
  const renderPlaceholder = () => {
    switch (type) {
      case 'text':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 5h12v2H4V5zm0 4h12v2H4V9zm0 4h12v2H4v-2z" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add text content'}</div>
          </div>
        );
        
      case 'image':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1h10a1 1 0 011 1v7.586l-3.293-3.293a1 1 0 00-1.414 0L8 11.586 6.707 10.293a1 1 0 00-1.414 0L3 12.586V5a1 1 0 011-1zm10 14H5a1 1 0 01-1-1v-.586l3.293-3.293a1 1 0 011.414 0L11 15.414 13.586 13H15v5a1 1 0 01-1 1z" />
              <circle cx="8.5" cy="7.5" r="1.5" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add image'}</div>
          </div>
        );
        
      case 'list':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              <circle cx="1.5" cy="5" r="1.5" />
              <circle cx="1.5" cy="10" r="1.5" />
              <circle cx="1.5" cy="15" r="1.5" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add list items'}</div>
          </div>
        );
        
      case 'chart':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add chart'}</div>
          </div>
        );
        
      case 'video':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.5 10.5-5 3A.5.5 0 0 1 8 13V7a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v5.5l4.5-2.5a.5.5 0 0 1 .5 0 .5.5 0 0 1 0 .5Z"/>
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add video'}</div>
          </div>
        );
        
      case 'shape':
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <rect x="3" y="3" width="14" height="14" rx="2" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add shape'}</div>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v3a1 1 0 01-1 1H7a1 1 0 110-2h2V8a1 1 0 011-1z" />
            </svg>
            <div className="text-sm text-gray-500">{placeholder || 'Add content'}</div>
          </div>
        );
    }
  };
  
  return (
    <div 
      className={`relative ${className}`} 
      style={{ width, height }}
    >
      {isSelectingContent ? (
        <div className="absolute inset-0 bg-white p-4 overflow-auto z-10 border rounded shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Select {type} content</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleRandomPlaceholder}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
              >
                Random
              </button>
              <button
                onClick={() => setIsSelectingContent(false)}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
          
          <PlaceholderSelector 
            contentType={type}
            onSelect={handleContentSelect}
            filterTags={filterTags}
          />
        </div>
      ) : (
        <div 
          className="w-full h-full bg-gray-100 border border-dashed border-gray-300 rounded-md overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={handleClick}
        >
          {renderPlaceholder()}
        </div>
      )}
    </div>
  );
};

export default ContentPlaceholder; 