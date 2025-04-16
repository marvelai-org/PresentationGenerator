'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Tabs, Tab } from '@heroui/react';
import { TemplateType } from '@/types/editor';
import templateRegistry, { TemplateRegistration } from '@/components/features/templates/TemplateRegistry';
import CommandMenuModal from '../CommandMenuModal';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelect }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Get all templates from registry
  const allTemplates = templateRegistry.getAllTemplates();
  
  // Get unique categories
  const categories = Array.from(
    new Set(allTemplates.map(template => template.category || 'Uncategorized'))
  );

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(null);
      setSearchTerm('');
      
      // Default to first category if available
      if (categories.length > 0 && !selectedCategory) {
        setSelectedCategory(categories[0]);
      }
    }
  }, [isOpen, categories, selectedCategory]);

  // Filter templates by search term and category
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = 
      searchTerm === '' || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      !selectedCategory || 
      template.category === selectedCategory ||
      (selectedCategory === 'Uncategorized' && !template.category);
    
    return matchesSearch && matchesCategory;
  });

  // Handle template selection
  const handleTemplateSelect = (template: TemplateRegistration) => {
    setSelectedTemplate(template.type);
  };

  // Handle template confirmation
  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
    }
  };

  return (
    <CommandMenuModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Template"
      size="3xl"
    >
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
          startContent={
            <svg className="w-5 h-5 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <Tabs 
          aria-label="Template categories" 
          color="primary"
          variant="underlined"
          selectedKey={selectedCategory}
          onSelectionChange={setSelectedCategory as any}
        >
          {categories.map(category => (
            <Tab key={category} title={category}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {filteredTemplates
                  .filter(t => (t.category || 'Uncategorized') === category)
                  .map(template => (
                    <div
                      key={template.type}
                      className={`
                        bg-content1 p-3 rounded-lg cursor-pointer border-2 transition-all
                        ${selectedTemplate === template.type 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-default-300'
                        }
                      `}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="bg-content2 h-28 rounded-md flex items-center justify-center mb-3">
                        {template.thumbnail ? (
                          <img 
                            src={template.thumbnail} 
                            alt={template.name} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-4/5 h-4/5 bg-content3 rounded flex items-center justify-center text-default-500">
                            {template.name}
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-medium">{template.name}</h3>
                      <p className="text-xs text-default-500 mt-1">{template.description}</p>
                    </div>
                  ))}
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>

      <div className="flex justify-end gap-2 p-4 bg-default-100 border-t border-default-200">
        <Button variant="flat" onPress={onClose}>
          Cancel
        </Button>
        <Button 
          color="primary" 
          onPress={handleConfirmTemplate}
          isDisabled={!selectedTemplate}
        >
          Use Template
        </Button>
      </div>
    </CommandMenuModal>
  );
} 