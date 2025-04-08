"use client";

import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TextInputPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsLoading(true);

    // In a real application, you would process the text here
    // before navigating to the next step
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/create/outline");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center mb-8">
        <Button
          as={Link}
          className="mr-4 text-default-500"
          href="/dashboard/create"
          startContent={<Icon icon="material-symbols:arrow-back" width={20} />}
          variant="light"
        >
          Back
        </Button>
      </div>

      <div className="flex flex-col items-center text-center mb-10 animate-fadeIn">
        <div className="flex items-center mb-4">
          <div className="bg-primary/10 p-3 rounded-xl transition-all hover:bg-primary/20">
            <Icon
              className="text-primary w-8 h-8"
              icon="material-symbols:description"
            />
          </div>
          <h2 className="text-3xl font-bold ml-3 bg-gradient-to-r from-primary-500 to-indigo-500 bg-clip-text text-transparent">
            Create from Text
          </h2>
        </div>
        <p className="text-default-500 text-lg">
          Paste your text, notes, or outline below
        </p>
      </div>

      <div
        className="bg-content1/20 border border-content2/30 rounded-xl p-0 mb-8 animate-fadeIn shadow-lg"
        style={{ animationDelay: "0.1s" }}
      >
        <Textarea
          className="w-full bg-transparent border-none"
          classNames={{
            base: "rounded-xl",
            inputWrapper:
              "bg-transparent shadow-none border-0 hover:border-0 focus:border-0",
            input: "placeholder:text-default-500 p-6 focus:ring-0",
          }}
          minRows={15}
          placeholder="Paste your content here..."
          value={content}
          onValueChange={setContent}
        />
      </div>

      <div
        className="flex justify-end animate-fadeIn"
        style={{ animationDelay: "0.2s" }}
      >
        <Button
          className="px-8 py-6"
          color="primary"
          isDisabled={!content.trim()}
          isLoading={isLoading}
          size="lg"
          startContent={<Icon icon="material-symbols:magic-button" />}
          onPress={handleSubmit}
        >
          Generate Outline
        </Button>
      </div>

      {/* Help Button */}
      <Button
        isIconOnly
        aria-label="Help"
        className="fixed bottom-6 right-6"
        radius="full"
        variant="bordered"
      >
        <Icon className="text-xl" icon="material-symbols:help" />
      </Button>
    </div>
  );
}
