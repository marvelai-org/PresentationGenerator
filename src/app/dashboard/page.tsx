"use client";

import { Button, Card, CardBody, CardFooter, Chip, Divider, Image, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Sample data for presentations
const recentPresentations = [
  {
    id: "1",
    title: "Climate Change Impact",
    image: "/images/presentations/climate.jpg",
    createdAt: "1 day ago",
    isPrivate: true
  },
  {
    id: "2",
    title: "Fashion Timeline",
    image: "/images/presentations/fashion.jpg",
    createdAt: "2 days ago",
    isPrivate: true
  },
  {
    id: "3",
    title: "Industrial Revolution",
    image: "/images/presentations/industrial.jpg",
    createdAt: "3 days ago",
    isPrivate: true
  },
  {
    id: "4",
    title: "Greenhouse Effect",
    image: "/images/presentations/greenhouse.jpg",
    createdAt: "5 days ago",
    isPrivate: true
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-default-500">Manage your presentations</p>
        </div>
        <Button 
          as={Link}
          href="/dashboard/create"
          color="primary" 
          startContent={<Icon icon="material-symbols:add" />}
        >
          Create new
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs aria-label="Dashboard Tabs" color="primary" className="w-full">
        <Tab key="all" title="All" />
        <Tab key="recent" title="Recently viewed" />
        <Tab key="created" title="Created by you" />
        <Tab key="favorites" title="Favorites" />
      </Tabs>

      {/* Presentations Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Presentations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recentPresentations.map((presentation) => (
            <Card key={presentation.id} className="bg-content1/50 h-full">
              <CardBody className="p-0 overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-default-200 w-full flex items-center justify-center">
                    {/* Placeholder for presentation preview */}
                    <div className="text-default-500 flex flex-col items-center">
                      <Icon icon="material-symbols:slideshow" className="w-12 h-12" />
                      <span>{presentation.title}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter className="flex flex-col items-start gap-1">
                <div className="flex justify-between w-full">
                  <h3 className="font-medium">{presentation.title}</h3>
                  <Chip size="sm" variant="flat" color="default">
                    {presentation.isPrivate ? "Private" : "Public"}
                  </Chip>
                </div>
                <p className="text-default-500 text-sm">Last edited {presentation.createdAt}</p>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Card */}
          <Link href="/dashboard/create" className="block h-full">
            <Card className="border-2 border-dashed border-default-200 h-full flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all">
              <CardBody className="flex flex-col items-center justify-center gap-2 p-6">
                <div className="rounded-full bg-primary/10 p-3">
                  <Icon icon="material-symbols:add" className="text-primary w-6 h-6" />
                </div>
                <p className="text-medium font-medium">Create New Presentation</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Templates Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popular Templates</h2>
          <Button variant="light">View all</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Template cards would go here */}
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-content1/50 h-full">
              <CardBody className="p-0 overflow-hidden">
                <div className="aspect-video bg-default-200 w-full flex items-center justify-center">
                  <Icon icon="material-symbols:template" className="w-12 h-12 text-default-500" />
                </div>
              </CardBody>
              <CardFooter>
                <p className="font-medium">Template {i}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 