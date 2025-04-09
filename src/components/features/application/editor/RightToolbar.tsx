// src/components/features/application/editor/RightToolbar.tsx
import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RightToolbarProps {
  showPropertiesPanel: boolean;
  setShowPropertiesPanel: (show: boolean) => void;
}

const RightToolbar = ({
  showPropertiesPanel,
  setShowPropertiesPanel,
}: RightToolbarProps) => {
  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 bg-black/40 p-1 rounded-lg">
      <Tooltip content="Edit" placement="left">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:edit" width={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Shapes" placement="left">
        <Button
          isIconOnly
          className={`${
            showPropertiesPanel ? "text-indigo-400" : "text-gray-400"
          }`}
          size="sm"
          variant="light"
          onPress={() => setShowPropertiesPanel(!showPropertiesPanel)}
        >
          <Icon icon="material-symbols:shapes" width={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Comments" placement="left">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:comment" width={20} />
        </Button>
      </Tooltip>

      <Tooltip content="Layout" placement="left">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:dashboard" width={20} />
        </Button>
      </Tooltip>

      <Tooltip content="History" placement="left">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:history" width={20} />
        </Button>
      </Tooltip>

      <Tooltip content="User" placement="left">
        <Button
          isIconOnly
          className="text-gray-400"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:person" width={20} />
        </Button>
      </Tooltip>
    </div>
  );
};

export default RightToolbar;