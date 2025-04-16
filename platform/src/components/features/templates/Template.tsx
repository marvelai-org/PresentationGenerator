import React from 'react';
import templateRegistry, { TemplateProps } from './TemplateRegistry';

interface TemplateWrapperProps extends TemplateProps {
  type: string;
}

/**
 * Template component that renders a registered template by type
 * Provides a consistent interface for using templates throughout the application
 */
const Template: React.FC<TemplateWrapperProps> = ({
  type,
  data = {},
  onContentChange,
  editable = false,
  className = '',
}) => {
  const template = templateRegistry.getTemplate(type as any);
  
  if (!template) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">Template Not Found</p>
          <p className="text-sm">The template "{type}" is not registered.</p>
        </div>
      </div>
    );
  }
  
  const TemplateComponent = template.component;
  
  // Merge default data with provided data
  const mergedData = {
    ...template.defaultData,
    ...data,
  };
  
  return (
    <TemplateComponent
      data={mergedData}
      onContentChange={onContentChange}
      editable={editable}
      className={className}
    />
  );
};

export default Template; 