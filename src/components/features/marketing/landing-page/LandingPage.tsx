"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  cn,
  Badge,
  Form,
  Image,
  Tooltip,
  Textarea,
  type TextAreaProps,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { VisuallyHidden } from "@react-aria/visually-hidden";

// Import your logo component
import { AIPresIcon } from "@/components/ui/Acme";

// =====================================
// Custom PromptInput Component Implementation
// =====================================
const PromptInput = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ classNames = {}, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        aria-label="Prompt"
        className="min-h-[40px]"
        classNames={{
          ...classNames,
          label: cn("hidden", classNames?.label),
          input: cn("py-0", classNames?.input),
        }}
        minRows={1}
        placeholder="Enter a prompt here"
        radius="lg"
        variant="bordered"
        {...props}
      />
    );
  },
);

PromptInput.displayName = "PromptInput";

// =====================================
// Define project suggestions data
// =====================================
const suggestions = [
  {
    id: "business-pitch",
    label: "A business pitch presentation",
    icon: "noto:rocket", // Represents a startup launch and innovation
  },
  {
    id: "data-presentation",
    label: "A data visualization presentation",
    icon: "noto:chart-increasing-with-yen", // Indicates analytics and growth
  },
  {
    id: "marketing-slides",
    label: "A marketing campaign presentation",
    icon: "noto:speech-balloon", // Suggests conversation and content sharing
  },
  {
    id: "quarterly-results",
    label: "A quarterly financial results deck",
    icon: "noto:money-with-wings", // Clearly financial in nature
  },
  {
    id: "product-launch",
    label: "A product launch presentation",
    icon: "noto:robot-face", // Emphasizes AI/chatbot functionality
  },
  {
    id: "conference-talk",
    label: "A conference talk slideshow",
    icon: "noto:clapper-board", // Evokes the movie industry
  },
  {
    id: "educational-slides",
    label: "An educational presentation for students",
    icon: "noto:abacus", // Represents tech and programming
  },
  {
    id: "research-presentation",
    label: "A research findings presentation",
    icon: "noto:page-facing-up", // Symbolizes documents and text
  },
  {
    id: "portfolio-showcase",
    label: "A creative portfolio presentation",
    icon: "noto:bridge-at-night", // Suggests visuals and imagery
  },
  {
    id: "company-overview",
    label: "A company overview presentation",
    icon: "noto:microphone", // Ideal for voice interaction
  },
  {
    id: "sales-pitch",
    label: "A sales pitch presentation",
    icon: "noto:globe-with-meridians", // Global and language-related
  },
  {
    id: "trend-analysis",
    label: "A trend analysis presentation",
    icon: "noto:bar-chart", // Reflects data analysis
  },
  {
    id: "project-proposal",
    label: "A project proposal presentation",
    icon: "noto:house", // Clearly indicates a home-related solution
  },
  {
    id: "creative-showcase",
    label: "A creative showcase presentation",
    icon: "noto:artist-palette", // Emphasizes creative, artistic content
  },
  {
    id: "onboarding-slides",
    label: "A team onboarding presentation",
    icon: "noto:envelope", // Represents email and communication
  },
  {
    id: "investor-deck",
    label: "An investor pitch deck",
    icon: "noto:briefcase", // Suggests business and professionalism
  },
  {
    id: "workshop-slides",
    label: "A workshop presentation",
    icon: "noto:runner", // Indicates movement and fitness
  },
  {
    id: "academic-presentation",
    label: "An academic presentation",
    icon: "noto:graduation-cap", // Immediately associated with education
  },
  {
    id: "strategy-deck",
    label: "A business strategy presentation",
    icon: "noto:bank", // Suggests finance and security
  },
  {
    id: "year-in-review",
    label: "A year in review presentation",
    icon: "noto:clipboard", // Represents documents and resumes
  },
];

type PromptSuggestion = (typeof suggestions)[number];

// =====================================
// Smaller UI Components
// =====================================

