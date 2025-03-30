"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

import { PromptInputFullLineComponent } from "./LeanPromptInputFullLine";

const suggestions = [
  {
    id: "ai-startup-app",
    label: "An AI app for my startup",
    icon: "noto:rocket", // Represents a startup launch and innovation
  },
  {
    id: "data-dashboard",
    label: "A data visualization dashboard",
    icon: "noto:chart-increasing-with-yen", // Indicates analytics and growth
  },
  {
    id: "content-generator",
    label: "A social media content generator",
    icon: "noto:speech-balloon", // Suggests conversation and content sharing
  },
  {
    id: "finance-tracker",
    label: "A personal finance tracker",
    icon: "noto:money-with-wings", // Clearly financial in nature
  },
  {
    id: "ai-chatbot",
    label: "An AI chatbot for customer support",
    icon: "noto:robot-face", // Emphasizes AI/chatbot functionality
  },
  {
    id: "ml-recommendation",
    label: "A movie recommendation engine",
    icon: "noto:clapper-board", // Evokes the movie industry
  },
  {
    id: "code-assistant",
    label: "A coding assistant with AI",
    icon: "noto:abacus", // Represents tech and programming
  },
  {
    id: "text-summarizer",
    label: "An AI text summarization tool",
    icon: "noto:page-facing-up", // Symbolizes documents and text
  },
  {
    id: "image-generator",
    label: "An AI image generation app",
    icon: "noto:bridge-at-night", // Suggests visuals and imagery
  },
  {
    id: "voice-assistant",
    label: "A voice-controlled AI assistant",
    icon: "noto:microphone", // Ideal for voice interaction
  },
  {
    id: "language-translator",
    label: "An AI language translation app",
    icon: "noto:globe-with-meridians", // Global and language-related
  },
  {
    id: "ml-analytics",
    label: "A machine learning analytics platform",
    icon: "noto:bar-chart", // Reflects data analysis
  },
  {
    id: "smart-home",
    label: "A smart home automation system",
    icon: "noto:house", // Clearly indicates a home-related solution
  },
  {
    id: "nft-marketplace",
    label: "An NFT marketplace app",
    icon: "noto:artist-palette", // Emphasizes creative, artistic content
  },
  {
    id: "ai-email-writer",
    label: "An AI email writing assistant",
    icon: "noto:envelope", // Represents email and communication
  },
  {
    id: "saas-platform",
    label: "A SaaS platform for businesses",
    icon: "noto:briefcase", // Suggests business and professionalism
  },
  {
    id: "fitness-tracker",
    label: "A fitness tracking app with AI insights",
    icon: "noto:runner", // Indicates movement and fitness
  },
  {
    id: "edtech-platform",
    label: "An AI-powered education platform",
    icon: "noto:graduation-cap", // Immediately associated with education
  },
  {
    id: "web3-wallet",
    label: "A Web3 crypto wallet app",
    icon: "noto:bank", // Suggests finance and security
  },
  {
    id: "ai-resume-builder",
    label: "An AI resume builder and analyzer",
    icon: "noto:clipboard", // Represents documents and resumes
  },
];

type PromptSuggestion = (typeof suggestions)[number];

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

export default function PromptInputWithBottomActionsLarge() {
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
      <PromptInputFullLineComponent prompt={prompt} setPrompt={setPrompt} />
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
}
