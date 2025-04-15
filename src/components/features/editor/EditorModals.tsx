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
      <Modal
        className="bg-gray-900"
        isOpen={showTemplateModal}
        size="4xl"
        onClose={() => setShowTemplateModal(false)}
      >
        <ModalContent>
          <ModalHeader className="border-b border-gray-800">
            <h2 className="text-white">Choose a Slide Template</h2>
          </ModalHeader>
          <ModalBody className="p-4">
            <Tabs aria-label="Template categories" color="primary" variant="underlined">
              <Tab key="basic" title="Basic Layouts">
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('title')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('title');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col items-center justify-center p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-xs font-bold">Presentation Title</div>
                      <div className="text-white text-[8px] mt-1">Your subtitle goes here</div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Title Slide</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('blankCard')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('blankCard');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col items-center justify-center p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-xs font-bold opacity-25">Blank</div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Blank Card</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('imageAndText')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('imageAndText');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-1/2 bg-gray-600 rounded mr-2" />
                        <div className="w-1/2">
                          <div className="text-white text-[8px]">Text description here</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Image and Text</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('textAndImage')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('textAndImage');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-1/2 pr-1">
                          <div className="text-white text-[8px]">Main point goes here</div>
                          <div className="text-white text-[8px] mt-1">
                            Supporting detail goes here
                          </div>
                        </div>
                        <div className="w-1/2 bg-gray-600 rounded" />
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Text & Image</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('twoColumns')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('twoColumns');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full gap-2">
                        <div className="w-1/2 bg-gray-800 rounded p-1">
                          <div className="text-white text-[8px]">Column 1</div>
                        </div>
                        <div className="w-1/2 bg-gray-800 rounded p-1">
                          <div className="text-white text-[8px]">Column 2</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Two Columns</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('bulletList')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('bulletList');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-xs font-bold mb-2">Bullet Points</div>
                      <div className="text-white text-[8px]">
                        <ul className="list-disc list-inside">
                          <li>First bullet point</li>
                          <li>Second bullet point</li>
                          <li>Third bullet point</li>
                          <li>Fourth bullet point</li>
                        </ul>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Bullet List</div>
                  </div>
                </div>
              </Tab>

              <Tab key="cardLayouts" title="Card Layouts">
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentLeft')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentLeft');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-1/3 bg-gray-600 rounded mr-2 flex items-center justify-center">
                          <div className="bg-gray-400 w-8 h-8 rounded" />
                        </div>
                        <div className="w-2/3">
                          <div className="text-white text-[8px]">Text content goes here</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Left</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentRight')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentRight');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-2/3 mr-2">
                          <div className="text-white text-[8px]">Text content goes here</div>
                        </div>
                        <div className="w-1/3 bg-gray-600 rounded flex items-center justify-center">
                          <div className="bg-gray-400 w-8 h-8 rounded" />
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Right</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentTop')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentTop');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="h-1/3 bg-gray-600 rounded mb-2 flex items-center p-2">
                        <div className="bg-gray-400 w-6 h-6 rounded mr-2" />
                        <div className="text-white text-[8px]">Title or heading</div>
                      </div>
                      <div className="h-2/3">
                        <div className="text-white text-[8px]">Main content goes here</div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Top</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentRightFit')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentRightFit');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-2/3 mr-2">
                          <div className="text-white text-[8px]">Text content goes here</div>
                        </div>
                        <div className="w-1/3 bg-gray-500 rounded-sm bg-opacity-50">
                          {/* Background image would be fitted here */}
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Right (Fitted)</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentLeftFit')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentLeftFit');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-1/3 bg-gray-500 rounded-sm bg-opacity-50 mr-2">
                          {/* Background image would be fitted here */}
                        </div>
                        <div className="w-2/3">
                          <div className="text-white text-[8px]">Text content goes here</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Left (Fitted)</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('accentBackground')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('accentBackground');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className="w-3/4 h-3/4 bg-gray-600 rounded p-2 flex flex-col">
                          <div className="text-white text-[8px] font-bold mb-1">
                            Title or heading
                          </div>
                          <div className="flex">
                            <div className="w-1/2">
                              <div className="text-white text-[8px]">Text content</div>
                            </div>
                            <div className="w-1/2 flex items-center justify-center">
                              <div className="bg-gray-400 w-8 h-8 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Accent Background</div>
                  </div>
                </div>
              </Tab>

              <Tab key="imageLayouts" title="Image Layouts">
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('twoImageColumns')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('twoImageColumns');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-3/4 gap-2 mb-1">
                        <div className="w-1/2 bg-gray-600 rounded" />
                        <div className="w-1/2 bg-gray-600 rounded" />
                      </div>
                      <div className="flex h-1/4 gap-2">
                        <div className="w-1/2">
                          <div className="text-white text-[8px]">Image 1 caption</div>
                        </div>
                        <div className="w-1/2">
                          <div className="text-white text-[8px]">Image 2 caption</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">2 Image Columns</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('threeImageColumns')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('threeImageColumns');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-3/4 gap-1 mb-1">
                        <div className="w-1/3 bg-gray-600 rounded" />
                        <div className="w-1/3 bg-gray-600 rounded" />
                        <div className="w-1/3 bg-gray-600 rounded" />
                      </div>
                      <div className="flex h-1/4 gap-1">
                        <div className="w-1/3">
                          <div className="text-white text-[6px]">Caption 1</div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-white text-[6px]">Caption 2</div>
                        </div>
                        <div className="w-1/3">
                          <div className="text-white text-[6px]">Caption 3</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">3 Image Columns</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('fourImageColumns')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('fourImageColumns');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="flex h-3/4 gap-1 mb-1">
                        <div className="w-1/4 bg-gray-600 rounded" />
                        <div className="w-1/4 bg-gray-600 rounded" />
                        <div className="w-1/4 bg-gray-600 rounded" />
                        <div className="w-1/4 bg-gray-600 rounded" />
                      </div>
                      <div className="flex h-1/4 gap-1">
                        <div className="w-1/4">
                          <div className="text-white text-[5px]">Caption</div>
                        </div>
                        <div className="w-1/4">
                          <div className="text-white text-[5px]">Caption</div>
                        </div>
                        <div className="w-1/4">
                          <div className="text-white text-[5px]">Caption</div>
                        </div>
                        <div className="w-1/4">
                          <div className="text-white text-[5px]">Caption</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">4 Image Columns</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('imagesWithText')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('imagesWithText');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Section Title</div>
                      <div className="flex h-1/2 gap-1 mb-1">
                        <div className="w-1/3 bg-gray-600 rounded" />
                        <div className="w-1/3 bg-gray-600 rounded" />
                        <div className="w-1/3 bg-gray-600 rounded" />
                      </div>
                      <div className="h-1/3">
                        <div className="text-white text-[8px]">
                          Text description goes here. Add details about the images.
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Images with Text</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('imageGallery')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('imageGallery');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Gallery Title</div>
                      <div className="flex justify-center mb-1">
                        <div className="bg-gray-700 w-3/4 h-6 rounded flex items-center justify-around px-1">
                          <div className="w-4 h-4 bg-gray-500 rounded" />
                          <div className="w-4 h-4 bg-gray-500 rounded" />
                          <div className="w-4 h-4 bg-gray-500 rounded" />
                        </div>
                      </div>
                      <div className="text-white text-[7px] text-center">
                        Description of the image gallery or collection
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Image Gallery</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('teamPhotos')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('teamPhotos');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-2"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1 text-center">
                        Our Team
                      </div>
                      <div className="flex justify-around mb-1">
                        <div className="w-8 h-8 bg-gray-600 rounded-full" />
                        <div className="w-8 h-8 bg-gray-600 rounded-full" />
                        <div className="w-8 h-8 bg-gray-600 rounded-full" />
                      </div>
                      <div className="flex justify-around">
                        <div className="text-white text-[6px] text-center w-8">Team Member 1</div>
                        <div className="text-white text-[6px] text-center w-8">Team Member 2</div>
                        <div className="text-white text-[6px] text-center w-8">Team Member 3</div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Team Photos</div>
                  </div>
                </div>
              </Tab>

              <Tab key="collections" title="Collections & Sequences">
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('textBoxes')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('textBoxes');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Main Heading</div>
                      <div className="flex gap-1 h-3/4">
                        <div className="w-1/3 bg-gray-600 rounded p-1">
                          <div className="text-white text-[6px]">Text box 1</div>
                        </div>
                        <div className="w-1/3 bg-gray-600 rounded p-1">
                          <div className="text-white text-[6px]">Text box 2</div>
                        </div>
                        <div className="w-1/3 bg-gray-600 rounded p-1">
                          <div className="text-white text-[6px]">Text box 3</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Text Boxes</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('timeline')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('timeline');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Timeline</div>
                      <div className="relative h-6 flex items-center mb-1">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-500" />
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                        <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                        <div className="absolute top-1/2 left-2/3 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                      </div>
                      <div className="flex text-white text-[6px]">
                        <div className="w-1/4">
                          Stage 1<br />
                          2020
                        </div>
                        <div className="w-1/4">
                          Stage 2<br />
                          2021
                        </div>
                        <div className="w-1/4">
                          Stage 3<br />
                          2022
                        </div>
                        <div className="w-1/4">
                          Stage 4<br />
                          2023
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Timeline</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('largeBulletList')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('largeBulletList');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Main Points</div>
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
                        <div className="text-white text-[7px]">First important point</div>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
                        <div className="text-white text-[7px]">Second important point</div>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
                        <div className="text-white text-[7px]">Third important point</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-500 rounded-full mr-1" />
                        <div className="text-white text-[7px]">Fourth important point</div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Large Bullet List</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('iconsWithText')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('iconsWithText');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Features Overview</div>
                      <div className="flex justify-around mb-2">
                        <div className="w-3 h-3 bg-white text-[6px] flex items-center justify-center">
                          ★
                        </div>
                        <div className="w-3 h-3 bg-white text-[6px] flex items-center justify-center">
                          ★
                        </div>
                        <div className="w-3 h-3 bg-white text-[6px] flex items-center justify-center">
                          ★
                        </div>
                        <div className="w-3 h-3 bg-white text-[6px] flex items-center justify-center">
                          ★
                        </div>
                      </div>
                      <div className="flex text-white text-[6px] text-center">
                        <div className="w-1/4">Feature 1</div>
                        <div className="w-1/4">Feature 2</div>
                        <div className="w-1/4">Feature 3</div>
                        <div className="w-1/4">Feature 4</div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Icons with Text</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('smallIconsWithText')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('smallIconsWithText');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Key Points</div>
                      <div className="flex items-center mb-1">
                        <div className="w-1 h-1 bg-white rounded-full mr-1" />
                        <div className="text-white text-[6px]">First important point</div>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="w-1 h-1 bg-white rounded-full mr-1" />
                        <div className="text-white text-[6px]">Second important point</div>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="w-1 h-1 bg-white rounded-full mr-1" />
                        <div className="text-white text-[6px]">Third important point</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-1 bg-white rounded-full mr-1" />
                        <div className="text-white text-[6px]">Fourth important point</div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Small Icons with Text</div>
                  </div>

                  <div
                    className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => addSlideFromTemplate('arrows')}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        addSlideFromTemplate('arrows');
                      }
                    }}
                  >
                    <div
                      className="bg-black h-32 rounded flex flex-col p-3"
                      style={{
                        background: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
                      }}
                    >
                      <div className="text-white text-[8px] font-bold mb-1">Process Flow</div>
                      <div className="flex items-center justify-between h-1/2">
                        <div className="bg-gray-600 w-1/4 h-6 rounded flex items-center justify-center">
                          <div className="text-white text-[6px]">Step 1</div>
                        </div>
                        <div className="text-white text-[10px]">→</div>
                        <div className="bg-gray-600 w-1/4 h-6 rounded flex items-center justify-center">
                          <div className="text-white text-[6px]">Step 2</div>
                        </div>
                        <div className="text-white text-[10px]">→</div>
                        <div className="bg-gray-600 w-1/4 h-6 rounded flex items-center justify-center">
                          <div className="text-white text-[6px]">Step 3</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-white text-sm mt-2 text-center">Arrows</div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter className="border-t border-gray-800">
            <Button color="primary" variant="flat" onPress={() => setShowTemplateModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditorModals;
