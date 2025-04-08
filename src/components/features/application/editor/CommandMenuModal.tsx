"use client";

import { ReactNode, useCallback, useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  Button,
  Tabs,
  Tab,
  ScrollShadow,
  Kbd,
  tv,
} from "@heroui/react";
import { Command } from "cmdk";
import { Icon } from "@iconify/react";

// Define the TV slots for consistent styling
const cmdkModal = tv({
  slots: {
    base: "max-h-full h-auto",
    header: [
      "flex",
      "items-center",
      "w-full",
      "px-4",
      "border-b",
      "border-default-400/50",
      "dark:border-default-100",
    ],
    searchIcon: "text-default-400 text-lg [&>g]:stroke-[2px]",
    input: [
      "w-full",
      "px-2",
      "h-14",
      "font-sans",
      "text-lg",
      "outline-none",
      "rounded-none",
      "bg-transparent",
      "text-default-700",
      "placeholder-default-500",
      "dark:text-default-500",
      "dark:placeholder:text-default-300",
    ],
    listScroll: ["pt-2", "pr-4", "pb-6", "overflow-y-auto"],
    list: ["max-h-[50vh] sm:max-h-[40vh]"],
    listWrapper: ["flex", "flex-col", "gap-4", "pb-4"],
    itemWrapper: [
      "px-4",
      "mt-2",
      "group",
      "flex",
      "h-[54px]",
      "justify-between",
      "items-center",
      "rounded-lg",
      "shadow",
      "bg-content2/50",
      "active:opacity-70",
      "cursor-pointer",
      "transition-opacity",
      "data-[active=true]:bg-primary",
      "data-[active=true]:text-primary-foreground",
    ],
    leftWrapper: ["flex", "gap-3", "items-center", "w-full", "max-w-full"],
    leftIcon: [
      "text-default-500 dark:text-default-300",
      "group-data-[active=true]:text-primary-foreground",
    ],
    itemContent: ["flex", "flex-col", "gap-0", "justify-center", "max-w-[80%]"],
    itemParentTitle: [
      "text-default-400",
      "text-xs",
      "group-data-[active=true]:text-primary-foreground",
      "select-none",
    ],
    itemTitle: [
      "truncate",
      "text-default-500",
      "group-data-[active=true]:text-primary-foreground",
      "select-none",
    ],
    emptyWrapper: [
      "flex",
      "flex-col",
      "text-center",
      "items-center",
      "justify-center",
      "h-32",
    ],
    sectionTitle: ["text-xs", "font-semibold", "leading-4", "text-default-900"],
    tabList: [
      "bg-transparent",
      "p-0",
      "border-b",
      "border-default-400/50",
      "dark:border-default-100",
    ],
    tab: "text-default-400 data-[selected=true]:text-white",
    tabCursor: "bg-primary",
  },
});

interface CommandMenuTab {
  key: string;
  title: ReactNode;
  icon?: string;
  content: ReactNode;
}

interface CommandMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  tabs?: CommandMenuTab[];
  children?: ReactNode;
  showSearch?: boolean;
  closeOnSelect?: boolean;
  modalSize?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
}

export default function CommandMenuModal({
  isOpen,
  onClose,
  title = "Command Menu",
  searchPlaceholder = "Search...",
  onSearch,
  tabs,
  children,
  showSearch = true,
  closeOnSelect = true,
  modalSize = "2xl",
}: CommandMenuModalProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>(tabs?.[0]?.key || "");
  const slots = cmdkModal();
  const eventRef = useRef<"mouse" | "keyboard">();

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch?.(value);
    },
    [onSearch],
  );

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: [
          "border-small",
          "dark:border-default-100",
          "supports-[backdrop-filter]:bg-background/80",
          "dark:supports-[backdrop-filter]:bg-background/30",
          "supports-[backdrop-filter]:backdrop-blur-md",
          "supports-[backdrop-filter]:backdrop-saturate-150",
        ],
        backdrop: ["bg-black/80"],
      }}
      isOpen={isOpen}
      motionProps={{
        onAnimationComplete: () => {
          if (!isOpen) {
            setQuery("");
          }
        },
      }}
      placement="top"
      scrollBehavior="inside"
      size={modalSize}
      onClose={onClose}
    >
      <ModalContent>
        <Command
          className={slots.base()}
          label="Command menu"
          shouldFilter={false}
        >
          {showSearch && (
            <div className={slots.header()}>
              <Icon
                className={slots.searchIcon()}
                icon="solar:magnifer-linear"
                width={20}
              />
              <Command.Input
                className={slots.input()}
                placeholder={searchPlaceholder}
                value={query}
                onValueChange={handleSearch}
              />
              {query.length > 0 && (
                <Button
                  isIconOnly
                  className="border border-default-400 data-[hover=true]:bg-content2 dark:border-default-100"
                  radius="full"
                  size="sm"
                  variant="bordered"
                  onPress={() => handleSearch("")}
                >
                  <Icon icon="mdi:close" width={16} />
                </Button>
              )}
              <Kbd className="ml-2 hidden border-none px-2 py-1 text-[0.6rem] font-medium md:block">
                ESC
              </Kbd>
            </div>
          )}

          {!tabs && children}

          {tabs && (
            <>
              <div className="p-2">
                <Tabs
                  aria-label="Options"
                  className="w-full"
                  classNames={{
                    tabList: slots.tabList(),
                    cursor: slots.tabCursor(),
                    tab: slots.tab(),
                  }}
                  selectedKey={activeTab}
                  onSelectionChange={setActiveTab as any}
                >
                  {tabs.map((tab) => (
                    <Tab
                      key={tab.key}
                      title={
                        tab.icon ? (
                          <div className="flex items-center gap-1">
                            <Icon icon={tab.icon} width={18} />
                            <span>{tab.title}</span>
                          </div>
                        ) : (
                          tab.title
                        )
                      }
                    />
                  ))}
                </Tabs>
              </div>

              <ScrollShadow className="flex-1 p-4">
                {tabs.map(
                  (tab) =>
                    tab.key === activeTab && (
                      <div key={tab.key}>{tab.content}</div>
                    ),
                )}
              </ScrollShadow>
            </>
          )}
        </Command>
      </ModalContent>
    </Modal>
  );
}

// Helper component for creating CommandMenuItem
interface CommandMenuItemProps {
  label: string;
  group?: string;
  icon?: string;
  isActive?: boolean;
  onSelect: () => void;
  onHover?: () => void;
  index?: number;
}

export function CommandMenuItem({
  label,
  group,
  icon,
  isActive = false,
  onSelect,
  onHover,
  index,
}: CommandMenuItemProps) {
  const slots = cmdkModal();

  return (
    <Command.Item
      className={slots.itemWrapper()}
      data-active={isActive}
      value={label}
      onMouseEnter={onHover}
      onSelect={onSelect}
    >
      <div className={slots.leftWrapper()}>
        {icon && <Icon className={slots.leftIcon()} icon={icon} width={20} />}
        <div className={slots.itemContent()}>
          {group && <span className={slots.itemParentTitle()}>{group}</span>}
          <p className={slots.itemTitle()}>{label}</p>
        </div>
      </div>
    </Command.Item>
  );
}
