// src/components/features/application/editor/EditorModals.tsx
import { 
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    Button, 
    Card
  } from "@heroui/react";
  import { Icon } from "@iconify/react";
  
  import SlideStyles from "./styles/SlideStyles";
  import MediaSelector from "./selectors/MediaSelector";
  import ShapeSelector from "./selectors/ShapeSelector";
  import TableSelector from "./selectors/TableSelector";
  import EmbedSelector from "./selectors/EmbedSelector";
  
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
    handleTableSelect: (tableOptions: any) => void;
    handleEmbedSelect: (embedData: any) => void;
    addSlideFromTemplate: (template: "title" | "textAndImage" | "bulletList") => void;
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
        <SlideStyles
          isOpen={isStylesOpen}
          onClose={onStylesClose}
          onSelect={handleStyleSelect}
        />
  
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
          size="3xl"
          onClose={() => setShowTemplateModal(false)}
        >
          <ModalContent>
            <ModalHeader className="border-b border-gray-800">
              <h2 className="text-white">Choose a Slide Template</h2>
            </ModalHeader>
            <ModalBody className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div
                  className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                  role="button"
                  tabIndex={0}
                  onClick={() => addSlideFromTemplate("title")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      addSlideFromTemplate("title");
                    }
                  }}
                >
                  <div
                    className="bg-black h-32 rounded flex flex-col items-center justify-center p-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #111111 0%, #333333 100%)",
                    }}
                  >
                    <div className="text-white text-xs font-bold">
                      Presentation Title
                    </div>
                    <div className="text-white text-[8px] mt-1">
                      Your subtitle goes here
                    </div>
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    Title Slide
                  </div>
                </div>
  
                <div
                  className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                  role="button"
                  tabIndex={0}
                  onClick={() => addSlideFromTemplate("textAndImage")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      addSlideFromTemplate("textAndImage");
                    }
                  }}
                >
                  <div
                    className="bg-black h-32 rounded flex flex-col p-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #111111 0%, #333333 100%)",
                    }}
                  >
                    <div className="text-white text-xs font-bold mb-2">
                      Text & Image
                    </div>
                    <div className="flex h-full">
                      <div className="w-1/2 pr-1">
                        <div className="text-white text-[8px]">
                          Main point goes here
                        </div>
                        <div className="text-white text-[8px] mt-1">
                          Supporting detail goes here
                        </div>
                      </div>
                      <div className="w-1/2 bg-gray-600 rounded" />
                    </div>
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    Text & Image
                  </div>
                </div>
  
                <div
                  className="bg-gray-800 p-2 rounded hover:ring-2 hover:ring-indigo-500 cursor-pointer transition-all"
                  role="button"
                  tabIndex={0}
                  onClick={() => addSlideFromTemplate("bulletList")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      addSlideFromTemplate("bulletList");
                    }
                  }}
                >
                  <div
                    className="bg-black h-32 rounded flex flex-col p-3"
                    style={{
                      background:
                        "linear-gradient(135deg, #111111 0%, #333333 100%)",
                    }}
                  >
                    <div className="text-white text-xs font-bold mb-2">
                      Bullet Points
                    </div>
                    <div className="text-white text-[8px]">
                      <ul className="list-disc list-inside">
                        <li>First bullet point</li>
                        <li>Second bullet point</li>
                        <li>Third bullet point</li>
                        <li>Fourth bullet point</li>
                      </ul>
                    </div>
                  </div>
                  <div className="text-white text-sm mt-2 text-center">
                    Bullet List
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t border-gray-800">
              <Button
                color="primary"
                variant="flat"
                onPress={() => setShowTemplateModal(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default EditorModals;