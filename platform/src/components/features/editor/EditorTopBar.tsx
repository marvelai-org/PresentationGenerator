// src/components/features/application/editor/EditorTopBar.tsx
import Link from 'next/link';
import { Button, Avatar, Tooltip, Badge } from '@heroui/react';
import { Icon } from '@iconify/react';

interface EditorTopBarProps {
  presentationTitle: string;
  setPresentationTitle: (title: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openMediaSelector: () => void;
  openShapeSelector: () => void;
  openTableSelector: () => void;
  openEmbedSelector: () => void;
  handlePresent: () => void;
  addTextImageLayout?: () => void;
}

const EditorTopBar = ({
  presentationTitle,
  setPresentationTitle,
  activeTab,
  setActiveTab,
  openMediaSelector,
  openShapeSelector,
  openTableSelector,
  openEmbedSelector,
  handlePresent,
  addTextImageLayout,
}: EditorTopBarProps) => {
  // Function to handle tab selection
  const handleTabClick = (key: string) => {
    setActiveTab(key);

    // Call the appropriate selector based on the selected tab
    if (key === 'media') openMediaSelector();
    if (key === 'shape') openShapeSelector();
    if (key === 'table') openTableSelector();
    if (key === 'embed') openEmbedSelector();
  };

  return (
    <div className="flex items-center p-2 bg-black border-b border-gray-800">
      {/* Left Section */}
      <div className="flex items-center">
        <Link className="mr-2" href="/dashboard">
          <Button isIconOnly className="text-gray-400 hover:text-white" size="sm" variant="light">
            <Icon icon="material-symbols:home-outline" width={22} />
          </Button>
        </Link>

        <Button
          isIconOnly
          className="text-gray-400 mr-4 hover:text-white"
          size="sm"
          variant="light"
        >
          <Icon icon="material-symbols:menu" width={22} />
        </Button>

        <div className="flex flex-col">
          <input
            className="bg-transparent border-none text-white text-lg font-medium px-0 focus:ring-0"
            placeholder="Untitled Presentation"
            type="text"
            value={presentationTitle}
            onChange={e => setPresentationTitle(e.target.value)}
          />
          <div className="text-xs text-gray-500">Private</div>
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-2">
          <TabButton
            icon="material-symbols:text-fields"
            isActive={activeTab === 'edit'}
            label="Text"
            onClick={() => handleTabClick('edit')}
          />

          <TabButton
            icon="material-symbols:image"
            isActive={activeTab === 'media'}
            label="Media"
            onClick={() => handleTabClick('media')}
          />

          <TabButton
            icon="material-symbols:shapes"
            isActive={activeTab === 'shape'}
            label="Shape"
            onClick={() => handleTabClick('shape')}
          />

          <TabButton
            icon="material-symbols:bar-chart"
            isActive={activeTab === 'chart'}
            label="Chart"
            onClick={() => handleTabClick('chart')}
          />

          <TabButton
            icon="material-symbols:table"
            isActive={activeTab === 'table'}
            label="Table"
            onClick={() => handleTabClick('table')}
          />

          <TabButton
            icon="material-symbols:code"
            isActive={activeTab === 'embed'}
            label="Embed"
            onClick={() => handleTabClick('embed')}
          />

          <TabButton
            icon="material-symbols:mic"
            isActive={activeTab === 'record'}
            label="Record"
            onClick={() => handleTabClick('record')}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Tooltip content="Add Layout" placement="bottom">
          <Button
            isIconOnly
            className="text-gray-400 hover:text-white"
            size="sm"
            variant="light"
            onPress={addTextImageLayout}
          >
            <Icon icon="material-symbols:add" width={22} />
          </Button>
        </Tooltip>

        <Tooltip content="Comments" placement="bottom">
          <Button isIconOnly className="text-gray-400 hover:text-white" size="sm" variant="light">
            <Icon icon="material-symbols:comment-outline" width={22} />
          </Button>
        </Tooltip>

        <Tooltip content="Analytics" placement="bottom">
          <Button isIconOnly className="text-gray-400 hover:text-white" size="sm" variant="light">
            <Icon icon="material-symbols:analytics-outline" width={22} />
          </Button>
        </Tooltip>

        <Button
          className="text-white"
          color="primary"
          startContent={<Icon icon="material-symbols:play-arrow" width={20} />}
          variant="flat"
          onPress={handlePresent}
        >
          Play
        </Button>

        <Button className="bg-indigo-600 text-white" color="primary" onPress={() => {}}>
          Share
        </Button>

        <Badge color="success" content="" placement="bottom-right" shape="circle" size="sm">
          <Avatar
            className="h-8 w-8"
            fallback={<div className="bg-primary text-white">TS</div>}
            name="Talha Sabri"
            src="https://placewaifu.com/image/200"
          />
        </Badge>
      </div>
    </div>
  );
};

// Custom Tab Button Component to maintain consistent styling
const TabButton = ({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) => {
  return (
    <button
      className={`flex flex-col items-center p-2 rounded transition-colors ${
        isActive ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
      }`}
      onClick={onClick}
    >
      <Icon icon={icon} width={22} />
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

export default EditorTopBar;
