import React, { useState } from 'react';
import Template from '../Template';
import templateRegistry from '../TemplateRegistry';

const TemplatePreview: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('title');
  const [editable, setEditable] = useState(true);
  const [data, setData] = useState<Record<string, any>>({});
  
  const allTemplates = templateRegistry.getAllTemplates();
  const template = templateRegistry.getTemplate(selectedType as any);
  
  const handleContentChange = (slotId: string, content: any) => {
    setData(prev => ({
      ...prev,
      [slotId]: content
    }));
  };
  
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label htmlFor="template-select" className="block text-sm font-medium mb-1">
            Template Type
          </label>
          <select
            id="template-select"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            {allTemplates.map(t => (
              <option key={t.type} value={t.type}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            id="editable-toggle"
            checked={editable}
            onChange={e => setEditable(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="editable-toggle" className="text-sm font-medium">
            Editable
          </label>
        </div>
      </div>
      
      {template && (
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">{template.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
          
          <div className="flex gap-4 flex-wrap">
            {template.slots.map(slot => (
              <div key={slot.id} className="mb-4">
                <label htmlFor={`slot-${slot.id}`} className="block text-sm font-medium mb-1">
                  {slot.name} {slot.required && <span className="text-red-500">*</span>}
                </label>
                {slot.type === 'text' ? (
                  <input
                    type="text"
                    id={`slot-${slot.id}`}
                    value={data[slot.id] || ''}
                    onChange={e => handleContentChange(slot.id, e.target.value)}
                    placeholder={slot.defaultContent || `Enter ${slot.name}`}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : slot.type === 'image' ? (
                  <input
                    type="text"
                    id={`slot-${slot.id}`}
                    value={data[slot.id] || ''}
                    onChange={e => handleContentChange(slot.id, e.target.value)}
                    placeholder="Enter image URL"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-sm text-gray-500">
                    {slot.type} content - edit directly on template
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ width: '800px', height: '450px' }}>
        <Template
          type={selectedType}
          data={data}
          onContentChange={handleContentChange}
          editable={editable}
        />
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Current Data</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TemplatePreview; 