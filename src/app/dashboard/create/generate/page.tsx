'use client';

import React from 'react';
import {
  Button,
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
// @ts-ignore - Type definition is missing but component is available
import { Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Example prompts
interface ExamplePrompt {
  icon: string;
  title: string;
}

const examplePrompts: ExamplePrompt[] = [
  {
    icon: 'material-symbols:groups',
    title: 'Collaborating with other creators on a joint project or collaboration',
  },
  {
    icon: 'material-symbols:menu-book',
    title: 'Book report for "The Joy Luck Club"',
  },
  {
    icon: 'material-symbols:home-work',
    title: 'A guide to investing in real estate',
  },
  {
    icon: 'material-symbols:rocket-launch',
    title: 'Explain the big bang to a 17th century pirate',
  },
  {
    icon: 'material-symbols:new-releases',
    title: 'Product launch plans',
  },
  {
    icon: 'material-symbols:school',
    title: "Academic's guide to deciphering student emails",
  },
];

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = React.useState('');
  const [slideCount, setSlideCount] = React.useState('8 cards');
  const [defaultStyle, setDefaultStyle] = React.useState('Default');
  const [language, setLanguage] = React.useState('English (US)');
  const [showExamplePrompts, setShowExamplePrompts] = React.useState(true);
  const [shuffledPrompts, setShuffledPrompts] = React.useState<ExamplePrompt[]>([...examplePrompts]);

  // Hide example prompts when input has text
  React.useEffect(() => {
    if (prompt) {
      setShowExamplePrompts(false);
    } else {
      setShowExamplePrompts(true);
    }
  }, [prompt]);

  const handleGenerateOutline = () => {
    if (!prompt.trim()) return;

    // Use URLSearchParams to create URL parameters for the outline page
    const params = new URLSearchParams();

    params.append('prompt', prompt);
    params.append('slideCount', slideCount);
    params.append('style', defaultStyle);
    params.append('language', language);

    router.push(`/dashboard/create/outline?${params.toString()}`);
  };

  const handleExampleSelect = (exampleTitle: string) => {
    setPrompt(exampleTitle);
  };

  const shuffleExamples = () => {
    // Create a copy of the array to shuffle
    const shuffled = [...shuffledPrompts];

    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledPrompts(shuffled);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-6">
      {/* Back Button */}
      <div className="self-start mb-4 ml-6">
        <Button
          as={Link}
          href="/dashboard/create"
          startContent={<Icon icon="material-symbols:arrow-back" />}
          variant="light"
        >
          Back
        </Button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8 w-full">
        <h1 className="text-5xl font-bold mb-2 text-blue-500">Generate</h1>
        <p className="text-gray-400 text-xl mb-6">What would you like to create today?</p>
      </div>

      {/* Options Row */}
      <div className="flex gap-2 justify-center mb-6">
        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-gray-900"
              endContent={<Icon icon="material-symbols:expand-more" />}
              variant="flat"
            >
              {slideCount}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Card Count" onAction={(key: React.Key) => setSlideCount(key.toString())}>
            <DropdownItem key="4 cards">4 cards</DropdownItem>
            <DropdownItem key="8 cards">8 cards</DropdownItem>
            <DropdownItem key="12 cards">12 cards</DropdownItem>
            <DropdownItem key="16 cards">16 cards</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-gray-900"
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:refresh" />}
              variant="flat"
            >
              {defaultStyle}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Template Style"
            onAction={(key: React.Key) => setDefaultStyle(key.toString())}
          >
            <DropdownItem key="Default">Default</DropdownItem>
            <DropdownItem key="Professional">Professional</DropdownItem>
            <DropdownItem key="Creative">Creative</DropdownItem>
            <DropdownItem key="Bold">Bold</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button
              className="bg-gray-900"
              endContent={<Icon icon="material-symbols:expand-more" />}
              startContent={<Icon icon="material-symbols:language" />}
              variant="flat"
            >
              {language}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Language" onAction={(key: React.Key) => setLanguage(key.toString())}>
            <DropdownItem key="English (US)">English (US)</DropdownItem>
            <DropdownItem key="English (UK)">English (UK)</DropdownItem>
            <DropdownItem key="Spanish">Spanish</DropdownItem>
            <DropdownItem key="French">French</DropdownItem>
            <DropdownItem key="German">German</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Prompt Input */}
      <div className="w-full max-w-3xl px-4 mb-8">
        <Textarea
          className="w-full min-h-[100px]"
          classNames={{
            base: 'max-w-full',
            inputWrapper: 'bg-gray-900 border-gray-800',
          }}
          placeholder="Enter a prompt here"
          value={prompt}
          onValueChange={setPrompt}
        />

        {prompt.trim() && (
          <div className="flex justify-center mt-6">
            <Button
              className="bg-blue-600"
              color="primary"
              startContent={<Icon icon="material-symbols:magic-button" width={20} />}
              onPress={handleGenerateOutline}
            >
              Generate Outline
            </Button>
          </div>
        )}
      </div>

      {/* Example Prompts */}
      {showExamplePrompts && (
        <div className="w-full max-w-3xl px-4 mb-10">
          <div className="text-center mb-4">
            <h3 className="text-gray-400">Example prompts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shuffledPrompts.map((example: ExamplePrompt, index: number) => (
              <Card
                key={index}
                isPressable
                className="bg-black border border-gray-800"
                onClick={() => handleExampleSelect(example.title)}
              >
                <div className="p-4 flex items-start">
                  <div className="text-blue-500 mr-3 flex-shrink-0">
                    <Icon icon={example.icon} width={24} />
                  </div>
                  <div className="text-white text-sm flex-grow pr-6">{example.title}</div>
                  <div className="text-gray-500 flex-shrink-0">
                    <Icon icon="material-symbols:add" width={18} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Shuffle Button */}
          <div className="flex justify-center mt-6">
            <Button
              className="border border-gray-800 bg-transparent"
              startContent={<Icon icon="material-symbols:shuffle" />}
              variant="flat"
              onPress={shuffleExamples}
            >
              Shuffle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