// Navbar Component
const LeanNavbar = () => {
  return (
    <Navbar
      classNames={{
        base: "max-w-full mx-auto bg-transparent px-4 py-2",
        wrapper: "px-0 max-w-[1200px] mx-auto",
      }}
      height="60px"
      position="static"
    >
      <NavbarBrand>
        <div className="flex items-center">
          <AIPresIcon className="text-white" size={34} />
          <span className="ml-2 text-xl font-medium text-white">
            AI Presentation Generator
          </span>
        </div>
      </NavbarBrand>

      <NavbarContent className="flex gap-4" justify="end">
        <NavbarItem>
          <Button
            as={Link}
            className="text-white"
            href="/login"
            radius="full"
            variant="flat"
          >
            Log in
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            className="border-[#9353d3] text-white"
            endContent={
              <Icon
                className="pointer-events-none"
                icon="solar:alt-arrow-right-linear"
              />
            }
            href="/signup"
            radius="full"
            variant="bordered"
          >
            Get Started
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

// Prompt Input Assets Component
interface PromptInputAssetsProps {
  assets: string[];
  onRemoveAsset: (index: number) => void;
}

const PromptInputAssets = ({
  assets,
  onRemoveAsset,
}: PromptInputAssetsProps) => {
  if (assets.length === 0) return null;

  return (
    <>
      {assets.map((asset, index) => (
        <Badge
          key={index}
          isOneChar
          className="opacity-0 group-hover:opacity-100"
          content={
            <Button
              isIconOnly
              radius="full"
              size="sm"
              variant="light"
              onPress={() => onRemoveAsset(index)}
            >
              <Icon
                className="text-foreground"
                icon="iconamoon:close-thin"
                width={16}
              />
            </Button>
          }
        >
          <Image
            alt="uploaded image"
            className="h-14 w-14 rounded-small border-small border-default-200/50 object-cover"
            src={asset}
          />
        </Badge>
      ))}
    </>
  );
};

// Prompt Suggestions Component
interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[];
  onSelect?: (suggestion: PromptSuggestion) => void;
}

const PromptSuggestions = ({
  suggestions,
  onSelect,
}: PromptSuggestionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          className="h-[52px] justify-start gap-2 rounded-medium border-1 border-default-200 bg-transparent px-4 text-default-foreground transition-colors !duration-150 hover:border-default-400 hover:text-foreground data-[hover=true]:border-default-400 data-[hover=true]:text-foreground"
          startContent={
            <div className="flex h-6 w-6 items-center justify-center">
              <Icon
                className="text-default-500"
                icon={suggestion.icon}
                width={20}
              />
            </div>
          }
          variant="light"
          onPress={() => onSelect?.(suggestion)}
        >
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
};

// =====================================
// Main Functional Components
// =====================================

// Prompt Input Component
interface PromptInputFullLineProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const PromptInputFullLine = ({
  prompt,
  setPrompt,
}: PromptInputFullLineProps) => {
  const [assets, setAssets] = useState<string[]>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!prompt) return;

    setPrompt("");
    inputRef?.current?.focus();
  }, [prompt, setPrompt]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items);

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();

        if (!blob) continue;

        const reader = new FileReader();

        reader.onload = () => {
          const base64data = reader.result as string;

          setAssets((prev) => [...prev, base64data]);
        };
        reader.readAsDataURL(blob);
      }
    }
  }, []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = () => {
            const base64data = reader.result as string;

            setAssets((prev) => [...prev, base64data]);
          };
          reader.readAsDataURL(file);
        }
      });

      // Reset input value to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [],
  );

  return (
    <Form
      className="flex w-full flex-col items-start gap-0 rounded-medium border-1 border-default-200 bg-default-50 dark:bg-default-50 hover:border-default-400 focus-within:border-default-400 transition-colors !duration-150"
      validationBehavior="native"
      onSubmit={onSubmit}
    >
      <div
        className={cn(
          "group flex gap-2 pl-[20px] pr-3",
          assets.length > 0 ? "pt-4" : "",
        )}
      >
        <PromptInputAssets
          assets={assets}
          onRemoveAsset={(index) => {
            setAssets((prev) => prev.filter((_, i) => i !== index));
          }}
        />
      </div>
      <PromptInput
        ref={inputRef}
        classNames={{
          innerWrapper: "relative",
          input: "text-medium h-auto w-full",
          inputWrapper:
            "!bg-transparent shadow-none group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 pr-3 pl-[20px] pt-3 pb-4",
        }}
        maxRows={16}
        minRows={2}
        name="content"
        radius="lg"
        spellCheck="false"
        value={prompt}
        variant="flat"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onValueChange={setPrompt}
      />
      <div className="flex w-full flex-row items-center justify-between px-3 pb-3">
        <Tooltip showArrow content="Attach Files">
          <Button
            isIconOnly
            radius="full"
            size="sm"
            variant="light"
            onPress={() => fileInputRef.current?.click()}
          >
            <Icon
              className="text-default-500"
              icon="solar:paperclip-outline"
              width={24}
            />
            <VisuallyHidden>
              <input
                ref={fileInputRef}
                multiple
                accept="image/*"
                type="file"
                onChange={handleFileUpload}
              />
            </VisuallyHidden>
          </Button>
        </Tooltip>
        <Button
          isIconOnly
          color={!prompt ? "default" : "primary"}
          isDisabled={!prompt}
          radius="full"
          size="sm"
          type="submit"
          variant="solid"
        >
          <Icon
            className={cn(
              "[&>path]:stroke-[2px]",
              !prompt ? "text-default-600" : "text-primary-foreground",
            )}
            icon="solar:arrow-up-linear"
            width={20}
          />
        </Button>
      </div>
    </Form>
  );
};

