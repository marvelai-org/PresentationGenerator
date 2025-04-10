// src/components/features/application/editor/EditorSidebar.tsx
import { ReactNode } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

import { Slide } from "./EditorContainer";

interface EditorSidebarProps {
  children: ReactNode;
  slides: Slide[];
  currentSlideIndex: number;
  addNewSlide: () => void;
  setShowTemplateModal: (show: boolean) => void;
}

const EditorSidebar = ({
  children,
  slides,
  currentSlideIndex,
  addNewSlide,
  setShowTemplateModal,
}: EditorSidebarProps) => {
  return (
    <div className="w-48 bg-black border-r border-gray-800 overflow-y-auto flex-shrink-0">
      <div className="p-3 flex justify-between items-center border-b border-gray-800">
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="text-white"
              endContent={
                <Icon
                  icon="material-symbols:arrow-drop-down"
                  width={18}
                />
              }
              size="sm"
              startContent={
                <Icon icon="material-symbols:add" width={18} />
              }
              variant="flat"
            >
              Add slide
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Slide Templates">
            <DropdownItem key="blank" onPress={addNewSlide}>
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:add-box-outline"
                  width={18}
                />
                <span>Blank Slide</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="title"
              onPress={() => {
                // This would be handled by the parent component
                // which would call addSlideFromTemplate("title")
              }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:title" width={18} />
                <span>Title Slide</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="textAndImage"
              onPress={() => {
                // This would be handled by the parent component
                // which would call addSlideFromTemplate("textAndImage")
              }}
            >
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:image-text" width={18} />
                <span>Text & Image</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="bulletList"
              onPress={() => {
                // This would be handled by the parent component
                // which would call addSlideFromTemplate("bulletList")
              }}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:format-list-bulleted"
                  width={18}
                />
                <span>Bullet List</span>
              </div>
            </DropdownItem>
            <DropdownItem
              key="more"
              onPress={() => setShowTemplateModal(true)}
            >
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:dashboard" width={18} />
                <span>More Templates...</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="p-2 space-y-2">
        {children}
      </div>
    </div>
  );
};

export default EditorSidebar;