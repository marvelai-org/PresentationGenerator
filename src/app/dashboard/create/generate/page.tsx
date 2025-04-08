"use client";

import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Import from the marketing landing page components
import { PromptInputFullLineComponent } from "@/components/features/marketing/landing-page/LeanPromptInputFullLine";

const examplePrompts = [
  {
    icon: "material-symbols:group",
    title:
      "Collaborating with other creators on a joint project or collaboration",
  },
  {
    icon: "material-symbols:book",
    title: 'Book report for "The Joy Luck Club"',
  },
  {
    icon: "material-symbols:home-work",
    title: "A guide to investing in real estate",
  },
  {
    icon: "material-symbols:rocket-launch",
    title: "Explain the big bang to a 17th century pirate",
  },
  {
    icon: "material-symbols:new-releases",
    title: "Product launch plans",
  },
  {
    icon: "material-symbols:school",
    title: "Academic's guide to deciphering student emails",
  },
];

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState("8 cards");
  const [templateStyle, setTemplateStyle] = useState("Default");
  const [language, setLanguage] = useState("English (US)");

  const handleGenerateOutline = () => {
    if (!prompt.trim()) return;

    // For a real app, you might want to store the prompt and options in state or context
    // before navigating to the outline page
    router.push("/dashboard/create/outline");
  };

  const handlePromptChange = (
    newPrompt: string | ((prevState: string) => string),
  ) => {
    if (typeof newPrompt === "function") {
      setPrompt(newPrompt);
    } else {
      setPrompt(newPrompt);
    }
  };

  const handleExampleSelect = (exampleTitle: string) => {
    setPrompt(exampleTitle);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button - Updated to match import page style */}
      <div className="flex items-center mb-2">
        <Button
          as={Link}
          className="rounded-full px-4 py-2 bg-background border border-default-200 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 shadow-sm mr-4"
          href="/dashboard/create"
          startContent={
            <Icon className="text-primary" icon="material-symbols:arrow-back" />
          }
          variant="light"
        >
          Back
        </Button>
      </div>

      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Generate</h1>
        <p className="text-default-500 text-lg">
          What would you like to create today?
        </p>
      </div>

      {/* Options Row */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              variant="flat"
            >
              {slideCount}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Card Count"
            onAction={(key) => setSlideCount(key.toString())}
          >
            <DropdownItem key="4 cards">4 cards</DropdownItem>
            <DropdownItem key="8 cards">8 cards</DropdownItem>
            <DropdownItem key="12 cards">12 cards</DropdownItem>
            <DropdownItem key="16 cards">16 cards</DropdownItem>
            <DropdownItem key="20 cards">20 cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:refresh" />}
              variant="flat"
            >
              {templateStyle}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Template Style"
            onAction={(key) => setTemplateStyle(key.toString())}
          >
            <DropdownItem key="Default">Default</DropdownItem>
            <DropdownItem key="Professional">Professional</DropdownItem>
            <DropdownItem key="Creative">Creative</DropdownItem>
            <DropdownItem key="Minimalist">Minimalist</DropdownItem>
            <DropdownItem key="Bold">Bold</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:language" />}
              variant="flat"
            >
              {language}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Language"
            onAction={(key) => setLanguage(key.toString())}
          >
            <DropdownItem key="English (US)">English (US)</DropdownItem>
            <DropdownItem key="English (UK)">English (UK)</DropdownItem>
            <DropdownItem key="Spanish">Spanish</DropdownItem>
            <DropdownItem key="French">French</DropdownItem>
            <DropdownItem key="German">German</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Prompt Input */}
      <div className="mb-8">
        <PromptInputFullLineComponent
          prompt={prompt}
          setPrompt={handlePromptChange}
        />

        {prompt.trim() && (
          <div className="flex justify-center mt-4">
            <Button
              className="px-8"
              color="primary"
              size="lg"
              startContent={<Icon icon="material-symbols:magic-button" />}
              onPress={handleGenerateOutline}
            >
              Generate Outline
            </Button>
          </div>
        )}
      </div>

      {/* Example Prompts */}
      <div className="mt-12">
        <h2 className="text-xl text-center text-default-600 mb-6">
          Example prompts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examplePrompts.map((examplePrompt, index) => (
            <Card
              key={index}
              isPressable
              className="bg-content1/10 border border-content2 hover:border-primary cursor-pointer transition-all"
              onPress={() => handleExampleSelect(examplePrompt.title)}
            >
              <CardBody className="flex flex-row items-center gap-3 p-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon
                    className="text-primary"
                    icon={examplePrompt.icon}
                    width={24}
                  />
                </div>
                <p className="flex-1">{examplePrompt.title}</p>
                <Icon
                  className="text-default-400"
                  icon="material-symbols:add"
                  width={20}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
