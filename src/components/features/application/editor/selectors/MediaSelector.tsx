"use client";

import { useState, useCallback } from "react";
import { Icon } from "@iconify/react";

import CommandMenuModal from "../CommandMenuModal";

interface MediaSelectorProps {
  onSelect: (mediaUrl: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Displays a modal media library for selecting images, stickers, icons, shapes, and charts.
 *
 * The component renders a command menu modal with tabbed interfaces that filter media based on user search input.
 * It supports keyboard accessibility, allowing selection via both mouse clicks and key presses.
 *
 * @param onSelect - Callback invoked with the identifier or URL of the selected media item.
 * @param onClose - Callback to close the media library modal.
 * @param isOpen - Boolean indicating whether the modal is currently open.
 *
 * @example
 * <MediaSelector onSelect={handleSelect} onClose={handleClose} isOpen={true} />
 */
export default function MediaSelector({
  onSelect,
  onClose,
  isOpen,
}: MediaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [_activeTab, _setActiveTab] = useState("images");

  // Sample image data
  const images = [
    {
      id: 1,
      url: "/climate-earth.jpg",
      type: "abstract",
      title: "Earth Abstract",
    },
    { id: 2, url: "/unsplash-1.jpg", type: "abstract", title: "Blue Abstract" },
    {
      id: 3,
      url: "/unsplash-2.jpg",
      type: "data",
      title: "Data Visualization",
    },
    {
      id: 4,
      url: "/unsplash-3.jpg",
      type: "abstract",
      title: "Colorful Abstract",
    },
    { id: 5, url: "/unsplash-4.jpg", type: "tech", title: "Technology" },
    { id: 6, url: "/unsplash-5.jpg", type: "3d", title: "3D Shapes" },
  ];

  // Sample icons/stickers
  const stickers = [
    {
      id: 1,
      type: "look",
      title: "Look at This",
      items: [
        "arrow1.png",
        "arrow2.png",
        "hot.png",
        "look.png",
        "open.png",
        "stars.png",
      ],
    },
    {
      id: 2,
      type: "mark",
      title: "Mark It Up",
      items: ["star-rating.png", "update.png", "welcome.png"],
    },
    { id: 3, type: "make", title: "Make Your Point", items: [] },
    { id: 4, type: "team", title: "Teamwork", items: [] },
    { id: 5, type: "hands", title: "Chubby Hands", items: [] },
    { id: 6, type: "pitch", title: "Pitch to Win", items: [] },
  ];

  const handleSearch = useCallback((query: string) => {
    setSearchTerm(query);
  }, []);

  const renderImageTab = () => (
    <div className="grid grid-cols-3 gap-4">
      {images
        .filter((image) =>
          image.title.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((image) => (
          <div
            key={image.id}
            className="cursor-pointer hover:opacity-90 transition-all"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(image.url)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(image.url);
              }
            }}
          >
            <div
              className="h-40 rounded-lg bg-gray-800 mb-2"
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="text-default-500 text-sm">{image.title}</div>
          </div>
        ))}
    </div>
  );

