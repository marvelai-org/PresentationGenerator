"use client";

import { Button, Input, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function ImportPage() {
  const router = useRouter();
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          className="mr-4"
          variant="light"
          startContent={<Icon icon="material-symbols:arrow-back" />}
          onPress={() => router.push("/dashboard/create")}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold">Import Content</h1>
      </div>

      <div className="p-8 bg-content1/20 rounded-xl">
        <Tabs aria-label="Import options" className="mb-6">
          <Tab key="file" title="Upload File" />
          <Tab key="url" title="Import from URL" />
        </Tabs>

        <div className="border-2 border-dashed border-default-200 rounded-xl p-10 flex flex-col items-center justify-center">
          <Icon
            className="w-16 h-16 text-default-400 mb-4"
            icon="material-symbols:upload-file"
          />
          <p className="text-default-600 mb-2">
            Drag and drop a file here, or click to browse
          </p>
          <p className="text-default-400 text-sm mb-6">
            Supports PDF, PPTX, DOCX, TXT (max 10MB)
          </p>

          <Button
            color="primary"
            startContent={<Icon icon="material-symbols:upload" />}
          >
            Choose File
          </Button>
        </div>

        <div className="mt-6">
          <Input
            className="mb-6"
            label="Or enter a URL"
            placeholder="https://example.com"
          />

          <div className="flex justify-end">
            <Button color="primary" size="lg">
              Import and Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
