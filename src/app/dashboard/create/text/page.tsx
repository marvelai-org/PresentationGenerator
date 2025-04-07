"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PasteTextPage() {
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
        <h1 className="text-2xl font-bold">Create from Text</h1>
      </div>

      <div className="p-8 bg-content1/20 rounded-xl flex flex-col">
        <div className="mb-6">
          <label
            className="block mb-2 text-default-500"
            htmlFor="content-textarea"
          >
            Paste your text, notes, or outline below:
          </label>
          <textarea
            className="w-full p-4 rounded-lg bg-content1 text-foreground border border-default-200 focus:border-primary focus:ring-0 transition-all min-h-[300px]"
            id="content-textarea"
            placeholder="Paste your content here..."
          />
        </div>

        <div className="flex justify-end">
          <Button color="primary" size="lg">
            Create Presentation
          </Button>
        </div>
      </div>
    </div>
  );
}
