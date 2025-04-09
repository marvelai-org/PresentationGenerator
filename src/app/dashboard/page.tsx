"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import NavigationHeaderWithHeadingCTA from "@/components/layout/NavigationHeader/NavigationHeader";

// Sample data for presentations
const recentPresentations = [
  {
    id: "1",
    title: "Climate Change Impact",
    image: "/images/presentations/climate.jpg",
    createdAt: "1 day ago",
    isPrivate: true,
  },
  {
    id: "2",
    title: "Fashion Timeline",
    image: "/images/presentations/fashion.jpg",
    createdAt: "2 days ago",
    isPrivate: true,
  },
  {
    id: "3",
    title: "Industrial Revolution",
    image: "/images/presentations/industrial.jpg",
    createdAt: "3 days ago",
    isPrivate: true,
  },
  {
    id: "4",
    title: "Greenhouse Effect",
    image: "/images/presentations/greenhouse.jpg",
    createdAt: "5 days ago",
    isPrivate: true,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading for visual feedback
  const handleSortChange = (key: string) => {
    setIsLoading(true);
    setSortBy(key);
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex flex-col">
      <NavigationHeaderWithHeadingCTA />

      <div className="flex flex-col gap-8 max-w-[1024px] mx-auto w-full px-4 lg:px-8 mt-10">
        {/* Presentations Grid with Controls */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ButtonGroup size="sm" variant="flat">
                <Button
                  isIconOnly
                  aria-label="Grid view"
                  className={viewType === "grid" ? "bg-default-100" : ""}
                  onPress={() => setViewType("grid")}
                >
                  <Icon icon="material-symbols:grid-view" width={20} />
                </Button>
                <Button
                  isIconOnly
                  aria-label="List view"
                  className={viewType === "list" ? "bg-default-100" : ""}
                  onPress={() => setViewType("list")}
                >
                  <Icon
                    icon="material-symbols:view-agenda-outline"
                    width={20}
                  />
                </Button>
              </ButtonGroup>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    endContent={
                      <Icon
                        icon="material-symbols:arrow-drop-down"
                        width={20}
                      />
                    }
                    size="sm"
                    variant="flat"
                  >
                    Sort:{" "}
                    {sortBy === "recent"
                      ? "Recent"
                      : sortBy === "name"
                        ? "Name"
                        : "Created"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort options"
                  selectedKeys={[sortBy]}
                  selectionMode="single"
                  onSelectionChange={(keys) =>
                    handleSortChange(Array.from(keys)[0] as string)
                  }
                >
                  <DropdownItem key="recent">Most Recent</DropdownItem>
                  <DropdownItem key="name">Name (A-Z)</DropdownItem>
                  <DropdownItem key="created">Date Created</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <span className="text-small text-default-400">
              {recentPresentations.length} presentations
            </span>
          </div>

          <div
            className={`grid ${
              viewType === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "grid-cols-1 gap-3"
            }`}
          >
            {isLoading ? (
              // Skeleton loaders
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Card key={`skeleton-${i}`} className="bg-content1/50 h-full">
                    <CardBody className="p-0 overflow-hidden">
                      <Skeleton className="rounded-lg">
                        <div className="aspect-video w-full" />
                      </Skeleton>
                    </CardBody>
                    <CardFooter className="flex flex-col items-start gap-1">
                      <Skeleton className="w-3/4 h-5 rounded-lg" />
                      <Skeleton className="w-2/4 h-4 rounded-lg" />
                    </CardFooter>
                  </Card>
                ))
            ) : (
              <>
                {/* Presentation cards */}
                {recentPresentations.map((presentation) => (
                  <Card
                    key={presentation.id}
                    className={`bg-content1/50 group relative ${
                      viewType === "list" ? "flex flex-row" : "h-full"
                    }`}
                  >
                    <button
                      aria-label={`View presentation: ${presentation.title}`}
                      className="cursor-pointer absolute inset-0 z-10 border-0 bg-transparent appearance-none"
                      onClick={() =>
                        router.push(
                          `/dashboard/presentation/${presentation.id}`,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push(
                            `/dashboard/presentation/${presentation.id}`,
                          );
                        }
                      }}
                    />
                    <CardBody
                      className={`p-0 overflow-hidden ${viewType === "list" ? "w-36" : ""}`}
                    >
                      <div className="relative">
                        <div className="aspect-video bg-default-200 w-full flex items-center justify-center">
                          {/* Placeholder for presentation preview */}
                          <div className="text-default-500 flex flex-col items-center">
                            <Icon
                              className="w-12 h-12"
                              icon="material-symbols:slideshow"
                            />
                            <span>{presentation.title}</span>
                          </div>

                          {/* Overlay with quick actions on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex gap-2 mt-auto mb-4 relative z-20">
                              <Tooltip content="Edit">
                                <Button
                                  isIconOnly
                                  className="bg-background/50 backdrop-blur-md"
                                  radius="full"
                                  size="sm"
                                  variant="flat"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/dashboard/edit/${presentation.id}`,
                                    );
                                  }}
                                >
                                  <Icon
                                    icon="material-symbols:edit"
                                    width={18}
                                  />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Present">
                                <Button
                                  isIconOnly
                                  className="backdrop-blur-md"
                                  color="primary"
                                  radius="full"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/dashboard/present/${presentation.id}`,
                                    );
                                  }}
                                >
                                  <Icon
                                    icon="material-symbols:play-arrow"
                                    width={18}
                                  />
                                </Button>
                              </Tooltip>
                              <Tooltip content="More options">
                                <Button
                                  isIconOnly
                                  className="bg-background/50 backdrop-blur-md"
                                  radius="full"
                                  size="sm"
                                  variant="flat"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Icon
                                    icon="material-symbols:more-vert"
                                    width={18}
                                  />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                    <CardFooter
                      className={`flex flex-col items-start gap-1 ${viewType === "list" ? "flex-1" : ""}`}
                    >
                      <div className="flex justify-between w-full">
                        <h3 className="font-medium">{presentation.title}</h3>
                        <Chip color="default" size="sm" variant="flat">
                          {presentation.isPrivate ? "Private" : "Public"}
                        </Chip>
                      </div>
                      <p className="text-default-500 text-sm">
                        Last edited {presentation.createdAt}
                      </p>
                    </CardFooter>
                  </Card>
                ))}

                {/* Create New Card */}
                <Card
                  className={`border-2 border-dashed border-default-200 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all ${
                    viewType === "list" ? "h-24" : "h-full aspect-auto"
                  }`}
                >
                  <button
                    aria-label="Create new presentation"
                    className="cursor-pointer absolute inset-0 z-10 border-0 bg-transparent appearance-none"
                    onClick={() => router.push("/dashboard/create")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push("/dashboard/create");
                      }
                    }}
                  />
                  <CardBody className="flex flex-col items-center justify-center gap-2 p-6">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon
                        className="text-primary w-6 h-6"
                        icon="material-symbols:add"
                      />
                    </div>
                    <p className="text-medium font-medium">
                      Create New Presentation
                    </p>
                  </CardBody>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