  const renderStickersTab = () => (
    <div className="space-y-8">
      {stickers
        .filter(
          (category) =>
            category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.items.some((item) =>
              item.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        )
        .map((category) => (
          <div key={category.id} className="space-y-3">
            <h3 className="text-default-700 font-medium">{category.title}</h3>
            <div className="grid grid-cols-4 gap-4">
              {category.items.length > 0 ? (
                category.items.map((item, index) => (
                  <div
                    key={index}
                    className="h-24 rounded-lg bg-content2/50 flex items-center justify-center cursor-pointer hover:bg-content3 transition-all"
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(`/stickers/${item}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        onSelect(`/stickers/${item}`);
                      }
                    }}
                  >
                    <div className="w-16 h-16 bg-content3 rounded-md" />
                  </div>
                ))
              ) : (
                <div className="h-24 col-span-4 rounded-lg bg-content2/50 flex items-center justify-center text-default-400">
                  No stickers in this category
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  const renderIconsTab = () => (
    <div className="space-y-4">
      <h3 className="text-default-700 font-medium">Fluent</h3>
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 w-16 rounded-lg bg-content2/50 flex items-center justify-center cursor-pointer hover:bg-content3 transition-all"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(`icon-${index}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(`icon-${index}`);
              }
            }}
          >
            <Icon
              className="text-default-500"
              icon={
                [
                  "fluent:checkmark-24-regular",
                  "fluent:clock-24-regular",
                  "fluent:person-24-regular",
                  "fluent:people-24-regular",
                  "fluent:money-24-regular",
                  "fluent:question-24-regular",
                ][index]
              }
              width={24}
            />
          </div>
        ))}
      </div>

      <h3 className="text-default-700 font-medium mt-6">Filled</h3>
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-16 w-16 rounded-lg bg-content2/50 flex items-center justify-center cursor-pointer hover:bg-content3 transition-all"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(`icon-filled-${index}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(`icon-filled-${index}`);
              }
            }}
          >
            <Icon
              className="text-default-500"
              icon={
                [
                  "fluent:checkmark-24-filled",
                  "fluent:clock-24-filled",
                  "fluent:person-24-filled",
                  "fluent:people-24-filled",
                  "fluent:money-24-filled",
                  "fluent:question-24-filled",
                ][index]
              }
              width={24}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderShapesTab = () => (
    <div className="grid grid-cols-4 gap-4">
      {[
        "square",
        "circle",
        "triangle",
        "hexagon",
        "star",
        "heart",
        "arrow-right",
        "arrow-left",
      ].map((shape, index) => (
        <div
          key={index}
          className="h-24 rounded-lg bg-content2/50 flex items-center justify-center cursor-pointer hover:bg-content3 transition-all"
          role="button"
          tabIndex={0}
          onClick={() => onSelect(`shape-${shape}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(`shape-${shape}`);
            }
          }}
        >
          <div
            className={`w-16 h-16 ${shape === "circle" ? "rounded-full" : ""} ${shape === "triangle" ? "triangle" : ""} bg-primary`}
          />
        </div>
      ))}
    </div>
  );

  const renderChartsTab = () => (
    <div className="grid grid-cols-3 gap-4">
      {["bar", "line", "pie", "area", "scatter", "radar"].map(
        (chart, index) => (
          <div
            key={index}
            className="h-40 rounded-lg bg-content2/50 p-4 cursor-pointer hover:bg-content3 transition-all"
            role="button"
            tabIndex={0}
            onClick={() => onSelect(`chart-${chart}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(`chart-${chart}`);
              }
            }}
          >
            <div className="text-default-500 text-sm mb-2">
              {chart.charAt(0).toUpperCase() + chart.slice(1)} Chart
            </div>
            <div className="h-28 bg-content3 rounded flex items-center justify-center">
              <Icon
                className="text-primary"
                icon={`mdi:chart-${chart}`}
                width={32}
              />
            </div>
          </div>
        ),
      )}
    </div>
  );

  // Define the tabs for the command menu modal
  const tabs = [
    {
      key: "images",
      title: "Images",
      icon: "material-symbols:image",
      content: renderImageTab(),
    },
    {
      key: "stickers",
      title: "Stickers",
      icon: "material-symbols:sticker",
      content: renderStickersTab(),
    },
    {
      key: "icons",
      title: "Icons",
      icon: "material-symbols:star",
      content: renderIconsTab(),
    },
    {
      key: "shapes",
      title: "Shapes",
      icon: "material-symbols:shapes",
      content: renderShapesTab(),
    },
    {
      key: "charts",
      title: "Charts",
      icon: "material-symbols:chart-data",
      content: renderChartsTab(),
    },
  ];

  // Sidebar items for left navigation panel
  const _sidebarItems = [
    { key: "images", label: "Images" },
    { key: "stickers", label: "Stickers" },
    { key: "icons", label: "Icons" },
    { key: "shapes", label: "Shapes" },
    { key: "charts", label: "Charts" },
  ];

  return (
    <CommandMenuModal
      isOpen={isOpen}
      modalSize="4xl"
      searchPlaceholder="Search for images, icons, or stickers..."
      tabs={tabs}
      _title="Media Library"
      onClose={onClose}
      onSearch={handleSearch}
    />
  );
}
