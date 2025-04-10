// src/components/features/application/editor/EditorTopBar.tsx
import Link from "next/link";
import { Button, Avatar, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";

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
}: EditorTopBarProps) => {
  return (
    <div className="flex items-center p-2 bg-black border-b border-gray-800">
      <div className="flex items-center mr-4">
        <Link className="flex items-center" href="/dashboard">
          <Icon
            className="text-indigo-500 mr-2"
            icon="material-symbols:presentation"
            width={24}
          />
          <span className="font-semibold text-white">Pitch</span>
        </Link>
      </div>

      <div className="border-l border-gray-700 h-6 mx-3" />

      <div className="flex items-center">
        <input
          className="bg-transparent text-gray-200 text-sm focus:outline-none focus:border-indigo-500 border-b border-transparent px-2 py-1 max-w-xs"
          type="text"
          value={presentationTitle}
          onChange={(e) => setPresentationTitle(e.target.value)}
        />
        <div className="text-gray-500 text-xs ml-2">Private</div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Tabs
          aria-label="Editor Tabs"
          classNames={{
            tabList: "bg-black",
            cursor: "bg-indigo-500",
            tab: "text-gray-400 data-[selected=true]:text-white",
          }}
          selectedKey={activeTab}
          onSelectionChange={setActiveTab as any}
        >
          <Tab
            key="edit"
            title={
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:edit-document" width={20} />
                <span>Text</span>
              </div>
            }
          />
          <Tab
            key="media"
            title={
              <div
                className="flex items-center gap-1"
                role="button"
                tabIndex={0}
                onClick={() => openMediaSelector()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openMediaSelector();
                  }
                }}
              >
                <Icon icon="material-symbols:image" width={20} />
                <span>Media</span>
              </div>
            }
          />
          <Tab
            key="shape"
            title={
              <div
                className="flex items-center gap-1"
                role="button"
                tabIndex={0}
                onClick={() => openShapeSelector()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openShapeSelector();
                  }
                }}
              >
                <Icon icon="material-symbols:shapes" width={20} />
                <span>Shape</span>
              </div>
            }
          />
          <Tab
            key="sticker"
            title={
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:sticker" width={20} />
                <span>Sticker</span>
              </div>
            }
          />
          <Tab
            key="chart"
            title={
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:bar-chart" width={20} />
                <span>Chart</span>
              </div>
            }
          />
          <Tab
            key="table"
            title={
              <div
                className="flex items-center gap-1"
                role="button"
                tabIndex={0}
                onClick={() => openTableSelector()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openTableSelector();
                  }
                }}
              >
                <Icon icon="material-symbols:table" width={20} />
                <span>Table</span>
              </div>
            }
          />
          <Tab
            key="embed"
            title={
              <div
                className="flex items-center gap-1"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openEmbedSelector();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    openEmbedSelector();
                  }
                }}
              >
                <Icon icon="material-symbols:code" width={20} />
                <span>Embed</span>
              </div>
            }
          />
          <Tab
            key="record"
            title={
              <div className="flex items-center gap-1">
                <Icon icon="material-symbols:mic" width={20} />
                <span>Record</span>
              </div>
            }
          />
        </Tabs>

        <div className="flex items-center gap-2 ml-2">
          <Button
            isIconOnly
            className="text-gray-400"
            size="sm"
            variant="light"
          >
            <Icon icon="material-symbols:undo" width={20} />
          </Button>

          <Button
            isIconOnly
            className="text-gray-400"
            size="sm"
            variant="light"
          >
            <Icon icon="material-symbols:redo" width={20} />
          </Button>

          <Avatar
            className="ml-2"
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />

          <Button
            className="bg-indigo-600 text-white"
            color="primary"
            endContent={<Icon icon="material-symbols:play-arrow" width={20} />}
            variant="solid"
            onPress={handlePresent}
          >
            Present
          </Button>

          <Button className="text-white" color="primary" variant="flat">
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorTopBar;