// src/components/features/application/editor/EditorModals.tsx
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

import SlideStyles from './styles/SlideStyles';
import MediaSelector from './selectors/MediaSelector';
import ShapeSelector from './selectors/ShapeSelector';
import TableSelector from './selectors/TableSelector';
import EmbedSelector, { EmbedData } from './selectors/EmbedSelector';
import TemplateSelector from './selectors/TemplateSelector';
import { TableOptions } from './selectors/TableSelector';

import { TemplateType } from '@/types/editor';

interface EditorModalsProps {
  isStylesOpen: boolean;
  isMediaSelectorOpen: boolean;
  isShapeSelectorOpen: boolean;
  isTableSelectorOpen: boolean;
  isEmbedSelectorOpen: boolean;
  showTemplateModal: boolean;
  onStylesClose: () => void;
  closeMediaSelector: () => void;
  closeShapeSelector: () => void;
  closeTableSelector: () => void;
  closeEmbedSelector: () => void;
  setShowTemplateModal: (show: boolean) => void;
  handleStyleSelect: (style: string) => void;
  handleMediaSelect: (mediaUrl: string) => void;
  handleShapeSelect: (shape: string) => void;
  handleTableSelect: (tableOptions: TableOptions) => void;
  handleEmbedSelect: (embedData: EmbedData) => void;
  addSlideFromTemplate: (template: TemplateType) => void;
}

const EditorModals = ({
  isStylesOpen,
  isMediaSelectorOpen,
  isShapeSelectorOpen,
  isTableSelectorOpen,
  isEmbedSelectorOpen,
  showTemplateModal,
  onStylesClose,
  closeMediaSelector,
  closeShapeSelector,
  closeTableSelector,
  closeEmbedSelector,
  setShowTemplateModal,
  handleStyleSelect,
  handleMediaSelect,
  handleShapeSelect,
  handleTableSelect,
  handleEmbedSelect,
  addSlideFromTemplate,
}: EditorModalsProps) => {
  return (
    <>
      {/* Slide Styles Modal */}
      <SlideStyles isOpen={isStylesOpen} onClose={onStylesClose} onSelect={handleStyleSelect} />

      {/* Media Selector Modal */}
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={closeMediaSelector}
        onSelect={handleMediaSelect}
      />

      {/* Shape Selector Modal */}
      <ShapeSelector
        isOpen={isShapeSelectorOpen}
        onClose={closeShapeSelector}
        onSelect={handleShapeSelect}
      />

      {/* Table Selector Modal */}
      <TableSelector
        isOpen={isTableSelectorOpen}
        onClose={closeTableSelector}
        onSelect={handleTableSelect}
      />

      {/* Embed Selector Modal */}
      <EmbedSelector
        isOpen={isEmbedSelectorOpen}
        onClose={closeEmbedSelector}
        onSelect={handleEmbedSelect}
      />

      {/* Slide Templates Modal */}
      <TemplateSelector
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={(templateId) => {
          addSlideFromTemplate(templateId as TemplateType);
          setShowTemplateModal(false);
        }}
      />
    </>
  );
};

export default EditorModals;
