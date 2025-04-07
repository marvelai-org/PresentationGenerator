"use client";

import { Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-4">
        <h1 className="text-4xl font-bold mb-2">Create with AI</h1>
        <p className="text-default-500 text-lg">
          How would you like to get started?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Paste Text Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all">
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon
                className="w-16 h-16 text-primary"
                icon="material-symbols:text-snippet-outline"
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Paste in text</h2>
            <p className="text-default-500 mb-2">
              Create from notes, an outline, or existing content
            </p>
            <Button
              className="self-end mt-2"
              color="primary"
              endContent={<Icon icon="material-symbols:arrow-forward" />}
              variant="flat"
              onPress={() => router.push("/dashboard/create/text")}
            />
          </CardFooter>
        </Card>

        {/* Generate Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all relative overflow-hidden">
          <Chip
            className="absolute top-4 right-4 z-10"
            color="primary"
            variant="flat"
          >
            Popular
          </Chip>
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon
                className="w-16 h-16 text-primary"
                icon="material-symbols:magic-button"
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Generate</h2>
            <p className="text-default-500 mb-2">
              Create from a one-line prompt in a few seconds
            </p>
            <Button
              className="self-end mt-2"
              color="primary"
              endContent={<Icon icon="material-symbols:arrow-forward" />}
              variant="flat"
              onPress={() => router.push("/dashboard/create/generate")}
            />
          </CardFooter>
        </Card>

        {/* Import Option */}
        <Card className="bg-content1/20 border-content2 hover:border-primary transition-all">
          <CardBody className="flex flex-col items-center justify-center pt-8 pb-6">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-primary/10 rounded-xl">
              <Icon
                className="w-16 h-16 text-primary"
                icon="material-symbols:upload-file"
              />
            </div>
          </CardBody>
          <CardFooter className="flex flex-col items-start gap-2 pb-4">
            <h2 className="text-xl font-semibold">Import file or URL</h2>
            <p className="text-default-500 mb-2">
              Enhance existing docs, presentations, or webpages
            </p>
            <Button
              className="self-end mt-2"
              color="primary"
              endContent={<Icon icon="material-symbols:arrow-forward" />}
              variant="flat"
              onPress={() => router.push("/dashboard/create/import")}
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
              <h3 className="text-lg font-medium">
                Seminar on the psychology of decision-making
              </h3>
              <div className="flex items-center gap-2 text-small text-default-500">
                <span>Generate</span>
                <span>•</span>
                <span>3 hours ago</span>
                <Chip className="ml-2" color="primary" size="sm" variant="flat">
                  DRAFT
                </Chip>
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
                <Chip className="ml-2" color="success" size="sm" variant="flat">
                  COMPLETED
                </Chip>
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
