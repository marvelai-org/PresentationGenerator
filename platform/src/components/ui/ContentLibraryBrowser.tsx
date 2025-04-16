import React, { useState, useEffect } from 'react';
import { 
  ContentType, 
  ContentCategory,
  ContentLibraryItem,
  getContentByType,
  getContentByCategory,
  getContentByTags
} from '../../utils/defaultContentLibrary';
import ContentPlaceholder from './ContentPlaceholder';

export interface ContentLibraryBrowserProps {
  onSelectContent: (content: any, type: ContentType) => void;
  initialType?: ContentType;
  initialCategory?: ContentCategory;
  showPreview?: boolean;
}

/**
 * A component for browsing and previewing content from the default library
 */
const ContentLibraryBrowser: React.FC<ContentLibraryBrowserProps> = ({
  onSelectContent,
  initialType,
  initialCategory,
  showPreview = true
}) => {
  const [selectedType, setSelectedType] = useState<ContentType>(initialType || 'text');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | undefined>(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<ContentLibraryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentLibraryItem | null>(null);
  
  // Content type options
  const contentTypes: Array<{ value: ContentType; label: string }> = [
    { value: 'text', label: 'Text' },
    { value: 'list', label: 'List' },
    { value: 'image', label: 'Image' },
    { value: 'chart', label: 'Chart' },
    { value: 'video', label: 'Video' },
    { value: 'shape', label: 'Shape' }
  ];
  
  // Category options
  const categories: Array<{ value: ContentCategory; label: string }> = [
    { value: 'business', label: 'Business' },
    { value: 'educational', label: 'Educational' },
    { value: 'creative', label: 'Creative' },
    { value: 'formal', label: 'Formal' },
    { value: 'casual', label: 'Casual' },
    { value: 'technical', label: 'Technical' }
  ];
  
  // Load content items based on selected type and category
  useEffect(() => {
    let contentItems: ContentLibraryItem[];
    
    if (selectedCategory) {
      // Filter by type and category
      contentItems = getContentByCategory(selectedCategory)
        .filter(item => item.type === selectedType);
    } else {
      // Only filter by type
      contentItems = getContentByType(selectedType);
    }
    
    setItems(contentItems);
    setSelectedItem(null);
  }, [selectedType, selectedCategory]);
  
  // Filter items based on search term
  const filteredItems = searchTerm
    ? items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : items;
  
  // Handle content type change
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as ContentType);
  };
  
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value === 'all' ? undefined : value as ContentCategory);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle item selection
  const handleSelectItem = (item: ContentLibraryItem) => {
    setSelectedItem(item);
    onSelectContent(item.content, item.type);
  };
  
  // Render preview of selected content
  const renderContentPreview = () => {
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-md p-6">
          <p className="text-gray-500">Select an item to preview</p>
        </div>
      );
    }
    
    switch (selectedItem.type) {
      case 'text':
        return (
          <div className="bg-white p-6 rounded-md border h-full overflow-auto">
            <p className="whitespace-pre-wrap">
              {typeof selectedItem.content === 'string' 
                ? selectedItem.content
                : JSON.stringify(selectedItem.content, null, 2)}
            </p>
          </div>
        );
        
      case 'list':
        return (
          <div className="bg-white p-6 rounded-md border h-full overflow-auto">
            <ul className="list-disc pl-5">
              {Array.isArray(selectedItem.content) && selectedItem.content.map((item, index) => (
                <li key={index} className="mb-2">{item}</li>
              ))}
            </ul>
          </div>
        );
        
      case 'image':
        return (
          <div className="flex items-center justify-center bg-gray-100 rounded-md h-full overflow-hidden">
            <img 
              src={selectedItem.content} 
              alt={selectedItem.name} 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
        );
        
      case 'chart':
        return (
          <div className="bg-white p-6 rounded-md border h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-medium mb-2">{selectedItem.content.type} Chart</div>
              <div className="text-sm text-gray-500">
                {selectedItem.content.data?.labels?.length || 0} data points
              </div>
              <div className="mt-4 text-xs text-gray-400">
                (Chart visualization would render here)
              </div>
            </div>
          </div>
        );
        
      case 'shape':
        return (
          <div className="bg-white rounded-md border h-full flex items-center justify-center">
            <div 
              className={`bg-blue-500 ${
                selectedItem.content === 'circle' 
                  ? 'rounded-full' 
                  : selectedItem.content === 'rounded' 
                    ? 'rounded-lg' 
                    : ''
              }`} 
              style={{ width: '150px', height: '150px' }}
            />
          </div>
        );
        
      case 'video':
        return (
          <div className="bg-white p-6 rounded-md border h-full flex items-center justify-center">
            <div className="w-full h-full aspect-video">
              <iframe 
                src={selectedItem.content} 
                title={selectedItem.name}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
            <p className="text-gray-500">Preview not available</p>
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content Type
            </label>
            <select 
              value={selectedType}
              onChange={handleTypeChange}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select 
              value={selectedCategory || 'all'}
              onChange={handleCategoryChange}
              className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name or tag..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className={`flex flex-grow overflow-hidden ${showPreview ? 'gap-4 p-4' : 'p-0'}`}>
        <div className={`${showPreview ? 'w-1/2 overflow-y-auto' : 'w-full p-4'}`}>
          {filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div 
                  key={item.id}
                  className={`cursor-pointer p-3 rounded-md border transition-all hover:shadow-md ${
                    selectedItem?.id === item.id 
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="h-24 mb-2 overflow-hidden">
                    <ContentPlaceholder 
                      type={item.type}
                      height="100%"
                      placeholder={item.name}
                    />
                  </div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <div className="flex flex-wrap mt-1 gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                      <span 
                        key={tag} 
                        className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showPreview && (
          <div className="w-1/2 h-full overflow-hidden">
            <div className="h-full bg-gray-50 rounded-md overflow-hidden">
              {renderContentPreview()}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-4 border-t">
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedItem}
            onClick={() => selectedItem && onSelectContent(selectedItem.content, selectedItem.type)}
          >
            Use Selected Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentLibraryBrowser; 