import React, { useState, useEffect } from 'react';
import { ContentLibraryItem, ContentType, getContentByType, getContentByTags } from '../../utils/defaultContentLibrary';

export interface PlaceholderSelectorProps {
  contentType: ContentType;
  onSelect: (content: any) => void;
  currentContent?: any;
  filterTags?: string[];
}

/**
 * Component for browsing and selecting placeholder content from the default library
 */
const PlaceholderSelector: React.FC<PlaceholderSelectorProps> = ({
  contentType,
  onSelect,
  currentContent,
  filterTags = []
}) => {
  const [items, setItems] = useState<ContentLibraryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Load content items based on content type and filter tags
  useEffect(() => {
    let contentItems: ContentLibraryItem[];
    
    if (filterTags.length > 0) {
      contentItems = getContentByTags(filterTags, contentType);
    } else {
      contentItems = getContentByType(contentType);
    }
    
    setItems(contentItems);
    
    // Try to find the current content in the library to set it as selected
    if (currentContent) {
      const match = contentItems.find(item => 
        JSON.stringify(item.content) === JSON.stringify(currentContent)
      );
      
      if (match) {
        setSelectedItem(match.id);
      } else {
        setSelectedItem(null);
      }
    }
  }, [contentType, filterTags, currentContent]);
  
  // Filter items based on search term
  const filteredItems = searchTerm
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : items;
  
  // Handle content item selection
  const handleSelectItem = (item: ContentLibraryItem) => {
    setSelectedItem(item.id);
    onSelect(item.content);
  };
  
  // Render preview based on content type
  const renderPreview = (item: ContentLibraryItem) => {
    switch (item.type) {
      case 'text':
        return (
          <div className="p-3 bg-white border rounded text-sm h-20 overflow-hidden">
            {typeof item.content === 'string' 
              ? item.content.substring(0, 100) + (item.content.length > 100 ? '...' : '') 
              : JSON.stringify(item.content)}
          </div>
        );
        
      case 'list':
        return (
          <div className="p-3 bg-white border rounded text-xs h-20 overflow-hidden">
            <ul className="list-disc ml-4">
              {Array.isArray(item.content) && item.content.slice(0, 3).map((listItem, index) => (
                <li key={index}>{listItem.substring(0, 50) + (listItem.length > 50 ? '...' : '')}</li>
              ))}
              {Array.isArray(item.content) && item.content.length > 3 && (
                <li>...</li>
              )}
            </ul>
          </div>
        );
        
      case 'image':
        return (
          <div className="h-20 bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
            {item.previewUrl ? (
              <img 
                src={item.previewUrl} 
                alt={item.name} 
                className="max-h-full max-w-full object-contain" 
              />
            ) : (
              <div className="text-gray-400 text-xs">Image Preview</div>
            )}
          </div>
        );
        
      case 'chart':
        return (
          <div className="h-20 bg-gray-100 border rounded p-2 overflow-hidden flex items-center justify-center">
            <div className="text-xs text-center">
              <div className="font-medium">{item.content.type} Chart</div>
              <div className="text-gray-500 mt-1">
                {item.content.data?.labels?.length || 0} data points
              </div>
            </div>
          </div>
        );
        
      case 'shape':
        return (
          <div className="h-20 flex items-center justify-center">
            <div 
              className={`bg-blue-500 ${
                item.content === 'circle' 
                  ? 'rounded-full' 
                  : item.content === 'rounded' 
                    ? 'rounded-lg' 
                    : ''
              }`} 
              style={{ width: '80px', height: '80px' }}
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="h-20 bg-gray-100 border rounded flex items-center justify-center">
            <div className="flex flex-col items-center">
              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.5 10.5-5 3A.5.5 0 0 1 8 13V7a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v5.5l4.5-2.5a.5.5 0 0 1 .5 0 .5.5 0 0 1 0 .5Z"/>
              </svg>
              <div className="text-xs mt-1">{item.name}</div>
            </div>
          </div>
        );
        
      default:
        return <div className="p-3 bg-white border rounded">Preview not available</div>;
    }
  };
  
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or tag..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No placeholder content available for this type.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`cursor-pointer transition-all duration-200 p-2 rounded hover:bg-gray-100 ${
                selectedItem === item.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleSelectItem(item)}
            >
              <div className="mb-2">{renderPreview(item)}</div>
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {item.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-block mr-1">
                    #{tag}{index < Math.min(2, item.tags.length - 1) ? ' ' : ''}
                  </span>
                ))}
                {item.tags.length > 3 && <span>...</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceholderSelector; 