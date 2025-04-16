// src/components/features/application/editor/StyleControls.tsx
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Icon } from '@iconify/react';

interface StyleControlsProps {
  onStylesOpen: () => void;
  openMediaSelector: () => void;
}

const StyleControls = ({ onStylesOpen, openMediaSelector }: StyleControlsProps) => {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/60 rounded-full px-4 py-1">
      <Button
        className="text-gray-300 flex items-center gap-1"
        size="sm"
        startContent={<Icon icon="material-symbols:style" width={18} />}
        variant="light"
        onPress={onStylesOpen}
      >
        Slide style
      </Button>

      <Dropdown>
        <DropdownTrigger>
          <Button
            className="text-gray-300 flex items-center gap-1"
            size="sm"
            startContent={<Icon icon="material-symbols:palette" width={18} />}
            variant="light"
          >
            Slide color
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Color Options">
          <DropdownItem
            key="black"
            startContent={<div className="bg-black rounded-full w-4 h-4" />}
          >
            Black
          </DropdownItem>
          <DropdownItem
            key="gray"
            startContent={<div className="bg-gray-500 rounded-full w-4 h-4" />}
          >
            Gray
          </DropdownItem>
          <DropdownItem
            key="mint"
            startContent={<div className="bg-green-400 rounded-full w-4 h-4" />}
          >
            Mint
          </DropdownItem>
          <DropdownItem
            key="darkgray"
            startContent={<div className="bg-gray-800 rounded-full w-4 h-4" />}
          >
            Dark Gray
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Button
        className="text-gray-300 flex items-center gap-1"
        size="sm"
        startContent={<Icon icon="material-symbols:image" width={18} />}
        variant="light"
        onPress={openMediaSelector}
      >
        Background image
      </Button>
    </div>
  );
};

export default StyleControls;