// Main Prompt Input with Suggestions Component
const LeanPromptInput = () => {
  const [prompt, setPrompt] = useState("");
  const [currentSuggestions, setCurrentSuggestions] = useState<
    PromptSuggestion[]
  >(suggestions.slice(0, 4));

  const handleSuggestionSelect = (suggestion: PromptSuggestion) => {
    setPrompt(suggestion.label);
  };

  const handleShuffle = () => {
    // Create a copy and shuffle it
    const shuffled = [...suggestions].sort(() => 0.5 - Math.random());

    // Take the first 4 items for display
    setCurrentSuggestions(shuffled.slice(0, 4));
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <PromptInputFullLine prompt={prompt} setPrompt={setPrompt} />
      <div className="space-y-4">
        <PromptSuggestions
          suggestions={currentSuggestions}
          onSelect={handleSuggestionSelect}
        />
        <div className="flex justify-center">
          <Button
            radius="full"
            startContent={<Icon icon="solar:shuffle-outline" />}
            variant="ghost"
            onPress={handleShuffle}
          >
            Shuffle
          </Button>
        </div>
      </div>
    </div>
  );
};

// Prompt Container Component
const LeanPromptContainer = () => {
  return (
    <div className="flex h-screen max-h-[calc(100vh-140px)] w-full">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex w-full max-w-2xl flex-col items-center gap-8">
          <h1 className="text-3xl font-semibold leading-9 text-default-foreground">
            What would you like to build today?
          </h1>
          <div className="flex w-full flex-col gap-4">
            <LeanPromptInput />
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================
// Main Landing Page Component
// =====================================
export default function LandingPage() {
  // Check if running in browser
  const [isMounted, setIsMounted] = useState(false);

  // Only run on client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Safe rendering for client components
  if (!isMounted) {
    return (
      <main className="flex min-h-screen flex-col">
        <LeanNavbar />
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-2xl px-4 text-center">
            <h1 className="text-3xl font-semibold leading-9 text-default-foreground">
              What would you like to build today?
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <LeanNavbar />
      <div className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-2xl px-4">
          <LeanPromptContainer />
        </div>
      </div>
    </main>
  );
}
