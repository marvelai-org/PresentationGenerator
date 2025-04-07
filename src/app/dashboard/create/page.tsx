"use client";

import { Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-4">
        <h1 className="text-4xl font-bold mb-2">Create with AI</h1>
        <p className="text-default-500 text-lg">How would you like to get started?</p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paste Text Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all">
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon icon="material-symbols:text-snippet-outline" className="w-16 h-16 text-primary" />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Paste in text</h2>
            <p className="text-default-500 mb-2">Create from notes, an outline, or existing content</p>
            <Button 
              as={Link}
              href="/dashboard/create/text"
              endContent={<Icon icon="material-symbols:arrow-forward" />} 
              variant="flat" 
              color="primary"
              className="self-end mt-2"
            />
          </CardFooter>
        </Card>

        {/* Generate Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all relative overflow-hidden">
          <Chip color="primary" variant="flat" className="absolute top-4 right-4 z-10">Popular</Chip>
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon icon="material-symbols:magic-button" className="w-16 h-16 text-primary" />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Generate</h2>
            <p className="text-default-500 mb-2">Create from a one-line prompt in a few seconds</p>
            <Button 
              as={Link}
              href="/dashboard/create/generate"
              endContent={<Icon icon="material-symbols:arrow-forward" />} 
              variant="flat" 
              color="primary"
              className="self-end mt-2"
            />
          </CardFooter>
        </Card>

        {/* Import Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all">
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon icon="material-symbols:upload-file" className="w-16 h-16 text-primary" />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Import file or URL</h2>
            <p className="text-default-500 mb-2">Enhance existing docs, presentations, or webpages</p>
            <Button 
              as={Link}
              href="/dashboard/create/import"
              endContent={<Icon icon="material-symbols:arrow-forward" />} 
              variant="flat" 
              color="primary"
              className="self-end mt-2"
            />
          </CardFooter>
        </Card>
      </div>

      {/* Recent Prompts Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your recent prompts</h2>
        
        <Card className="bg-content1/20 mb-4">
          <CardBody className="flex justify-between items-center p-4">
            <div>
              <h3 className="text-lg font-medium">Seminar on the psychology of decision-making</h3>
              <div className="flex items-center gap-2 text-small text-default-500">
                <span>Generate</span>
                <span>•</span>
                <span>3 hours ago</span>
                <Chip size="sm" variant="flat" color="primary" className="ml-2">DRAFT</Chip>
              </div>
            </div>
            <Button isIconOnly variant="light">
              <Icon icon="material-symbols:arrow-forward" />
            </Button>
          </CardBody>
        </Card>
        
        <Card className="bg-content1/20">
          <CardBody className="flex justify-between items-center p-4">
            <div>
              <h3 className="text-lg font-medium">Persuasive presentation</h3>
              <div className="flex items-center gap-2 text-small text-default-500">
                <span>Generate</span>
                <span>•</span>
                <span>Yesterday</span>
                <Chip size="sm" variant="flat" color="success" className="ml-2">COMPLETED</Chip>
              </div>
            </div>
            <Button isIconOnly variant="light">
              <Icon icon="material-symbols:arrow-forward" />
            </Button>
          </CardBody>
        </Card>
      </div>
      
      {/* Help Button */}
      <Button 
        isIconOnly 
        variant="bordered" 
        radius="full" 
        className="fixed bottom-6 right-6"
        aria-label="Help"
      >
        <Icon icon="material-symbols:help" className="text-xl" />
      </Button>
    </div>
  );
} 