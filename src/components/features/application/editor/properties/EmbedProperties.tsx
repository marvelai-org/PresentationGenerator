"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Slider,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Divider,
  Switch,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { EmbedData } from "../selectors/EmbedSelector";

interface EmbedPropertiesProps {
  selectedEmbed: EmbedData | null;
  onUpdateEmbed: (embedId: string, properties: Partial<EmbedData>) => void;
}

/**
 * Renders a user interface for editing properties of a selected embed.
 *
 * Displays controls for updating the embed's URL, dimensions (width, height, and aspect ratio),
 * position, and player options (autoplay, loop, controls). The component initializes its state
 * from the provided embed data and applies any changes via the onUpdateEmbed callback. If no embed
 * is selected, a placeholder message is displayed.
 *
 * @param selectedEmbed - The current embed data used to populate the editor fields; if null,
 * the component shows a placeholder.
 * @param onUpdateEmbed - Callback function to update the selected embed with new property values.
 */
export default function EmbedProperties({
  selectedEmbed,
  onUpdateEmbed,
}: EmbedPropertiesProps) {
  const [width, setWidth] = useState<number>(560);
  const [height, setHeight] = useState<number>(315);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [controls, setControls] = useState(true);
  const [url, setUrl] = useState("");

  // Set initial state when selected embed changes
  useEffect(() => {
    if (selectedEmbed) {
      setWidth(selectedEmbed.width || 560);
      setHeight(selectedEmbed.height || 315);
      setAspectRatio(selectedEmbed.aspectRatio || "16:9");
      setUrl(selectedEmbed.url || "");

      // Extract autoplay, loop, and controls settings from embedHtml if available
      if (selectedEmbed.embedHtml) {
        setAutoplay(
          selectedEmbed.embedHtml.includes("autoplay=1") ||
            selectedEmbed.embedHtml.includes("autoplay;"),
        );
        setLoop(
          selectedEmbed.embedHtml.includes("loop=1") ||
            selectedEmbed.embedHtml.includes("loop;"),
        );
        setControls(!selectedEmbed.embedHtml.includes("controls=0"));
      }
    }
  }, [selectedEmbed]);

  // Handler for aspect ratio lock changes
  const handleAspectRatioLockChange = (shouldMaintain: boolean) => {
    setMaintainAspectRatio(shouldMaintain);
    
    if (shouldMaintain && selectedEmbed && aspectRatio) {
      // If turning on aspect ratio maintenance, adjust the height
      const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
      const newHeight = Math.round((width * aspectHeight) / aspectWidth);
      
      setHeight(newHeight);
      
      if (selectedEmbed) {
        applyChanges({
          height: newHeight,
        });
      }
    }
  };

  // Handler for width changes with aspect ratio maintenance
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);

    if (maintainAspectRatio && aspectRatio) {
      const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
      const newHeight = Math.round((newWidth * aspectHeight) / aspectWidth);

      setHeight(newHeight);

      if (selectedEmbed) {
        applyChanges({
          width: newWidth,
          height: newHeight,
        });
      }
    } else if (selectedEmbed) {
      applyChanges({ width: newWidth });
    }
  };

  // Handler for height changes with aspect ratio maintenance
  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);

    if (maintainAspectRatio && aspectRatio) {
      const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
      const newWidth = Math.round((newHeight * aspectWidth) / aspectHeight);

      setWidth(newWidth);

      if (selectedEmbed) {
        applyChanges({
          width: newWidth,
          height: newHeight,
        });
      }
    } else if (selectedEmbed) {
      applyChanges({ height: newHeight });
    }
  };

  // Handler for aspect ratio changes
  const handleAspectRatioChange = (newAspectRatio: string) => {
    setAspectRatio(newAspectRatio);

    if (maintainAspectRatio && selectedEmbed) {
      const [aspectWidth, aspectHeight] = newAspectRatio.split(":").map(Number);
      const newHeight = Math.round((width * aspectHeight) / aspectWidth);

      setHeight(newHeight);

      applyChanges({
        aspectRatio: newAspectRatio,
        height: newHeight,
      });
    } else if (selectedEmbed) {
      applyChanges({ aspectRatio: newAspectRatio });
    }
  };

  // Handler for position changes
  const handlePositionChange = (axis: "x" | "y", value: number) => {
    const newPosition = { ...position, [axis]: value };

    setPosition(newPosition);

    if (selectedEmbed) {
      // Note: In a real implementation, you'd update the position in the parent component
      // This is a placeholder for the position update logic
    }
  };

  // Handler for autoplay, loop, and controls changes
  const handlePlayerOptionChange = (
    option: "autoplay" | "loop" | "controls",
    value: boolean,
  ) => {
    if (option === "autoplay") setAutoplay(value);
    if (option === "loop") setLoop(value);
    if (option === "controls") setControls(value);

    if (selectedEmbed && selectedEmbed.embedHtml) {
      let updatedHtml = selectedEmbed.embedHtml;

      // Update the embed HTML with the new settings
      // This is a simplified example - in a real implementation, you'd need more robust HTML parsing
      if (option === "autoplay") {
        if (value) {
          if (selectedEmbed.type === "youtube") {
            updatedHtml = updatedHtml.replace(
              "youtube.com/embed/",
              "youtube.com/embed/?autoplay=1&",
            );
          } else {
            updatedHtml = updatedHtml.replace('allow="', 'allow="autoplay; ');
          }
        } else {
          updatedHtml = updatedHtml
            .replace("autoplay=1&", "")
            .replace("autoplay; ", "");
        }
      }

      if (option === "loop") {
        if (value) {
          if (selectedEmbed.type === "youtube") {
            updatedHtml = updatedHtml.replace(
              "youtube.com/embed/",
              "youtube.com/embed/?loop=1&playlist=VIDEOID&",
            );
          }
        } else {
          updatedHtml = updatedHtml.replace("loop=1&playlist=VIDEOID&", "");
        }
      }

      if (option === "controls") {
        if (!value) {
          if (selectedEmbed.type === "youtube") {
            updatedHtml = updatedHtml.replace(
              "youtube.com/embed/",
              "youtube.com/embed/?controls=0&",
            );
          }
        } else {
          updatedHtml = updatedHtml.replace("controls=0&", "");
        }
      }

      applyChanges({ embedHtml: updatedHtml });
    }
  };

  // Handler for URL changes
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (selectedEmbed) {
      applyChanges({ url: newUrl });
    }
  };

  // Apply changes to the embed
  const applyChanges = (changes: Partial<EmbedData>) => {
    if (selectedEmbed) {
      onUpdateEmbed(selectedEmbed.id, changes);
    }
  };

  // Function to generate common aspect ratio options
  const getAspectRatioOptions = () => [
    { key: "16:9", label: "16:9 - Widescreen" },
    { key: "4:3", label: "4:3 - Standard" },
    { key: "1:1", label: "1:1 - Square" },
    { key: "9:16", label: "9:16 - Portrait" },
    { key: "21:9", label: "21:9 - Ultrawide" },
  ];

  // If no embed is selected, show a placeholder
  if (!selectedEmbed) {
    return (
      <div className="text-gray-400 text-center p-4">
        <Icon
          className="mx-auto mb-2 opacity-50"
          icon="material-symbols:embed"
          width={36}
        />
        <p>Select an embed to customize its properties</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="space-y-4">
        {/* Embed type and basic info */}
        <div>
          <h3 className="text-sm font-medium mb-2">Embed Type</h3>
          <div className="flex items-center gap-2 p-2 rounded bg-gray-800">
            <Icon
              className={
                selectedEmbed.type === "youtube"
                  ? "text-red-500"
                  : selectedEmbed.type === "vimeo"
                    ? "text-[#1ab7ea]"
                    : selectedEmbed.type === "loom"
                      ? "text-[#4b42f5]"
                      : selectedEmbed.type === "spotify"
                        ? "text-[#1db954]"
                        : selectedEmbed.type === "figma"
                          ? "text-white"
                          : "text-gray-400"
              }
              icon={
                selectedEmbed.type === "youtube"
                  ? "mdi:youtube"
                  : selectedEmbed.type === "vimeo"
                    ? "mdi:vimeo"
                    : selectedEmbed.type === "loom"
                      ? "simple-icons:loom"
                      : selectedEmbed.type === "spotify"
                        ? "mdi:spotify"
                        : selectedEmbed.type === "figma"
                          ? "simple-icons:figma"
                          : "material-symbols:public"
              }
              width={20}
            />
            <span className="capitalize">{selectedEmbed.type}</span>
          </div>
        </div>

        {/* URL field */}
        <div>
          <h3 className="text-sm font-medium mb-2">URL</h3>
          <Input
            classNames={{
              input: "bg-gray-800 text-white",
              inputWrapper:
                "bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500",
            }}
            placeholder="Enter embed URL"
            startContent={
              <Icon
                className="text-gray-400"
                icon="material-symbols:link"
                width={16}
              />
            }
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>

        <Divider className="bg-gray-700 my-4" />

        {/* Size controls */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Size</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Lock aspect ratio</span>
              <Switch
                color="primary"
                isSelected={maintainAspectRatio}
                size="sm"
                onValueChange={handleAspectRatioLockChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Width</span>
                <span>{width}px</span>
              </div>
              <Input
                classNames={{
                  input: "bg-gray-800 text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500",
                }}
                max={1920}
                min={100}
                startContent={
                  <Icon
                    className="text-gray-400"
                    icon="material-symbols:width"
                    width={16}
                  />
                }
                type="number"
                value={width.toString()}
                onChange={(e) =>
                  handleWidthChange(parseInt(e.target.value) || 100)
                }
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Height</span>
                <span>{height}px</span>
              </div>
              <Input
                classNames={{
                  input: "bg-gray-800 text-white",
                  inputWrapper:
                    "bg-gray-800 border-gray-700 hover:border-gray-600 focus-within:border-indigo-500",
                }}
                max={1080}
                min={100}
                startContent={
                  <Icon
                    className="text-gray-400"
                    icon="material-symbols:height"
                    width={16}
                  />
                }
                type="number"
                value={height.toString()}
                onChange={(e) =>
                  handleHeightChange(parseInt(e.target.value) || 100)
                }
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1 text-xs">
              <span>Aspect Ratio</span>
              <span>{aspectRatio}</span>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="w-full justify-between text-white bg-gray-800 border border-gray-700"
                  endContent={
                    <Icon icon="material-symbols:arrow-drop-down" width={20} />
                  }
                  variant="flat"
                >
                  {aspectRatio}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Aspect Ratios">
                {getAspectRatioOptions().map((option) => (
                  <DropdownItem
                    key={option.key}
                    onPress={() => handleAspectRatioChange(option.key)}
                  >
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        <Divider className="bg-gray-700 my-4" />

        {/* Position controls */}
        <div>
          <h3 className="text-sm font-medium mb-2">Position</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>X Position</span>
                <span>{position.x}px</span>
              </div>
              <Slider
                classNames={{
                  track: "bg-gray-700",
                  filler: "bg-indigo-600",
                }}
                maxValue={1000}
                minValue={0}
                size="sm"
                step={1}
                value={position.x}
                onChange={(value) => handlePositionChange("x", value as number)}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-xs">
                <span>Y Position</span>
                <span>{position.y}px</span>
              </div>
              <Slider
                classNames={{
                  track: "bg-gray-700",
                  filler: "bg-indigo-600",
                }}
                maxValue={1000}
                minValue={0}
                size="sm"
                step={1}
                value={position.y}
                onChange={(value) => handlePositionChange("y", value as number)}
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Button
              className="bg-gray-800 text-white"
              size="sm"
              variant="flat"
              onPress={() => {
                /* Implement alignment logic */
              }}
            >
              <Icon icon="material-symbols:align-horizontal-left" width={18} />
            </Button>
            <Button
              className="bg-gray-800 text-white"
              size="sm"
              variant="flat"
              onPress={() => {
                /* Implement alignment logic */
              }}
            >
              <Icon
                icon="material-symbols:align-horizontal-center"
                width={18}
              />
            </Button>
            <Button
              className="bg-gray-800 text-white"
              size="sm"
              variant="flat"
              onPress={() => {
                /* Implement alignment logic */
              }}
            >
              <Icon icon="material-symbols:align-horizontal-right" width={18} />
            </Button>
          </div>
        </div>

        {/* Player options - only show for video embeds */}
        {(selectedEmbed.type === "youtube" ||
          selectedEmbed.type === "vimeo" ||
          selectedEmbed.type === "loom") && (
          <>
            <Divider className="bg-gray-700 my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Player Options</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Autoplay</span>
                  <Switch
                    color="primary"
                    isSelected={autoplay}
                    size="sm"
                    onValueChange={(isSelected) =>
                      handlePlayerOptionChange("autoplay", isSelected)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Loop</span>
                  <Switch
                    color="primary"
                    isSelected={loop}
                    size="sm"
                    onValueChange={(isSelected) =>
                      handlePlayerOptionChange("loop", isSelected)
                    }
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Show Controls</span>
                  <Switch
                    color="primary"
                    isSelected={controls}
                    size="sm"
                    onValueChange={(isSelected) =>
                      handlePlayerOptionChange("controls", isSelected)
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Advanced options for custom embeds */}
        {selectedEmbed.type === "custom" && (
          <>
            <Divider className="bg-gray-700 my-4" />
            <div>
              <h3 className="text-sm font-medium mb-2">Advanced Options</h3>
              <Button
                className="bg-gray-800 text-white w-full"
                size="sm"
                startContent={<Icon icon="material-symbols:code" width={18} />}
                variant="flat"
                onPress={() => {
                  /* Implement custom code editing */
                }}
              >
                Edit Custom Embed Code
              </Button>
              <p className="text-xs text-gray-400 mt-2">
                Edit raw HTML code for advanced customization options
              </p>
            </div>
          </>
        )}

        {/* Refresh button */}
        <Divider className="bg-gray-700 my-4" />
        <div>
          <Button
            className="bg-gray-800 text-white w-full"
            size="sm"
            startContent={<Icon icon="material-symbols:refresh" width={18} />}
            variant="flat"
            onPress={() => {
              // Implement refresh logic
              if (selectedEmbed) {
                applyChanges({ url: url + "?refresh=" + Date.now() });
                setTimeout(() => applyChanges({ url }), 100);
              }
            }}
          >
            Refresh Embed
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            Update the embed to reflect any content changes
          </p>
        </div>
      </div>
    </div>
  );
}
