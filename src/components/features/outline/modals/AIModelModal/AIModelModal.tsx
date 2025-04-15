import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import ModelOption from './ModelOption';
import { AIModelDetails, aiModelOptions, getModelCategory } from './aiModelData';

interface AIModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelSelect: (modelKey: string) => void;
}

export default function AIModelModal({
  isOpen,
  onClose,
  selectedModel,
  onModelSelect,
}: AIModelModalProps) {
  // Initialize selectedPreview state with null, will be set on open
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  // Reset selectedPreview to current selectedModel whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPreview(selectedModel);
      // Also set active tab based on the category of the selected model
      if (selectedModel) {
        setActiveTab(getModelCategory(selectedModel));
      }
    }
  }, [isOpen, selectedModel]);

  // Set default active tab based on selected model
  const defaultActiveTab = selectedModel ? getModelCategory(selectedModel) : 'basic';
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab);

  const handleApply = () => {
    if (selectedPreview) {
      onModelSelect(selectedPreview);
    }
    onClose();
  };

  // Define tab content components for better organization
  const renderTabContent = (models: AIModelDetails[]) => (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto p-1 no-scrollbar thin-scrollbar"
      style={{ maxHeight: 'calc(80vh - 180px)' }}
    >
      {models.map(model => (
        <ModelOption
          key={model.key}
          isSelected={selectedPreview === model.key}
          model={model}
          onSelect={() => setSelectedPreview(model.key)}
        />
      ))}
    </div>
  );

  return (
    <Modal
      aria-labelledby="ai-model-modal-title"
      backdrop="blur"
      classNames={{
        backdrop: 'bg-[#00000099] backdrop-blur-sm',
        base: 'border-0 shadow-xl bg-[#1C1C1E] max-h-[95vh] max-w-[90vw] w-full sm:w-[90%] md:w-[85%] lg:w-[1200px]',
        header: 'border-b border-[#38383A]',
        body: 'p-0 overflow-hidden',
        footer: 'border-t border-[#38383A]',
        closeButton: 'hover:bg-white/5 text-gray-400 absolute right-4 top-4 z-50',
      }}
      hideCloseButton={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onClose={onClose}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="border-b border-[#38383A] text-white">
              <div className="flex items-center gap-2" id="ai-model-modal-title">
                <Icon className="text-primary" icon="material-symbols:auto-awesome" width={20} />
                <span>Select AI Image Model</span>
              </div>
            </ModalHeader>
            <ModalBody className="p-0 overflow-hidden">
              <div className="p-4 sm:p-6 bg-[#1C1C1E] h-full">
                {/* Using HeroUI Tabs component */}
                <Tabs
                  aria-label="AI model categories"
                  classNames={{
                    base: 'flex flex-col justify-start mb-4 sm:mb-6 h-full',
                    tabList:
                      'bg-[#232324] p-1 border border-[#38383A] rounded-full flex overflow-x-auto no-scrollbar',
                    tab: 'px-3 sm:px-4 py-1.5 sm:py-2 text-gray-400 hover:text-gray-300 data-[selected=true]:bg-primary data-[selected=true]:text-white focus:outline-none rounded-full transition-colors',
                    tabContent: 'flex items-center gap-1 whitespace-nowrap',
                    panel: 'mt-4 overflow-visible h-full',
                  }}
                  color="primary"
                  radius="full"
                  selectedKey={activeTab}
                  variant="solid"
                  onSelectionChange={key => setActiveTab(key as string)}
                >
                  <Tab key="basic" title="Basic">
                    {renderTabContent(aiModelOptions.basic)}
                  </Tab>
                  <Tab
                    key="advanced"
                    title={
                      <div className="flex items-center gap-1">
                        <span>Advanced</span>
                        <span className="text-xs bg-[#38383A] text-gray-300 px-1.5 py-0.5 rounded-full">
                          PLUS
                        </span>
                      </div>
                    }
                  >
                    {renderTabContent(aiModelOptions.advanced)}
                  </Tab>
                  <Tab
                    key="premium"
                    title={
                      <div className="flex items-center gap-1">
                        <span>Premium</span>
                        <span className="text-xs bg-[#38383A] text-gray-300 px-1.5 py-0.5 rounded-full">
                          PRO
                        </span>
                      </div>
                    }
                  >
                    {renderTabContent(aiModelOptions.premium)}
                  </Tab>
                </Tabs>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-[#38383A]">
              <Button
                className="text-gray-300 bg-[#28282A] hover:bg-[#323234]"
                variant="flat"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-b from-[#2B2B2D] to-[#242426] text-white border-[#38383A] hover:opacity-90"
                isDisabled={!selectedPreview}
                startContent={
                  selectedPreview ? <Icon icon="material-symbols:check" width={18} /> : undefined
                }
                onPress={handleApply}
              >
                Apply
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Add this to your global CSS file (e.g., globals.css):
/*
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
